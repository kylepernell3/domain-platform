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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentIntentId, domainName, addons, amountTotal, currency = 'usd' } = await request.json();

    // Verify the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not succeeded' }, { status: 400 });
    }

    // Check if order already exists (idempotency)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (existingOrder) {
      return NextResponse.json({ message: 'Order already exists', orderId: existingOrder.id }, { status: 200 });
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
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        domain_name: domainName,
        registrar: 'DomainPro',
        status: 'active',
        expires_at: expiresAt.toISOString(),
        purchase_price: amountTotal / 100,
        auto_renew: true,
        privacy_enabled: addons?.privacy || false,
      })
      .select()
      .single();

    if (domainError) throw domainError;

    // Create domain settings
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
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}