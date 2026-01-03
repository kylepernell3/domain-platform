"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Shield,
  Zap,
  Award,
  Crown,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  Star,
  Infinity,
  Server,
  Database,
  Headphones,
  Code,
  BarChart3,
  Rocket,
  Users,
  Clock,
  CircleDot,
  Github,
  Chrome,
  Laptop,
  Sparkles,
  FileText,
  ShieldCheck,
  HardDrive,
  Mail as MailIcon,
  Settings,
  Palette,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Heart,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// ============================================
// STRIPE SETUP
// ============================================

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// ============================================
// TYPES
// ============================================

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
  color: string
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

interface FormErrors {
  [key: string]: string
}

// ============================================
// CONSTANTS
// ============================================

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for getting started",
    icon: Rocket,
    color: "slate",
    features: [
      "Free subdomain (yoursite.domainpro.site)",
      "1 Page website",
      "Basic SSL Certificate",
      "500MB Storage",
      "Community support",
      "DomainPro branding",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 6.99,
    annualPrice: 67.10, // 20% off
    description: "Great for personal projects",
    icon: Zap,
    color: "blue",
    stripePriceIdMonthly: "price_starter_monthly",
    stripePriceIdAnnual: "price_starter_annual",
    features: [
      "1 Custom domain included",
      "2 SSL Certificates",
      "10GB Storage",
      "Basic DNS Management",
      "Email Forwarding",
      "Standard Support",
      "No branding",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 19.99,
    annualPrice: 191.90, // 20% off
    description: "Best for growing businesses",
    icon: Crown,
    color: "red",
    highlighted: true,
    stripePriceIdMonthly: "price_professional_monthly",
    stripePriceIdAnnual: "price_professional_annual",
    features: [
      "20 Domains included",
      "10 FREE SSL Certificates",
      "100GB Storage",
      "Advanced DNS Management",
      "Professional Email (5 accounts)",
      "Priority 24/7 Support",
      "Full Analytics Dashboard",
      "One-Click WordPress Deploy",
      "API Access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 79.99,
    annualPrice: 767.90, // 20% off
    description: "For large organizations",
    icon: Building2,
    color: "purple",
    stripePriceIdMonthly: "price_enterprise_monthly",
    stripePriceIdAnnual: "price_enterprise_annual",
    features: [
      "Unlimited Domains",
      "Unlimited SSL Certificates",
      "Unlimited Storage",
      "Premium DNS with DDoS Protection",
      "Professional Email (Unlimited)",
      "Dedicated Account Manager",
      "White-label Solutions",
      "Custom Integrations",
      "SLA Guarantee",
    ],
  },
]

const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const SOCIAL_PROVIDERS = [
  { id: "google", name: "Google", icon: Chrome, color: "hover:bg-red-500/10 hover:border-red-500/50" },
  { id: "github", name: "GitHub", icon: Github, color: "hover:bg-gray-500/10 hover:border-gray-500/50" },
  { id: "azure", name: "Microsoft", icon: Laptop, color: "hover:bg-blue-500/10 hover:border-blue-500/50" },
]

const INITIAL_FORM_DATA: FormData = {
  selectedPlan: "professional",
  billingCycle: "monthly",
  fullName: "",
  email: "",
  companyName: "",
  accountType: "personal",
  password: "",
  confirmPassword: "",
  phone: "",
  cardholderName: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
  billingCountry: "US",
  agreeToTerms: false,
  agreeToPrivacy: false,
  subscribeMarketing: true,
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password: string): { isValid: boolean; score: number; requirements: Record<string, boolean> } => {
  const requirements: Record<string, boolean> = {}
  let score = 0
  PASSWORD_REQUIREMENTS.forEach((req) => {
    const passed = req.test(password)
    requirements[req.id] = passed
    if (passed) score++
  })
  return { isValid: score === PASSWORD_REQUIREMENTS.length, score, requirements }
}

const getPasswordStrength = (score: number): { label: string; color: string; width: string } => {
  if (score === 0) return { label: "Enter password", color: "bg-gray-400", width: "0%" }
  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" }
  if (score <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" }
  return { label: "Strong", color: "bg-green-500", width: "100%" }
}

const formatPrice = (price: number): string => {
  if (price === 0) return "FREE"
  return `$${price.toFixed(2)}`
}

const getPlanPrice = (plan: PricingPlan, cycle: BillingCycle): number => {
  return cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
}

// ============================================
// THEME CONTEXT & HOOK
// ============================================

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("domainpro-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light")
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("domainpro-theme", newTheme)
  }, [theme])

  return { theme, toggleTheme, mounted }
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

