"use client"

// ============================================================================
// DOMAINPRO SIGNUP PAGE
// Complete Production-Ready Version
// COLOR SCHEME: TRUE BLACK background, RED primary, TEAL secondary
// ============================================================================

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Crown,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  CreditCard,
  MapPin,
  Sun,
  Moon,
  Menu,
  Rocket,
  CircleDot,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Heart,
  type LucideIcon,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  highlighted: boolean
  icon: LucideIcon
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

interface PasswordRequirement {
  id: string
  label: string
  test: (password: string) => boolean
}

interface Country {
  code: string
  name: string
}

interface NavLink {
  href: string
  label: string
}

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for getting started",
    icon: Rocket,
    highlighted: false,
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
    annualPrice: 67.10,
    description: "Great for personal projects",
    icon: Zap,
    highlighted: false,
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
    annualPrice: 191.90,
    description: "Best for growing businesses",
    icon: Crown,
    highlighted: true,
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
    annualPrice: 767.90,
    description: "For large organizations",
    icon: Building2,
    highlighted: false,
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

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const COUNTRIES: Country[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
]

const NAV_LINKS: NavLink[] = [
  { href: "/domains", label: "Domains" },
  { href: "/pricing", label: "Pricing" },
  { href: "/features", label: "Features" },
  { href: "/support", label: "Support" },
]

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Products",
    links: [
      { label: "Domain Search", href: "/domains" },
      { label: "Domain Transfer", href: "/transfer" },
      { label: "SSL Certificates", href: "/ssl" },
      { label: "Email Hosting", href: "/email" },
      { label: "Web Hosting", href: "/hosting" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Status", href: "/status" },
      { label: "API Docs", href: "/docs/api" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
      { label: "Acceptable Use", href: "/acceptable-use" },
    ],
  },
]

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Twitter, href: "https://twitter.com/domainpro", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/domainpro", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/domainpro", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/domainpro", label: "LinkedIn" },
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): { isValid: boolean; score: number; requirements: Record<string, boolean> } {
  const requirements: Record<string, boolean> = {}
  let score = 0
  for (const req of PASSWORD_REQUIREMENTS) {
    const passed = req.test(password)
    requirements[req.id] = passed
    if (passed) score++
  }
  return { isValid: score === PASSWORD_REQUIREMENTS.length, score, requirements }
}

function getPasswordStrength(score: number): { label: string; bgColor: string; textColor: string; width: string } {
  if (score === 0) return { label: "Enter password", bgColor: "bg-gray-200", textColor: "text-gray-400", width: "0%" }
  if (score === 1) return { label: "Very Weak", bgColor: "bg-red-500", textColor: "text-red-500", width: "20%" }
  if (score === 2) return { label: "Weak", bgColor: "bg-orange-500", textColor: "text-orange-500", width: "40%" }
  if (score === 3) return { label: "Fair", bgColor: "bg-yellow-500", textColor: "text-yellow-500", width: "60%" }
  if (score === 4) return { label: "Good", bgColor: "bg-emerald-500", textColor: "text-emerald-500", width: "80%" }
  return { label: "Strong", bgColor: "bg-emerald-500", textColor: "text-emerald-500", width: "100%" }
}

function formatPrice(price: number): string {
  return price === 0 ? "FREE" : "$" + price.toFixed(2)
}

function calculateSavings(monthlyPrice: number, annualPrice: number): number {
  if (monthlyPrice === 0) return 0
  return Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100)
}

function getMonthlyEquivalent(plan: PricingPlan, cycle: BillingCycle): number {
  return cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useTheme(): { theme: Theme; toggleTheme: () => void; mounted: boolean } {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("domainpro-theme")
      if (saved === "light" || saved === "dark") {
        setTheme(saved)
      } else {
        setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      }
    } catch {
      setTheme("dark")
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((curr) => {
      const next = curr === "dark" ? "light" : "dark"
      try { localStorage.setItem("domainpro-theme", next) } catch {}
      return next
    })
  }, [])

  return { theme, toggleTheme, mounted }
}

