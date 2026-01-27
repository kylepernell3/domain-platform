"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  CreditCard, ShieldCheck, Lock, ChevronLeft, 
  CheckCircle2, AlertCircle, Info, Trash2, Apple, Smartphone, Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

interface Profile {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  company?: string;
}

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

const getCardBrand = (number: string) => {
  const cleanNumber = number.replace(/\D/g, '');
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'AMEX';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
  return null;
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'domain' | 'ssl' | 'hosting' | 'protection';
}

const RECOMMENDATIONS = [
  {
    id: 'privacy',
    name: 'Privacy Protection',
    description: 'Hide your personal info on WHOIS',
    price: 4.99,
    icon: ShieldCheck,
    trigger: 'domain'
  },
  {
    id: 'ssl',
    name: 'Premium SSL',
    description: 'Enhanced security for your visitors',
    price: 19.99,
    icon: Lock,
    trigger: 'domain'
  },
  {
    id: 'vpn',
    name: 'Pro VPN',
    description: 'Secure your connection anywhere',
    price: 9.99,
    icon: ShieldCheck,
    trigger: 'ssl'
  }
];

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<PaymentMethod>('card');
  const [savePayment, setSavePayment] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'example-domain.com', price: 12.99, type: 'domain' }
  ]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    company: '',
    cardholderName: '',
    expiry: '',
    cardNumber: '',
    cvv: '',
    agreed: false
  });

  useEffect(() => {
    async function getSessionAndProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirect=/checkout');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setFormData(prev => ({
          ...prev,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: session.user.email || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          zip: profileData.zip_code || '',
          country: profileData.country || 'United States',
          phone: profileData.phone || '',
          company: profileData.company || ''
        }));
      }
      setLoading(false);
    }
    getSessionAndProfile();
  }, [supabase, router]);

  const cardBrand = useMemo(() => getCardBrand(formData.cardNumber), [formData.cardNumber]);
  
  const dynamicRecommendations = useMemo(() => {
    const cartTypes = cart.map(item => item.type);
    return RECOMMENDATIONS.filter(rec => 
      cartTypes.includes(rec.trigger as any) && !cart.some(item => item.id === rec.id)
    );
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  const addToCart = (rec: typeof RECOMMENDATIONS[0]) => {
    setCart([...cart, { id: rec.id, name: rec.name, price: rec.price, type: rec.trigger as any }]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.zip) newErrors.zip = 'Required';
    
    if (paymentType === 'card') {
      const cleanCard = formData.cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) newErrors.cardNumber = 'Invalid Card';
      if (!formData.expiry.includes('/')) newErrors.expiry = 'MM/YY';
      if (formData.cvv.length < 3) newErrors.cvv = 'CVV';
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    
try {
      // Call payment intent API
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          description: `Domain Platform Purchase - ${cart.map(i => i.name).join(', ')}`
        })
      });

      const { clientSecret, error } = await response.json();
      
      if (error) {
        setErrors({ payment: error });
        setIsSubmitting(false);
        return;
      }

        setErrors({ payment: 'Failed to load payment processor' });
        setIsSubmitting(false);
        return;
      }

      // Confirm the payment with the card details
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: formData.cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(formData.expiry.split('/')[0]),
            exp_year: parseInt('20' + formData.expiry.split('/')[1]),
            cvc: formData.cvv,
          },
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
              country: 'US',
            },
          },
        },
              });
      });

      if (confirmError) {
        setErrors({ payment: confirmError.message || 'Payment failed' });
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful - redirect to onboarding
        router.push('/onboarding');
      } else {
        setErrors({ payment: 'Payment was not successful' });
        setIsSubmitting(false);
          
    
      }
        }
 catch (error) {
      setErrors({ payment: 'Payment failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const CardBrandIcon = ({ brand }: { brand: string | null }) => {
    if (brand === 'Visa') {return (
        <svg width="40" height="24" viewBox="0 0 48 32" className="animate-in fade-in slide-in-from-right-2">
          <rect width="48" height="32" rx="4" fill="#1A1F71"/>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
        </svg>
      );
    }
    if (brand === 'Mastercard') {
      return (
        <svg width="40" height="24" viewBox="0 0 48 32" className="animate-in fade-in slide-in-from-right-2">
          <circle cx="18" cy="16" r="10" fill="#EB001B"/>
          <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
        </svg>
      );
    }
    return <CreditCard className="w-5 h-5 text-gray-600 opacity-50" />;
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <header>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Lock className="w-8 h-8 text-red-500" /> Secure Checkout
            </h1>
          </header>

          <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-500" /> Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">First Name *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Last Name *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase">Email *</label>
                <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1 opacity-50 cursor-not-allowed" value={formData.email} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase">Address *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
               <div>
 <label className="text-xs font-medium text-gray-500 uppercase">City *</label>
 <input className={`w-full bg-[#1a1a1a] border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
 </div>
 <div>
 <label className="text-xs font-medium text-gray-500 uppercase">Zip Code *</label>
 <input className={`w-full bg-[#1a1a1a] border ${errors.zip ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
 </div>
            </div>
          </section>

          <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setPaymentType('apple_pay')} className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'apple_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10'}`}><Apple className="w-5 h-5" /> Apple Pay</button>
              <button onClick={() => setPaymentType('google_pay')} className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'google_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10'}`}><Smartphone className="w-5 h-5" /> Google Pay</button>
            </div>

            {paymentType === 'card' && (
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 uppercase">Card Number *</label>
                  <input className={`w-full bg-[#1a1a1a] border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} placeholder="0000 0000 0000 0000" />
                  <div className="absolute right-3 top-9"><CardBrandIcon brand={cardBrand} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3" placeholder="MM/YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                  <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3" placeholder="CVV" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{item.type}</p>
                  </div>
                  <p className="font-bold">${item.price}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between text-gray-400 text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-bold pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <button onClick={handlePay} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold mt-6 transition-all disabled:opacity-50">
              {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>

          {dynamicRecommendations.length > 0 && (
            <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-500" /> Recommended
              </h3>
              <div className="space-y-4">
                {dynamicRecommendations.map(rec => (
                  <div key={rec.id} className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg"><rec.icon className="w-5 h-5 text-red-500" /></div>
                      <div>
                        <p className="text-sm font-medium">{rec.name}</p>
                        <p className="text-xs text-gray-500">{rec.description}</p>
                      </div>
                    </div>
                    <button onClick={() => addToCart(rec)} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10">Add ${rec.price}</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-500" /> DNS Setup
            </h2>
            <div className="text-xs space-y-2 text-gray-400">
              <div className="flex justify-between p-2 bg-black/40 rounded border border-white/5"><span>A @</span><span>76.76.21.21</span></div>
              <div className="flex justify-between p-2 bg-black/40 rounded border border-white/5"><span>CNAME www</span><span>cname.vercel-dns.com</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
