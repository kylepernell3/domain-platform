"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Search, Check, ArrowRight, Star, Zap, ChevronRight, Sparkles, X, Award, Bot, Clock, DollarSign, Rocket, Eye, LayoutDashboard, FileCheck, MousePointerClick, ChevronDown, Menu, Gift } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Animated Icon Component
function AnimatedIcon({ icon: Icon, color, delay = 0 }: { icon: typeof Globe; color: string; delay?: number }) {
  return (
    <div 
      className="relative h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-icon-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 rounded-2xl ${color} opacity-15 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
      <div className={`absolute inset-0 rounded-2xl ${color} opacity-10`} />
      <div className={`absolute inset-0 rounded-2xl border ${color.replace('bg-', 'border-').replace('-500', '-500/40').replace('-600', '-600/40')} group-hover:border-opacity-100 transition-all duration-500`} />
      <Icon className={`h-7 w-7 ${color.replace('bg-', 'text-')} relative z-10`} />
    </div>
  )
}

// Parallax Background Component
function ParallaxOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-700/8 rounded-full blur-3xl animate-float-medium" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl animate-float-fast" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-float-medium" />
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  return (
    <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className={`absolute right-0 top-0 h-full w-80 bg-neutral-950 border-l border-neutral-800 transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Globe className="h-7 w-7 text-red-500/90" />
              <span className="text-xl font-display font-bold">DomainPro</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-300">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Features Accordion */}
            <div>
              <button 
                onClick={() => setExpandedSection(expandedSection === 'features' ? null : 'features')}
                className="w-full flex items-center justify-between py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300"
              >
                Features
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSection === 'features' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'features' ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="pl-4 space-y-2 pb-3">
                  {usps.slice(0, 6).map((usp, i) => (
                    <Link key={i} href="#features" onClick={onClose} className="flex items-center gap-3 py-2 text-neutral-400 hover:text-white transition-colors duration-300">
                      <usp.icon className="h-4 w-4 text-red-500/80" />
                      <span className="text-sm">{usp.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pricing Accordion */}
            <div>
              <button 
                onClick={() => setExpandedSection(expandedSection === 'pricing' ? null : 'pricing')}
                className="w-full flex items-center justify-between py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300"
              >
                Pricing
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSection === 'pricing' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'pricing' ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div className="pl-4 space-y-2 pb-3">
                  {pricingTiers.map((tier, i) => (
                    <Link key={i} href="#pricing" onClick={onClose} className="flex items-center justify-between py-2 text-neutral-400 hover:text-white transition-colors duration-300">
                      <span className="text-sm">{tier.name}</span>
                      <span className={`text-sm font-semibold ${tier.name === 'Free' ? 'text-emerald-400' : 'text-white'}`}>
                        {tier.name === 'Free' ? 'FREE' : `$${tier.price}/mo`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link href="#compare" onClick={onClose} className="block py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300">
              Compare
            </Link>
            <Link href="/dashboard" onClick={onClose} className="block py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300">
              Dashboard
            </Link>
          </div>
          
          <div className="mt-8 space-y-3">
            <Button variant="ghost" className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300 font-semibold">
              Sign In
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-500 text-white hover:text-white transition-all duration-300 font-semibold">
              Get Started Free
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 backdrop-blur-xl p-6 h-full hover:border-red-500/20 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-neutral-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-red-500/90 text-red-500/90" />
            ))}
          </div>
          <p className="text-neutral-300 mb-6 leading-relaxed font-normal tracking-wide">"{testimonial.quote}"</p>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600/90 to-red-700/90 flex items-center justify-center text-white font-bold text-lg tracking-tight">
              {testimonial.name[0]}
            </div>
            <div>
              <div className="font-semibold text-white tracking-tight">{testimonial.name}</div>
              <div className="text-sm text-neutral-400 font-medium">{testimonial.role}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Pricing Feature Row
function PricingFeatureRow({ feature, domainpro, godaddy, namecheap, highlight = false }: {
  feature: string
  domainpro: boolean | string
  godaddy: boolean | string
  namecheap: boolean | string
  highlight?: boolean
}) {
  return (
    <tr className={`border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors duration-300 ${highlight ? 'bg-red-600/5' : ''}`}>
      <td className={`py-4 px-6 text-neutral-300 font-medium ${highlight ? 'font-semibold text-white' : ''}`}>
        {highlight && <Sparkles className="inline h-4 w-4 text-red-500/90 mr-2" />}
        {feature}
      </td>
      <td className="py-4 px-6 text-center">
        {typeof domainpro === 'boolean' ? (
          domainpro ? <Check className="h-5 w-5 text-emerald-400 mx-auto" /> : <X className="h-5 w-5 text-neutral-600 mx-auto" />
        ) : (
          <span className={`font-semibold ${highlight ? 'text-red-400' : 'text-red-400'}`}>{domainpro}</span>
        )}
      </td>
      <td className="py-4 px-6 text-center">
        {typeof godaddy === 'boolean' ? (
          godaddy ? <Check className="h-5 w-5 text-neutral-400 mx-auto" /> : <X className="h-5 w-5 text-neutral-600 mx-auto" />
        ) : (
          <span className="text-neutral-400 font-medium">{godaddy}</span>
        )}
      </td>
      <td className="py-4 px-6 text-center">
        {typeof namecheap === 'boolean' ? (
          namecheap ? <Check className="h-5 w-5 text-neutral-400 mx-auto" /> : <X className="h-5 w-5 text-neutral-600 mx-auto" />
        ) : (
          <span className="text-neutral-400 font-medium">{namecheap}</span>
        )}
      </td>
    </tr>
  )
}

// Pricing Tier Card Component
function PricingTierCard({ tier, index, popular = false, isFree = false }: { tier: typeof pricingTiers[0]; index: number; popular?: boolean; isFree?: boolean }) {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className={`relative bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 backdrop-blur-xl p-8 h-full transition-all duration-500 group overflow-hidden ${popular ? 'ring-2 ring-red-500/40 scale-105 z-10' : 'hover:border-neutral-700'} ${isFree ? 'border-emerald-500/30' : ''}`}>
        {popular && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <Badge className="bg-red-600 hover:bg-red-600 text-white font-semibold text-xs uppercase tracking-wider rounded-t-none rounded-b-lg px-4">
              Most Popular
            </Badge>
          </div>
        )}
        {isFree && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider rounded-t-none rounded-b-lg px-4">
              <Gift className="h-3 w-3 mr-1" />
              Forever Free
            </Badge>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${popular ? 'from-red-600/10' : isFree ? 'from-emerald-600/10' : 'from-red-600/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10">
          <h3 className="text-xl font-display font-bold text-white tracking-tight mb-2">{tier.name}</h3>
          <p className="text-neutral-400 font-medium mb-6">{tier.description}</p>
          <div className="mb-8">
            {isFree ? (
              <div>
                <span className="text-5xl font-display font-bold text-emerald-400 tracking-tight">FREE</span>
                <span className="text-neutral-400 font-medium ml-2">forever</span>
              </div>
            ) : (
              <div>
                <span className="text-5xl font-display font-bold text-white tracking-tight">${tier.price}</span>
                <span className="text-neutral-400 font-medium">/month</span>
              </div>
            )}
          </div>
          <ul className="space-y-4 mb-8">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className={`h-5 w-5 ${isFree ? 'text-emerald-500/90' : 'text-red-500/90'} mt-0.5 flex-shrink-0`} />
                <span className="text-neutral-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full font-semibold tracking-wide transition-all duration-300 ${
              popular 
                ? 'bg-red-600 hover:bg-red-500 text-white hover:text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02]' 
                : isFree
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02]'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white hover:text-white hover:scale-[1.02]'
            }`}
            size="lg"
          >
            {isFree ? 'Start Free' : 'Get Started'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

const testimonials = [
  {
    quote: "Switched from GoDaddy and never looked back. The interface is lightning fast and the pricing is transparent.",
    name: "Sarah Chen",
    role: "Founder, TechStartup.io"
  },
  {
    quote: "Managing 50+ domains used to be a nightmare. DomainPro's dashboard makes it effortless. Best decision we made.",
    name: "Marcus Rodriguez",
    role: "CTO, Digital Agency"
  },
  {
    quote: "Started with the free plan to test it out. The 10 free SSL certificates on Pro saved us so much. Customer support is incredible.",
    name: "Emily Watson",
    role: "E-commerce Owner"
  },
  {
    quote: "AI-powered onboarding had us up and running in minutes. The built-in analytics are exactly what we needed.",
    name: "David Park",
    role: "Web Developer"
  }
]

const usps = [
  { icon: Shield, title: "10 FREE SSL Certificates", desc: "Enterprise-grade security included with every account — no hidden fees", color: "bg-red-600", gradient: "from-red-600/20 to-red-600/5", featured: true },
  { icon: Bot, title: "AI-Powered Onboarding", desc: "Intelligent setup wizard guides you through configuration in minutes", color: "bg-neutral-500", gradient: "from-neutral-500/20 to-neutral-500/5" },
  { icon: Clock, title: "99.9% Uptime with SLA", desc: "Guaranteed reliability backed by our service level agreement", color: "bg-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
  { icon: DollarSign, title: "No Hidden Fees", desc: "What you see is what you pay — transparent pricing always", color: "bg-neutral-400", gradient: "from-neutral-400/20 to-neutral-400/5" },
  { icon: Rocket, title: "Instant Domain Activation", desc: "Your domain goes live immediately after purchase", color: "bg-rose-500", gradient: "from-rose-500/20 to-rose-500/5" },
  { icon: Eye, title: "Free WHOIS Privacy Forever", desc: "Protect your personal information at no extra cost", color: "bg-neutral-500", gradient: "from-neutral-500/20 to-neutral-500/5" },
  { icon: MousePointerClick, title: "One-Click WordPress Deploy", desc: "Launch your WordPress site with a single click", color: "bg-red-500", gradient: "from-red-500/20 to-red-500/5" },
  { icon: LayoutDashboard, title: "Built-in Analytics Dashboard", desc: "Track domain performance and visitor insights in real-time", color: "bg-neutral-400", gradient: "from-neutral-400/20 to-neutral-400/5" },
  { icon: FileCheck, title: "Transparent Pricing", desc: "Clear, upfront pricing with no surprise charges at renewal", color: "bg-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
]

const pricingTiers = [
  {
    name: "Free",
    description: "Get started with zero cost",
    price: "0",
    features: [
      "Free subdomain (yoursite.domainpro.site)",
      "1 Page website",
      "Basic SSL Certificate",
      "500MB Storage",
      "Community support",
      "DomainPro branding"
    ]
  },
  {
    name: "Starter",
    description: "Perfect for individuals",
    price: "6.99",
    features: [
      "1 Custom domain included",
      "2 SSL Certificates",
      "10GB Storage",
      "Basic DNS Management",
      "Email Forwarding",
      "Standard Support",
      "No branding"
    ]
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    price: "19.99",
    features: [
      "5 Domains included",
      "10 FREE SSL Certificates",
      "100GB Storage",
      "Advanced DNS Management",
      "Professional Email (5 accounts)",
      "Priority 24/7 Support",
      "Full Analytics Dashboard",
      "One-Click WordPress Deploy",
      "API Access"
    ]
  },
  {
    name: "Enterprise",
    description: "For agencies and organizations",
    price: "79.99",
    features: [
      "Unlimited Domains",
      "Unlimited SSL Certificates",
      "Unlimited Storage",
      "Premium DNS with DDoS Protection",
      "Professional Email (Unlimited)",
      "Dedicated Account Manager",
      "White-label Solutions",
      "Custom Integrations",
      "SLA Guarantee"
    ]
  }
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const servicesSection = useScrollAnimation()
  const pricingSection = useScrollAnimation()
  const tiersSection = useScrollAnimation()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.nav-dropdown')) {
        setOpenDropdown(null)
      }
    }
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        
        body { font-family: var(--font-body); }
        .font-display { font-family: var(--font-display); }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.08); }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); }
          50% { opacity: 0.8; box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(220, 38, 38, 0.2); }
          50% { border-color: rgba(220, 38, 38, 0.4); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: shimmer 2s infinite; }
        .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-border-glow { animation: border-glow 2s ease-in-out infinite; }
        .text-gradient-red {
          background: linear-gradient(135deg, #dc2626 0%, #f87171 50%, #dc2626 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .text-gradient-white {
          background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Navigation with Dropdowns */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Globe className="h-9 w-9 text-red-500/90 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-0 bg-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              DomainPro
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Features Dropdown */}
            <div className="relative nav-dropdown">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'features' ? null : 'features')}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors duration-300 text-sm font-semibold tracking-wide uppercase py-2"
              >
                Features
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${openDropdown === 'features' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden min-w-[520px]">
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {usps.map((usp, i) => (
                      <Link 
                        key={i}
                        href="#features" 
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-all duration-300 group/item"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className={`p-2 rounded-lg ${usp.color} bg-opacity-20`}>
                          <usp.icon className={`h-4 w-4 ${usp.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm group-hover/item:text-red-400 transition-colors duration-300">{usp.title}</div>
                          <div className="text-xs text-neutral-500 line-clamp-1">{usp.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                    <Link href="#features" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors duration-300" onClick={() => setOpenDropdown(null)}>
                      View all features <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Dropdown */}
            <div className="relative nav-dropdown">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'pricing' ? null : 'pricing')}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors duration-300 text-sm font-semibold tracking-wide uppercase py-2"
              >
                Pricing
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openDropdown === 'pricing' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${openDropdown === 'pricing' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden min-w-[300px]">
                  <div className="p-4 space-y-2">
                    {pricingTiers.map((tier, i) => (
                      <Link 
                        key={i}
                        href="#pricing" 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/50 transition-all duration-300 group/item"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div>
                          <div className="font-semibold text-white text-sm group-hover/item:text-red-400 transition-colors duration-300 flex items-center gap-2">
                            {tier.name}
                            {tier.name === 'Free' && <Badge className="bg-emerald-600/20 text-emerald-400 text-[10px] hover:bg-emerald-600/20">FREE</Badge>}
                            {tier.name === 'Professional' && <Badge className="bg-red-600/20 text-red-400 text-[10px] hover:bg-red-600/20">POPULAR</Badge>}
                          </div>
                          <div className="text-xs text-neutral-500">{tier.description}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${tier.name === 'Free' ? 'text-emerald-400' : 'text-white'}`}>
                            {tier.name === 'Free' ? 'FREE' : `$${tier.price}`}
                          </div>
                          {tier.name !== 'Free' && <div className="text-xs text-neutral-500">/month</div>}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                    <Link href="#pricing" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors duration-300" onClick={() => setOpenDropdown(null)}>
                      Compare all plans <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simple Links */}
            <Link href="#compare" className="relative text-neutral-400 hover:text-white transition-colors duration-300 group text-sm font-semibold tracking-wide uppercase py-2">
              Compare
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500/80 to-red-400/80 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/dashboard" className="relative text-neutral-400 hover:text-white transition-colors duration-300 group text-sm font-semibold tracking-wide uppercase py-2">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500/80 to-red-400/80 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-300 font-semibold tracking-wide">
              Sign In
            </Button>
            <Button className="bg-red-600 hover:bg-red-500 text-white hover:text-white border-0 shadow-lg shadow-red-500/15 hover:shadow-red-500/30 transition-all duration-300 font-semibold tracking-wide hover:scale-[1.02]">
              Get Started Free
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-300" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <ParallaxOrbs />
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/15 via-neutral-950/50 to-neutral-950" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Free Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Gift className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-semibold tracking-wide">Start Free Today — No Credit Card Required</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '200ms' }}>
              <span className="block text-gradient-white">Your digital empire</span>
              <span className="text-gradient-red">starts here</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide animate-slide-up" style={{ animationDelay: '300ms' }}>
              The modern domain platform built for speed, security, and savings. 
              <span className="text-white font-semibold"> Free subdomain included. Upgrade anytime.</span>
            </p>
            
            {/* Search bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/40 to-red-500/40 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Find your perfect domain..." 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900/90 border border-neutral-700 focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/15 text-white placeholder:text-neutral-500 transition-all duration-300 font-medium tracking-wide"
                  />
                </div>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-500 text-white hover:text-white font-bold px-8 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 tracking-wide">
                Search Domains
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Domain prices */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
              {[
                { tld: '.com', price: '$8.99', popular: true },
                { tld: '.io', price: '$29.99', popular: false },
                { tld: '.co', price: '$14.99', popular: false },
                { tld: '.dev', price: '$12.99', popular: false },
              ].map((domain) => (
                <div 
                  key={domain.tld}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer ${
                    domain.popular 
                      ? 'bg-red-600/10 border-red-500/40 text-red-400' 
                      : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <span className="font-mono font-bold tracking-tight">{domain.tld}</span>
                  <span className="font-semibold">{domain.price}/yr</span>
                  {domain.popular && <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs font-bold tracking-wide">Popular</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Scroll to explore</span>
          <ChevronRight className="h-5 w-5 text-neutral-500 rotate-90" />
        </div>
      </section>

      {/* USP Features Section */}
      <section id="features" className="py-24 relative">
        <ParallaxOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div ref={servicesSection.ref} className={`text-center mb-16 transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/10 mb-4 uppercase tracking-widest font-bold text-xs">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="text-white">Everything you need to </span>
              <span className="text-gradient-red">succeed online</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
              Professional tools and services designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((usp, i) => {
              const cardAnimation = useScrollAnimation()
              const isFeatured = 'featured' in usp && usp.featured
              return (
                <div
                  key={i}
                  ref={cardAnimation.ref}
                  className={`transition-all duration-700 ${cardAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <Card className={`group bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 hover:border-neutral-700 transition-all duration-500 p-6 h-full relative overflow-hidden backdrop-blur-xl cursor-pointer hover:-translate-y-1 ${isFeatured ? 'ring-2 ring-red-500/30 animate-border-glow' : ''}`}>
                    {isFeatured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-600 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider">
                          <Award className="h-3 w-3 mr-1" />
                          Best Value
                        </Badge>
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-br ${usp.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <AnimatedIcon icon={usp.icon} color={usp.color} delay={i * 100} />
                      <h3 className="text-xl font-display font-bold mb-3 text-white group-hover:text-red-400 transition-colors duration-300 mt-4 tracking-tight">
                        {usp.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed font-medium tracking-wide">
                        {usp.desc}
                      </p>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SSL Highlight Banner */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-red-900/20 to-red-950/30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-red-600/15 border border-red-500/25 flex items-center justify-center animate-glow-pulse">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                  10 FREE SSL Certificates
                </h3>
                <p className="text-neutral-400 font-medium tracking-wide">
                  Included with Professional & Enterprise plans
                </p>
              </div>
            </div>
            <Button size="lg" className="bg-white hover:bg-neutral-100 text-neutral-950 hover:text-neutral-950 font-bold px-8 shadow-lg transition-all duration-300 hover:scale-105 tracking-wide">
              View Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tiered Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-neutral-950 to-neutral-900/50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div ref={tiersSection.ref} className={`text-center mb-16 transition-all duration-700 ${tiersSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="text-white">Start free, </span>
              <span className="text-gradient-red">scale as you grow</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
              No credit card required for free plan. Transparent pricing with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {pricingTiers.map((tier, i) => (
              <PricingTierCard key={i} tier={tier} index={i} popular={tier.name === 'Professional'} isFree={tier.name === 'Free'} />
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section id="compare" className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div ref={pricingSection.ref} className={`text-center mb-16 transition-all duration-700 ${pricingSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/30 hover:bg-neutral-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
              Compare
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="text-white">See how we </span>
              <span className="text-gradient-red">stack up</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
              Compare DomainPro with the competition
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <div className="min-w-[700px]">
              <Card className="bg-neutral-900/50 border-neutral-800/50 backdrop-blur-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="py-6 px-6 text-left text-neutral-400 font-semibold uppercase tracking-widest text-xs">Feature</th>
                      <th className="py-6 px-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-red-500/90" />
                            <span className="font-display font-bold text-white tracking-tight">DomainPro</span>
                          </div>
                          <Badge className="bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/10 font-bold text-xs uppercase tracking-wider">Recommended</Badge>
                        </div>
                      </th>
                      <th className="py-6 px-6 text-center"><span className="text-neutral-400 font-semibold">GoDaddy</span></th>
                      <th className="py-6 px-6 text-center"><span className="text-neutral-400 font-semibold">Namecheap</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <PricingFeatureRow feature="Free Plan Available" domainpro="YES" godaddy="Limited" namecheap={false} highlight={true} />
                    <PricingFeatureRow feature=".com Domain (1st year)" domainpro="$8.99" godaddy="$11.99" namecheap="$10.98" />
                    <PricingFeatureRow feature=".com Renewal" domainpro="$12.99" godaddy="$22.99" namecheap="$15.98" />
                    <PricingFeatureRow feature="WHOIS Privacy" domainpro="FREE Forever" godaddy="$9.99/yr" namecheap="FREE" />
                    <PricingFeatureRow feature="Free SSL Certificates" domainpro="10 FREE" godaddy="5 credits" namecheap="1 FREE" highlight={true} />
                    <PricingFeatureRow feature="Instant Activation" domainpro={true} godaddy={false} namecheap={true} />
                    <PricingFeatureRow feature="AI-Powered Onboarding" domainpro={true} godaddy={false} namecheap={false} />
                    <PricingFeatureRow feature="Built-in Analytics" domainpro={true} godaddy={false} namecheap={false} />
                    <PricingFeatureRow feature="One-Click WordPress" domainpro={true} godaddy={true} namecheap={true} />
                    <PricingFeatureRow feature="24/7 Support" domainpro={true} godaddy={true} namecheap={false} />
                    <PricingFeatureRow feature="API Access" domainpro={true} godaddy={true} namecheap={true} />
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <ParallaxOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/30 hover:bg-neutral-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="text-white">Loved by </span>
              <span className="text-gradient-red">businesses everywhere</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
              Don't just take our word for it. Here's what our customers have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} testimonial={testimonial} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/15 via-red-900/8 to-red-950/15" />
        <div className="absolute inset-0 bg-neutral-950/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-8 tracking-tight">
              <span className="text-white">Ready to claim your </span>
              <span className="text-gradient-red">digital territory?</span>
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
              Join businesses who trust DomainPro for their online presence. 
              <span className="text-white font-semibold"> Start free, no credit card required.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-500 text-white hover:text-white font-bold px-10 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 tracking-wide">
                Start Free Today
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 font-bold tracking-wide hover:scale-[1.02]">
                View All Plans
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-sm text-neutral-500 mt-8 tracking-wide font-medium">
              No credit card required • Free subdomain included • Upgrade anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-16 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-7 w-7 text-red-500/90" />
                <span className="text-xl font-display font-bold tracking-tight">DomainPro</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                The modern domain platform built for businesses that demand more.
              </p>
            </div>
            
            {[
              { title: 'Products', links: ['Domains', 'Hosting', 'Email', 'SSL'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'API Docs'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-neutral-500 hover:text-red-400 transition-colors duration-300 text-sm font-medium tracking-wide">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm font-medium tracking-wide">© 2026 DomainPro. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide">Privacy</Link>
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide">Terms</Link>
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
