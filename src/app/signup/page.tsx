"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Globe, Mail, Lock, Eye, EyeOff, User, Building2, Check, AlertCircle, CheckCircle,
  Shield, Zap, Crown, ArrowRight, ArrowLeft, Loader2, Phone, MapPin, Sun, Moon,
  Menu, X, Rocket, Heart, Twitter, Linkedin, Instagram, Facebook, Sparkles,
  CreditCard, CircleDot,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

type PlanId = "free" | "starter" | "professional" | "enterprise"
type BillingCycle = "monthly" | "annual"
type AccountType = "personal" | "business"
type Theme = "light" | "dark"

interface PricingPlan {
  id: PlanId
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  highlighted?: boolean
  icon: React.ComponentType<{ className?: string }>
  gradientFrom: string
  gradientTo: string
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

interface FormData {
  selectedPlan: PlanId
  billingCycle: BillingCycle
  fullName: string
  email: string
  companyName: string
  accountType: AccountType
  password: string
  confirmPassword: string
  phone: string
  cardholderName: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  subscribeMarketing: boolean
}

interface FormErrors { [key: string]: string }

const PLANS: PricingPlan[] = [
  {
    id: "free", name: "Free", monthlyPrice: 0, annualPrice: 0,
    description: "Perfect for getting started", icon: Rocket,
    gradientFrom: "from-slate-500", gradientTo: "to-slate-600",
    features: ["Free subdomain (yoursite.domainpro.site)", "1 Page website", "Basic SSL Certificate", "500MB Storage", "Community support", "DomainPro branding"],
  },
  {
    id: "starter", name: "Starter", monthlyPrice: 6.99, annualPrice: 67.10,
    description: "Great for personal projects", icon: Zap,
    gradientFrom: "from-blue-500", gradientTo: "to-cyan-500",
    stripePriceIdMonthly: "price_starter_monthly", stripePriceIdAnnual: "price_starter_annual",
    features: ["1 Custom domain included", "2 SSL Certificates", "10GB Storage", "Basic DNS Management", "Email Forwarding", "Standard Support", "No branding"],
  },
  {
    id: "professional", name: "Professional", monthlyPrice: 19.99, annualPrice: 191.90,
    description: "Best for growing businesses", icon: Crown, highlighted: true,
    gradientFrom: "from-red-500", gradientTo: "to-orange-500",
    stripePriceIdMonthly: "price_professional_monthly", stripePriceIdAnnual: "price_professional_annual",
    features: ["20 Domains included", "10 FREE SSL Certificates", "100GB Storage", "Advanced DNS Management", "Professional Email (5 accounts)", "Priority 24/7 Support", "Full Analytics Dashboard", "One-Click WordPress Deploy", "API Access"],
  },
  {
    id: "enterprise", name: "Enterprise", monthlyPrice: 79.99, annualPrice: 767.90,
    description: "For large organizations", icon: Building2,
    gradientFrom: "from-purple-500", gradientTo: "to-pink-500",
    stripePriceIdMonthly: "price_enterprise_monthly", stripePriceIdAnnual: "price_enterprise_annual",
    features: ["Unlimited Domains", "Unlimited SSL Certificates", "Unlimited Storage", "Premium DNS with DDoS Protection", "Professional Email (Unlimited)", "Dedicated Account Manager", "White-label Solutions", "Custom Integrations", "SLA Guarantee"],
  },
]

const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const COUNTRIES = [
  { code: "US", name: "United States" }, { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" }, { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" }, { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" }, { code: "IN", name: "India" },
]

const INITIAL_FORM_DATA: FormData = {
  selectedPlan: "professional", billingCycle: "monthly", fullName: "", email: "",
  companyName: "", accountType: "personal", password: "", confirmPassword: "",
  phone: "", cardholderName: "", billingAddress: "", billingCity: "",
  billingState: "", billingZip: "", billingCountry: "US",
  agreeToTerms: false, agreeToPrivacy: false, subscribeMarketing: true,
}

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password: string) => {
  const requirements: Record<string, boolean> = {}
  let score = 0
  PASSWORD_REQUIREMENTS.forEach((req) => {
    const passed = req.test(password)
    requirements[req.id] = passed
    if (passed) score++
  })
  return { isValid: score === PASSWORD_REQUIREMENTS.length, score, requirements }
}

const getPasswordStrength = (score: number) => {
  if (score === 0) return { label: "Enter password", color: "text-gray-400", bgColor: "bg-gray-400", width: "0%" }
  if (score <= 2) return { label: "Weak", color: "text-red-500", bgColor: "bg-red-500", width: "33%" }
  if (score <= 4) return { label: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-500", width: "66%" }
  return { label: "Strong", color: "text-green-500", bgColor: "bg-green-500", width: "100%" }
}

const formatPrice = (price: number): string => price === 0 ? "FREE" : `$${price.toFixed(2)}`

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("domainpro-theme") as Theme
    if (savedTheme) setTheme(savedTheme)
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light")
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("domainpro-theme", newTheme)
  }, [theme])

  return { theme, toggleTheme, mounted }
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative p-2.5 rounded-xl transition-all duration-300 group ${theme === "dark" ? "bg-white/5 hover:bg-white/10 border border-white/10" : "bg-gray-100 hover:bg-gray-200 border border-gray-200"}`} aria-label="Toggle theme">
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 text-amber-400" : "rotate-90 scale-0 text-amber-400"}`} />
        <Moon className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "light" ? "rotate-0 scale-100 text-slate-700" : "-rotate-90 scale-0 text-slate-700"}`} />
      </div>
    </button>
  )
}

function Navigation({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navLinks = [{ href: "/domains", label: "Domains" }, { href: "/pricing", label: "Pricing" }, { href: "/features", label: "Features" }, { href: "/support", label: "Support" }]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${theme === "dark" ? "bg-[#0F172A]/80 backdrop-blur-2xl border-b border-white/5" : "bg-white/80 backdrop-blur-2xl border-b border-gray-200/50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-br from-red-500/20 to-teal-500/20 group-hover:from-red-500/30 group-hover:to-teal-500/30" : "bg-gradient-to-br from-red-50 to-teal-50 group-hover:from-red-100 group-hover:to-teal-100"}`}>
              <Globe className="h-6 w-6 text-red-500" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Domain<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Pro</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (<Link key={link.href} href={link.href} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{link.label}</Link>))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Link href="/login" className={`hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200"}`}>Sign In</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "hover:bg-white/5 text-white" : "hover:bg-gray-100 text-gray-900"}`}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 pb-6" : "max-h-0"}`}>
          <div className={`pt-4 border-t ${theme === "dark" ? "border-white/5" : "border-gray-200"}`}>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (<Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{link.label}</Link>))}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer({ theme }: { theme: Theme }) {
  const currentYear = new Date().getFullYear()
  const footerSections = [
    { title: "Products", links: ["Domain Search", "Domain Transfer", "SSL Certificates", "Email Hosting", "Web Hosting"] },
    { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Partners"] },
    { title: "Support", links: ["Help Center", "Contact Us", "Status", "API Docs", "Community"] },
    { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR", "Acceptable Use"] },
  ]
  const socialLinks = [{ icon: Twitter, href: "#", label: "Twitter" }, { icon: Facebook, href: "#", label: "Facebook" }, { icon: Instagram, href: "#", label: "Instagram" }, { icon: Linkedin, href: "#", label: "LinkedIn" }]

  return (
    <footer className={`border-t transition-colors duration-500 ${theme === "dark" ? "bg-[#0F172A] border-white/5" : "bg-gray-50 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className={`p-2.5 rounded-xl ${theme === "dark" ? "bg-gradient-to-br from-red-500/20 to-teal-500/20" : "bg-gradient-to-br from-red-50 to-teal-50"}`}><Globe className="h-6 w-6 text-red-500" /></div>
              <span className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Domain<span className="text-red-500">Pro</span></span>
            </Link>
            <p className={`text-sm mb-6 max-w-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Professional domain management for modern businesses. Secure, fast, and reliable.</p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (<a key={social.label} href={social.href} aria-label={social.label} className={`p-2.5 rounded-xl transition-all duration-200 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`}><social.icon className="h-4 w-4" /></a>))}
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{section.title}</h4>
              <ul className="space-y-3">{section.links.map((link) => (<li key={link}><a href="#" className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{link}</a></li>))}</ul>
            </div>
          ))}
        </div>
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === "dark" ? "border-white/5" : "border-gray-200"}`}>
          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>© {currentYear} DomainPro. All rights reserved.</p>
          <p className={`text-sm flex items-center gap-1.5 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by Mindscapes</p>
        </div>
      </div>
    </footer>
  )
}

