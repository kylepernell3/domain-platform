# Domain Platform - Implementation Guide

## Overview
This guide contains all the code and steps needed to complete the implementation of tasks 2-5.

## Status
- ✅ Task 1: Domain Management Dashboard UI (COMPLETE - page.tsx exists with full UI)
- 🔄 Task 2: Wire domains to Supabase (SQL migration created, needs to be run)
- ⏳ Task 3: Complete Stripe payment confirmation
- ⏳ Task 4: Onboarding → Dashboard handoff
- ⏳ Task 5: End-to-end testing

---

## STEP 1: Run Supabase Migration

### Action Required:
1. Log into your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/migrations/001_initial_schema.sql`
4. Verify tables were created successfully

This will create:
- `domains` table with RLS
- `domain_settings` table
- `domain_dns_records` table
- `domain_ssl` table
- `orders` table
- `profiles` table
- `domain_analytics` table
- All indexes and RLS policies

---

## STEP 2: Create API Route for Order Persistence

Create `src/app/api/orders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      paymentIntentId,
      domainName,
      addons,
      amountTotal,
      currency = 'usd',
    } = await request.json();

    // Verify the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not succeeded' },
        { status: 400 }
      );
    }

    // Check if order already exists (idempotency)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (existingOrder) {
      return NextResponse.json(
        { message: 'Order already exists', orderId: existingOrder.id },
        { status: 200 }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        stripe_payment_intent_id: paymentIntentId,
        domain_name: domainName,
        addons: addons || {},
        amount_total: amountTotal,
        currency,
        status: 'paid',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create domain entry
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year from now

    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        domain_name: domainName,
        registrar: 'DomainPro', // or your platform name
        status: 'active',
        expires_at: expiresAt.toISOString(),
        purchase_price: amountTotal / 100, // convert from cents
        auto_renew: true,
        privacy_enabled: addons?.privacy || false,
      })
      .select()
      .single();

    if (domainError) throw domainError;

    // Create domain settings if any configuration was provided
    if (addons) {
      await supabase.from('domain_settings').insert({
        domain_id: domain.id,
        preferred_dns_mode: 'managed',
        metadata: addons,
      });
    }

    // Create SSL record if Premium SSL was purchased
    if (addons?.ssl) {
      await supabase.from('domain_ssl').insert({
        domain_id: domain.id,
        status: 'requested',
        provider: 'letsencrypt',
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      domainId: domain.id,
      domainName,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

---

## STEP 3: Update Checkout Page

Update `src/app/checkout/page.tsx` to call the orders API after successful payment:

Find the payment confirmation section and update it:

```typescript
// After successful Stripe confirmCardPayment
const handlePayment = async () => {
  try {
    setProcessing(true);

    // Confirm card payment
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: billingInfo.fullName,
            email: billingInfo.email,
            address: {
              line1: billingInfo.addressLine1,
              city: billingInfo.city,
              postal_code: billingInfo.postalCode,
              country: billingInfo.country,
            },
          },
        },
      }
    );

    if (error) {
      console.error(error);
      setError(error.message || 'Payment failed');
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // Persist order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          domainName: selectedDomain || 'example.com', // Replace with actual domain
          addons: {
            privacy: selectedAddons.includes('privacy'),
            ssl: selectedAddons.includes('ssl'),
            vpn: selectedAddons.includes('vpn'),
          },
          amountTotal: paymentIntent.amount,
          currency: paymentIntent.currency,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to onboarding with order/domain ID
        router.push(`/onboarding?orderId=${result.orderId}&domainId=${result.domainId}`);
      } else {
        setError('Order creation failed');
        setProcessing(false);
      }
    }
  } catch (err) {
    console.error(err);
    setError('An unexpected error occurred');
    setProcessing(false);
  }
};
```

---

## STEP 4: Update Onboarding Page

Update `src/app/onboarding/page.tsx` to handle the domain configuration and redirect:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  
  const domainId = searchParams.get('domainId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    async function loadDomain() {
      if (!domainId) return;
      
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('id', domainId)
        .single();
      
      if (data) setDomain(data);
      setLoading(false);
    }
    
    loadDomain();
  }, [domainId]);

  const completeOnboarding = async () => {
    // Save any onboarding configuration
    if (domainId) {
      await supabase
        .from('domain_settings')
        .upsert({
          domain_id: domainId,
          preferred_dns_mode: 'managed',
          // Add any other settings from onboarding
        });
    }
    
    // Redirect to domains dashboard
    router.push(`/domains`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Welcome! Let's set up {domain?.domain_name}
        </h1>
        
        {/* Your existing onboarding UI */}
        {/* Add step completion logic */}
        
        <button
          onClick={completeOnboarding}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}
```

---

## STEP 5: Install Required Dependencies

Ensure these packages are installed:

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js stripe @stripe/stripe-js
```

---

## STEP 6: Set Environment Variables

In Vercel dashboard, set:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## STEP 7: Testing Checklist

1. ✅ Navigate to /domains - should show empty state
2. ✅ Run SQL migration in Supabase
3. ✅ Navigate to /checkout
4. ✅ Complete checkout with test card (4242 4242 4242 4242)
5. ✅ Verify redirect to /onboarding with domainId
6. ✅ Complete onboarding
7. ✅ Verify redirect to /domains
8. ✅ Verify domain appears in list
9. ✅ Check Supabase tables for order and domain records
10. ✅ Test domain actions (auto-renew toggle, etc.)

---

## STEP 8: Deploy and Verify

```bash
git add .
git commit -m "Complete Stripe integration and Supabase wiring"
git push
```

Vercel will auto-deploy. Check:
1. Build logs for errors
2. Function logs for runtime errors
3. Test the full flow in production

---

## Troubleshooting

### Domain doesn't appear after checkout
- Check Vercel function logs
- Verify Supabase RLS policies are active
- Check browser console for errors

### Payment fails
- Verify Stripe keys are set correctly
- Check Stripe dashboard for payment intent status
- Ensure STRIPE_SECRET_KEY uses live/test key appropriately

### Database errors
- Verify SQL migration ran successfully
- Check Supabase logs
- Confirm RLS policies allow user operations

---

## Next Steps (After Implementation)

1. **DNS Management**: Build /domains/[id]/dns page
2. **Domain Detail Page**: Create /domains/[id] route
3. **API Integrations**: Connect to registrar APIs
4. **Domain Assistant**: Enhance AI chat features
5. **Analytics**: Wire domain_analytics table

---

End of Implementation Guide