function Navigation({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
      theme === "dark"
        ? "bg-black/90 backdrop-blur-xl border-gray-800"
        : "bg-white/90 backdrop-blur-xl border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-red-500/10 group-hover:bg-red-500/20"
                : "bg-red-50 group-hover:bg-red-100"
            }`}>
              <Globe className="h-6 w-6 text-red-500" />
            </div>
            <span className={`text-xl font-bold font-['Lato'] ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Domain<span className="text-red-500">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/domains" className={`text-sm font-medium transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}>
              Domains
            </Link>
            <Link href="/pricing" className={`text-sm font-medium transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}>
              Pricing
            </Link>
            <Link href="/features" className={`text-sm font-medium transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}>
              Features
            </Link>
            <Link href="/support" className={`text-sm font-medium transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}>
              Support
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            
            <Link href="/login" className={`hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}>
              Sign In
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <Menu className={`h-5 w-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          }`}>
            <div className="flex flex-col gap-2">
              <Link href="/domains" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>Domains</Link>
              <Link href="/pricing" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>Pricing</Link>
              <Link href="/features" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>Features</Link>
              <Link href="/support" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>Support</Link>
              <Link href="/login" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer({ theme }: { theme: Theme }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`border-t transition-colors duration-300 ${
      theme === "dark"
        ? "bg-black border-gray-800"
        : "bg-gray-50 border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-red-500/10" : "bg-red-50"}`}>
                <Globe className="h-6 w-6 text-red-500" />
              </div>
              <span className={`text-xl font-bold font-['Lato'] ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Domain<span className="text-red-500">Pro</span>
              </span>
            </Link>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Professional domain management for modern businesses.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              }`}><Twitter className="h-5 w-5" /></a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              }`}><Facebook className="h-5 w-5" /></a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              }`}><Instagram className="h-5 w-5" /></a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              }`}><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Products</h4>
            <ul className="space-y-2">
              {["Domain Search", "Domain Transfer", "SSL Certificates", "Email Hosting", "Web Hosting"].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Press", "Blog", "Partners"].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Support</h4>
            <ul className="space-y-2">
              {["Help Center", "Contact Us", "Status", "API Docs", "Community"].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Legal</h4>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR", "Acceptable Use"].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}>
          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            © {currentYear} DomainPro. All rights reserved.
          </p>
          <p className={`text-sm flex items-center gap-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Mindscapes
          </p>
        </div>
      </div>
    </footer>
  )
}