function ProgressSteps({ currentStep, skipPayment, theme }: { currentStep: number; skipPayment: boolean; theme: Theme }) {
  const steps = [{ number: 1, label: "Select Plan", icon: CreditCard }, { number: 2, label: "Account Details", icon: User }, { number: 3, label: "Payment", icon: Lock, skip: skipPayment }, { number: 4, label: "Review", icon: CheckCircle }]
  const visibleSteps = steps.filter(s => !s.skip)

  return (
    <div className="flex items-center justify-center mb-10">
      {visibleSteps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCurrent ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25 scale-110" : isCompleted ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white" : theme === "dark" ? "bg-white/5 text-gray-500 border border-white/10" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                {isCurrent && <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 animate-ping opacity-20" />}
              </div>
              <span className={`mt-3 text-xs font-medium hidden sm:block transition-colors duration-300 ${isCurrent ? (theme === "dark" ? "text-white" : "text-gray-900") : isCompleted ? (theme === "dark" ? "text-green-400" : "text-green-600") : (theme === "dark" ? "text-gray-500" : "text-gray-400")}`}>{step.label}</span>
            </div>
            {index < visibleSteps.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-all duration-500 ${currentStep > step.number ? "bg-gradient-to-r from-green-500 to-emerald-500" : theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} />}
          </div>
        )
      })}
    </div>
  )
}

