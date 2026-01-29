"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Globe, Check, Crown, Zap } from 'lucide-react';

interface PricingTier {
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    plan: 'free',
    price: 0,
    period: 'forever',
    features: [
      'Free .flowmain.site subdomain',
      'Basic DNS management',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Starter',
    plan: 'starter',
    price: 9.99,
    period: 'month',
    popular: true,
    features: [
      'Register custom TLD domains',
      'Unlimited domain transfers',
      'Advanced DNS management',
      'WHOIS privacy protection',
      'Email support',
    ],
    cta: 'Upgrade to Starter',
  },
  {
    name: 'Professional',
    plan: 'professional',
    price: 29.99,
    period: 'month',
    features: [
      'Everything in Starter',
      'Premium domain access',
      'Bulk domain management',
      'Priority support',
      'API access',
    ],
    cta: 'Upgrade to Pro',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
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
        setCurrentPlan(profile.plan || 'free');
      }
      setLoading(false);
    }

    fetchProfile();
  }, [supabase, router]);

  const handleUpgrade = async (plan: string) => {
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
        .update({ plan })
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
          {currentPlan !== 'free' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg mb-8">
              <Check className="h-5 w-5" />
              <span>Current plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier) => {
            const isCurrent = currentPlan === tier.plan;
            const isDowngrade = 
              (currentPlan === 'professional' && tier.plan !== 'professional') ||
              (currentPlan === 'starter' && tier.plan === 'free');
            const isDisabled = isCurrent || isDowngrade;

            return (
              <div
                key={tier.plan}
                className={`relative p-8 rounded-2xl border transition-all ${
                  tier.popular
                    ? 'border-red-500 bg-gradient-to-b from-red-500/10 to-gray-800/50 scale-105'
                    : 'border-gray-700 bg-gray-800/50'
                } ${
                  isCurrent ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-400">/{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.plan)}
                  disabled={isDisabled || upgrading}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isDisabled
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

      {/* FAQ or Additional Info */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-400 mb-6">
            Free accounts can register a .flowmain.site subdomain. Paid accounts unlock custom TLD domains.
          </p>
          <button
            onClick={() => router.push('/support/contact')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium"
          >
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
}
