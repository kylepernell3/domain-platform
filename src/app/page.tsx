/*
 * =============================================================================
 * DOMAINPRO HOMEPAGE - SEO META TAGS RECOMMENDATIONS
 * =============================================================================
 * Add the following meta tags to your layout.tsx or _app.tsx:
 *
 * <title>DomainPro - Modern Domain Registration & Web Hosting Platform</title>
 * <meta name="description" content="Register domains starting at $8.99/yr. Get 10 FREE SSL certificates, AI-powered onboarding, and 24/7 support. Start free today - no credit card required." />
 * <meta name="keywords" content="domain registration, web hosting, SSL certificates, domain transfer, WordPress hosting" />
 * 
 * <!-- Open Graph / Facebook -->
 * <meta property="og:type" content="website" />
 * <meta property="og:url" content="https://domainpro.com/" />
 * <meta property="og:title" content="DomainPro - Your Digital Empire Starts Here" />
 * <meta property="og:description" content="The modern domain platform built for speed, security, and savings. Free subdomain included." />
 * <meta property="og:image" content="https://domainpro.com/og-image.png" />
 *
 * <!-- Twitter -->
 * <meta property="twitter:card" content="summary_large_image" />
 * <meta property="twitter:url" content="https://domainpro.com/" />
 * <meta property="twitter:title" content="DomainPro - Modern Domain Registration Platform" />
 * <meta property="twitter:description" content="Register domains starting at $8.99/yr. Get 10 FREE SSL certificates." />
 * <meta property="twitter:image" content="https://domainpro.com/twitter-image.png" />
 *
 * <!-- Canonical URL -->
 * <link rel="canonical" href="https://domainpro.com/" />
 *
 * <!-- Favicon -->
 * <link rel="icon" href="/favicon.ico" />
 * <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
 * =============================================================================
 */

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Search, Check, ArrowRight, Star, ChevronRight, Sparkles, X, Award, Bot, Clock, DollarSign, Rocket, Eye, LayoutDashboard, FileCheck, MousePointerClick, ChevronDown, Menu, Gift, Server, Mail, Lock, RefreshCw, Layers, Cloud, HardDrive, Send, Briefcase, Store, Code, Users, Info, Loader2, ChevronUp, CreditCard, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"

// Navigation menu structure
const navMenus = {
  domains: {
    title: "Domains",
    items: [
      { name: "Domain Search", desc: "Find your perfect domain name", icon: Search },
      { name: "Domain Transfer", desc: "Move your domain to DomainPro", icon: RefreshCw },
      { name: "Domain Backorder", desc: "Catch expiring domains", icon: Clock },
      { name: "Bulk Domain Search", desc: "Register multiple domains at once", icon: Layers },
      { name: "Domain Auctions", desc: "Bid on premium domains", icon: DollarSign },
    ]
  },
  hosting: {
    title: "Hosting",
    items: [
      { name: "Web Hosting", desc: "Fast & reliable shared hosting", icon: Server },
      { name: "WordPress Hosting", desc: "Optimized for WordPress sites", icon: Code },
      { name: "VPS Hosting", desc: "Virtual private server power", icon: HardDrive },
      { name: "Dedicated Servers", desc: "Maximum performance & control", icon: Server },
      { name: "Cloud Hosting", desc: "Scalable cloud infrastructure", icon: Cloud },
    ]
  },
  email: {
    title: "Email",
    items: [
      { name: "Professional Email", desc: "Business email with your domain", icon: Mail },
      { name: "Email Marketing", desc: "Reach your audience effectively", icon: Send },
      { name: "Microsoft 365", desc: "Full Office suite & email", icon: Briefcase },
    ]
  },
  websites: {
    title: "Websites",
    items: [
      { name: "Website Builder", desc: "Drag & drop site creation", icon: LayoutDashboard },
      { name: "WordPress", desc: "World's most popular CMS", icon: Code },
      { name: "Online Store", desc: "Sell products online", icon: Store },
      { name: "Website Security", desc: "SSL & malware protection", icon: Lock },
    ]
  }
}