function PricingCard({ plan, selected, billingCycle, onSelect, theme }: { plan: PricingPlan; selected: boolean; billingCycle: BillingCycle; onSelect: () => void; theme: Theme }) {
  const Icon = plan.icon
  const monthlyEquivalent = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
  const totalAnnual = plan.annualPrice
  const savings = billingCycle === "annual" && plan.monthlyPrice > 0 ? Math.round(((plan.monthlyPrice * 12 - totalAnnual) / (plan.monthlyPrice * 12)) * 100) : 0

  return (
    <div onClick={onSelect} className={`relative rounded-3xl p-1 cursor-pointer transition-all duration-500 group ${selected ? `bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} shadow-2xl scale-[1.02]` : "bg-transparent"}`}>
      <div className={`relative h-full rounded-[22px] p-6 transition-all duration-300 ${selected ? (theme === "dark" ? "bg-[#0F172A]" : "bg-white") : theme === "dark" ? "bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04]" : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"}`}>
        {plan.highlighted && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="relative px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg shadow-red-500/25"><Sparkles className="inline-block h-3 w-3 mr-1 -mt-0.5" />MOST POPULAR</div>
          </div>
        )}
        <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selected ? `bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} border-transparent` : theme === "dark" ? "border-white/20" : "border-gray-300"}`}>
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
        <div className="flex items-center gap-4 mb-5 mt-2">
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} bg-opacity-10`}><Icon className="h-6 w-6 text-white" /></div>
          <div>
            <h3 className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{monthlyEquivalent === 0 ? "FREE" : `$${monthlyEquivalent.toFixed(2)}`}</span>
            {monthlyEquivalent > 0 && <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>/month</span>}
          </div>
          {billingCycle === "annual" && monthlyEquivalent > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>${totalAnnual.toFixed(2)} billed annually</span>
              {savings > 0 && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">Save {savings}%</span>}
            </div>
          )}
        </div>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-0.5 p-0.5 rounded-full bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo}`}><Check className="h-3 w-3 text-white" /></div>
              <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature}</span>
            </li>
          ))}
        </ul>
        <button className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${selected ? `bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} text-white shadow-lg` : theme === "dark" ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200"}`}>
          {selected ? "Selected" : "Select Plan"}
        </button>
      </div>
    </div>
  )
}