function useSupabaseClient(): { client: any; isLoading: boolean } {
  const [client, setClient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        setClient(createClient())
      } catch {
        setClient(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  return { client, isLoading }
}

// ============================================================================
// COMPONENT: TopBanner - TEAL banner like homepage
// ============================================================================

function TopBanner(): React.ReactElement {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return <></>

  return (
    <div className="bg-emerald-500 text-white py-2 px-4 text-center text-sm font-medium relative">
      <span>
        🚀 Get 20% off your first year with code <span className="font-bold">LAUNCH20</span> →{" "}
        <Link href="/pricing" className="underline hover:no-underline">View Plans</Link>
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-emerald-600 rounded transition-colors"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ============================================================================
// COMPONENT: ThemeToggle
// ============================================================================

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label={"Switch to " + (theme === "dark" ? "light" : "dark") + " mode"}
      className={
        "relative p-2.5 rounded-xl transition-all duration-300 " +
        (theme === "dark"
          ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
          : "bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300")
      }
    >
      <div className="relative w-5 h-5">
        <Sun className={"absolute inset-0 h-5 w-5 transition-all duration-500 transform " + (theme === "dark" ? "rotate-0 scale-100 opacity-100 text-amber-400" : "rotate-90 scale-0 opacity-0")} />
        <Moon className={"absolute inset-0 h-5 w-5 transition-all duration-500 transform " + (theme === "light" ? "rotate-0 scale-100 opacity-100 text-slate-700" : "-rotate-90 scale-0 opacity-0")} />
      </div>
    </button>
  )
}

// ============================================================================
// COMPONENT: Navigation - RED circle with TEAL globe logo
// ============================================================================

function Navigation({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (theme === "dark" ? "bg-black/90 backdrop-blur-xl border-b border-white/5" : "bg-white/90 backdrop-blur-xl border-b border-gray-200/50")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-2.5 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors duration-300">
              <Globe className="h-6 w-6 text-emerald-400" />
            </div>
            <span className={"text-xl font-bold tracking-tight " + (theme === "dark" ? "text-white" : "text-gray-900")}>
              Domain<span className="text-red-500">Pro</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={"px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 " + (theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle mobile menu"
              className={"lg:hidden p-2.5 rounded-xl transition-all duration-200 " + (theme === "dark" ? "hover:bg-white/5 text-white" : "hover:bg-gray-100 text-gray-900")}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className={"lg:hidden overflow-hidden transition-all duration-300 ease-in-out " + (mobileMenuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0")}>
          <div className={"pt-4 border-t " + (theme === "dark" ? "border-white/5" : "border-gray-200")}>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={"px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 " + (theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ============================================================================
// COMPONENT: Footer - RED circle with TEAL globe logo
// ============================================================================

function Footer({ theme }: { theme: Theme }): React.ReactElement {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={"border-t transition-colors duration-300 " + (theme === "dark" ? "bg-black border-white/5" : "bg-gray-50 border-gray-200")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-full bg-red-500">
                <Globe className="h-6 w-6 text-emerald-400" />
              </div>
              <span className={"text-xl font-bold tracking-tight " + (theme === "dark" ? "text-white" : "text-gray-900")}>
                Domain<span className="text-red-500">Pro</span>
              </span>
            </Link>
            <p className={"text-sm mb-6 max-w-xs leading-relaxed " + (theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Professional domain management for modern businesses. Secure, fast, and reliable domain services you can trust.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className={"p-2.5 rounded-xl transition-all duration-200 " + (theme === "dark" ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900")}>
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className={"font-semibold mb-4 " + (theme === "dark" ? "text-white" : "text-gray-900")}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={"text-sm transition-colors duration-200 " + (theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={"mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 " + (theme === "dark" ? "border-white/5" : "border-gray-200")}>
          <p className={"text-sm " + (theme === "dark" ? "text-gray-500" : "text-gray-500")}>© {currentYear} DomainPro. All rights reserved.</p>
          <p className={"text-sm flex items-center gap-1.5 " + (theme === "dark" ? "text-gray-500" : "text-gray-500")}>
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by Mindscapes
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// COMPONENT: ProgressSteps - RED for current/active states
// ============================================================================

function ProgressSteps({ currentStep, skipPayment, theme }: { currentStep: number; skipPayment: boolean; theme: Theme }): React.ReactElement {
  const steps = [
    { number: 1, label: "Select Plan", icon: CreditCard, skip: false },
    { number: 2, label: "Account Details", icon: User, skip: false },
    { number: 3, label: "Payment", icon: Lock, skip: skipPayment },
    { number: 4, label: "Review", icon: CheckCircle, skip: false },
  ]
  const visibleSteps = steps.filter((s) => !s.skip)

  return (
    <div className="flex items-center justify-center mb-10">
      {visibleSteps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={"relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 " + (isCurrent ? "bg-red-500 text-white shadow-lg shadow-red-500/25 scale-110" : isCompleted ? "bg-emerald-500 text-white" : theme === "dark" ? "bg-white/5 text-gray-500 border border-white/10" : "bg-gray-100 text-gray-400 border border-gray-200")}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                {isCurrent && <div className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-20" />}
              </div>
              <span className={"mt-3 text-xs font-medium hidden sm:block transition-colors duration-300 " + (isCurrent ? "text-red-500" : isCompleted ? "text-emerald-500" : theme === "dark" ? "text-gray-500" : "text-gray-400")}>
                {step.label}
              </span>
            </div>
            {index < visibleSteps.length - 1 && (
              <div className={"w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-all duration-500 " + (currentStep > step.number ? "bg-emerald-500" : theme === "dark" ? "bg-white/10" : "bg-gray-200")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// COMPONENT: BillingToggle - RED for active state
// ============================================================================

function BillingToggle({ billingCycle, onChange, theme }: { billingCycle: BillingCycle; onChange: (cycle: BillingCycle) => void; theme: Theme }): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <span className={"text-sm font-medium transition-colors duration-300 " + (billingCycle === "monthly" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-500" : "text-gray-400")}>
        Monthly
      </span>
      <button
        onClick={() => onChange(billingCycle === "monthly" ? "annual" : "monthly")}
        type="button"
        aria-label={"Switch to " + (billingCycle === "monthly" ? "annual" : "monthly") + " billing"}
        className={"relative w-16 h-8 rounded-full transition-all duration-300 " + (billingCycle === "annual" ? "bg-red-500 shadow-lg shadow-red-500/25" : theme === "dark" ? "bg-white/10" : "bg-gray-200")}
      >
        <div className={"absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 " + (billingCycle === "annual" ? "translate-x-9" : "translate-x-1")} />
      </button>
      <span className={"text-sm font-medium flex items-center gap-2 transition-colors duration-300 " + (billingCycle === "annual" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-500" : "text-gray-400")}>
        Annual
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">Save 20%</span>
      </span>
    </div>
  )
}

// ============================================================================
// COMPONENT: PricingCard - RED for selection
// ============================================================================

function PricingCard({ plan, selected, billingCycle, onSelect, theme }: { plan: PricingPlan; selected: boolean; billingCycle: BillingCycle; onSelect: () => void; theme: Theme }): React.ReactElement {
  const Icon = plan.icon
  const monthlyEquivalent = getMonthlyEquivalent(plan, billingCycle)
  const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice)

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect() } }}
      aria-pressed={selected}
      className={"relative rounded-3xl p-1 cursor-pointer transition-all duration-500 group " + (selected ? "bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/25 scale-[1.02]" : "bg-transparent")}
    >
      <div className={"relative h-full rounded-[22px] p-6 transition-all duration-300 " + (selected ? (theme === "dark" ? "bg-black" : "bg-white") : theme === "dark" ? "bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04]" : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg")}>
        {plan.highlighted && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="relative px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg shadow-red-500/25">
              <Sparkles className="inline-block h-3 w-3 mr-1 -mt-0.5" />MOST POPULAR
            </div>
          </div>
        )}

        <div className={"absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 " + (selected ? "bg-red-500 border-transparent" : theme === "dark" ? "border-white/20" : "border-gray-300")}>
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>

        <div className="flex items-center gap-4 mb-5 mt-2">
          <div className={"p-3.5 rounded-2xl " + (plan.id === "free" ? "bg-gray-500" : "bg-red-500")}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className={"font-bold text-lg " + (theme === "dark" ? "text-white" : "text-gray-900")}>{plan.name}</h3>
            <p className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>{plan.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={"text-4xl font-extrabold tracking-tight " + (theme === "dark" ? "text-white" : "text-gray-900")}>
              {monthlyEquivalent === 0 ? "FREE" : "$" + monthlyEquivalent.toFixed(2)}
            </span>
            {monthlyEquivalent > 0 && <span className={"text-sm font-medium " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>/month</span>}
          </div>
          {billingCycle === "annual" && monthlyEquivalent > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>${plan.annualPrice.toFixed(2)} billed annually</span>
              {savings > 0 && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Save {savings}%</span>}
            </div>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-0.5 p-0.5 rounded-full bg-red-500"><Check className="h-3 w-3 text-white" /></div>
              <span className={"text-sm " + (theme === "dark" ? "text-gray-300" : "text-gray-600")}>{feature}</span>
            </li>
          ))}
        </ul>

        <button type="button" className={"w-full py-3.5 rounded-xl font-semibold transition-all duration-300 " + (selected ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : theme === "dark" ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200")}>
          {selected ? "Selected" : "Select Plan"}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: FormInput - RED focus states
// ============================================================================

function FormInput({
  id, label, type = "text", value, onChange, placeholder, icon: Icon, error, required = false, disabled = false, theme,
  showPasswordToggle = false, showPassword = false, onTogglePassword, autoComplete,
}: {
  id: string; label: string; type?: string; value: string; onChange: (value: string) => void; placeholder?: string;
  icon?: LucideIcon; error?: string; required?: boolean; disabled?: boolean; theme: Theme;
  showPasswordToggle?: boolean; showPassword?: boolean; onTogglePassword?: () => void; autoComplete?: string;
}): React.ReactElement {
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={"block text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={"h-5 w-5 " + (error ? "text-red-500" : theme === "dark" ? "text-gray-500 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-red-500")} />
          </div>
        )}
        <input
          id={id} name={id} type={inputType} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required} disabled={disabled} autoComplete={autoComplete}
          className={
            "w-full py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none " +
            (Icon ? "pl-12 " : "pl-4 ") + (showPasswordToggle ? "pr-12 " : "pr-4 ") +
            (error ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 " :
              theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white/[0.07] " :
              "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 ") +
            (disabled ? "opacity-50 cursor-not-allowed" : "")
          }
        />
        {showPasswordToggle && (
          <button type="button" onClick={onTogglePassword} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}
            className={"absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors " + (theme === "dark" ? "text-gray-500 hover:text-gray-300 hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100")}>
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}</p>}
    </div>
  )
}

// ============================================================================
// COMPONENT: PasswordStrengthIndicator - TEAL for success
// ============================================================================

function PasswordStrengthIndicator({ password, theme }: { password: string; theme: Theme }): React.ReactElement {
  const validation = useMemo(() => validatePassword(password), [password])
  const strength = useMemo(() => getPasswordStrength(validation.score), [validation.score])

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={"text-xs " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>Password strength</span>
          <span className={"text-xs font-semibold " + strength.textColor}>{strength.label}</span>
        </div>
        <div className={"h-2 rounded-full overflow-hidden " + (theme === "dark" ? "bg-white/10" : "bg-gray-200")}>
          <div className={"h-full transition-all duration-500 ease-out rounded-full " + strength.bgColor} style={{ width: strength.width }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PASSWORD_REQUIREMENTS.map((req) => {
          const passed = validation.requirements[req.id]
          return (
            <div key={req.id} className={"flex items-center gap-2 text-xs transition-all duration-300 " + (passed ? "text-emerald-500" : theme === "dark" ? "text-gray-500" : "text-gray-400")}>
              {passed ? <div className="p-0.5 rounded-full bg-emerald-500"><Check className="h-2.5 w-2.5 text-white" /></div> : <CircleDot className="h-3.5 w-3.5" />}
              <span>{req.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Checkbox - RED when checked
// ============================================================================

function Checkbox({ id, checked, onChange, label, error, theme }: { id: string; checked: boolean; onChange: (checked: boolean) => void; label: ReactNode; error?: string; theme: Theme }): React.ReactElement {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
          <div className={"w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 " + (checked ? "bg-red-500 border-transparent" : error ? "border-red-500" : theme === "dark" ? "border-white/20 group-hover:border-white/40" : "border-gray-300 group-hover:border-gray-400")}>
            {checked && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        <span className={"text-sm " + (error ? "text-red-500" : theme === "dark" ? "text-gray-300" : "text-gray-600")}>{label}</span>
      </label>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-500 ml-8"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}</p>}
    </div>
  )
}

// ============================================================================
// COMPONENT: SocialSignupButtons
// ============================================================================

function SocialSignupButtons({ onGoogleClick, onGithubClick, onMicrosoftClick, loading, theme }: { onGoogleClick: () => void; onGithubClick: () => void; onMicrosoftClick: () => void; loading: string | null; theme: Theme }): React.ReactElement {
  const buttons = [
    { id: "google", name: "Google", onClick: onGoogleClick, icon: <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
    { id: "github", name: "GitHub", onClick: onGithubClick, icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { id: "azure", name: "Microsoft", onClick: onMicrosoftClick, icon: <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg> },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.map((btn) => (
        <button key={btn.id} type="button" onClick={btn.onClick} disabled={loading !== null}
          className={"flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 font-medium transition-all duration-200 " + (theme === "dark" ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300") + (loading === btn.id ? " opacity-70" : "") + (loading !== null && loading !== btn.id ? " opacity-50 cursor-not-allowed" : "")}>
          {loading === btn.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{btn.icon}<span className="hidden sm:inline">{btn.name}</span></>}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: OrderSummary
// ============================================================================

function OrderSummary({ plan, billingCycle, theme }: { plan: PricingPlan; billingCycle: BillingCycle; theme: Theme }): React.ReactElement {
  const monthlyPrice = getMonthlyEquivalent(plan, billingCycle)
  const total = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
  const annualSavings = plan.monthlyPrice > 0 ? plan.monthlyPrice * 12 - plan.annualPrice : 0
  const Icon = plan.icon

  return (
    <div className={"p-6 rounded-2xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50")}>
      <h3 className={"font-bold text-lg mb-5 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Order Summary</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500"><Icon className="h-4 w-4 text-white" /></div>
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{plan.name} Plan</span>
          </div>
          <span className={"font-semibold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formatPrice(monthlyPrice)}{monthlyPrice > 0 && "/mo"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing Cycle</span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{billingCycle === "monthly" ? "Monthly" : "Annual"}</span>
        </div>
        {billingCycle === "annual" && annualSavings > 0 && (
          <div className="flex items-center justify-between text-emerald-500">
            <span>Annual Savings</span>
            <span className="font-semibold">-${annualSavings.toFixed(2)}</span>
          </div>
        )}
        <div className={"pt-4 mt-4 border-t " + (theme === "dark" ? "border-white/10" : "border-gray-200")}>
          <div className="flex items-center justify-between">
            <span className={"font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>Total {billingCycle === "annual" ? "(billed annually)" : ""}</span>
            <span className={"text-2xl font-extrabold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: StripeCardForm
// ============================================================================

function StripeCardForm({ theme, onReady }: { theme: Theme; onReady: (ready: boolean) => void }): React.ReactElement {
  useEffect(() => { const t = setTimeout(() => onReady(true), 500); return () => clearTimeout(t) }, [onReady])

  return (
    <div className={"p-4 rounded-xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50")}>
      <div className="flex items-center gap-3">
        <CreditCard className={"h-5 w-5 " + (theme === "dark" ? "text-gray-400" : "text-gray-500")} />
        <span className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>Card details will be collected securely via Stripe</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className={"h-10 rounded-lg animate-pulse " + (theme === "dark" ? "bg-white/10" : "bg-gray-200")} />
        <div className={"h-10 rounded-lg animate-pulse " + (theme === "dark" ? "bg-white/10" : "bg-gray-200")} />
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: SecurityBadges - TEAL icons
// ============================================================================

function SecurityBadges({ theme }: { theme: Theme }): React.ReactElement {
  return (
    <div className={"p-4 rounded-xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50")}>
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          <span className={"text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-600")}>SSL Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-500" />
          <span className={"text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-600")}>Encrypted</span>
        </div>
      </div>
      <p className={"text-xs text-center mt-3 " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>Your payment information is encrypted and secure</p>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT: SignupPage
// ============================================================================

export default function SignupPage(): React.ReactElement {
  const router = useRouter()
  const { theme, toggleTheme, mounted } = useTheme()
  const { client: supabase, isLoading: supabaseLoading } = useSupabaseClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedPlan = useMemo(() => PLANS.find((p) => p.id === formData.selectedPlan) || PLANS[2], [formData.selectedPlan])
  const skipPayment = formData.selectedPlan === "free"

  const updateFormData = useCallback((field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }, [errors])

  const validateStep = useCallback((step: number): boolean => {
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
  }, [formData, skipPayment])

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep === 2 && skipPayment) setCurrentStep(4)
      else setCurrentStep((prev) => Math.min(prev + 1, 4))
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep, validateStep, skipPayment])

  const prevStep = useCallback(() => {
    if (currentStep === 4 && skipPayment) setCurrentStep(2)
    else setCurrentStep((prev) => Math.max(prev - 1, 1))
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep, skipPayment])

  const handleSocialSignup = useCallback(async (provider: "google" | "github" | "azure") => {
    if (!supabase) { setErrors({ submit: "Authentication service is not available." }); return }
    setSocialLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + "/auth/callback?plan=" + formData.selectedPlan } })
      if (error) throw error
    } catch (err) {
      console.error(provider + " signup error:", err)
      setErrors({ submit: "Failed to connect. Please try again." })
      setSocialLoading(null)
    }
  }, [supabase, formData.selectedPlan])

  const handleSubmit = useCallback(async () => {
    if (!validateStep(4)) return
    if (!supabase) { setErrors({ submit: "Authentication service is not available." }); return }
    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback",
          data: {
            full_name: formData.fullName, company_name: formData.companyName || null, account_type: formData.accountType,
            phone: formData.phone || null, selected_plan: formData.selectedPlan, billing_cycle: formData.billingCycle, subscribe_marketing: formData.subscribeMarketing,
          },
        },
      })
      if (authError) {
        if (authError.message.includes("already registered")) setErrors({ email: "This email is already registered. Please sign in instead." })
        else setErrors({ submit: authError.message })
        return
      }
      setSuccess(true)
    } catch (err) {
      console.error("Signup error:", err)
      setErrors({ submit: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }, [validateStep, supabase, formData])

  const handleReset = useCallback(() => { setSuccess(false); setFormData(INITIAL_FORM_DATA); setCurrentStep(1); setErrors({}) }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
      </div>
    )
  }

  // SUCCESS STATE
  if (success) {
    return (
      <div className={theme === "dark" ? "min-h-screen bg-black" : "min-h-screen bg-gray-50"}>
        <style jsx global>{`@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"); * { font-family: "Lato", system-ui, sans-serif; }`}</style>
        <TopBanner />
        <Navigation theme={theme} onToggleTheme={toggleTheme} />
        <main className="pt-28 pb-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className={"p-10 rounded-3xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-gray-200 bg-white shadow-xl")}>
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className={"text-3xl font-bold mb-3 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Account Created!</h1>
              <p className={"mb-8 " + (theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                We&apos;ve sent a verification email to <span className="text-red-500 font-semibold">{formData.email}</span>
              </p>
              <p className={"text-sm mb-10 " + (theme === "dark" ? "text-gray-500" : "text-gray-500")}>Please check your inbox and click the verification link to activate your account.</p>
              <div className="flex flex-col gap-4">
                <Link href="/login" className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 text-center">
                  Go to Login
                </Link>
                <button onClick={handleReset} className={"w-full py-4 rounded-xl font-semibold transition-all duration-200 " + (theme === "dark" ? "bg-transparent hover:bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/50 hover:border-emerald-500" : "bg-transparent hover:bg-emerald-50 text-emerald-600 border-2 border-emerald-500/50 hover:border-emerald-500")}>
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

  // MAIN RENDER
  return (
    <div className={theme === "dark" ? "min-h-screen bg-black" : "min-h-screen bg-gray-50"}>
      <style jsx global>{`@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"); * { font-family: "Lato", system-ui, sans-serif; }`}</style>
      <TopBanner />
      <Navigation theme={theme} onToggleTheme={toggleTheme} />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className={"text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Create Your Account</h1>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {currentStep === 1 && "Choose the perfect plan for your needs"}
              {currentStep === 2 && "Tell us about yourself"}
              {currentStep === 3 && "Secure payment information"}
              {currentStep === 4 && "Review and confirm your order"}
            </p>
          </div>

          <ProgressSteps currentStep={currentStep} skipPayment={skipPayment} theme={theme} />

          {errors.submit && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{errors.submit}</p>
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            {/* STEP 1: Select Plan */}
            {currentStep === 1 && (
              <div>
                <BillingToggle billingCycle={formData.billingCycle} onChange={(cycle) => updateFormData("billingCycle", cycle)} theme={theme} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {PLANS.map((plan) => (
                    <PricingCard key={plan.id} plan={plan} selected={formData.selectedPlan === plan.id} billingCycle={formData.billingCycle} onSelect={() => updateFormData("selectedPlan", plan.id)} theme={theme} />
                  ))}
                </div>
                {formData.selectedPlan === "free" && (
                  <div className="max-w-md mx-auto">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center"><div className={"w-full border-t " + (theme === "dark" ? "border-white/10" : "border-gray-200")} /></div>
                      <div className="relative flex justify-center text-sm"><span className={"px-4 " + (theme === "dark" ? "bg-black text-gray-500" : "bg-gray-50 text-gray-500")}>Quick signup with</span></div>
                    </div>
                    <SocialSignupButtons onGoogleClick={() => handleSocialSignup("google")} onGithubClick={() => handleSocialSignup("github")} onMicrosoftClick={() => handleSocialSignup("azure")} loading={socialLoading} theme={theme} />
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Account Details */}
            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto">
                <div className={"p-6 sm:p-10 rounded-3xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white")}>
                  <div className="mb-8">
                    <p className={"text-sm text-center mb-4 " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>Sign up with</p>
                    <SocialSignupButtons onGoogleClick={() => handleSocialSignup("google")} onGithubClick={() => handleSocialSignup("github")} onMicrosoftClick={() => handleSocialSignup("azure")} loading={socialLoading} theme={theme} />
                  </div>
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><div className={"w-full border-t " + (theme === "dark" ? "border-white/10" : "border-gray-200")} /></div>
                    <div className="relative flex justify-center text-sm"><span className={"px-4 " + (theme === "dark" ? "bg-white/5 text-gray-500" : "bg-white text-gray-500")}>or continue with email</span></div>
                  </div>
                  <div className="space-y-6">
                    <FormInput id="fullName" label="Full Name" value={formData.fullName} onChange={(v) => updateFormData("fullName", v)} placeholder="John Doe" icon={User} error={errors.fullName} required theme={theme} autoComplete="name" />
                    <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={(v) => updateFormData("email", v)} placeholder="john@example.com" icon={Mail} error={errors.email} required theme={theme} autoComplete="email" />
                    <div className="space-y-2">
                      <label className={"block text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}>Account Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => updateFormData("accountType", "personal")} className={"p-4 rounded-xl border-2 transition-all duration-200 " + (formData.accountType === "personal" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-white/10 hover:border-white/20" : "border-gray-200 hover:border-gray-300")}>
                          <div className="flex items-center gap-3">
                            <User className={"h-5 w-5 " + (formData.accountType === "personal" ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500")} />
                            <span className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>Personal</span>
                          </div>
                        </button>
                        <button type="button" onClick={() => updateFormData("accountType", "business")} className={"p-4 rounded-xl border-2 transition-all duration-200 " + (formData.accountType === "business" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-white/10 hover:border-white/20" : "border-gray-200 hover:border-gray-300")}>
                          <div className="flex items-center gap-3">
                            <Building2 className={"h-5 w-5 " + (formData.accountType === "business" ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500")} />
                            <span className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>Business</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    {formData.accountType === "business" && <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={(v) => updateFormData("companyName", v)} placeholder="Acme Inc." icon={Building2} error={errors.companyName} required theme={theme} autoComplete="organization" />}
                    <div>
                      <FormInput id="password" label="Password" type="password" value={formData.password} onChange={(v) => updateFormData("password", v)} placeholder="Create a strong password" icon={Lock} error={errors.password} required theme={theme} showPasswordToggle showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} autoComplete="new-password" />
                      {formData.password && <PasswordStrengthIndicator password={formData.password} theme={theme} />}
                    </div>
                    <FormInput id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(v) => updateFormData("confirmPassword", v)} placeholder="Confirm your password" icon={Lock} error={errors.confirmPassword} required theme={theme} showPasswordToggle showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)} autoComplete="new-password" />
                    <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={(v) => updateFormData("phone", v)} placeholder="+1 (555) 000-0000" icon={Phone} theme={theme} autoComplete="tel" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && !skipPayment && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className={"lg:col-span-3 p-6 sm:p-10 rounded-3xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white")}>
                    <h2 className={"text-xl font-bold mb-8 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Payment Information</h2>
                    <div className="space-y-6">
                      <FormInput id="cardholderName" label="Cardholder Name" value={formData.cardholderName} onChange={(v) => updateFormData("cardholderName", v)} placeholder="John Doe" icon={User} error={errors.cardholderName} required theme={theme} autoComplete="cc-name" />
                      <div className="space-y-2">
                        <label className={"block text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}>Card Details <span className="text-red-500">*</span></label>
                        <StripeCardForm theme={theme} onReady={setStripeReady} />
                      </div>
                      <div className={"pt-6 border-t " + (theme === "dark" ? "border-white/10" : "border-gray-200")}>
                        <h3 className={"font-semibold mb-4 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Billing Address</h3>
                        <div className="space-y-4">
                          <FormInput id="billingAddress" label="Street Address" value={formData.billingAddress} onChange={(v) => updateFormData("billingAddress", v)} placeholder="123 Main St" icon={MapPin} error={errors.billingAddress} required theme={theme} autoComplete="street-address" />
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput id="billingCity" label="City" value={formData.billingCity} onChange={(v) => updateFormData("billingCity", v)} placeholder="New York" error={errors.billingCity} required theme={theme} autoComplete="address-level2" />
                            <FormInput id="billingState" label="State" value={formData.billingState} onChange={(v) => updateFormData("billingState", v)} placeholder="NY" theme={theme} autoComplete="address-level1" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput id="billingZip" label="ZIP Code" value={formData.billingZip} onChange={(v) => updateFormData("billingZip", v)} placeholder="10001" error={errors.billingZip} required theme={theme} autoComplete="postal-code" />
                            <div className="space-y-2">
                              <label className={"block text-sm font-medium " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}>Country</label>
                              <select value={formData.billingCountry} onChange={(e) => updateFormData("billingCountry", e.target.value)} className={"w-full py-3.5 px-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 " + (theme === "dark" ? "border-white/10 bg-white/5 text-white focus:border-red-500" : "border-gray-200 bg-white text-gray-900 focus:border-red-500")}>
                                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <OrderSummary plan={selectedPlan} billingCycle={formData.billingCycle} theme={theme} />
                    <SecurityBadges theme={theme} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div className="max-w-2xl mx-auto">
                <div className={"p-6 sm:p-10 rounded-3xl border-2 " + (theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white")}>
                  <h2 className={"text-xl font-bold mb-8 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Review Your Order</h2>

                  <div className={"p-5 rounded-2xl mb-6 " + (theme === "dark" ? "bg-white/5" : "bg-gray-100")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500"><selectedPlan.icon className="h-5 w-5 text-white" /></div>
                        <div>
                          <p className={"font-semibold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{selectedPlan.name} Plan</p>
                          <p className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>{formData.billingCycle === "monthly" ? "Monthly" : "Annual"} billing</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={"text-xl font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>
                          {selectedPlan.monthlyPrice === 0 ? "FREE" : "$" + (formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice).toFixed(2)}
                        </p>
                        {selectedPlan.monthlyPrice > 0 && <p className={"text-xs " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>{formData.billingCycle === "monthly" ? "/month" : "/year"}</p>}
                      </div>
                    </div>
                  </div>

                  <div className={"space-y-3 mb-6 pb-6 border-b " + (theme === "dark" ? "border-white/10" : "border-gray-200")}>
                    <h3 className={"font-semibold " + (theme === "dark" ? "text-white" : "text-gray-900")}>Account Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Name</p><p className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formData.fullName}</p></div>
                      <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Email</p><p className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formData.email}</p></div>
                      <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Account Type</p><p className={"font-medium capitalize " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formData.accountType}</p></div>
                      {formData.companyName && <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Company</p><p className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formData.companyName}</p></div>}
                      {formData.phone && <div><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Phone</p><p className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formData.phone}</p></div>}
                    </div>
                  </div>

                  {!skipPayment && formData.billingAddress && (
                    <div className={"space-y-3 mb-6 pb-6 border-b " + (theme === "dark" ? "border-white/10" : "border-gray-200")}>
                      <h3 className={"font-semibold " + (theme === "dark" ? "text-white" : "text-gray-900")}>Billing Information</h3>
                      <div className="text-sm">
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing Address</p>
                        <p className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>
                          {formData.billingAddress}<br />{formData.billingCity}{formData.billingState && ", " + formData.billingState} {formData.billingZip}<br />{COUNTRIES.find((c) => c.code === formData.billingCountry)?.name || formData.billingCountry}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mb-8">
                    <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onChange={(v) => updateFormData("agreeToTerms", v)} error={errors.agreeToTerms} theme={theme}
                      label={<>I agree to the <Link href="/terms" className="text-red-500 hover:text-red-400 underline">Terms of Service</Link><span className="text-red-500 ml-1">*</span></>} />
                    <Checkbox id="agreeToPrivacy" checked={formData.agreeToPrivacy} onChange={(v) => updateFormData("agreeToPrivacy", v)} error={errors.agreeToPrivacy} theme={theme}
                      label={<>I agree to the <Link href="/privacy" className="text-red-500 hover:text-red-400 underline">Privacy Policy</Link><span className="text-red-500 ml-1">*</span></>} />
                    <Checkbox id="subscribeMarketing" checked={formData.subscribeMarketing} onChange={(v) => updateFormData("subscribeMarketing", v)} theme={theme}
                      label="Send me product updates, tips, and exclusive offers" />
                  </div>

                  <button onClick={handleSubmit} disabled={isLoading}
                    className={"w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 " + (isLoading ? "" : "hover:shadow-red-500/40")}>
                    {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Creating Account...</> : <><Sparkles className="h-5 w-5" />Create Account{!skipPayment && selectedPlan.monthlyPrice > 0 && <span>{" — $" + (formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice).toFixed(2)}</span>}</>}
                  </button>

                  <p className={"text-xs text-center mt-4 " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>🔒 Your information is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="max-w-2xl mx-auto mt-10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button onClick={prevStep} className={"flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 " + (theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>
                <ArrowLeft className="h-5 w-5" />Back
              </button>
            ) : <div />}
            {currentStep < 4 && (
              <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40">
                Continue<ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Sign In Link */}
          <p className={"text-center mt-10 " + (theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Already have an account?{" "}
            <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  )
}