// FAQ Data
const faqData = [
  {
    question: "How does pricing work? Are there any hidden fees?",
    answer: "Our pricing is completely transparent. The price you see is the price you pay - no hidden fees, no surprise charges at renewal. All plans include the features listed, and you can cancel anytime without penalty."
  },
  {
    question: "Can I migrate my existing domains from another registrar?",
    answer: "Absolutely! We offer free domain transfers with zero downtime. Our migration wizard guides you through the process step-by-step, and our support team is available 24/7 to assist. Most transfers complete within 5-7 days."
  },
  {
    question: "What kind of support do you offer?",
    answer: "Free plan users get community support. Starter plans include email support with 24-hour response time. Professional and Enterprise plans include priority 24/7 support via chat, email, and phone, plus a dedicated account manager for Enterprise."
  },
  {
    question: "Are SSL certificates really free?",
    answer: "Yes! We include free SSL certificates with all plans. Free plans get 1 basic SSL, Starter gets 2, Professional gets 10, and Enterprise gets unlimited SSL certificates. These are industry-standard certificates that secure your website with HTTPS."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time with no penalties or hidden fees. Your service will continue until the end of your current billing period. Domain registration fees are non-refundable per ICANN policy."
  },
  {
    question: "How long does it take to set up?",
    answer: "Most customers are up and running in under 5 minutes! Our AI-powered onboarding guides you through the setup process. Domain activation is instant, and our one-click WordPress deploy gets your site live in seconds."
  }
]

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Custom hook for scroll-triggered animations
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: "50px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000, start: number = 0, trigger: boolean = true) {
  const [count, setCount] = useState(start)
  
  useEffect(() => {
    if (!trigger) return
    
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, start, trigger])
  
  return count
}

// Skip to Content Link Component
function SkipToContent() {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:outline-none"
    >
      Skip to main content
    </a>
  )
}

// Back to Top Button Component
function BackToTopButton({ show }: { show: boolean }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-40 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}

// Live Sign-ups Counter Component
function LiveSignupsCounter({ signups }: { signups: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500/10 border-b border-emerald-500/20">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm text-emerald-300 font-medium">
          <span className="font-bold text-emerald-400">{signups.toLocaleString()}</span> people signed up in the last 24 hours
        </span>
      </div>
    </div>
  )
}