function BillingToggle({ billingCycle, onChange, theme }: { billingCycle: BillingCycle; onChange: (cycle: BillingCycle) => void; theme: Theme }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <span className={`text-sm font-medium transition-colors duration-300 ${billingCycle === "monthly" ? (theme === "dark" ? "text-white" : "text-gray-900") : (theme === "dark" ? "text-gray-500" : "text-gray-400")}`}>Monthly</span>
      <button onClick={() => onChange(billingCycle === "monthly" ? "annual" : "monthly")} className={`relative w-16 h-8 rounded-full transition-all duration-300 ${billingCycle === "annual" ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/25" : theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${billingCycle === "annual" ? "translate-x-9" : "translate-x-1"}`} />
      </button>
      <span className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${billingCycle === "annual" ? (theme === "dark" ? "text-white" : "text-gray-900") : (theme === "dark" ? "text-gray-500" : "text-gray-400")}`}>
        Annual<span className="px-2.5 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">Save 20%</span>
      </span>
    </div>
  )
}

function FormInput({ id, label, type = "text", value, onChange, placeholder, icon: Icon, error, required = false, disabled = false, theme, showPasswordToggle = false, showPassword = false, onTogglePassword }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; placeholder?: string; icon?: React.ComponentType<{ className?: string }>; error?: string; required?: boolean; disabled?: boolean; theme: Theme; showPasswordToggle?: boolean; showPassword?: boolean; onTogglePassword?: () => void }) {
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative group">
        {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"><Icon className={`h-5 w-5 ${error ? "text-red-500" : theme === "dark" ? "text-gray-500 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-red-500"}`} /></div>}
        <input id={id} name={id} type={inputType} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className={`w-full ${Icon ? "pl-12" : "pl-4"} ${showPasswordToggle ? "pr-12" : "pr-4"} py-3.5 rounded-xl border-2 transition-all duration-200 ${error ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white/[0.07]" : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"} focus:outline-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} />
        {showPasswordToggle && <button type="button" onClick={onTogglePassword} className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${theme === "dark" ? "text-gray-500 hover:text-gray-300 hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>}
      </div>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
    </div>
  )
}

function PasswordStrengthIndicator({ password, theme }: { password: string; theme: Theme }) {
  const { score, requirements } = validatePassword(password)
  const strength = getPasswordStrength(score)
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Password strength</span>
          <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}>
          <div className={`h-full ${strength.bgColor} transition-all duration-500 ease-out`} style={{ width: strength.width }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PASSWORD_REQUIREMENTS.map((req) => (
          <div key={req.id} className={`flex items-center gap-2 text-xs transition-all duration-300 ${requirements[req.id] ? "text-green-500" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            {requirements[req.id] ? <div className="p-0.5 rounded-full bg-green-500"><Check className="h-2.5 w-2.5 text-white" /></div> : <CircleDot className="h-3.5 w-3.5" />}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Checkbox({ id, checked, onChange, label, error, theme }: { id: string; checked: boolean; onChange: (checked: boolean) => void; label: React.ReactNode; error?: string; theme: Theme }) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-gradient-to-br from-red-500 to-orange-500 border-transparent" : error ? "border-red-500" : theme === "dark" ? "border-white/20 group-hover:border-white/40" : "border-gray-300 group-hover:border-gray-400"}`}>
            {checked && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        <span className={`text-sm ${error ? "text-red-500" : theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
      </label>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-500 ml-8"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
    </div>
  )
}

function SocialSignupButtons({ onGoogleClick, onGithubClick, onMicrosoftClick, loading, theme }: { onGoogleClick: () => void; onGithubClick: () => void; onMicrosoftClick: () => void; loading: string | null; theme: Theme }) {
  const buttons = [
    { id: "google", name: "Google", onClick: onGoogleClick, icon: (<svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>) },
    { id: "github", name: "GitHub", onClick: onGithubClick, icon: (<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>) },
    { id: "azure", name: "Microsoft", onClick: onMicrosoftClick, icon: (<svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#00A4EF" d="M1 13h10v10H1z" /><path fill="#7FBA00" d="M13 1h10v10H13z" /><path fill="#FFB900" d="M13 13h10v10H13z" /></svg>) },
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.map((button) => (
        <button key={button.id} type="button" onClick={button.onClick} disabled={loading !== null} className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${theme === "dark" ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"} ${loading === button.id ? "opacity-70" : ""} ${loading !== null ? "cursor-not-allowed" : ""}`}>
          {loading === button.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{button.icon}<span className="hidden sm:inline">{button.name}</span></>}
        </button>
      ))}
    </div>
  )
}