function ProgressSteps({ currentStep, theme }: { currentStep: number; theme: Theme }) {
  const steps = [
    { number: 1, label: "Select Plan" },
    { number: 2, label: "Account Details" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Review" },
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              currentStep === step.number
                ? "bg-red-500 text-white ring-4 ring-red-500/20"
                : currentStep > step.number
                ? "bg-green-500 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-500"
                : "bg-gray-200 text-gray-500"
            }`}>
              {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
            </div>
            <span className={`mt-2 text-xs font-medium hidden sm:block ${
              currentStep >= step.number
                ? theme === "dark" ? "text-white" : "text-gray-900"
                : theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 sm:w-20 h-1 mx-2 rounded transition-colors duration-300 ${
              currentStep > step.number
                ? "bg-green-500"
                : theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PricingCard({
  plan,
  selected,
  billingCycle,
  onSelect,
  theme,
}: {
  plan: PricingPlan
  selected: boolean
  billingCycle: BillingCycle
  onSelect: () => void
  theme: Theme
}) {
  const Icon = plan.icon
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
  const totalAnnual = plan.annualPrice
  const savings = billingCycle === "annual" && plan.monthlyPrice > 0
    ? Math.round(((plan.monthlyPrice * 12 - totalAnnual) / (plan.monthlyPrice * 12)) * 100)
    : 0

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
        selected
          ? "border-red-500 shadow-xl shadow-red-500/20 scale-[1.02]"
          : theme === "dark"
          ? "border-gray-800 hover:border-gray-700"
          : "border-gray-200 hover:border-gray-300"
      } ${theme === "dark" ? "bg-gray-900/50" : "bg-white"}`}
    >
      {/* Most Popular Badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
          MOST POPULAR
        </div>
      )}

      {/* Selection Indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        selected
          ? "border-red-500 bg-red-500"
          : theme === "dark" ? "border-gray-600" : "border-gray-300"
      }`}>
        {selected && <Check className="h-4 w-4 text-white" />}
      </div>

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${
          plan.color === "red" ? "bg-red-500/10" :
          plan.color === "blue" ? "bg-blue-500/10" :
          plan.color === "purple" ? "bg-purple-500/10" :
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
          <Icon className={`h-6 w-6 ${
            plan.color === "red" ? "text-red-500" :
            plan.color === "blue" ? "text-blue-500" :
            plan.color === "purple" ? "text-purple-500" :
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`} />
        </div>
        <div>
          <h3 className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {plan.name}
          </h3>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {plan.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {price === 0 ? "FREE" : `$${price.toFixed(2)}`}
          </span>
          {price > 0 && (
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              /month
            </span>
          )}
        </div>
        {billingCycle === "annual" && price > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              ${totalAnnual.toFixed(2)} billed annually
            </span>
            {savings > 0 && (
              <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">
                Save {savings}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
              plan.color === "red" ? "text-red-500" :
              plan.color === "blue" ? "text-blue-500" :
              plan.color === "purple" ? "text-purple-500" :
              "text-green-500"
            }`} />
            <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Select Button */}
      <button className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        selected
          ? "bg-red-500 text-white hover:bg-red-600"
          : theme === "dark"
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
      }`}>
        {selected ? "Selected" : "Select Plan"}
      </button>
    </div>
  )
}

function BillingToggle({
  billingCycle,
  onChange,
  theme,
}: {
  billingCycle: BillingCycle
  onChange: (cycle: BillingCycle) => void
  theme: Theme
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span className={`text-sm font-medium ${
        billingCycle === "monthly"
          ? theme === "dark" ? "text-white" : "text-gray-900"
          : theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}>Monthly</span>
      <button
        onClick={() => onChange(billingCycle === "monthly" ? "annual" : "monthly")}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          billingCycle === "annual" ? "bg-red-500" : theme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
          billingCycle === "annual" ? "translate-x-8" : "translate-x-1"
        }`} />
      </button>
      <span className={`text-sm font-medium flex items-center gap-2 ${
        billingCycle === "annual"
          ? theme === "dark" ? "text-white" : "text-gray-900"
          : theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}>
        Annual
        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">
          Save 20%
        </span>
      </span>
    </div>
  )
}

function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  disabled = false,
  theme,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
  error?: string
  required?: boolean
  disabled?: boolean
  theme: Theme
  showPasswordToggle?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}) {
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={`block text-sm font-medium ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`h-5 w-5 ${
              error ? "text-red-500" : theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`} />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} ${showPasswordToggle ? "pr-12" : "pr-4"} py-3 rounded-xl border transition-all duration-200 font-['Lato'] ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : theme === "dark"
              ? "border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
          } focus:outline-none focus:ring-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
              theme === "dark" ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

function PasswordStrengthIndicator({ password, theme }: { password: string; theme: Theme }) {
  const { score, requirements } = validatePassword(password)
  const strength = getPasswordStrength(score)

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Password strength
          </span>
          <span className={`text-xs font-medium ${
            score <= 2 ? "text-red-500" : score <= 4 ? "text-yellow-500" : "text-green-500"
          }`}>
            {strength.label}
          </span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`}>
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: strength.width }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {PASSWORD_REQUIREMENTS.map((req) => (
          <div
            key={req.id}
            className={`flex items-center gap-2 text-xs transition-colors ${
              requirements[req.id]
                ? "text-green-500"
                : theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {requirements[req.id] ? (
              <Check className="h-3 w-3" />
            ) : (
              <CircleDot className="h-3 w-3" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Checkbox({
  id,
  checked,
  onChange,
  label,
  error,
  theme,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  error?: string
  theme: Theme
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-red-500 border-red-500"
              : error
              ? "border-red-500"
              : theme === "dark"
              ? "border-gray-600 group-hover:border-gray-500"
              : "border-gray-300 group-hover:border-gray-400"
          }`}>
            {checked && <Check className="h-3.5 w-3.5 text-white" />}
          </div>
        </div>
        <span className={`text-sm ${
          error ? "text-red-500" : theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}>
          {label}
        </span>
      </label>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 ml-8">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

function SocialSignupButton({
  provider,
  onClick,
  loading,
  theme,
}: {
  provider: typeof SOCIAL_PROVIDERS[0]
  onClick: () => void
  loading: boolean
  theme: Theme
}) {
  const Icon = provider.icon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
        theme === "dark"
          ? `border-gray-700 bg-gray-800/50 text-white ${provider.color}`
          : `border-gray-300 bg-white text-gray-700 hover:bg-gray-50`
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Icon className="h-5 w-5" />
          <span>{provider.name}</span>
        </>
      )}
    </button>
  )
}

// Stripe Card Form Component
function StripeCardForm({ theme, onReady }: { theme: Theme; onReady: (ready: boolean) => void }) {
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    onReady(!!stripe && !!elements)
  }, [stripe, elements, onReady])

  return (
    <div className={`p-4 rounded-xl border ${
      theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-50"
    }`}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              fontFamily: "'Lato', sans-serif",
              color: theme === "dark" ? "#fff" : "#1f2937",
              "::placeholder": {
                color: theme === "dark" ? "#6b7280" : "#9ca3af",
              },
            },
            invalid: {
              color: "#ef4444",
            },
          },
        }}
      />
    </div>
  )
}