// Sticky CTA Bar Component
function StickyCTABar({ show }: { show: boolean }) {
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 transition-transform duration-500 ${show ? 'translate-y-0' : 'translate-y-full'}`}
      role="complementary"
      aria-label="Quick signup"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Limited Time</Badge>
          <span className="text-neutral-300 font-medium">Start free today — No credit card required</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-neutral-400 text-sm hidden md:block">Cancel anytime</span>
          <button 
            onClick={() => smoothScrollTo('pricing')}
            className="btn-swipe-red px-6 py-2.5 rounded-lg font-semibold tracking-wide flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label="Start free today - scroll to pricing"
          >
            Start Free Today
            <Sparkles className="h-4 w-4 animate-sparkle" />
          </button>
        </div>
      </div>
    </div>
  )
}

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onToggle, index }: { 
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div className="border-b border-neutral-800/50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset rounded-lg"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="font-semibold text-white group-hover:text-red-400 transition-colors duration-300 pr-4">
          {question}
        </span>
        <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div 
        id={`faq-answer-${index}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
      >
        <p className="text-neutral-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

// FAQ Section Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <section className="py-24 relative" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/30 mb-4 uppercase tracking-widest font-bold text-xs">
            FAQ
          </Badge>
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Frequently Asked </span>
            <span className="text-gradient-red">Questions</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
            Everything you need to know about DomainPro
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="bg-neutral-900/50 border-neutral-800/50 backdrop-blur-xl p-6 md:p-8">
            {faqData.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                index={i}
              />
            ))}
          </Card>
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation()
  
  const steps = [
    { icon: Search, title: "Search", desc: "Find your perfect domain name", color: "text-red-400", bg: "bg-red-600/10" },
    { icon: Shield, title: "Register", desc: "Secure checkout with instant activation", color: "text-emerald-400", bg: "bg-emerald-600/10" },
    { icon: Rocket, title: "Launch", desc: "Go live with one-click deployment", color: "text-blue-400", bg: "bg-blue-600/10" },
  ]
  
  return (
    <section className="py-24 relative overflow-hidden" aria-labelledby="how-it-works-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-950" />
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Badge className="bg-red-600/10 text-red-400 border-red-500/30 mb-4 uppercase tracking-widest font-bold text-xs">
            Simple Process
          </Badge>
          <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">How It </span>
            <span className="text-gradient-red">Works</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
            Get online in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div 
              key={i}
              className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative inline-block mb-6">
                <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-10 w-10 ${step.color}`} aria-hidden="true" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">{step.title}</h3>
              <p className="text-neutral-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Social Proof Counter
function SocialProofCounter() {
  const { ref, isVisible } = useScrollAnimation()
  const count = useCountUp(10000, 2500, 0, isVisible)
  
  return (
    <div 
      ref={ref}
      className="flex items-center justify-center gap-2 text-neutral-400"
    >
      <Users className="h-5 w-5" aria-hidden="true" />
      <span className="font-medium">
        Join <span className="text-white font-bold">{count.toLocaleString()}+</span> businesses worldwide
      </span>
    </div>
  )
}

// Tooltip Component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group/tooltip inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50" role="tooltip">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
      </div>
    </div>
  )
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
      <Icon className={`h-7 w-7 ${color.replace('bg-', 'text-')} relative z-10`} aria-hidden="true" />
    </div>
  )
}

// Parallax Background Component
function ParallaxOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-700/8 rounded-full blur-3xl animate-float-medium" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl animate-float-fast" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-float-medium" />
    </div>
  )
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const handleNavClick = (sectionId: string) => {
    onClose()
    setTimeout(() => smoothScrollTo(sectionId), 100)
  }
  
  return (
    <div 
      className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`absolute right-0 top-0 h-full w-80 bg-neutral-950 border-l border-neutral-800 transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Globe className="h-7 w-7 text-red-500/90" aria-hidden="true" />
              <span className="text-xl font-display font-bold">DomainPro</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="space-y-1" aria-label="Mobile navigation">
            {Object.entries(navMenus).map(([key, menu]) => (
              <div key={key}>
                <button 
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full flex items-center justify-between py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset rounded-lg"
                  aria-expanded={expandedSection === key}
                >
                  {menu.title}
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSection === key ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedSection === key ? 'max-h-[400px]' : 'max-h-0'}`}>
                  <div className="pl-4 space-y-1 pb-3">
                    {menu.items.map((item, i) => (
                      <Link key={i} href="#" onClick={onClose} className="flex items-center gap-3 py-2 text-neutral-400 hover:text-white transition-colors duration-300 focus:outline-none focus:text-red-400">
                        <item.icon className="h-4 w-4 text-red-500/80" aria-hidden="true" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => handleNavClick('pricing')}
              className="w-full text-left py-3 text-white font-semibold hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset rounded-lg"
            >
              Pricing
            </button>
          </nav>
          
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 px-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500">
              Sign In
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="btn-swipe-red w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Get Started Free
              <Sparkles className="h-4 w-4 animate-sparkle" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Testimonial Carousel (Mobile)
function TestimonialCarousel({ testimonials }: { testimonials: typeof testimonialData }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }
    if (touchStart - touchEnd < -75) {
      setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }
  
  return (
    <div 
      className="lg:hidden relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Testimonials carousel"
    >
      <div 
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, i) => (
          <div key={i} className="w-full flex-shrink-0 px-4" role="group" aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}>
            <TestimonialCard testimonial={testimonial} index={i} />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${i === currentIndex ? 'bg-red-500 w-6' : 'bg-neutral-600'}`}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-selected={i === currentIndex}
            role="tab"
          />
        ))}
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonialData[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 backdrop-blur-xl p-6 h-full hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-neutral-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex gap-1 mb-4" aria-label={`5 out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-red-500/90 text-red-500/90" aria-hidden="true" />
            ))}
          </div>
          <blockquote className="text-neutral-300 mb-6 leading-relaxed font-normal tracking-wide">"{testimonial.quote}"</blockquote>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600/90 to-red-700/90 flex items-center justify-center text-white font-bold text-lg tracking-tight" aria-hidden="true">
              {testimonial.name[0]}
            </div>
            <div>
              <cite className="font-semibold text-white tracking-tight not-italic">{testimonial.name}</cite>
              <div className="text-sm text-neutral-400 font-medium">{testimonial.role}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Pricing Feature Row with 4 competitors (Bluehost removed)
function PricingFeatureRow({ feature, domainpro, godaddy, namecheap, wordpress, highlight = false, tooltip }: {
  feature: string
  domainpro: boolean | string
  godaddy: boolean | string
  namecheap: boolean | string
  wordpress: boolean | string
  highlight?: boolean
  tooltip?: string
}) {
  const renderCell = (value: boolean | string, isHighlight: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="h-5 w-5 text-emerald-400 mx-auto" aria-label="Yes" /> : <X className="h-5 w-5 text-neutral-600 mx-auto" aria-label="No" />
    }
    return <span className={`font-semibold ${isHighlight ? 'text-red-400' : 'text-neutral-400'}`}>{value}</span>
  }

  return (
    <tr className={`border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors duration-300 ${highlight ? 'bg-red-600/5' : ''}`}>
      <td className={`py-4 px-4 text-neutral-300 font-medium ${highlight ? 'font-semibold text-white' : ''}`}>
        <div className="flex items-center gap-2">
          {highlight && <Sparkles className="h-4 w-4 text-red-500/90 animate-sparkle" aria-hidden="true" />}
          {feature}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="h-4 w-4 text-neutral-500 hover:text-neutral-300 cursor-help" aria-label="More information" />
            </Tooltip>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-center bg-red-500/5">{renderCell(domainpro, highlight)}</td>
      <td className="py-4 px-4 text-center">{renderCell(godaddy)}</td>
      <td className="py-4 px-4 text-center">{renderCell(namecheap)}</td>
      <td className="py-4 px-4 text-center">{renderCell(wordpress)}</td>
    </tr>
  )
}

