'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs;
import { 
  Bot, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Shield, 
  Settings,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
    const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const domainId = searchParams.get('domainId');
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    async function loadDomain() {
      if (!domainId) {
        setLoading(false);
        return;
      }
      
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
        });
    }
    
    // Redirect to domains dashboard
    router.push('/domains');
  };
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<string | null>(null);
  const [showBot, setShowBot] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBot(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExperienceSelect = (level: string) => {
    setExperience(level);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => completeOnboarding()
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-red-600/20">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">DomainPro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="/domains" className="hover:text-white transition-colors">Domains</a>
            <a href="/dns" className="hover:text-white transition-colors">DNS</a>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all border border-white/10">
              Support
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {step === 1 && (
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">Welcome to the family!</h1>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Your domain purchase was successful. Let's get everything connected and secured so you can start building.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Secure DNS', desc: 'Enterprise-grade protection', icon: Shield },
                { title: 'Auto-Renewal', desc: 'Never lose your domain', icon: Globe },
                { title: 'Configuration', desc: 'Step-by-step setup', icon: Settings },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-all group">
                  <item.icon className="w-8 h-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
                Personalized Guide
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                {experience === 'beginner' 
                  ? "Let's walk through this together" 
                  : experience === 'intermediate' 
                    ? "Setting up your connection" 
                    : "Power user quick start"}
              </h2>
              <p className="text-lg text-gray-400">
                Based on your experience, we've tailored these steps to help you connect your domain to your platform.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Update Nameservers',
                  desc: 'Point your domain to our cloud network for maximum performance.',
                  action: 'View NS Records',
                  completed: true
                },
                {
                  title: 'Configure A Records',
                  desc: 'Link your domain to your web server or hosting provider.',
                  action: 'Setup Guide',
                  completed: false
                },
                {
                  title: 'Enable DNSSEC',
                  desc: 'Add an extra layer of security to prevent DNS hijacking.',
                  action: 'Enable Now',
                  completed: false
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 p-6 bg-[#111] border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold ${step.completed ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white/50'}`}>
                    {step.completed ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                  </div>
                  <div className="flex-grow space-y-2">
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                    <button className="text-red-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                      {step.action} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </main>

      {showBot && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-12 fade-in duration-500">
          <div className="w-[380px] bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5">
            <div className="p-6 bg-red-600 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">Domain Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Online & Ready</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm leading-relaxed text-gray-300">
                  Hey Kyle! I'm here to help you get started. To provide the best guide, how would you describe your experience with DNS and domain configuration?
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-3">
                  {[
                    { id: 'beginner', label: 'I\'m new to this', sub: 'Walk me through every step' },
                    { id: 'intermediate', label: 'I know the basics', sub: 'Just show me the records' },
                    { id: 'expert', label: 'I\'m an expert', sub: 'Give me the raw data' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleExperienceSelect(option.id)}
                      className="w-full p-4 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left group"
                    >
                      <div className="font-bold text-sm group-hover:text-red-500 transition-colors">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.sub}</div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-red-500/10 p-4 rounded-2xl rounded-tl-none border border-red-500/10 text-sm leading-relaxed text-red-100">
                    Perfect! I've updated your guide. I'll stay here if you have any questions during the setup.
                  </div>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Type a message..."
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                    />
                    <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button 
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 z-[90]"
        onClick={() => setShowBot(!showBot)}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