function StripeCardForm({ theme, onReady }: { theme: Theme; onReady: (ready: boolean) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => { onReady(!!stripe && !!elements) }, [stripe, elements, onReady])
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${theme === "dark" ? "border-white/10 bg-white/5 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10" : "border-gray-200 bg-gray-50 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"}`}>
      <CardElement options={{ style: { base: { fontSize: "16px", fontFamily: "'Lato', system-ui, sans-serif", fontWeight: "400", color: theme === "dark" ? "#fff" : "#1f2937", "::placeholder": { color: theme === "dark" ? "#6b7280" : "#9ca3af" } }, invalid: { color: "#ef4444", iconColor: "#ef4444" } } }} />
    </div>
  )
}

function OrderSummary({ plan, billingCycle, theme }: { plan: PricingPlan; billingCycle: BillingCycle; theme: Theme }) {
  const monthlyPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
  const total = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
  const annualSavings = plan.monthlyPrice > 0 ? (plan.monthlyPrice * 12) - plan.annualPrice : 0

  return (
    <div className={`p-6 rounded-2xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
      <h3 className={`font-bold text-lg mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Order Summary</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo}`}><plan.icon className="h-4 w-4 text-white" /></div>
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{plan.name} Plan</span>
          </div>
          <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(monthlyPrice)}{monthlyPrice > 0 && "/mo"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing Cycle</span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{billingCycle === "monthly" ? "Monthly" : "Annual"}</span>
        </div>
        {billingCycle === "annual" && annualSavings > 0 && (
          <div className="flex items-center justify-between text-green-500">
            <span>Annual Savings</span><span className="font-semibold">-${annualSavings.toFixed(2)}</span>
          </div>
        )}
        <div className={`pt-4 mt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Total {billingCycle === "annual" ? "(billed annually)" : ""}</span>
            <span className={`text-2xl font-extrabold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { theme, toggleTheme, mounted } = useTheme()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedPlan = PLANS.find((p) => p.id === formData.selectedPlan) || PLANS[2]
  const skipPayment = formData.selectedPlan === "free"

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) { setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors }) }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
      if (formData.accountType === "business" && !formData.companyName.trim()) newErrors.companyName = "Company name is required for business accounts"
      if (!formData.password) newErrors.password = "Password is required"
      else if (!validatePassword(formData.password).isValid) newErrors.password = "Password does not meet all requirements"
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }
    if (step === 3 && !skipPayment) {
      if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
      if (!formData.billingAddress.trim()) newErrors.billingAddress = "Billing address is required"
      if (!formData.billingCity.trim()) newErrors.billingCity = "City is required"
      if (!formData.billingZip.trim()) newErrors.billingZip = "ZIP code is required"
    }
    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service"
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = "You must agree to the Privacy Policy"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2 && skipPayment) setCurrentStep(4)
      else setCurrentStep((prev) => Math.min(prev + 1, 4))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep === 4 && skipPayment) setCurrentStep(2)
    else setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSocialSignup = async (provider: "google" | "github" | "azure") => {
    setSocialLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback?plan=${formData.selectedPlan}` } })
      if (error) throw error
    } catch (err) { console.error("Social signup error:", err); setSocialLoading(null) }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    setIsLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: formData.fullName, company_name: formData.companyName || null, account_type: formData.accountType, phone: formData.phone || null, selected_plan: formData.selectedPlan, billing_cycle: formData.billingCycle, subscribe_marketing: formData.subscribeMarketing },
        },
      })
      if (authError) {
        if (authError.message.includes("already registered")) setErrors({ email: "This email is already registered. Please sign in instead." })
        else setErrors({ submit: authError.message })
        return
      }
      // For paid plans, you would call your backend API to create a Stripe subscription:
      // if (formData.selectedPlan !== "free") {
      //   const priceId = formData.billingCycle === "monthly" ? selectedPlan.stripePriceIdMonthly : selectedPlan.stripePriceIdAnnual
      //   const response = await fetch("/api/create-subscription", {
      //     method: "POST", headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ priceId, customerId: authData.user?.id, email: formData.email, name: formData.fullName,
      //       billingAddress: { line1: formData.billingAddress, city: formData.billingCity, state: formData.billingState, postal_code: formData.billingZip, country: formData.billingCountry } }),
      //   })
      //   if (!response.ok) throw new Error("Failed to create subscription")
      // }
      setSuccess(true)
    } catch (err) { console.error("Signup error:", err); setErrors({ submit: "An unexpected error occurred. Please try again." }) }
    finally { setIsLoading(false) }
  }

  if (!mounted) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><Loader2 className="h-8 w-8 text-red-500 animate-spin" /></div>

  if (success) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-[#0F172A]" : "bg-gray-50"}`}>
        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'); * { font-family: 'Lato', system-ui, sans-serif; }`}</style>
        <Navigation theme={theme} onToggleTheme={toggleTheme} />
        <main className="pt-28 pb-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className={`p-10 rounded-3xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-gray-200 bg-white shadow-xl"}`}>
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25"><CheckCircle className="h-12 w-12 text-white" /></div>
              <h1 className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Account Created!</h1>
              <p className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>We&apos;ve sent a verification email to <span className="text-red-500 font-semibold">{formData.email}</span></p>
              <p className={`text-sm mb-10 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Please check your inbox and click the verification link to activate your account.</p>
              <div className="flex flex-col gap-4">
                <Link href="/login" className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 text-center">Go to Login</Link>
                <button onClick={() => window.location.reload()} className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"}`}>Create Another Account</button>
              </div>
            </div>
          </div>
        </main>
        <Footer theme={theme} />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-[#0F172A]" : "bg-gray-50"}`}>
        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'); * { font-family: 'Lato', system-ui, sans-serif; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }`}</style>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${theme === "dark" ? "bg-gradient-to-br from-red-500/10 to-orange-500/5" : "bg-gradient-to-br from-red-100/50 to-orange-100/30"}`} />
          <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${theme === "dark" ? "bg-gradient-to-tr from-blue-500/10 to-purple-500/5" : "bg-gradient-to-tr from-blue-100/50 to-purple-100/30"}`} />
        </div>
        <Navigation theme={theme} onToggleTheme={toggleTheme} />
        <main className="relative pt-28 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 animate-fadeInUp">
              <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Create Your Account</h1>
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {currentStep === 1 && "Choose the perfect plan for your needs"}
                {currentStep === 2 && "Tell us about yourself"}
                {currentStep === 3 && "Secure payment information"}
                {currentStep === 4 && "Review and confirm your order"}
              </p>
            </div>
            <ProgressSteps currentStep={currentStep} skipPayment={skipPayment} theme={theme} />
            {errors.submit && (
              <div className="max-w-2xl mx-auto mb-8 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-center gap-4">
                <div className="p-2 rounded-xl bg-red-500/20"><AlertCircle className="h-5 w-5 text-red-500" /></div>
                <p className="text-sm text-red-500 font-medium">{errors.submit}</p>
              </div>
            )}
            <div className="max-w-7xl mx-auto animate-fadeInUp">
              {/* STEP 1: Select Plan */}
              {currentStep === 1 && (
                <div>
                  <BillingToggle billingCycle={formData.billingCycle} onChange={(cycle) => updateFormData("billingCycle", cycle)} theme={theme} />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {PLANS.map((plan) => (<PricingCard key={plan.id} plan={plan} selected={formData.selectedPlan === plan.id} billingCycle={formData.billingCycle} onSelect={() => updateFormData("selectedPlan", plan.id)} theme={theme} />))}
                  </div>
                  {formData.selectedPlan === "free" && (
                    <div className="max-w-lg mx-auto mt-14">
                      <div className="relative mb-8"><div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`} /></div><div className="relative flex justify-center text-sm"><span className={`px-4 ${theme === "dark" ? "bg-[#0F172A] text-gray-500" : "bg-gray-50 text-gray-500"}`}>Quick signup with</span></div></div>
                      <SocialSignupButtons onGoogleClick={() => handleSocialSignup("google")} onGithubClick={() => handleSocialSignup("github")} onMicrosoftClick={() => handleSocialSignup("azure")} loading={socialLoading} theme={theme} />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Account Details */}
              {currentStep === 2 && (
                <div className="max-w-2xl mx-auto">
                  <div className={`p-8 sm:p-10 rounded-3xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-gray-200 bg-white shadow-xl"}`}>
                    <div className="mb-10">
                      <p className={`text-sm text-center mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Sign up quickly with</p>
                      <SocialSignupButtons onGoogleClick={() => handleSocialSignup("google")} onGithubClick={() => handleSocialSignup("github")} onMicrosoftClick={() => handleSocialSignup("azure")} loading={socialLoading} theme={theme} />
                    </div>
                    <div className="relative mb-10"><div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`} /></div><div className="relative flex justify-center text-sm"><span className={`px-4 ${theme === "dark" ? "bg-[#0F172A]/50 text-gray-500" : "bg-white text-gray-500"}`}>or continue with email</span></div></div>
                    <div className="space-y-6">
                      <FormInput id="fullName" label="Full Name" value={formData.fullName} onChange={(value) => updateFormData("fullName", value)} placeholder="John Doe" icon={User} error={errors.fullName} required theme={theme} />
                      <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={(value) => updateFormData("email", value)} placeholder="john@example.com" icon={Mail} error={errors.email} required theme={theme} />
                      <div className="space-y-3">
                        <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          {(["personal", "business"] as AccountType[]).map((type) => (
                            <button key={type} type="button" onClick={() => updateFormData("accountType", type)} className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.accountType === type ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10" : theme === "dark" ? "border-white/10 hover:border-white/20 bg-white/5" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                              <div className="flex items-center gap-3">
                                {type === "personal" ? <User className={`h-5 w-5 ${formData.accountType === type ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`} /> : <Building2 className={`h-5 w-5 ${formData.accountType === type ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />}
                                <span className={`font-medium capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{type}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      {formData.accountType === "business" && <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={(value) => updateFormData("companyName", value)} placeholder="Acme Inc." icon={Building2} error={errors.companyName} required theme={theme} />}
                      <div>
                        <FormInput id="password" label="Password" type="password" value={formData.password} onChange={(value) => updateFormData("password", value)} placeholder="Create a strong password" icon={Lock} error={errors.password} required theme={theme} showPasswordToggle showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />
                        {formData.password && <PasswordStrengthIndicator password={formData.password} theme={theme} />}
                      </div>
                      <FormInput id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(value) => updateFormData("confirmPassword", value)} placeholder="Confirm your password" icon={Lock} error={errors.confirmPassword} required theme={theme} showPasswordToggle showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
                      <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={(value) => updateFormData("phone", value)} placeholder="+1 (555) 000-0000" icon={Phone} theme={theme} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {currentStep === 3 && !skipPayment && (
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className={`lg:col-span-3 p-8 sm:p-10 rounded-3xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-gray-200 bg-white shadow-xl"}`}>
                      <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500"><CreditCard className="h-5 w-5 text-white" /></div>Payment Information
                      </h2>
                      <div className="space-y-6">
                        <FormInput id="cardholderName" label="Cardholder Name" value={formData.cardholderName} onChange={(value) => updateFormData("cardholderName", value)} placeholder="John Doe" icon={User} error={errors.cardholderName} required theme={theme} />
                        <div className="space-y-2">
                          <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Card Details <span className="text-red-500">*</span></label>
                          <StripeCardForm theme={theme} onReady={setStripeReady} />
                        </div>
                        <div className={`pt-8 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                          <h3 className={`font-semibold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}><MapPin className="h-4 w-4 text-red-500" />Billing Address</h3>
                          <div className="space-y-5">
                            <FormInput id="billingAddress" label="Street Address" value={formData.billingAddress} onChange={(value) => updateFormData("billingAddress", value)} placeholder="123 Main Street" icon={MapPin} error={errors.billingAddress} required theme={theme} />
                            <div className="grid grid-cols-2 gap-4">
                              <FormInput id="billingCity" label="City" value={formData.billingCity} onChange={(value) => updateFormData("billingCity", value)} placeholder="New York" error={errors.billingCity} required theme={theme} />
                              <FormInput id="billingState" label="State / Province" value={formData.billingState} onChange={(value) => updateFormData("billingState", value)} placeholder="NY" theme={theme} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormInput id="billingZip" label="ZIP / Postal Code" value={formData.billingZip} onChange={(value) => updateFormData("billingZip", value)} placeholder="10001" error={errors.billingZip} required theme={theme} />
                              <div className="space-y-2">
                                <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Country</label>
                                <select value={formData.billingCountry} onChange={(e) => updateFormData("billingCountry", e.target.value)} className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${theme === "dark" ? "border-white/10 bg-white/5 text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 bg-white text-gray-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"} focus:outline-none`}>
                                  {COUNTRIES.map((country) => (<option key={country.code} value={country.code}>{country.name}</option>))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                      <OrderSummary plan={selectedPlan} billingCycle={formData.billingCycle} theme={theme} />
                      <div className={`p-6 rounded-2xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>SSL Secure</span></div>
                          <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-green-500" /><span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Encrypted</span></div>
                        </div>
                        <p className={`text-xs text-center mt-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirm */}
              {currentStep === 4 && (
                <div className="max-w-2xl mx-auto">
                  <div className={`p-8 sm:p-10 rounded-3xl border-2 ${theme === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-gray-200 bg-white shadow-xl"}`}>
                    <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500"><CheckCircle className="h-5 w-5 text-white" /></div>Review Your Order
                    </h2>
                    <div className={`p-5 rounded-2xl mb-8 ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedPlan.gradientFrom} ${selectedPlan.gradientTo}`}><selectedPlan.icon className="h-6 w-6 text-white" /></div>
                          <div>
                            <p className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{selectedPlan.name} Plan</p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{formData.billingCycle === "monthly" ? "Monthly" : "Annual"} billing</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-extrabold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{selectedPlan.monthlyPrice === 0 ? "FREE" : formData.billingCycle === "monthly" ? `$${selectedPlan.monthlyPrice.toFixed(2)}` : `$${selectedPlan.annualPrice.toFixed(2)}`}</p>
                          {selectedPlan.monthlyPrice > 0 && <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{formData.billingCycle === "monthly" ? "/month" : "/year"}</p>}
                        </div>
                      </div>
                    </div>
                    <div className={`space-y-4 mb-8 pb-8 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                      <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Account Details</h3>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Name</p><p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.fullName}</p></div>
                        <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Email</p><p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.email}</p></div>
                        <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Account Type</p><p className={`font-medium capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.accountType}</p></div>
                        {formData.companyName && <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Company</p><p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.companyName}</p></div>}
                        {formData.phone && <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Phone</p><p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.phone}</p></div>}
                      </div>
                    </div>
                    {!skipPayment && formData.billingAddress && (
                      <div className={`space-y-4 mb-8 pb-8 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                        <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Billing Information</h3>
                        <div className="text-sm">
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing Address</p>
                          <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.billingAddress}<br />{formData.billingCity}{formData.billingState && `, ${formData.billingState}`} {formData.billingZip}<br />{COUNTRIES.find(c => c.code === formData.billingCountry)?.name || formData.billingCountry}</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-5 mb-10">
                      <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onChange={(checked) => updateFormData("agreeToTerms", checked)} label={<>I agree to the <Link href="/terms" className="text-red-500 hover:text-red-400 underline underline-offset-2">Terms of Service</Link><span className="text-red-500 ml-1">*</span></>} error={errors.agreeToTerms} theme={theme} />
                      <Checkbox id="agreeToPrivacy" checked={formData.agreeToPrivacy} onChange={(checked) => updateFormData("agreeToPrivacy", checked)} label={<>I agree to the <Link href="/privacy" className="text-red-500 hover:text-red-400 underline underline-offset-2">Privacy Policy</Link><span className="text-red-500 ml-1">*</span></>} error={errors.agreeToPrivacy} theme={theme} />
                      <Checkbox id="subscribeMarketing" checked={formData.subscribeMarketing} onChange={(checked) => updateFormData("subscribeMarketing", checked)} label="Send me product updates, tips, and exclusive offers (you can unsubscribe anytime)" theme={theme} />
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center gap-3">
                      {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Creating Account...</> : <><Sparkles className="h-5 w-5" />Create Account{!skipPayment && selectedPlan.monthlyPrice > 0 && <span>— ${formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice.toFixed(2) : selectedPlan.annualPrice.toFixed(2)}</span>}</>}
                    </button>
                    <p className={`text-xs text-center mt-6 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>🔒 Your information is protected with 256-bit SSL encryption</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="max-w-2xl mx-auto mt-10 flex items-center justify-between">
              {currentStep > 1 ? (
                <button onClick={prevStep} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200"}`}><ArrowLeft className="h-5 w-5" />Back</button>
              ) : <div />}
              {currentStep < 4 && (
                <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40">Continue<ArrowRight className="h-5 w-5" /></button>
              )}
            </div>

            <p className={`text-center mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Already have an account? <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold underline underline-offset-2">Sign in</Link></p>
          </div>
        </main>
        <Footer theme={theme} />
      </div>
    </Elements>
  )
}