// Pricing Tier Card Component
function PricingTierCard({ tier, index, popular = false, isFree = false, isAnnual }: { 
  tier: typeof pricingTiers[0]
  index: number
  popular?: boolean
  isFree?: boolean
  isAnnual: boolean
}) {
  const { ref, isVisible } = useScrollAnimation()
  const monthlyPrice = parseFloat(tier.price)
  const annualPrice = isFree ? 0 : monthlyPrice * 0.8
  const displayPrice = isAnnual && !isFree ? annualPrice.toFixed(2) : tier.price
  
  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className={`relative bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 backdrop-blur-xl p-8 h-full transition-all duration-500 group overflow-hidden hover:shadow-xl hover:scale-[1.02] ${popular ? 'ring-2 ring-red-500/40 scale-105 z-10 shadow-lg shadow-red-500/10' : 'hover:border-neutral-700 hover:-translate-y-1'} ${isFree ? 'border-emerald-500/30' : ''}`}>
        {popular && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <Badge className="bg-red-600 hover:bg-red-600 text-white font-semibold text-xs uppercase tracking-wider rounded-t-none rounded-b-lg px-4 animate-pulse-subtle">
              Most Popular
            </Badge>
          </div>
        )}
        {isFree && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider rounded-t-none rounded-b-lg px-4">
              <Gift className="h-3 w-3 mr-1" aria-hidden="true" />
              Forever Free
            </Badge>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${popular ? 'from-red-600/10' : isFree ? 'from-emerald-600/10' : 'from-red-600/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10">
          <h3 className="text-xl font-display font-bold text-white tracking-tight mb-2">{tier.name}</h3>
          <p className="text-neutral-400 font-medium mb-6">{tier.description}</p>
          <div className="mb-2">
            {isFree ? (
              <div>
                <span className="text-5xl font-display font-bold text-emerald-400 tracking-tight">FREE</span>
                <span className="text-neutral-400 font-medium ml-2">forever</span>
              </div>
            ) : (
              <div>
                <span className="text-5xl font-display font-bold text-white tracking-tight">${displayPrice}</span>
                <span className="text-neutral-400 font-medium">/month</span>
              </div>
            )}
          </div>
          {isAnnual && !isFree && (
            <div className="mb-6">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                Save 20% annually
              </Badge>
            </div>
          )}
          {!isAnnual && !isFree && <div className="mb-6 h-6" />}
          <ul className="space-y-4 mb-8" aria-label={`${tier.name} plan features`}>
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className={`h-5 w-5 ${isFree ? 'text-emerald-500/90' : 'text-red-500/90'} mt-0.5 flex-shrink-0`} aria-hidden="true" />
                <span className="text-neutral-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => smoothScrollTo('hero')}
            className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
              popular 
                ? 'btn-swipe-red shadow-lg shadow-red-500/20 focus:ring-red-500' 
                : isFree
                ? 'btn-swipe-green shadow-lg shadow-emerald-500/20 focus:ring-emerald-500'
                : 'btn-swipe-gray focus:ring-neutral-500'
            }`}
            aria-label={`Get started with ${tier.name} plan`}
          >
            {isFree ? 'Start Free' : 'Get Started'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Card>
    </div>
  )
}

const testimonialData = [
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
      "20 Domains included",
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

const domainPrices = [
  { tld: '.com', price: '$8.99', popular: true },
  { tld: '.io', price: '$29.99', popular: false },
  { tld: '.co', price: '$14.99', popular: false },
  { tld: '.dev', price: '$12.99', popular: false },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [signups, setSignups] = useState(247)
  const servicesSection = useScrollAnimation()
  const pricingSection = useScrollAnimation()
  const tiersSection = useScrollAnimation()

  // Keyboard shortcut: "/" to focus search (functionality kept, hint removed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Slower counter animation - 25-40 seconds interval, 1-2 increments
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 2) + 1
      setSignups(prev => prev + increment)
    }, Math.random() * 15000 + 25000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowStickyCTA(window.scrollY > 600)
      setShowBackToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = () => {
        if (!searchQuery.trim()) return
    
    // Redirect to search results page
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`

  const handleDomainClick = (tld: string) => {
    setSearchQuery(`mydomain${tld}`)
    searchInputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden scroll-smooth">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        
        html { scroll-behavior: smooth; }
        body { font-family: var(--font-body); }
        .font-display { font-family: var(--font-display); }
        
        /* BUTTON SWIPE ANIMATIONS */
        .btn-swipe-red {
          background: linear-gradient(to right, #525252 50%, #dc2626 50%);
          background-size: 200% 100%;
          background-position: right;
          color: white;
          transition: background-position 0.3s ease-out;
        }
        .btn-swipe-red:hover { background-position: left; }
        
        .btn-swipe-green {
          background: linear-gradient(to right, #525252 50%, #059669 50%);
          background-size: 200% 100%;
          background-position: right;
          color: white;
          transition: background-position 0.3s ease-out;
        }
        .btn-swipe-green:hover { background-position: left; }
        
        .btn-swipe-gray {
          background: linear-gradient(to right, #525252 50%, #262626 50%);
          background-size: 200% 100%;
          background-position: right;
          color: white;
          transition: background-position 0.3s ease-out;
        }
        .btn-swipe-gray:hover { background-position: left; }
        
        .btn-swipe-white {
          background: linear-gradient(to right, #525252 50%, #ffffff 50%);
          background-size: 200% 100%;
          background-position: right;
          color: #171717;
          transition: background-position 0.3s ease-out, color 0.3s ease-out;
        }
        .btn-swipe-white:hover { background-position: left; color: white; }
        
        .btn-swipe-outline {
          background: linear-gradient(to right, #525252 50%, transparent 50%);
          background-size: 200% 100%;
          background-position: right;
          color: white;
          border: 1px solid #404040;
          transition: background-position 0.3s ease-out, border-color 0.3s ease-out;
        }
        .btn-swipe-outline:hover { background-position: left; border-color: #525252; }
        
        /* HOVER DROPDOWN */
        .nav-dropdown { position: relative; }
        .nav-dropdown .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding-top: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
        }
        .nav-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; }
        .nav-dropdown:hover .dropdown-trigger { color: white; }
        .nav-dropdown:hover .dropdown-chevron { transform: rotate(180deg); }
        
        /* ANIMATIONS */
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
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-border-glow { animation: border-glow 2s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        
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
        
        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #dc2626;
          outline-offset: 2px;
        }
        
        /* Skip to content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        /* Table scroll fade gradients */
        .table-scroll-container {
          position: relative;
        }
        .table-scroll-container::before,
        .table-scroll-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          pointer-events: none;
          z-index: 10;
        }
        .table-scroll-container::before {
          left: 0;
          background: linear-gradient(to right, rgba(10, 10, 10, 0.9), transparent);
        }
        .table-scroll-container::after {
          right: 0;
          background: linear-gradient(to left, rgba(10, 10, 10, 0.9), transparent);
        }
        
        @media (min-width: 1024px) {
          .table-scroll-container::before,
          .table-scroll-container::after {
            display: none;
          }
        }
      `}</style>

      <SkipToContent />

      {/* Sticky Header Container */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <LiveSignupsCounter signups={signups} />
        
        <nav className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer py-4" aria-label="DomainPro Home">
              <div className="relative">
                <Globe className="h-9 w-9 text-red-500/90 group-hover:rotate-180 transition-transform duration-700" aria-hidden="true" />
                <div className="absolute inset-0 bg-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                DomainPro
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              {Object.entries(navMenus).map(([key, menu]) => (
                <div key={key} className="nav-dropdown">
                  <button className="dropdown-trigger flex items-center gap-1 text-neutral-400 transition-colors duration-200 text-sm font-semibold tracking-wide uppercase py-4 px-3 focus:outline-none focus:text-red-400">
                    {menu.title}
                    <ChevronDown className="dropdown-chevron h-4 w-4 transition-transform duration-200" aria-hidden="true" />
                  </button>
                  <div className="dropdown-menu z-50">
                    <div className="bg-neutral-900/98 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden min-w-[320px]">
                      <div className="p-3">
                        {menu.items.map((item, i) => (
                          <Link key={i} href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-800/60 transition-all duration-200 group/item focus:outline-none focus:bg-neutral-800/60">
                            <div className="p-2 rounded-lg bg-red-600/10 group-hover/item:bg-red-600/20 transition-colors duration-200">
                              <item.icon className="h-4 w-4 text-red-400" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm group-hover/item:text-red-400 transition-colors duration-200">{item.name}</div>
                              <div className="text-xs text-neutral-500">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => smoothScrollTo('pricing')}
                className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-semibold tracking-wide uppercase py-4 px-3 focus:outline-none focus:text-red-400"
              >
                Pricing
              </button>
            </div>
            
            <div className="hidden lg:flex items-center gap-3">
              <button className="text-neutral-400 hover:text-white hover:bg-neutral-800/50 px-4 py-2 rounded-lg transition-all duration-300 font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-red-500">
                Sign In
              </button>
              <button 
                onClick={() => smoothScrollTo('pricing')}
                className="btn-swipe-red px-6 py-2.5 rounded-lg font-semibold tracking-wide flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label="Get started for free"
              >
                Get Started Free
                <Sparkles className="h-4 w-4 animate-sparkle" aria-hidden="true" />
              </button>
            </div>
            
            <button 
              className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <StickyCTABar show={showStickyCTA} />
      <BackToTopButton show={showBackToTop} />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
          <ParallaxOrbs />
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/15 via-neutral-950/50 to-neutral-950" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
          
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <Gift className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span className="text-sm text-emerald-300 font-semibold tracking-wide">Start Free Today — No Credit Card Required</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '200ms' }}>
                <span className="block text-gradient-white">Your digital empire</span>
                <span className="text-gradient-red">starts here</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-400 mb-6 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide animate-slide-up" style={{ animationDelay: '300ms' }}>
                The modern domain platform built for speed, security, and savings. 
                <span className="text-white font-semibold"> Free subdomain included. Upgrade anytime.</span>
              </p>
              
              <div className="mb-8 animate-slide-up" style={{ animationDelay: '350ms' }}>
                <SocialProofCounter />
              </div>
              
              {/* Search bar - keyboard hint removed */}
              <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600/40 to-red-500/40 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-neutral-500" aria-hidden="true" />
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Find your perfect domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900/90 border border-neutral-700 focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/30 text-white placeholder:text-neutral-500 transition-all duration-300 font-medium tracking-wide"
                      aria-label="Search for a domain name"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="btn-swipe-red font-bold px-8 py-4 rounded-xl shadow-lg shadow-red-500/20 tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                  aria-label="Search domains"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search Domains
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
                {domainPrices.map((domain) => (
                  <button 
                    key={domain.tld}
                    onClick={() => handleDomainClick(domain.tld)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      domain.popular 
                        ? 'bg-red-600/10 border-red-500/40 text-red-400 hover:bg-red-600/20' 
                        : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800/50'
                    }`}
                    aria-label={`Select ${domain.tld} domain extension at ${domain.price} per year`}
                  >
                    <span className="font-mono font-bold tracking-tight">{domain.tld}</span>
                    <span className="font-semibold">{domain.price}/yr</span>
                    {domain.popular && <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs font-bold tracking-wide">Popular</Badge>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-neutral-500" aria-hidden="true" />
          </div>
        </section>

        <HowItWorksSection />

        {/* USP Features Section */}
        <section id="features" className="py-24 relative" aria-labelledby="features-heading">
          <ParallaxOrbs />
          <div className="container mx-auto px-4 relative z-10">
            <div ref={servicesSection.ref} className={`text-center mb-16 transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/10 mb-4 uppercase tracking-widest font-bold text-xs">
                Why Choose Us
              </Badge>
              <h2 id="features-heading" className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
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
                    <Card className={`group bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-neutral-800/50 hover:border-neutral-700 transition-all duration-500 p-6 h-full relative overflow-hidden backdrop-blur-xl cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] ${isFeatured ? 'ring-2 ring-red-500/30 animate-border-glow' : ''}`}>
                      {isFeatured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-600 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider animate-pulse-subtle">
                            <Award className="h-3 w-3 mr-1" aria-hidden="true" />
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
        <section className="py-12 relative overflow-hidden" aria-label="SSL Certificate promotion">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-red-900/20 to-red-950/30" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-red-600/15 border border-red-500/25 flex items-center justify-center animate-glow-pulse">
                  <Shield className="h-8 w-8 text-red-400" aria-hidden="true" />
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
              <button 
                onClick={() => smoothScrollTo('pricing')}
                className="btn-swipe-white font-bold px-8 py-3 rounded-lg shadow-lg tracking-wide flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                View Plans
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* Tiered Pricing Section */}
        <section id="pricing" className="py-24 bg-gradient-to-b from-neutral-950 to-neutral-900/50 relative" aria-labelledby="pricing-heading">
          <div className="container mx-auto px-4 relative z-10">
            <div ref={tiersSection.ref} className={`text-center mb-12 transition-all duration-700 ${tiersSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
                Simple Pricing
              </Badge>
              <h2 id="pricing-heading" className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                <span className="text-white">Start free, </span>
                <span className="text-gradient-red">scale as you grow</span>
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide mb-8">
                No credit card required for free plan. Transparent pricing with no hidden fees.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Badge className="bg-neutral-800/50 text-neutral-300 border-neutral-700 px-4 py-2">
                  <Check className="h-4 w-4 mr-2 text-emerald-400" aria-hidden="true" />
                  Cancel Anytime
                </Badge>
                <Badge className="bg-neutral-800/50 text-neutral-300 border-neutral-700 px-4 py-2">
                  <Lock className="h-4 w-4 mr-2 text-emerald-400" aria-hidden="true" />
                  No Hidden Fees
                </Badge>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${isAnnual ? 'bg-red-600' : 'bg-neutral-700'}`}
                  role="switch"
                  aria-checked={isAnnual}
                  aria-label="Toggle annual pricing"
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <span className={`font-medium transition-colors ${isAnnual ? 'text-white' : 'text-neutral-500'}`}>
                  Annual
                  <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Save 20%</Badge>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
              {pricingTiers.map((tier, i) => (
                <PricingTierCard 
                  key={i} 
                  tier={tier} 
                  index={i} 
                  popular={tier.name === 'Professional'} 
                  isFree={tier.name === 'Free'}
                  isAnnual={isAnnual}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Comparison Section - Bluehost removed, now 4 competitors */}
        <section id="compare" className="py-24 relative" aria-labelledby="compare-heading">
          <div className="container mx-auto px-4 relative z-10">
            <div ref={pricingSection.ref} className={`text-center mb-16 transition-all duration-700 ${pricingSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/30 hover:bg-neutral-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
                Compare
              </Badge>
              <h2 id="compare-heading" className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                <span className="text-white">See how we </span>
                <span className="text-gradient-red">stack up</span>
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
                Compare DomainPro with the competition
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Mobile scroll hint */}
              <div className="flex justify-center mb-4 lg:hidden">
                <span className="text-sm text-neutral-500 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                  Scroll to compare
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              
              <div className="table-scroll-container overflow-x-auto">
                <div className="min-w-[700px] relative">
                  <div className="absolute top-0 left-[20%] w-[20%] h-full bg-red-500/5 blur-xl pointer-events-none" aria-hidden="true" />
                  <Card className="bg-neutral-900/50 border-neutral-800/50 backdrop-blur-xl overflow-hidden relative">
                    <table className="w-full" role="table" aria-label="Feature comparison table">
                      <thead>
                        <tr className="border-b border-neutral-800">
                          <th scope="col" className="py-6 px-4 text-left text-neutral-400 font-semibold uppercase tracking-widest text-xs">Feature</th>
                          <th scope="col" className="py-6 px-4 text-center bg-red-500/5">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-red-500/90" aria-hidden="true" />
                                <span className="font-display font-bold text-white tracking-tight">DomainPro</span>
                              </div>
                              <Badge className="bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/10 font-bold text-xs uppercase tracking-wider">Recommended</Badge>
                            </div>
                          </th>
                          <th scope="col" className="py-6 px-4 text-center"><span className="text-neutral-400 font-semibold text-sm">GoDaddy</span></th>
                          <th scope="col" className="py-6 px-4 text-center"><span className="text-neutral-400 font-semibold text-sm">Namecheap</span></th>
                          <th scope="col" className="py-6 px-4 text-center"><span className="text-neutral-400 font-semibold text-sm">WordPress.com</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        <PricingFeatureRow feature="Free Plan Available" domainpro="YES" godaddy="Limited" namecheap={false} wordpress="YES" highlight={true} />
                        <PricingFeatureRow feature=".com Domain (1st year)" domainpro="$8.99" godaddy="$11.99" namecheap="$10.98" wordpress="$18" />
                        <PricingFeatureRow feature=".com Renewal" domainpro="$12.99" godaddy="$22.99" namecheap="$15.98" wordpress="$25" />
                        <PricingFeatureRow feature="WHOIS Privacy" domainpro="FREE Forever" godaddy="$9.99/yr" namecheap="FREE" wordpress="$8/yr" tooltip="Protects your personal info from public WHOIS lookup" />
                        <PricingFeatureRow feature="Free SSL Certificates" domainpro="10 FREE" godaddy="5 credits" namecheap="1 FREE" wordpress="1 FREE" highlight={true} tooltip="SSL certificates secure your site with HTTPS" />
                        <PricingFeatureRow feature="Intelligent DNS Wizard" domainpro={true} godaddy={false} namecheap={false} wordpress={false} tooltip="AI-powered DNS configuration assistant" />
                        <PricingFeatureRow feature="AI-Powered Onboarding" domainpro={true} godaddy={false} namecheap={false} wordpress={false} tooltip="Intelligent setup wizard for quick configuration" />
                        <PricingFeatureRow feature="Built-in Analytics" domainpro={true} godaddy={false} namecheap={false} wordpress={true} />
                        <PricingFeatureRow feature="One-Click WordPress" domainpro={true} godaddy={true} namecheap={true} wordpress={true} />
                        <PricingFeatureRow feature="24/7 Support" domainpro={true} godaddy={true} namecheap={false} wordpress={false} />
                        <PricingFeatureRow feature="API Access" domainpro={true} godaddy={true} namecheap={true} wordpress="Limited" tooltip="Programmatic access for developers" />
                      </tbody>
                    </table>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 relative overflow-hidden" aria-labelledby="testimonials-heading">
          <ParallaxOrbs />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/30 hover:bg-neutral-500/10 mb-4 uppercase tracking-widest font-bold text-xs">
                Testimonials
              </Badge>
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                <span className="text-white">Loved by </span>
                <span className="text-gradient-red">businesses everywhere</span>
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium tracking-wide">
                Don't just take our word for it. Here's what our customers have to say.
              </p>
            </div>

            <TestimonialCarousel testimonials={testimonialData} />
            
            <div className="hidden lg:grid grid-cols-4 gap-6">
              {testimonialData.map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} index={i} />
              ))}
            </div>
          </div>
        </section>

        <FAQSection />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/15 via-red-900/8 to-red-950/15" />
          <div className="absolute inset-0 bg-neutral-950/80" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="cta-heading" className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-8 tracking-tight">
                <span className="text-white">Ready to claim your </span>
                <span className="text-gradient-red">digital territory?</span>
              </h2>
              <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
                Join businesses who trust DomainPro for their online presence. 
                <span className="text-white font-semibold"> Start free, no credit card required.</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                <span className="text-neutral-400 text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Cancel anytime
                </span>
                <span className="text-neutral-400 text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> No hidden fees
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => smoothScrollTo('hero')}
                  className="btn-swipe-red font-bold px-10 py-4 rounded-lg shadow-lg shadow-red-500/20 tracking-wide flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  Start Free Today
                  <Sparkles className="h-5 w-5 animate-sparkle" aria-hidden="true" />
                </button>
                <button 
                  onClick={() => smoothScrollTo('pricing')}
                  className="btn-swipe-outline font-bold px-10 py-4 rounded-lg tracking-wide flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  View All Plans
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              
              <p className="text-sm text-neutral-500 mt-8 tracking-wide font-medium">
                No credit card required • Free subdomain included • Upgrade anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-16 bg-neutral-950" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-7 w-7 text-red-500/90" aria-hidden="true" />
                <span className="text-xl font-display font-bold tracking-tight">DomainPro</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium mb-6">
                The modern domain platform built for businesses that demand more.
              </p>
              
              {/* Security Trust Badges */}
              <div className="space-y-3">
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Trusted & Secure</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Shield className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Lock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Domains</h4>
              <ul className="space-y-3">
                {navMenus.domains.items.slice(0, 4).map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-neutral-500 hover:text-red-400 transition-colors duration-300 text-sm font-medium tracking-wide focus:outline-none focus:text-red-400">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Hosting</h4>
              <ul className="space-y-3">
                {navMenus.hosting.items.slice(0, 4).map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-neutral-500 hover:text-red-400 transition-colors duration-300 text-sm font-medium tracking-wide focus:outline-none focus:text-red-400">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'System Status', 'API Docs'].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="text-neutral-500 hover:text-red-400 transition-colors duration-300 text-sm font-medium tracking-wide focus:outline-none focus:text-red-400">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Payment Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span>Visa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span>Mastercard</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span>American Express</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <DollarSign className="h-4 w-4" aria-hidden="true" />
                  <span>PayPal</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                  <span>Apple Pay</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-3">
                Payments processed securely through Stripe
              </p>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm font-medium tracking-wide">© 2026 DomainPro. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide focus:outline-none focus:text-red-400">Privacy</Link>
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide focus:outline-none focus:text-red-400">Terms</Link>
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide focus:outline-none focus:text-red-400">Cookies</Link>
              <Link href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 font-medium tracking-wide focus:outline-none focus:text-red-400">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
