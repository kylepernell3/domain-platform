"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  CreditCard, ShieldCheck, Lock, ChevronLeft, 
  CheckCircle2, AlertCircle, Info, Trash2, 
  Apple, Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<PaymentMethod>('card');
  const [savePayment, setSavePayment] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    cardNumber: '',
    cardholderName: '',
    expiry: '',
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.zip) newErrors.zip = 'Required';
    
    if (paymentType === 'card') {
      if (formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = 'Invalid Card';
      if (!formData.expiry.includes('/')) newErrors.expiry = 'MM/YY';
      if (formData.cvv.length < 3) newErrors.cvv = 'CVV';
    }
    
    if (!formData.agreed) newErrors.agreed = 'Terms required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Order Placed Successfully!');
    }, 2000);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Domains
          </button>
          
          <header>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Lock className="w-8 h-8 text-red-500" /> Secure Checkout
            </h1>
            <p className="text-gray-400 mt-2">Complete your domain purchase</p>
          </header>

          <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-500" /> Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email *</label>
                <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1 opacity-50 cursor-not-allowed" value={formData.email} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address *</label>
                <input className={`w-full bg-[#1a1a1a] border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1`} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" /> Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setPaymentType('apple_pay')} className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'apple_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10 text-white hover:border-white/30'}`}><Apple className="w-5 h-5" /> Apple Pay</button>
              <button onClick={() => setPaymentType('google_pay')} className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'google_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10 text-white hover:border-white/30'}`}><Smartphone className="w-5 h-5" /> Google Pay</button>
            </div>

            {paymentType === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Card Number *</label>
                  <div className="relative mt-1">
                    <input 
                      className={`w-full bg-[#1a1a1a] border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 pr-16 transition-all`} 
                      value={formData.cardNumber} 
                      onChange={e => setFormData({...formData, cardNumber: e.target.value})} 
                      placeholder="0000 0000 0000 0000"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {cardBrand ? (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border shadow-sm ${
                          cardBrand === 'Visa' ? 'bg-blue-600 border-blue-400 text-white' :
                          cardBrand === 'Mastercard' ? 'bg-orange-600 border-orange-400 text-white' :
                          cardBrand === 'AMEX' ? 'bg-cyan-600 border-cyan-400 text-white' :
                          'bg-gray-700 border-gray-500 text-gray-200'
                        }`}>
                          {cardBrand.toUpperCase()}
                        </span>
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1" placeholder="MM/YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                  <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1" placeholder="CVV" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
                </div>
                
                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="checkbox" checked={savePayment} onChange={e => setSavePayment(e.target.checked)} className="w-5 h-5 rounded accent-red-500" />
                  <div>
                    <p className="text-sm font-medium">Save payment method</p>
                    <p className="text-xs text-gray-500">Securely stored</p>
                  </div>
                </label>
              </div>
            )}
          </section>

          <div className="flex items-start gap-3">
            <input type="checkbox" checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} className="mt-1" />
            <p className="text-xs text-gray-400 leading-relaxed">I agree to the <a href="/terms" className="text-white underline">Terms of Service</a> and <a href="/privacy" className="text-white underline">Privacy Policy</a>. I understand that domain registrations are non-refundable.</p>
          </div>
          {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <p className="font-medium text-white">example-domain.com</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">New Registration • 1 Year</p>
              </div>
              <p className="font-bold">$12.99</p>
            </div>
            
            <div className="space-y-3 py-6 text-sm text-gray-400">
              <div className="flex justify-between"><span>Subtotal</span><span>$12.99</span></div>
              <div className="flex justify-between"><span>Tax</span><span>$0.00</span></div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/5"><span>Total Due</span><span>$12.99</span></div>
            </div>

            <button onClick={handlePay} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50">
              {isSubmitting ? 'Processing...' : 'Pay $12.99'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
