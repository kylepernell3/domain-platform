"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Globe, Check, Crown, Zap, Building2, Code } from 'lucide-react';

interface PricingTier {
  name: string;
  plan: 'starter' | 'professional' | 'developer' | 'enterprise' | 'white_label';
  price: number;
  annualPrice?: number;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
  isContactSales?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    plan: 'starter',
    price: 0,
    period: 'forever',
    features: [
      'Automatic HTTPS (DV certificates for your .domainpro.site subdomain)',
      'Basic DNS management',
      '1 GB storage',
      '10 GB bandwidth',
      'Free subdomain (yourname.domainpro.site)',
      'DomainPro branding',
      'Community support',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Professional',
    plan: 'professional',
    price: 19.99,
    annualPrice: 15.99,
    period: 'month',
    popular: true,
    features: [
      'Automatic HTTPS for all connected domains',
      'Unlimited domain management',
      '10 email forwards included',
      'Advanced DNS management',
      'Beginner website builder',
      '80 GB storage',
      '100 GB bandwidth',
      'Basic analytics dashboard',
      'Domain transfer tools',
      '1-click DNS templates',
      'Email support (24-hour response)',
    ],
    cta: 'Upgrade to Professional',
  },
  {
    name: 'Developer',
    plan: 'developer',
    price: 79.99,
    annualPrice: 63.99,
    period: 'month',
    features: [
      'Everything in Professional',
      'Automatic HTTPS for unlimited sites',
      'Advanced website builder',
      'Host unlimited websites',
      'Version history & one-click rollback',
      '5 Gmail inboxes included (30 GB each)',
      'API access (domains, DNS, billing)',
      'Custom DNS templates',
    ],
    cta: 'Upgrade to Developer',
  },
  {
    name: 'Enterprise',
    plan: 'enterprise',
    price: 249.99,
    annualPrice: 199.99,
    period: 'month',
    features: [
      'Everything in Developer',
      'Multi-site management dashboard',
      'Multi-client dashboard',
      'Team collaboration',
      '10 Gmail inboxes (30 GB each)',
      '500 GB storage per website',
      'Premium DNS & DDoS protection',
      'Dedicated account manager',
      'Custom certificate management',
    ],
    cta: 'Upgrade to Enterprise',
  },
  {
    name: 'White Label',
    plan: 'white_label',
    price: 499,
    period: 'month',
    isContactSales: true,
    features: [
      'Custom-branded control panel and URLs',
      'Everything in Enterprise, rebranded',
      'Whitelabel billing and invoices',
      'API and provisioning support',
      'Priority support and onboarding',
      'Custom limits and pricing',
      'Revenue-share options',
    ],
    cta: 'Contact Sales',
  },
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [currentPlan, setCurrentPlan] = useState<string>('starter');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const redirectDomain = searchParams.get('domain');
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/pricing');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setCurrentPlan(profile.plan || 'starter');
      }
      setLoading(false);
    }

    fetchProfile();
  }, [supabase, router]);

  const handleUpgrade = async (plan: string, isContactSales: boolean = false) => {
    // For White Label, redirect to contact form
    if (isContactSales || plan === 'white_label') {
      router.push('/contact?plan=white-label');
      return;
    }

    setUpgrading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirect=/pricing');
        return;
      }

      // Update user's plan
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan,
          billing_cycle: billingCycle 
        })
        .eq('id', session.user.id);

      if (error) throw error;

      // Redirect based on context
      if (redirectDomain && redirectUrl) {
        router.push(`${redirectUrl}?domain=${redirectDomain}`);
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanLevel = (plan: string): number => {
    const levels: Record<string, number> = {
      'starter': 0,
      'professional': 1,
      'developer': 2,
      'enterprise': 3,
      'white_label': 4,
    };
    return levels[plan] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-xl bg-gray-900/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">DomainPro</span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-red-500">Plan</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {redirectDomain
              ? `Upgrade to register ${redirectDomain}`
              : 'Select the plan that works best for you'}
          </p>
          {currentPlan !== 'starter' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg mb-8">
              <Check className="h-5 w-5" />
              <span>Current plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).replace('_', ' ')}</span>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PRICING_TIERS.map((tier) => {
            const currentLevel = getPlanLevel(currentPlan);
            const tierLevel = getPlanLevel(tier.plan);
            const isCurrent = currentPlan === tier.plan;
            const isDowngrade = tierLevel < currentLevel;
            const isDisabled = isCurrent || isDowngrade;
            
            // Calculate display price based on billing cycle
            const displayPrice = billingCycle === 'annual' && tier.annualPrice 
              ? tier.annualPrice 
              : tier.price;

            return (
              <div
                key={tier.plan}
                className={`relative p-6 rounded-2xl border transition-all ${
                  tier.popular
                    ? 'border-red-500 bg-gradient-to-b from-red-500/10 to-gray-800/50 lg:scale-105'
                    : 'border-gray-700 bg-gray-800/50'
                } ${
                  isCurrent ? 'ring-2 ring-green-500' : ''
                } ${
                  tier.isContactSales ? 'border-purple-500 bg-gradient-to-b from-purple-500/10 to-gray-800/50' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                {tier.isContactSales && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                    CUSTOM
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    {tier.isContactSales ? (
                      <span className="text-3xl font-bold">From ${tier.price}</span>
                    ) : tier.price === 0 ? (
                      <span className="text-3xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">${displayPrice}</span>
                        <span className="text-gray-400">/{tier.period}</span>
                      </>
                    )}
                  </div>
                  {billingCycle === 'annual' && tier.annualPrice && tier.price > 0 && (
                    <div className="text-sm text-green-400 mt-1">
                      Save ${((tier.price - tier.annualPrice) * 12).toFixed(2)}/year
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.plan, tier.isContactSales)}
                  disabled={isDisabled && !tier.isContactSales}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    tier.isContactSales
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : tier.popular
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isDowngrade
                    ? 'Contact Support'
                    : upgrading
                    ? 'Processing...'
                    : tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">

