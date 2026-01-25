"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  CreditCard, ShieldCheck, Lock, ChevronLeft, 
  CheckCircle2, AlertCircle, Info, Trash2, 
  Apple, Smartphone // For Google Pay/Apple Pay icons
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Types & Interfaces ---
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

// --- Card Brand Validator Logic ---
const getCardBrand = (number: string) => {
  const cleanNumber = number.replace(/\D/g, '');
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'AMEX';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
  return null;
};

export default function CheckoutPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentMethod>('card');
  const [savePayment, setSavePayment] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
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

  // --- 1. Fetching Real Authenticated Data ---
  useEffect(() => {
    async function getSessionAndProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/checkout');
        return;
      }

      // Fetch true profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData && !error) {
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

  // --- 2. Card Brand Identification ---
  const cardBrand = useMemo(() => getCardBrand(formData.cardNumber), [formData.cardNumber]);

  // --- 3. Robust Validation Logic ---
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.zip) newErrors.zip = 'Required';
    
    if (paymentType === 'card') {
      if (formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = 'Invalid Card Number';
      if (!formData.expiry.includes('/')) newErrors.expiry = 'Use MM/YY';
      if (formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    }

    if (!formData.agreed) newErrors.agreed = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // Logic for processing payment and autosaving to Supabase would go here
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Order Placed Successfully!');
    }, 2000);
  };

  if (loading) return <div className=\"min-h-screen bg-black flex items-center justify-center text-white\">Loading Secure Checkout...</div>;

  return (
    <div className=\"min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans\">
      <div className=\"max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8\">
        
        {/* Main Checkout Form */}
        <div className=\"lg:col-span-2 space-y-8\">
          <button onClick={() => router.back()} className=\"flex items-center text-gray-400 hover:text-white transition-colors\">
            <ChevronLeft className=\"w-4 h-4 mr-1\" /> Back to Domains
          </button>

          <header>
            <h1 className=\"text-3xl font-bold flex items-center gap-3\">
              <Lock className=\"w-8 h-8 text-red-500\" /> Secure Checkout
            </h1>
            <p className=\"text-gray-400 mt-2\">Complete your domain purchase</p>
          </header>

          {/* Billing Section */}
          <section className=\"bg-[#111] border border-white/5 rounded-2xl p-6\">
            <h2 className=\"text-xl font-semibold mb-6 flex items-center gap-2\">
              <CheckCircle2 className=\"w-5 h-5 text-red-500\" /> Billing Information
            </h2>
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div>
                <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">First Name *</label>
                <input 
                  className={`w-full bg-[#1a1a1a] border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1 outline-none focus:border-red-500`}
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">Last Name *</label>
                <input 
                  className={`w-full bg-[#1a1a1a] border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1 outline-none focus:border-red-500`}
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className=\"md:col-span-2\">
                <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">Email *</label>
                <input className=\"w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1 opacity-50 cursor-not-allowed\" value={formData.email} disabled />
              </div>
              <div className=\"md:col-span-2\">
                <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">Address *</label>
                <input 
                  className={`w-full bg-[#1a1a1a] border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1 outline-none focus:border-red-500`}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className=\"bg-[#111] border border-white/5 rounded-2xl p-6\">
            <div className=\"flex justify-between items-center mb-6\">
              <h2 className=\"text-xl font-semibold flex items-center gap-2\">
                <CreditCard className=\"w-5 h-5 text-red-500\" /> Payment Method
              </h2>
              <div className=\"flex gap-2\">
                {/* Brand Visualizer Icons */}
                <div className={`px-2 py-1 border rounded text-[10px] font-bold ${cardBrand === 'Visa' ? 'bg-blue-600 border-blue-400' : 'bg-gray-800 opacity-20'}`}>VISA</div>
                <div className={`px-2 py-1 border rounded text-[10px] font-bold ${cardBrand === 'Mastercard' ? 'bg-orange-600 border-orange-400' : 'bg-gray-800 opacity-20'}`}>MC</div>
                <div className={`px-2 py-1 border rounded text-[10px] font-bold ${cardBrand === 'AMEX' ? 'bg-cyan-600 border-cyan-400' : 'bg-gray-800 opacity-20'}`}>AMEX</div>
              </div>
            </div>

            {/* Quick Pay Options (Apple / Google) */}
            <div className=\"grid grid-cols-2 gap-4 mb-6\">
              <button 
                onClick={() => setPaymentType('apple_pay')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'apple_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10 text-white hover:border-white/30'}`}
              >
                <Apple className=\"w-5 h-5\" /> Apple Pay
              </button>
              <button 
                onClick={() => setPaymentType('google_pay')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentType === 'google_pay' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10 text-white hover:border-white/30'}`}
              >
                <Smartphone className=\"w-5 h-5\" /> Google Pay
              </button>
            </div>

            <div className=\"relative mb-6\">
              <div className=\"absolute inset-0 flex items-center\"><span className=\"w-full border-t border-white/5\"></span></div>
              <div className=\"relative flex justify-center text-xs uppercase\"><span className=\"bg-[#111] px-2 text-gray-500\">Or Pay with Card</span></div>
            </div>

            {/* Traditional Card Form */}
            {paymentType === 'card' && (
              <div className=\"space-y-4\">
                <div>
                  <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">Card Number *</label>
                  <div className=\"relative\">
                    <input 
                      placeholder=\"XXXX XXXX XXXX XXXX\"
                      className={`w-full bg-[#1a1a1a] border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 mt-1 pl-10 outline-none focus:border-red-500`}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    />
                    <CreditCard className=\"absolute left-3 top-4 w-5 h-5 text-gray-500\" />
                  </div>
                  {cardBrand && <p className=\"text-[10px] text-red-500 mt-1 font-bold tracking-widest uppercase\">Detecting: {cardBrand}</p>}
                </div>
                <div className=\"grid grid-cols-2 gap-4\">
                  <div>
                    <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">Expiry Date *</label>
                    <input 
                      placeholder=\"MM/YY\"
                      className=\"w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1 outline-none focus:border-red-500\"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className=\"text-xs font-medium text-gray-500 uppercase tracking-wider\">CVV *</label>
                    <input 
                      placeholder=\"123\"
                      className=\"w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mt-1 outline-none focus:border-red-500\"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>

                <label className=\"flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors\">
                  <input 
                    type=\"checkbox\" 
                    checked={savePayment} 
                    onChange={(e) => setSavePayment(e.target.checked)}
                    className=\"w-5 h-5 rounded accent-red-500\" 
                  />
                  <div>
                    <p className=\"text-sm font-medium\">Save payment method for future use</p>
                    <p className=\"text-xs text-gray-500\">Securely stored in your DomainPro account</p>
                  </div>
                </label>
              </div>
            )}
          </section>

          <div className=\"flex items-start gap-3\">
            <input type=\"checkbox\" checked={formData.agreed} onChange={(e) => setFormData({...formData, agreed: e.target.checked})} className=\"mt-1\" />
            <p className=\"text-xs text-gray-400 leading-relaxed\">
              I agree to the <a href=\"/terms\" className=\"text-white underline\">Terms of Service</a> and <a href=\"/privacy\" className=\"text-white underline\">Privacy Policy</a>. I understand that domain registrations are non-refundable.
            </p>
          </div>
          {errors.agreed && <p className=\"text-red-500 text-xs\">{errors.agreed}</p>}

        </div>

        {/* Sidebar Order Summary */}
        <div className=\"space-y-6\">
          <div className=\"bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-8\">
            <h2 className=\"text-xl font-semibold mb-6\">Order Summary</h2>
            <div className=\"flex justify-between items-center pb-4 border-b border-white/5\">
              <div>
                <p className=\"font-medium text-white\">example-domain.com</p>
                <p className=\"text-xs text-gray-500 uppercase tracking-widest\">New Registration • 1 Year</p>
              </div>
              <p className=\"font-bold\">$12.99</p>
            </div>
            
            <div className=\"space-y-3 py-6 text-sm\">
              <div className=\"flex justify-between text-gray-400\"><span>Subtotal</span><span>$12.99</span></div>
              <div className=\"flex justify-between text-gray-400\"><span>Estimated Tax</span><span>$0.00</span></div>
              <div className=\"flex justify-between text-xl font-bold text-white pt-3 border-t border-white/5\">
                <span>Total Due</span><span>$12.99</span>
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={isSubmitting}
              className=\"w-full bg-red-600 hover:bg-red-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-white hover:text-red-600 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50\"
            >
              {isSubmitting ? \"Processing...\" : <><Lock className=\"w-4 h-4\" /> Pay $12.99</>}
            </button>

            <div className=\"mt-8 space-y-4\">
              <div className=\"flex items-center gap-3 text-xs text-gray-500\">
                <ShieldCheck className=\"w-4 h-4 text-green-500\" />
                <span>256-bit SSL Encrypted Connection</span>
              </div>
              <div className=\"flex items-center gap-3 text-xs text-gray-500\">
                <Info className=\"w-4 h-4 text-blue-500\" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