function PaymentMethodButtons({ theme }: { theme: Theme }) {
  return (
    <div className="mt-6">
      <p className={`text-sm text-center mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Or pay with
      </p>
      <div className="flex items-center justify-center gap-4">
        <button className={`p-3 rounded-xl border transition-colors ${
          theme === "dark"
            ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}>
          <svg className="h-6 w-auto" viewBox="0 0 24 24">
            <path fill="#00457C" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .633-.539h6.535c2.17 0 3.878.478 5.07 1.422 1.194.944 1.79 2.326 1.79 4.147 0 2.486-.882 4.38-2.646 5.68-1.765 1.302-4.167 1.952-7.206 1.952H6.89l-1.152 6.044a.641.641 0 0 1-.632.54z"/>
          </svg>
        </button>
        <button className={`p-3 rounded-xl border transition-colors ${
          theme === "dark"
            ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}>
          <svg className="h-6 w-auto" viewBox="0 0 24 24">
            <path fill={theme === "dark" ? "#fff" : "#000"} d="M17.05 10.917c-.054-1.744 1.397-2.597 1.464-2.641a3.14 3.14 0 0 0-2.457-1.337c-1.033-.11-2.039.623-2.564.623-.536 0-1.345-.614-2.218-.596a3.27 3.27 0 0 0-2.756 1.693c-1.194 2.088-.303 5.148.84 6.835.572.825 1.238 1.744 2.11 1.712.858-.035 1.177-.554 2.212-.554 1.024 0 1.32.554 2.212.532.917-.015 1.493-.83 2.054-1.66a6.968 6.968 0 0 0 .94-1.949 2.857 2.857 0 0 1-1.737-2.658zm-1.63-4.886a2.935 2.935 0 0 0 .667-2.131 2.997 2.997 0 0 0-1.936 1.008 2.816 2.816 0 0 0-.684 2.041 2.489 2.489 0 0 0 1.953-.918z"/>
          </svg>
        </button>
        <button className={`p-3 rounded-xl border transition-colors ${
          theme === "dark"
            ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}>
          <svg className="h-6 w-auto" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function OrderSummary({ plan, billingCycle, theme }: { plan: PricingPlan; billingCycle: BillingCycle; theme: Theme }) {
  const monthlyPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
  const total = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice

  return (
    <div className={`p-6 rounded-2xl border ${
      theme === "dark" ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"
    }`}>
      <h3 className={`font-bold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Order Summary
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {plan.name} Plan
          </span>
          <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {formatPrice(monthlyPrice)}/mo
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Billing Cycle
          </span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {billingCycle === "monthly" ? "Monthly" : "Annual"}
          </span>
        </div>
        {billingCycle === "annual" && plan.monthlyPrice > 0 && (
          <div className="flex items-center justify-between text-green-500">
            <span>Annual Savings</span>
            <span className="font-semibold">
              -${((plan.monthlyPrice * 12) - plan.annualPrice).toFixed(2)}
            </span>
          </div>
        )}
        <div className={`pt-3 mt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Total {billingCycle === "annual" ? "(billed annually)" : ""}
            </span>
            <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SignupPage() {
  const router = useRouter()
  const { theme, toggleTheme, mounted } = useTheme()
  const supabase = createClient()

  // Form State
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const [success, setSuccess] = useState(false)

  // Get selected plan details
  const selectedPlan = PLANS.find((p) => p.id === formData.selectedPlan) || PLANS[2]

  // Update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validate step
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      // Plan selection is always valid (default selected)
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
      if (formData.accountType === "business" && !formData.companyName.trim()) {
        newErrors.companyName = "Company name is required for business accounts"
      }
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (!validatePassword(formData.password).isValid) {
        newErrors.password = "Password does not meet requirements"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (step === 3 && formData.selectedPlan !== "free") {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = "Cardholder name is required"
      }
      if (!formData.billingAddress.trim()) {
        newErrors.billingAddress = "Billing address is required"
      }
      if (!formData.billingCity.trim()) {
        newErrors.billingCity = "City is required"
      }
      if (!formData.billingZip.trim()) {
        newErrors.billingZip = "ZIP code is required"
      }
    }

    if (step === 4) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the Terms of Service"
      }
      if (!formData.agreeToPrivacy) {
        newErrors.agreeToPrivacy = "You must agree to the Privacy Policy"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Skip payment step for free plan
      if (currentStep === 2 && formData.selectedPlan === "free") {
        setCurrentStep(4)
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 4))
      }
    }
  }

  const prevStep = () => {
    // Handle back from review step for free plan
    if (currentStep === 4 && formData.selectedPlan === "free") {
      setCurrentStep(2)
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }
  }

  // Social signup
  const handleSocialSignup = async (provider: string) => {
    setSocialLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "github" | "azure",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?plan=free`,
        },
      })
      if (error) throw error
    } catch (err) {
      console.error("Social signup error:", err)
      setSocialLoading(null)
    }
  }

  // Submit signup
  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName || null,
            account_type: formData.accountType,
            phone: formData.phone || null,
            selected_plan: formData.selectedPlan,
            billing_cycle: formData.billingCycle,
            subscribe_marketing: formData.subscribeMarketing,
          },
        },
      })

      if (authError) {
        if (authError.message.includes("already registered")) {
          setErrors({ email: "This email is already registered. Please sign in instead." })
        } else {
          setErrors({ submit: authError.message })
        }
        return
      }

      // If paid plan, create payment intent (this would be handled by your API)
      if (formData.selectedPlan !== "free") {
        // In production, you would call your API to create a Stripe subscription
        // const response = await fetch("/api/create-subscription", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     priceId: selectedPlan.stripePriceIdMonthly,
        //     customerId: authData.user?.id,
        //   }),
        // })
      }

      setSuccess(true)
    } catch (err) {
      console.error("Signup error:", err)
      setErrors({ submit: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Success state
  if (success) {
    return (
      <div className={`min-h-screen font-['Lato'] transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
      }`}>
        <Navigation theme={theme} onToggleTheme={toggleTheme} />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className={`p-8 rounded-3xl border ${
              theme === "dark" ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"
            }`}>
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Account Created!
              </h1>
              <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                We have sent a verification email to <span className="text-red-500 font-medium">{formData.email}</span>
              </p>
              <p className={`text-sm mb-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                Please check your inbox and click the verification link to activate your account.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Create Another Account
                </button>
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
      <div className={`min-h-screen font-['Lato'] transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
      }`}>
        {/* Google Fonts */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
        `}</style>

        <Navigation theme={theme} onToggleTheme={toggleTheme} />

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Create Your Account
              </h1>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                {currentStep === 1 && "Choose the perfect plan for your needs"}
                {currentStep === 2 && "Tell us about yourself"}
                {currentStep === 3 && "Secure payment information"}
                {currentStep === 4 && "Review and confirm your order"}
              </p>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStep} theme={theme} />

            {/* Global Error */}
            {errors.submit && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="max-w-6xl mx-auto">
              {/* STEP 1: Select Plan */}
              {currentStep === 1 && (
                <div className="animate-fadeIn">
                  <BillingToggle
                    billingCycle={formData.billingCycle}
                    onChange={(cycle) => updateFormData("billingCycle", cycle)}
                    theme={theme}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PLANS.map((plan) => (
                      <PricingCard
                        key={plan.id}
                        plan={plan}
                        selected={formData.selectedPlan === plan.id}
                        billingCycle={formData.billingCycle}
                        onSelect={() => updateFormData("selectedPlan", plan.id)}
                        theme={theme}
                      />
                    ))}
                  </div>

                  {/* Social Signup for Free Plan */}
                  {formData.selectedPlan === "free" && (
                    <div className="max-w-md mx-auto mt-12">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className={`w-full border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className={`px-4 ${theme === "dark" ? "bg-[#0a0a0a] text-gray-500" : "bg-white text-gray-500"}`}>
                            Quick signup with
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {SOCIAL_PROVIDERS.map((provider) => (
                          <SocialSignupButton
                            key={provider.id}
                            provider={provider}
                            onClick={() => handleSocialSignup(provider.id)}
                            loading={socialLoading === provider.id}
                            theme={theme}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Account Details */}
              {currentStep === 2 && (
                <div className="max-w-2xl mx-auto animate-fadeIn">
                  <div className={`p-6 sm:p-8 rounded-2xl border ${
                    theme === "dark" ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white"
                  }`}>
                    {/* Social Signup */}
                    <div className="mb-8">
                      <p className={`text-sm text-center mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        Sign up with
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {SOCIAL_PROVIDERS.map((provider) => (
                          <SocialSignupButton
                            key={provider.id}
                            provider={provider}
                            onClick={() => handleSocialSignup(provider.id)}
                            loading={socialLoading === provider.id}
                            theme={theme}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className={`w-full border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-4 ${
                          theme === "dark" ? "bg-gray-900/50 text-gray-500" : "bg-white text-gray-500"
                        }`}>
                          or continue with email
                        </span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <FormInput
                        id="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(value) => updateFormData("fullName", value)}
                        placeholder="John Doe"
                        icon={User}
                        error={errors.fullName}
                        required
                        theme={theme}
                      />

                      <FormInput
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(value) => updateFormData("email", value)}
                        placeholder="john@example.com"
                        icon={Mail}
                        error={errors.email}
                        required
                        theme={theme}
                      />

                      {/* Account Type */}
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          Account Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {(["personal", "business"] as AccountType[]).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateFormData("accountType", type)}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.accountType === type
                                  ? "border-red-500 bg-red-500/10"
                                  : theme === "dark"
                                  ? "border-gray-700 hover:border-gray-600"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {type === "personal" ? (
                                  <User className={`h-5 w-5 ${
                                    formData.accountType === type ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`} />
                                ) : (
                                  <Building2 className={`h-5 w-5 ${
                                    formData.accountType === type ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`} />
                                )}
                                <span className={`font-medium capitalize ${
                                  theme === "dark" ? "text-white" : "text-gray-900"
                                }`}>
                                  {type}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.accountType === "business" && (
                        <FormInput
                          id="companyName"
                          label="Company Name"
                          value={formData.companyName}
                          onChange={(value) => updateFormData("companyName", value)}
                          placeholder="Acme Inc."
                          icon={Building2}
                          error={errors.companyName}
                          required
                          theme={theme}
                        />
                      )}

                      <div>
                        <FormInput
                          id="password"
                          label="Password"
                          type="password"
                          value={formData.password}
                          onChange={(value) => updateFormData("password", value)}
                          placeholder="Create a strong password"
                          icon={Lock}
                          error={errors.password}
                          required
                          theme={theme}
                          showPasswordToggle
                          showPassword={showPassword}
                          onTogglePassword={() => setShowPassword(!showPassword)}
                        />
                        {formData.password && (
                          <PasswordStrengthIndicator password={formData.password} theme={theme} />
                        )}
                      </div>

                      <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(value) => updateFormData("confirmPassword", value)}
                        placeholder="Confirm your password"
                        icon={Lock}
                        error={errors.confirmPassword}
                        required
                        theme={theme}
                        showPasswordToggle
                        showPassword={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                      />

                      <FormInput
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(value) => updateFormData("phone", value)}
                        placeholder="+1 (555) 000-0000"
                        icon={Phone}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {currentStep === 3 && formData.selectedPlan !== "free" && (
                <div className="max-w-4xl mx-auto animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <div className={`lg:col-span-3 p-6 sm:p-8 rounded-2xl border ${
                      theme === "dark" ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white"
                    }`}>
                      <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Payment Information
                      </h2>

                      <div className="space-y-6">
                        <FormInput
                          id="cardholderName"
                          label="Cardholder Name"
                          value={formData.cardholderName}
                          onChange={(value) => updateFormData("cardholderName", value)}
                          placeholder="John Doe"
                          icon={User}
                          error={errors.cardholderName}
                          required
                          theme={theme}
                        />

                        <div className="space-y-1.5">
                          <label className={`block text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}>
                            Card Details <span className="text-red-500">*</span>
                          </label>
                          <StripeCardForm theme={theme} onReady={setStripeReady} />
                        </div>

                        <div className={`pt-6 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                          <h3 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            Billing Address
                          </h3>
                          <div className="space-y-4">
                            <FormInput
                              id="billingAddress"
                              label="Street Address"
                              value={formData.billingAddress}
                              onChange={(value) => updateFormData("billingAddress", value)}
                              placeholder="123 Main St"
                              icon={MapPin}
                              error={errors.billingAddress}
                              required
                              theme={theme}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormInput
                                id="billingCity"
                                label="City"
                                value={formData.billingCity}
                                onChange={(value) => updateFormData("billingCity", value)}
                                placeholder="New York"
                                error={errors.billingCity}
                                required
                                theme={theme}
                              />
                              <FormInput
                                id="billingState"
                                label="State"
                                value={formData.billingState}
                                onChange={(value) => updateFormData("billingState", value)}
                                placeholder="NY"
                                theme={theme}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <FormInput
                                id="billingZip"
                                label="ZIP Code"
                                value={formData.billingZip}
                                onChange={(value) => updateFormData("billingZip", value)}
                                placeholder="10001"
                                error={errors.billingZip}
                                required
                                theme={theme}
                              />
                              <div className="space-y-1.5">
                                <label className={`block text-sm font-medium ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  Country
                                </label>
                                <select
                                  value={formData.billingCountry}
                                  onChange={(e) => updateFormData("billingCountry", e.target.value)}
                                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                                    theme === "dark"
                                      ? "border-gray-700 bg-gray-800/50 text-white"
                                      : "border-gray-300 bg-white text-gray-900"
                                  } focus:outline-none focus:ring-4 focus:border-red-500 focus:ring-red-500/20`}
                                >
                                  <option value="US">United States</option>
                                  <option value="CA">Canada</option>
                                  <option value="GB">United Kingdom</option>
                                  <option value="AU">Australia</option>
                                  <option value="DE">Germany</option>
                                  <option value="FR">France</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <PaymentMethodButtons theme={theme} />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                      <OrderSummary
                        plan={selectedPlan}
                        billingCycle={formData.billingCycle}
                        theme={theme}
                      />

                      {/* Security Badges */}
                      <div className="mt-6 flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          <Shield className="h-4 w-4" />
                          <span>SSL Secure</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          <Lock className="h-4 w-4" />
                          <span>Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review */}
              {currentStep === 4 && (
                <div className="max-w-2xl mx-auto animate-fadeIn">
                  <div className={`p-6 sm:p-8 rounded-2xl border ${
                    theme === "dark" ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white"
                  }`}>
                    <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Review Your Order
                    </h2>

                    {/* Plan Summary */}
                    <div className={`p-4 rounded-xl mb-6 ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedPlan.color === "red" ? "bg-red-500/10" :
                            selectedPlan.color === "blue" ? "bg-blue-500/10" :
                            selectedPlan.color === "purple" ? "bg-purple-500/10" :
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}>
                            <selectedPlan.icon className={`h-5 w-5 ${
                              selectedPlan.color === "red" ? "text-red-500" :
                              selectedPlan.color === "blue" ? "text-blue-500" :
                              selectedPlan.color === "purple" ? "text-purple-500" :
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`} />
                          </div>
                          <div>
                            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {selectedPlan.name} Plan
                            </p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                              {formData.billingCycle === "monthly" ? "Monthly" : "Annual"} billing
                            </p>
                          </div>
                        </div>
                        <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {selectedPlan.monthlyPrice === 0
                            ? "FREE"
                            : formData.billingCycle === "monthly"
                            ? `$${selectedPlan.monthlyPrice.toFixed(2)}/mo`
                            : `$${(selectedPlan.annualPrice / 12).toFixed(2)}/mo`}
                        </p>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className={`space-y-3 mb-6 pb-6 border-b ${
                      theme === "dark" ? "border-gray-800" : "border-gray-200"
                    }`}>
                      <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Account Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Name</p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.fullName}</p>
                        </div>
                        <div>
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Email</p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.email}</p>
                        </div>
                        <div>
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Account Type</p>
                          <p className={`capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {formData.accountType}
                          </p>
                        </div>
                        {formData.companyName && (
                          <div>
                            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Company</p>
                            <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.companyName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Billing (if not free) */}
                    {formData.selectedPlan !== "free" && (
                      <div className={`space-y-3 mb-6 pb-6 border-b ${
                        theme === "dark" ? "border-gray-800" : "border-gray-200"
                      }`}>
                        <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Billing Information
                        </h3>
                        <div className="text-sm">
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing Address</p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {formData.billingAddress}<br />
                            {formData.billingCity}, {formData.billingState} {formData.billingZip}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Agreements */}
                    <div className="space-y-4 mb-8">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(checked) => updateFormData("agreeToTerms", checked)}
                        label={
                          <>
                            I agree to the{" "}
                            <a href="/terms" className="text-red-500 hover:underline">
                              Terms of Service
                            </a>
                          </>
                        }
                        error={errors.agreeToTerms}
                        theme={theme}
                      />

                      <Checkbox
                        id="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={(checked) => updateFormData("agreeToPrivacy", checked)}
                        label={
                          <>
                            I agree to the{" "}
                            <a href="/privacy" className="text-red-500 hover:underline">
                              Privacy Policy
                            </a>
                          </>
                        }
                        error={errors.agreeToPrivacy}
                        theme={theme}
                      />

                      <Checkbox
                        id="subscribeMarketing"
                        checked={formData.subscribeMarketing}
                        onChange={(checked) => updateFormData("subscribeMarketing", checked)}
                        label="Send me product updates, tips, and exclusive offers"
                        theme={theme}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Create Account
                          {formData.selectedPlan !== "free" && ` - $${
                            formData.billingCycle === "monthly"
                              ? selectedPlan.monthlyPrice.toFixed(2)
                              : selectedPlan.annualPrice.toFixed(2)
                          }`}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <p className={`text-center mt-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <Link href="/login" className="text-red-500 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </main>

        <Footer theme={theme} />

        {/* Animation Styles */}
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </Elements>
  )
}
