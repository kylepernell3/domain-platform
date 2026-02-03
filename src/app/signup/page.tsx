"use client"

// ============================================================================
// DOMAINPRO SIGNUP PAGE - ENHANCED VERSION
// Complete Production-Ready with Stripe, Dropdowns, Accessibility
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Globe, Check, X, Eye, EyeOff, Sun, Moon, ArrowRight, ArrowLeft,
  Building2, User, Mail, Lock, Phone, CreditCard, Sparkles, Shield,
  Zap, Crown, Loader2, AlertCircle, CheckCircle, Menu, ChevronDown,
  ChevronUp, MapPin, Home, Hash, Server, Cloud, HardDrive, Database,
  ShieldCheck, Headphones, Users, Activity, Code, MessageCircle,
  RefreshCw, BarChart3, Network, Layers, Palette,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type PlanId = "starter" | "professional" | "business" | "enterprise"
type BillingCycle = "monthly" | "annual"
type AccountType = "personal" | "business"
type Theme = "light" | "dark"
type SocialProvider = "google" | "github" | "microsoft"
type ValidationStatus = "idle" | "validating" | "valid" | "invalid"

interface PricingPlan {
  id: PlanId
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  popular: boolean
  icon: React.ReactNode
  color: string
}

interface FormData {
  selectedPlan: PlanId
  billingCycle: BillingCycle
  fullName: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  accountType: AccountType
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
  enableWhiteLabel: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  companyName?: string
  phone?: string
  cardholderName?: string
  billingAddress?: string
  billingCity?: string
  billingState?: string
  billingZip?: string
  billingCountry?: string
  agreeToTerms?: string
  agreeToPrivacy?: string
  payment?: string
  general?: string
}

interface FieldValidationState {
  fullName: ValidationStatus
  email: ValidationStatus
  password: ValidationStatus
  confirmPassword: ValidationStatus
  companyName: ValidationStatus
  phone: ValidationStatus
  cardholderName: ValidationStatus
  billingAddress: ValidationStatus
  billingCity: ValidationStatus
  billingState: ValidationStatus
  billingZip: ValidationStatus
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

interface SocialProviderConfig {
  id: SocialProvider
  name: string
  icon: React.ReactNode
  bgColor: string
  hoverColor: string
  textColor: string
}

interface NavDropdownItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: NavDropdownItem[]
}

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

interface StepConfig {
  number: number
  title: string
  icon: React.ReactNode
}

// Clock Icon Component
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

// ============================================================================
// CONSTANTS
// ============================================================================

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Get online free with Automatic HTTPS",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "Automatic HTTPS (DV certificates for your .domainpro.site subdomain)",
      "Basic DNS management",
      "1 GB storage",
      "10 GB bandwidth",
      "Free subdomain (yourname.domainpro.site)",
      "DomainPro branding",
      "Community support",
    ],
    popular: false,
    icon: <Zap className="h-6 w-6" />,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Everything you need for a small business site",
    monthlyPrice: 19.99,
    annualPrice: 191.88,
    features: [
      "Automatic HTTPS for all connected domains",
      "Unlimited domain management",
      "10 email forwards included (extra forwards $1.99/month each)",
      "Advanced DNS management",
      "Beginner website builder",
      "80 GB storage",
      "100 GB bandwidth",
      "Basic analytics dashboard",
      "Domain transfer tools",
      "1-click DNS templates (WordPress, Shopify, Webflow)",
      "Domain auto-renewal & renewal notifications",
      "Honest pricing – no hidden fees or SSL upsells",
      "Form builder & templates",
      "Email support (24-hour response target)",
      "Upsell slot in UI: Add 3 Gmail inboxes (optional add-on)",
    ],
    popular: true,
    icon: <Shield className="h-6 w-6" />,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "business",
    name: "Developer",
    description: "For developers shipping serious projects",
    monthlyPrice: 79.99,
    annualPrice: 767.88,
    features: [
      "Everything in Professional",
      "Automatic HTTPS for unlimited sites and domains",
      "Advanced website builder",
      "Host unlimited websites",
      "Easy domain connect (guided DNS wizard)",
      "Version history & one-click rollback",
      "5 Gmail inboxes included (30 GB each)",
      "API access (domains, DNS, billing)",
      "Custom DNS templates (e.g., SaaS presets, staging/prod split)",
    ],
    popular: false,
    icon: <Building2 className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Scalable, managed hosting for teams",
    monthlyPrice: 249.99,
    annualPrice: 2399.88,
    features: [
      "Everything in Developer",
      "Multi-site management dashboard (coming soon)",
      "Multi-client dashboard (coming soon)",
      "Team collaboration (multiple editors per site)",
      "10 Gmail inboxes (30 GB each)",
      "500 GB storage per website",
      "Premium DNS & DDoS protection (Cloudflare-backed)",
      "Dedicated account manager",
      "Optional: custom/OV/EV certificate management add-on",
    ],
    popular: false,
    icon: <Crown className="h-6 w-6" />,
    color: "from-amber-500 to-yellow-500",
  },
]

const WHITE_LABEL_PRICE_MONTHLY = 499

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: (<svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>),
    bgColor: "bg-white",
    hoverColor: "hover:bg-gray-50",
    textColor: "text-gray-700",
  },
  {
    id: "github",
    name: "GitHub",
    icon: (<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>),
    bgColor: "bg-gray-900",
    hoverColor: "hover:bg-gray-800",
    textColor: "text-white",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: (<svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#00A4EF" d="M1 13h10v10H1z" /><path fill="#7FBA00" d="M13 1h10v10H13z" /><path fill="#FFB900" d="M13 13h10v10H13z" /></svg>),
    bgColor: "bg-white",
    hoverColor: "hover:bg-gray-50",
    textColor: "text-gray-700",
  },
]

const NAV_ITEMS: NavItem[] = [
  {
    label: "Domains",
    dropdown: [
      { label: "Domain Search", href: "/domains/search", icon: <Globe className="h-4 w-4" />, description: "Find your perfect domain" },
      { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
      { label: "Domain Backorder", href: "/domains/backorder", icon: <Clock className="h-4 w-4" />, description: "Catch expiring domains" },
      { label: "Bulk Domain Register", href: "/domains/bulk", icon: <Layers className="h-4 w-4" />, description: "Register multiple domains" },
      { label: "Domain Auctions", href: "/domains/auctions", icon: <BarChart3 className="h-4 w-4" />, description: "Bid on premium domains" },
    ],
  },
  {
    label: "Hosting",
    dropdown: [
      { label: "Web Hosting", href: "/hosting/web", icon: <Server className="h-4 w-4" />, description: "Reliable shared hosting" },
      { label: "WordPress Hosting", href: "/hosting/wordpress", icon: <Globe className="h-4 w-4" />, description: "Optimized for WordPress" },
      { label: "VPS Hosting", href: "/hosting/vps", icon: <HardDrive className="h-4 w-4" />, description: "Virtual private servers" },
      { label: "Cloud Hosting", href: "/hosting/cloud", icon: <Cloud className="h-4 w-4" />, description: "Scalable cloud solutions" },
      { label: "Dedicated Servers", href: "/hosting/dedicated", icon: <Database className="h-4 w-4" />, description: "Full server control" },
    ],
  },
  {
    label: "Services",
    dropdown: [
      { label: "SSL Certificates", href: "/services/ssl", icon: <ShieldCheck className="h-4 w-4" />, description: "Secure your website" },
      { label: "CDN Services", href: "/services/cdn", icon: <Network className="h-4 w-4" />, description: "Global content delivery" },
      { label: "Email Hosting", href: "/services/email", icon: <Mail className="h-4 w-4" />, description: "Professional email" },
      { label: "Website Builder", href: "/services/builder", icon: <Layers className="h-4 w-4" />, description: "Build without code" },
      { label: "DNS Management", href: "/services/dns", icon: <Globe className="h-4 w-4" />, description: "Advanced DNS control" },
    ],
  },
  {
    label: "Security",
    dropdown: [
      { label: "VPN Services", href: "/security/vpn", icon: <Lock className="h-4 w-4" />, description: "Private browsing" },
      { label: "DDoS Protection", href: "/security/ddos", icon: <Shield className="h-4 w-4" />, description: "Attack mitigation" },
      { label: "Backup Services", href: "/security/backup", icon: <HardDrive className="h-4 w-4" />, description: "Automated backups" },
      { label: "Security Monitoring", href: "/security/monitoring", icon: <Activity className="h-4 w-4" />, description: "24/7 threat detection" },
    ],
  },
  {
    label: "Support",
    dropdown: [
      { label: "Help Center", href: "/support/help", icon: <Headphones className="h-4 w-4" />, description: "Browse articles" },
      { label: "Contact Us", href: "/support/contact", icon: <MessageCircle className="h-4 w-4" />, description: "Get in touch" },
      { label: "System Status", href: "/support/status", icon: <Activity className="h-4 w-4" />, description: "Service uptime" },
      { label: "API Documentation", href: "/support/api", icon: <Code className="h-4 w-4" />, description: "Developer resources" },
      { label: "Community Forum", href: "/support/forum", icon: <Users className="h-4 w-4" />, description: "Join discussions" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
]

const FOOTER_SECTIONS: FooterSection[] = [
  { title: "DOMAINS", links: [{ label: "Domain Search", href: "/domains/search" }, { label: "Domain Transfer", href: "/domains/transfer" }, { label: "Domain Backorder", href: "/domains/backorder" }, { label: "Bulk Registration", href: "/domains/bulk" }, { label: "Domain Auctions", href: "/domains/auctions" }, { label: "WHOIS Lookup", href: "/domains/whois" }] },
  { title: "HOSTING", links: [{ label: "Web Hosting", href: "/hosting/web" }, { label: "WordPress Hosting", href: "/hosting/wordpress" }, { label: "Cloud Hosting", href: "/hosting/cloud" }, { label: "VPS Hosting", href: "/hosting/vps" }, { label: "VPN Services", href: "/security/vpn" }, { label: "Dedicated Servers", href: "/hosting/dedicated" }] },
  { title: "INFRASTRUCTURE", links: [{ label: "CDN Services", href: "/services/cdn" }, { label: "Load Balancing", href: "/infrastructure/load-balancing" }, { label: "Edge Computing", href: "/infrastructure/edge" }, { label: "Global Network", href: "/infrastructure/network" }, { label: "Data Centers", href: "/infrastructure/datacenters" }, { label: "API Access", href: "/support/api" }] },
  { title: "SECURITY", links: [{ label: "SSL Certificates", href: "/services/ssl" }, { label: "DDoS Protection", href: "/security/ddos" }, { label: "VPN Services", href: "/security/vpn" }, { label: "Backup Services", href: "/security/backup" }, { label: "Security Monitoring", href: "/security/monitoring" }, { label: "Two-Factor Auth", href: "/security/2fa" }] },
  { title: "COMPANY", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Blog", href: "/blog" }, { label: "Press", href: "/press" }, { label: "Partners", href: "/partners" }, { label: "Affiliates", href: "/affiliates" }] },
  { title: "SUPPORT", links: [{ label: "Help Center", href: "/support/help" }, { label: "Contact Us", href: "/support/contact" }, { label: "System Status", href: "/support/status" }, { label: "Community Forum", href: "/support/forum" }, { label: "Report Abuse", href: "/support/abuse" }, { label: "Feedback", href: "/support/feedback" }] },
  { title: "LEGAL", links: [{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }, { label: "Cookie Policy", href: "/legal/cookies" }, { label: "GDPR", href: "/legal/gdpr" }, { label: "Acceptable Use", href: "/legal/acceptable-use" }, { label: "SLA", href: "/legal/sla" }] },
]

const COUNTRIES: Country[] = [
  { code: "US", name: "United States" }, { code: "CA", name: "Canada" }, { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" }, { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
  { code: "ES", name: "Spain" }, { code: "IT", name: "Italy" }, { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" }, { code: "CH", name: "Switzerland" }, { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" }, { code: "NO", name: "Norway" }, { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" }, { code: "IE", name: "Ireland" }, { code: "NZ", name: "New Zealand" },
  { code: "JP", name: "Japan" }, { code: "SG", name: "Singapore" }, { code: "HK", name: "Hong Kong" },
  { code: "KR", name: "South Korea" }, { code: "BR", name: "Brazil" }, { code: "MX", name: "Mexico" }, { code: "IN", name: "India" },
]

const INITIAL_FORM_DATA: FormData = {
  selectedPlan: "professional", billingCycle: "annual", fullName: "", email: "", password: "", confirmPassword: "",
  companyName: "", accountType: "personal", phone: "", cardholderName: "", billingAddress: "", billingCity: "",
  billingState: "", billingZip: "", billingCountry: "US", agreeToTerms: false, agreeToPrivacy: false, subscribeMarketing: false,
  enableWhiteLabel: false,
}

const INITIAL_VALIDATION_STATE: FieldValidationState = {
  fullName: "idle", email: "idle", password: "idle", confirmPassword: "idle", companyName: "idle",
  phone: "idle", cardholderName: "idle", billingAddress: "idle", billingCity: "idle", billingState: "idle", billingZip: "idle",
}

const STEP_CONFIG: StepConfig[] = [
  { number: 1, title: "Plan", icon: <Sparkles className="h-5 w-5" /> },
  { number: 2, title: "Account", icon: <User className="h-5 w-5" /> },
  { number: 3, title: "Payment", icon: <CreditCard className="h-5 w-5" /> },
  { number: 4, title: "Review", icon: <CheckCircle className="h-5 w-5" /> },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): { isValid: boolean; requirements: { id: string; met: boolean }[] } {
  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({ id: req.id, met: req.test(password) }))
  return { isValid: requirements.every((req) => req.met), requirements }
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  const { requirements } = validatePassword(password)
  const metCount = requirements.filter((r) => r.met).length
  if (metCount <= 1) return { score: 1, label: "Weak", color: "bg-red-500" }
  if (metCount <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" }
  if (metCount <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" }
  if (metCount <= 4) return { score: 4, label: "Strong", color: "bg-lime-500" }
  return { score: 5, label: "Excellent", color: "bg-green-500" }
}

function formatPrice(price: number): string { return price.toFixed(2) }
function calculateSavings(monthly: number, annual: number): number { return Math.round(((monthly * 12 - annual) / (monthly * 12)) * 100) }
function getMonthlyEquivalent(annualPrice: number): string { return (annualPrice / 12).toFixed(2) }

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useTheme(): [Theme, () => void, boolean] {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) setTheme(savedTheme)
      else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light")
    } catch (e) { console.error("Error accessing localStorage:", e) }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark"
      try { localStorage.setItem("theme", newTheme) } catch (e) { console.error("Error saving theme:", e) }
      return newTheme
    })
  }, [])

  return [theme, toggleTheme, mounted]
}

function useSupabaseClient() {
  const [supabase, setSupabase] = useState<ReturnType<typeof Object> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadSupabase = async () => {
      // Try the project's existing helper first
      try {
        const mod = await import("@/lib/supabase/client")
        const client = typeof mod.createClient === "function" ? mod.createClient() : mod.default
        if (!cancelled) {
          setSupabase(client)
          setError(null)
          setLoading(false)
        }
        return
      } catch {
        // Local helper not available — fall through to manual creation
      }

      // Fallback: build a browser client from env vars
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!url || !anonKey) {
          throw new Error(
            "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
          )
        }
        const { createClient } = await import("@supabase/supabase-js")
        const client = createClient(url, anonKey)
        if (!cancelled) {
          setSupabase(client)
          setError(null)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to initialize authentication"
        console.error("Failed to load Supabase client:", e)
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSupabase()
    return () => { cancelled = true }
  }, [])

  return { supabase, loading, error }
}

function useStripePayment() {
  const [stripe, setStripe] = useState<ReturnType<typeof Object> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadStripe = async () => {
      try {
        const { loadStripe: loadStripeJS } = await import("@stripe/stripe-js")
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (!publishableKey) throw new Error("Stripe publishable key not configured")
        const stripeInstance = await loadStripeJS(publishableKey)
        if (!cancelled) {
          setStripe(stripeInstance)
          setError(null)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to initialize payment system"
        console.error("Failed to load Stripe:", e)
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadStripe()
    return () => { cancelled = true }
  }, [])

  return { stripe, loading, error }
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function ThemeToggle({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} role="switch" aria-pressed={theme === "light"}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

function NavDropdown({ item, theme, isOpen, onToggle, onClose }: { item: NavItem; theme: Theme; isOpen: boolean; onToggle: () => void; onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) onClose()
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  if (!item.dropdown) {
    return <Link href={item.href || "#"} className={`font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{item.label}</Link>
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={onToggle} className={`flex items-center gap-1 font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`} aria-expanded={isOpen} aria-haspopup="true">
        {item.label}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} role="menu">
          <div className="p-2">
            {item.dropdown.map((dropdownItem) => (
              <Link key={dropdownItem.href} href={dropdownItem.href} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`} role="menuitem" onClick={onClose}>
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>{dropdownItem.icon}</div>
                <div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{dropdownItem.label}</div>
                  {dropdownItem.description && <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{dropdownItem.description}</div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ theme, isOpen, onClose }: { theme: Theme; isOpen: boolean; onClose: () => void }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const toggleExpanded = (label: string) => setExpandedItems((prev) => { const next = new Set(prev); next.has(label) ? next.delete(label) : next.add(label); return next })

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} role="dialog" aria-modal="true">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <Globe className="h-8 w-8 text-red-500" />
          <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span>
        </Link>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close menu"><X className="h-6 w-6" /></button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="mb-2">
            {item.dropdown ? (
              <>
                <button onClick={() => toggleExpanded(item.label)} className={`w-full flex items-center justify-between p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`} aria-expanded={expandedItems.has(item.label)}>
                  {item.label}
                  {expandedItems.has(item.label) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {expandedItems.has(item.label) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((di) => (
                      <Link key={di.href} href={di.href} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"}`} onClick={onClose}>
                        <span className={theme === "dark" ? "text-red-400" : "text-red-500"}>{di.icon}</span>
                        {di.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href || "#"} className={`block p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`} onClick={onClose}>{item.label}</Link>
            )}
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <Link href="/login" className="block w-full p-3 text-center font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl" onClick={onClose}>Sign In</Link>
        </div>
      </nav>
    </div>
  )
}

function Navigation({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="DomainPro Home">
            <div className="relative">
              <Globe className="h-8 w-8 text-red-500" />
              <div className="absolute inset-0 h-8 w-8 bg-red-500 blur-lg opacity-30 animate-pulse" />
            </div>
            <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => <NavDropdown key={item.label} item={item} theme={theme} isOpen={openDropdown === item.label} onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} onClose={() => setOpenDropdown(null)} />)}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link href="/login" className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>Sign In</Link>
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
          </div>
        </div>
      </div>
      <MobileMenu theme={theme} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}

function Footer({ theme }: { theme: Theme }) {
  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/domainpro", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
    { name: "GitHub", href: "https://github.com/domainpro", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
    { name: "LinkedIn", href: "https://linkedin.com/company/domainpro", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
  ]

  return (
    <footer className={`border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}><Link href={link.href} className={`text-sm transition-colors ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`pt-8 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2"><Globe className="h-6 w-6 text-red-500" /><span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
              <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>© {new Date().getFullYear()} DomainPro. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-gray-500 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`} aria-label={`Follow us on ${s.name}`}>{s.icon}</a>)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ProgressSteps({ currentStep, skipPayment, theme }: { currentStep: number; skipPayment: boolean; theme: Theme }) {
  const steps = skipPayment ? STEP_CONFIG.filter((s) => s.number !== 3) : STEP_CONFIG
  return (
    <div className="flex items-center justify-center mb-12" role="navigation" aria-label="Signup progress">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number
        const isCompleted = currentStep > step.number
        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${isCompleted ? "bg-green-500 border-green-500" : isActive ? "bg-red-500 border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"}`} aria-current={isActive ? "step" : undefined}>
                {isCompleted ? <Check className="h-6 w-6 text-white" /> : <span className={isActive ? "text-white" : theme === "dark" ? "text-gray-400" : "text-gray-500"}>{step.icon}</span>}
                {isActive && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />}
              </div>
              <span className={`mt-2 text-sm font-medium ${isActive ? "text-red-500" : isCompleted ? "text-green-500" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{step.title}</span>
            </div>
            {index < steps.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-2 ${currentStep > step.number ? "bg-green-500" : theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function BillingToggle({ billingCycle, onChange, theme }: { billingCycle: BillingCycle; onChange: (cycle: BillingCycle) => void; theme: Theme }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8" role="radiogroup" aria-label="Billing cycle">
      <button onClick={() => onChange("monthly")} className={`px-4 py-2 rounded-lg font-medium transition-all ${billingCycle === "monthly" ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`} role="radio" aria-checked={billingCycle === "monthly"}>Monthly</button>
      <button onClick={() => onChange("annual")} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${billingCycle === "annual" ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`} role="radio" aria-checked={billingCycle === "annual"}>
        Annual<span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">Save 20%</span>
      </button>
    </div>
  )
}

function PricingCard({ plan, selected, billingCycle, onSelect, theme }: { plan: PricingPlan; selected: boolean; billingCycle: BillingCycle; onSelect: () => void; theme: Theme }) {
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
  const monthlyEquivalent = billingCycle === "annual" ? getMonthlyEquivalent(plan.annualPrice) : null
  const savings = billingCycle === "annual" ? calculateSavings(plan.monthlyPrice, plan.annualPrice) : 0

  return (
    <button onClick={onSelect} className={`relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 ${selected ? "border-red-500 shadow-xl shadow-red-500/20" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"} ${theme === "dark" ? "bg-gray-800/50" : "bg-white"}`} role="radio" aria-checked={selected} aria-label={`${plan.name} plan - ${plan.monthlyPrice === 0 ? "Free" : `$${formatPrice(price)} ${billingCycle === "annual" ? "per year" : "per month"}`}`}>
      {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">MOST POPULAR</div>}
      {selected && <div className="absolute top-4 right-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>}
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} mb-4`}>{plan.icon}</div>
      <h3 className={`text-xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
      <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
      <div className="mb-4">
        {plan.monthlyPrice === 0 ? (
          <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Free</div>
        ) : (
          <>
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${formatPrice(price)}<span className={`text-base font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>/{billingCycle === "annual" ? "year" : "month"}</span></div>
            {monthlyEquivalent && <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>${monthlyEquivalent}/mo billed annually{savings > 0 && <span className="ml-2 text-green-500 font-medium">Save {savings}%</span>}</div>}
          </>
        )}
      </div>
      <ul className="space-y-2">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2"><Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${selected ? "text-red-500" : "text-green-500"}`} /><span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature}</span></li>
        ))}
      </ul>
    </button>
  )
}

function WhiteLabelUpsell({ enabled, onToggle, theme }: { enabled: boolean; onToggle: () => void; theme: Theme }) {
  const features = [
    "Custom domain login portal for your clients",
    "Your logo, colors, and brand throughout the dashboard",
    "Remove all DomainPro branding and references",
    "Branded email notifications sent on your behalf",
  ]

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full p-7 rounded-2xl border-2 text-left transition-all duration-300 flex items-start gap-5 ${
          enabled
            ? "border-red-500 shadow-xl shadow-red-500/20"
            : theme === "dark"
            ? "border-gray-700 hover:border-gray-600"
            : "border-gray-200 hover:border-gray-300"
        } ${theme === "dark" ? "bg-gray-800/50" : "bg-white"}`}
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle white-label client dashboard add-on for $${WHITE_LABEL_PRICE_MONTHLY} per month`}
      >
        <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${enabled ? "from-red-500 to-orange-500" : "from-gray-500 to-gray-600"} transition-all duration-300`}>
          <Palette className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                White‑label client dashboard
              </h3>
              <p className={`text-base font-semibold mt-0.5 ${enabled ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                + ${WHITE_LABEL_PRICE_MONTHLY}/mo
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center ${enabled ? "bg-red-500 justify-end" : theme === "dark" ? "bg-gray-600 justify-start" : "bg-gray-300 justify-start"}`}>
                <div className="w-5 h-5 mx-1 bg-white rounded-full shadow transition-all duration-300" />
              </div>
            </div>
          </div>
          <p className={`text-base mt-3 leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Let clients log in on your own domain with your branding. Present a fully custom, professional experience with no trace of DomainPro.
          </p>
          <ul className="mt-4 space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${enabled ? "text-red-500" : "text-green-500"}`} />
                <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </button>
    </div>
  )
}

function FormInput({ id, label, type = "text", value, onChange, error, icon, placeholder, required, theme, autoComplete, validationStatus, showPasswordToggle, onBlur, ariaDescribedBy }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; error?: string; icon?: React.ReactNode; placeholder?: string; required?: boolean; theme: Theme; autoComplete?: string; validationStatus?: ValidationStatus; showPasswordToggle?: boolean; onBlur?: () => void; ariaDescribedBy?: string }) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? "text" : type
  const errorId = `${id}-error`
  const describedBy = [error ? errorId : null, ariaDescribedBy].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative">
        {icon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{icon}</div>}
        <input id={id} type={inputType} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} autoComplete={autoComplete} required={required} aria-required={required} aria-invalid={error ? "true" : "false"} aria-describedby={describedBy} className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${icon ? "pl-10" : ""} ${showPasswordToggle || validationStatus ? "pr-10" : ""} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : validationStatus === "valid" ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"} focus:outline-none focus:ring-4`} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {validationStatus === "validating" && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}
          {validationStatus === "valid" && !error && <CheckCircle className="h-5 w-5 text-green-500" />}
          {validationStatus === "invalid" && error && <AlertCircle className="h-5 w-5 text-red-500" />}
          {showPasswordToggle && <button type="button" onClick={() => setShowPassword(!showPassword)} className={`p-1 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
        </div>
      </div>
      {error && <p id={errorId} className="text-sm text-red-500 flex items-center gap-1" role="alert"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

function PasswordStrengthIndicator({ password, theme }: { password: string; theme: Theme }) {
  const { requirements } = validatePassword(password)
  const strength = getPasswordStrength(password)
  if (!password) return null

  return (
    <div className="mt-2 space-y-3" aria-label="Password requirements">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={5} aria-label={`Password strength: ${strength.label}`}>
          <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
        </div>
        <span className={`text-xs font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {PASSWORD_REQUIREMENTS.map((req) => {
          const met = requirements.find((r) => r.id === req.id)?.met || false
          return <li key={req.id} className={`flex items-center gap-2 text-xs ${met ? "text-green-500" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{met ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}<span>{req.label}</span></li>
        })}
      </ul>
    </div>
  )
}

function Checkbox({ id, checked, onChange, label, error, theme }: { id: string; checked: boolean; onChange: (checked: boolean) => void; label: React.ReactNode; error?: string; theme: Theme }) {
  const errorId = `${id}-error`
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" aria-invalid={error ? "true" : "false"} aria-describedby={error ? errorId : undefined} />
          <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${checked ? "bg-red-500 border-red-500" : error ? "border-red-500" : theme === "dark" ? "border-gray-600 group-hover:border-gray-500" : "border-gray-300 group-hover:border-gray-400"}`}>{checked && <Check className="h-3 w-3 text-white" />}</div>
        </div>
        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
      </label>
      {error && <p id={errorId} className="text-sm text-red-500 mt-1 ml-8 flex items-center gap-1" role="alert"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

function SocialSignupButtons({ onSignup, loadingProvider, theme, disabled }: { onSignup: (provider: SocialProvider) => void; loadingProvider: SocialProvider | null; theme: Theme; disabled?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="relative"><div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} /></div><div className="relative flex justify-center text-sm"><span className={`px-4 ${theme === "dark" ? "bg-gray-800/50 text-gray-400" : "bg-gray-50 text-gray-500"}`}>Or continue with</span></div></div>
      <div className="grid grid-cols-3 gap-3" role="group" aria-label="Social sign up options">
        {SOCIAL_PROVIDERS.map((provider) => (
          <button key={provider.id} onClick={() => onSignup(provider.id)} disabled={disabled || loadingProvider !== null} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} ${provider.bgColor} ${provider.hoverColor} ${provider.textColor} disabled:opacity-50 disabled:cursor-not-allowed`} aria-label={`Sign up with ${provider.name}`}>
            {loadingProvider === provider.id ? <Loader2 className="h-5 w-5 animate-spin" /> : provider.icon}
            <span className="sr-only sm:not-sr-only">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function OrderSummary({ plan, billingCycle, theme, enableWhiteLabel }: { plan: PricingPlan; billingCycle: BillingCycle; theme: Theme; enableWhiteLabel?: boolean }) {
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
  const monthlyEquivalent = billingCycle === "annual" ? getMonthlyEquivalent(plan.annualPrice) : null
  const savings = billingCycle === "annual" && plan.monthlyPrice > 0 ? plan.monthlyPrice * 12 - plan.annualPrice : 0

  return (
    <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`} role="region" aria-label="Order summary">
      <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Plan</span><span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</span></div>
        <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Billing</span><span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{billingCycle === "monthly" ? "Monthly" : "Annual"}</span></div>
        {monthlyEquivalent && <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Monthly equivalent</span><span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${monthlyEquivalent}/mo</span></div>}
        {savings > 0 && <div className="flex justify-between text-green-500"><span>Annual savings</span><span className="font-medium">-${formatPrice(savings)}</span></div>}
        {enableWhiteLabel && (
          <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>White‑label add‑on</span><span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${formatPrice(WHITE_LABEL_PRICE_MONTHLY)}/mo</span></div>
        )}
        <div className={`pt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between">
            <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Total</span>
            <div className="text-right"><span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{price === 0 ? "Free" : `$${formatPrice(price)}`}</span>{price > 0 && <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>/{billingCycle === "annual" ? "year" : "month"}</span>}{enableWhiteLabel && <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>+ ${formatPrice(WHITE_LABEL_PRICE_MONTHLY)}/mo white‑label</div>}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StripeCardForm({ stripe, theme, onCardChange, cardError }: { stripe: ReturnType<typeof Object> | null; theme: Theme; onCardChange: (complete: boolean, error?: string) => void; cardError?: string }) {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const cardElementRef = useRef<ReturnType<typeof Object> | null>(null)
  const onCardChangeRef = useRef(onCardChange)

  // Keep callback ref current to avoid remounting the Stripe element when the
  // parent re-creates the callback identity.
  useEffect(() => { onCardChangeRef.current = onCardChange }, [onCardChange])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!stripe || !mounted || !cardContainerRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elements = (stripe as any).elements()
    const style = {
      base: {
        fontSize: "16px",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": { color: theme === "dark" ? "#6b7280" : "#9ca3af" },
      },
      invalid: { color: "#ef4444", iconColor: "#ef4444" },
    }
    const card = elements.create("card", { style, hidePostalCode: true })
    card.mount(cardContainerRef.current)
    cardElementRef.current = card
    setLoading(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card.on("change", (event: any) =>
      onCardChangeRef.current(event.complete, event.error?.message)
    )

    return () => { card.unmount() }
  }, [stripe, mounted, theme])

  if (!stripe) return <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`} role="alert"><div className="flex items-center gap-2 text-amber-500"><AlertCircle className="h-5 w-5" /><span>Payment system loading...</span></div></div>

  return (
    <div className="space-y-2">
      <label htmlFor="card-element" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Card Details <span className="text-red-500">*</span></label>
      <div ref={cardContainerRef} id="card-element" className={`p-4 rounded-xl border transition-all ${cardError ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 focus-within:border-red-500" : "bg-white border-gray-300 focus-within:border-red-500"}`} role="group" aria-label="Card information" aria-invalid={cardError ? "true" : "false"} />
      {loading && <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading payment form...</span></div>}
      {cardError && <p className="text-sm text-red-500 flex items-center gap-1" role="alert"><AlertCircle className="h-4 w-4" />{cardError}</p>}
    </div>
  )
}

function PaymentMethodButtons({ theme }: { theme: Theme }) {
  return (
    <div className="space-y-3">
      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Or pay with</p>
      <div className="grid grid-cols-3 gap-3" role="group" aria-label="Alternative payment methods">
        {[{ name: "PayPal", icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.773.773 0 0 1 .764-.654h6.751c2.235 0 3.862.53 4.842 1.575.467.498.789 1.07.957 1.703.172.648.173 1.427 0 2.314l-.014.081v.633l.494.286c.41.213.742.48.993.797.316.398.532.877.642 1.422.113.557.113 1.223 0 1.978-.131.872-.39 1.631-.77 2.258a4.38 4.38 0 0 1-1.309 1.41c-.532.362-1.151.627-1.84.783-.67.152-1.42.228-2.229.228h-.529c-.4 0-.786.145-1.085.405-.3.26-.498.62-.558 1.013l-.033.196-.56 3.543-.025.137c-.06.393-.258.753-.558 1.013-.3.26-.687.405-1.085.405z" /></svg> }, { name: "Apple Pay", icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg> }, { name: "Google Pay", icon: <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg> }].map((pm) => (
          <button key={pm.name} type="button" className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${theme === "dark" ? "border-gray-700 hover:border-gray-600 text-gray-300" : "border-gray-200 hover:border-gray-300 text-gray-700"}`} aria-label={`Pay with ${pm.name}`}>{pm.icon}<span className="text-sm font-medium">{pm.name}</span></button>
        ))}
      </div>
    </div>
  )
}

function SecurityBadges({ theme }: { theme: Theme }) {
  return (
    <div className={`flex items-center justify-center gap-6 py-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} role="group" aria-label="Security certifications">
      <div className="flex items-center gap-2"><Shield className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>SSL Secured</span></div>
      <div className="flex items-center gap-2"><Lock className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>256-bit Encryption</span></div>
      <div className="flex items-center gap-2"><CreditCard className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>PCI Compliant</span></div>
    </div>
  )
}

function ErrorAlert({ message, theme, onDismiss }: { message: string; theme: Theme; onDismiss?: () => void }) {
  return (
    <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-200"}`} role="alert" aria-live="assertive">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1"><p className={`text-sm font-medium ${theme === "dark" ? "text-red-400" : "text-red-800"}`}>{message}</p></div>
        {onDismiss && <button onClick={onDismiss} className={`p-1 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-red-500/20" : "hover:bg-red-100"}`} aria-label="Dismiss error"><X className="h-4 w-4 text-red-500" /></button>}
      </div>
    </div>
  )
}

function SuccessMessage({ theme, email }: { theme: Theme; email: string }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6"><CheckCircle className="h-10 w-10 text-white" /></div>
      <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Check Your Email to Confirm Your Account</h2>
      <p className={`text-lg mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>We&apos;ve sent a confirmation link to <strong>{email}</strong>.</p>
      <p className={`text-sm mb-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Please check your inbox (and spam folder) and click the link to activate your account.</p>
      <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40">Continue to Sign In<ArrowRight className="h-5 w-5" /></Link>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SignupPage() {
  const router = useRouter()
  const [theme, toggleTheme, mounted] = useTheme()
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabaseClient()
  const { stripe, error: stripeError } = useStripePayment()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [validationState, setValidationState] = useState<FieldValidationState>(INITIAL_VALIDATION_STATE)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardError, setCardError] = useState<string | undefined>()

  const selectedPlan = PLANS.find((p) => p.id === formData.selectedPlan) || PLANS[1]
  const skipPayment = selectedPlan.monthlyPrice === 0

  const updateFormData = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [errors])

  const validateFieldRealtime = useCallback((field: keyof FieldValidationState, value: string) => {
    setValidationState((prev) => ({ ...prev, [field]: "validating" }))
    setTimeout(() => {
      let isValid = false
      let error: string | undefined
      switch (field) {
        case "fullName": isValid = value.trim().length >= 2; error = isValid ? undefined : "Name must be at least 2 characters"; break
        case "email": isValid = validateEmail(value); error = isValid ? undefined : "Please enter a valid email address"; break
        case "password": isValid = validatePassword(value).isValid; error = isValid ? undefined : "Password does not meet all requirements"; break
        case "confirmPassword": isValid = value === formData.password && value.length > 0; error = isValid ? undefined : "Passwords do not match"; break
        case "companyName": isValid = formData.accountType === "personal" || value.trim().length >= 2; error = isValid ? undefined : "Company name is required"; break
        case "phone": isValid = value.length === 0 || /^[\d\s\-+()]+$/.test(value); error = isValid ? undefined : "Please enter a valid phone number"; break
        case "cardholderName": isValid = value.trim().length >= 2; error = isValid ? undefined : "Cardholder name is required"; break
        case "billingAddress": isValid = value.trim().length >= 5; error = isValid ? undefined : "Please enter your street address"; break
        case "billingCity": isValid = value.trim().length >= 2; error = isValid ? undefined : "Please enter your city"; break
        case "billingState": isValid = value.trim().length >= 2; error = isValid ? undefined : "Please enter your state/province"; break
        case "billingZip": isValid = value.trim().length >= 3; error = isValid ? undefined : "Please enter your ZIP/postal code"; break
      }
      setValidationState((prev) => ({ ...prev, [field]: isValid ? "valid" : "invalid" }))
      if (error) setErrors((prev) => ({ ...prev, [field]: error }))
      else setErrors((prev) => ({ ...prev, [field]: undefined }))
    }, 300)
  }, [formData.password, formData.accountType])

  const handleFieldBlur = useCallback((field: keyof FieldValidationState) => {
    const value = formData[field as keyof FormData] as string
    if (value && value.length > 0) validateFieldRealtime(field, value)
  }, [formData, validateFieldRealtime])

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: FormErrors = {}
    if (step === 1) return true
    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      else if (formData.fullName.trim().length < 2) newErrors.fullName = "Name must be at least 2 characters"
      if (!formData.email.trim()) newErrors.email = "Email address is required"
      else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
      else if (!validatePassword(formData.password).isValid) newErrors.password = "Password does not meet all requirements (uppercase, lowercase, number, and special character)"
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
      if (formData.accountType === "business" && !formData.companyName.trim()) newErrors.companyName = "Company name is required for business accounts"
    }
    if (step === 3 && !skipPayment) {
      if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
      if (!formData.billingAddress.trim()) newErrors.billingAddress = "Street address is required"
      if (!formData.billingCity.trim()) newErrors.billingCity = "City is required"
      if (!formData.billingState.trim()) newErrors.billingState = "State/Province is required"
      if (!formData.billingZip.trim()) newErrors.billingZip = "ZIP/Postal code is required"
      if (!cardComplete) newErrors.payment = "Please enter valid card details"
    }
    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service"
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = "You must agree to the Privacy Policy"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, skipPayment, cardComplete])

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep === 2 && skipPayment) setCurrentStep(4)
      else setCurrentStep((prev) => Math.min(prev + 1, 4))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep, validateStep, skipPayment])

  const prevStep = useCallback(() => {
    if (currentStep === 4 && skipPayment) setCurrentStep(2)
    else setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep, skipPayment])

  const handleCardChange = useCallback((complete: boolean, error?: string) => {
    setCardComplete(complete)
    setCardError(error)
    if (errors.payment && complete) setErrors((prev) => ({ ...prev, payment: undefined }))
  }, [errors.payment])

  const handleSocialSignup = useCallback(async (provider: SocialProvider) => {
    if (!supabase) { setErrors({ general: "Authentication system not available. Please try again." }); return }
    setSocialLoading(provider)
    setErrors({})
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?plan=${formData.selectedPlan}&billing=${formData.billingCycle}`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : `Failed to sign up with ${provider}. Please try again.`
      console.error("Social signup error:", error)
      setErrors({ general: msg })
      setSocialLoading(null)
    }
    // NOTE: On success the browser is redirected by Supabase, so we intentionally
    // do NOT clear setSocialLoading here — the page will unmount.
  }, [supabase, formData.selectedPlan, formData.billingCycle])

  const handleSubmit = useCallback(async () => {
    if (!validateStep(4)) return
    if (!supabase) {
      setErrors({ general: "Authentication system is not available. Please refresh and try again." })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName || null,
            account_type: formData.accountType,
            phone: formData.phone || null,
            selected_plan: formData.selectedPlan,
            billing_cycle: formData.billingCycle,
            subscribe_marketing: formData.subscribeMarketing,
            enable_white_label: formData.enableWhiteLabel,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        // Map common Supabase error messages to user-friendly text
        const msg = authError.message || ""
        if (msg.includes("already registered") || msg.includes("already been registered")) {
          setErrors({ email: "This email is already registered. Please sign in instead." })
        } else if (msg.includes("valid email") || msg.includes("invalid")) {
          setErrors({ email: "Please enter a valid email address." })
        } else if (msg.includes("password")) {
          setErrors({ password: msg })
        } else {
          setErrors({ general: msg || "An error occurred during sign up. Please try again." })
        }
        return
      }

      // Supabase v2: when "Confirm email" is enabled the response includes a
      // user object but NO session.  When the email already exists Supabase may
      // return a user with an empty identities array (to prevent enumeration).
      if (authData?.user?.identities && authData.user.identities.length === 0) {
        setErrors({ email: "This email is already registered. Please sign in instead." })
        return
      }

      if (authData?.session) {
        // Email confirmation is disabled — the user is already authenticated.
        router.push("/login")
        return
      }

      // Email confirmation is required — show the confirmation notice.
      setIsSuccess(true)
    } catch (error: unknown) {
      console.error("Signup error:", error)
      const msg = error instanceof Error ? error.message : ""
      if (msg.includes("network") || msg.includes("fetch")) {
        setErrors({ general: "Network error. Please check your connection and try again." })
      } else {
        setErrors({ general: msg || "An unexpected error occurred. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
  }, [formData, supabase, validateStep, router])

  if (!mounted) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="h-8 w-8 text-red-500 animate-spin" aria-label="Loading" /></div>
  if (isSuccess) return <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}><Navigation theme={theme} toggleTheme={toggleTheme} /><main className="max-w-2xl mx-auto px-4 py-16"><SuccessMessage theme={theme} email={formData.email} /></main><Footer theme={theme} /></div>

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <main className="py-12 px-4" role="main">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Create Your Account</h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Get started with DomainPro in just a few steps</p>
          </div>
          <ProgressSteps currentStep={currentStep} skipPayment={skipPayment} theme={theme} />
          {errors.general && <div className="max-w-2xl mx-auto mb-6"><ErrorAlert message={errors.general} theme={theme} onDismiss={() => setErrors((prev) => ({ ...prev, general: undefined }))} /></div>}
          {supabaseError && <div className="max-w-2xl mx-auto mb-6"><ErrorAlert message={supabaseError} theme={theme} /></div>}

          <div className="transition-all duration-500">
            {currentStep === 1 && (
              <div>
                <BillingToggle billingCycle={formData.billingCycle} onChange={(cycle) => updateFormData("billingCycle", cycle)} theme={theme} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PLANS.map((plan) => <PricingCard key={plan.id} plan={plan} selected={formData.selectedPlan === plan.id} billingCycle={formData.billingCycle} onSelect={() => updateFormData("selectedPlan", plan.id)} theme={theme} />)}
                </div>
                <WhiteLabelUpsell enabled={formData.enableWhiteLabel} onToggle={() => updateFormData("enableWhiteLabel", !formData.enableWhiteLabel)} theme={theme} />
                <div className={`mt-8 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}><p className="text-sm">All plans include 30-day money-back guarantee</p></div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto">
                <div className={`p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Account Information</h2>
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Account Type</label>
                    <div className="flex gap-4" role="radiogroup" aria-label="Account type selection">
                      <button onClick={() => updateFormData("accountType", "personal")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${formData.accountType === "personal" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`} role="radio" aria-checked={formData.accountType === "personal"}>
                        <User className={`h-5 w-5 ${formData.accountType === "personal" ? "text-red-500" : ""}`} /><span className={formData.accountType === "personal" ? "text-red-500 font-medium" : ""}>Personal</span>
                      </button>
                      <button onClick={() => updateFormData("accountType", "business")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${formData.accountType === "business" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`} role="radio" aria-checked={formData.accountType === "business"}>
                        <Building2 className={`h-5 w-5 ${formData.accountType === "business" ? "text-red-500" : ""}`} /><span className={formData.accountType === "business" ? "text-red-500 font-medium" : ""}>Business</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormInput id="fullName" label="Full Name" value={formData.fullName} onChange={(v) => { updateFormData("fullName", v); if (v.length > 0) validateFieldRealtime("fullName", v) }} onBlur={() => handleFieldBlur("fullName")} error={errors.fullName} icon={<User className="h-5 w-5" />} placeholder="John Doe" required theme={theme} autoComplete="name" validationStatus={validationState.fullName} />
                    {formData.accountType === "business" && <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={(v) => { updateFormData("companyName", v); if (v.length > 0) validateFieldRealtime("companyName", v) }} onBlur={() => handleFieldBlur("companyName")} error={errors.companyName} icon={<Building2 className="h-5 w-5" />} placeholder="Acme Inc." required theme={theme} autoComplete="organization" validationStatus={validationState.companyName} />}
                    <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={(v) => { updateFormData("email", v); if (v.length > 0) validateFieldRealtime("email", v) }} onBlur={() => handleFieldBlur("email")} error={errors.email} icon={<Mail className="h-5 w-5" />} placeholder="john@example.com" required theme={theme} autoComplete="email" validationStatus={validationState.email} />
                    <FormInput id="password" label="Password" type="password" value={formData.password} onChange={(v) => { updateFormData("password", v); if (v.length > 0) validateFieldRealtime("password", v) }} onBlur={() => handleFieldBlur("password")} error={errors.password} icon={<Lock className="h-5 w-5" />} placeholder="Create a strong password" required theme={theme} autoComplete="new-password" showPasswordToggle validationStatus={validationState.password} ariaDescribedBy="password-requirements" />
                    <div id="password-requirements"><PasswordStrengthIndicator password={formData.password} theme={theme} /></div>
                    <FormInput id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(v) => { updateFormData("confirmPassword", v); if (v.length > 0) validateFieldRealtime("confirmPassword", v) }} onBlur={() => handleFieldBlur("confirmPassword")} error={errors.confirmPassword} icon={<Lock className="h-5 w-5" />} placeholder="Confirm your password" required theme={theme} autoComplete="new-password" showPasswordToggle validationStatus={validationState.confirmPassword} />
                    <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={(v) => { updateFormData("phone", v); if (v.length > 0) validateFieldRealtime("phone", v) }} onBlur={() => handleFieldBlur("phone")} error={errors.phone} icon={<Phone className="h-5 w-5" />} placeholder="+1 (555) 123-4567" theme={theme} autoComplete="tel" validationStatus={validationState.phone} />
                  </div>
                  <div className="mt-8"><SocialSignupButtons onSignup={handleSocialSignup} loadingProvider={socialLoading} theme={theme} disabled={supabaseLoading} /></div>
                </div>
              </div>
            )}

            {currentStep === 3 && !skipPayment && (
              <div className="max-w-2xl mx-auto">
                <div className="grid gap-6 lg:grid-cols-5">
                  <div className={`lg:col-span-3 p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                    <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Payment Details</h2>
                    {stripeError && <div className="mb-6"><ErrorAlert message={stripeError} theme={theme} /></div>}
                    <div className="space-y-4">
                      <FormInput id="cardholderName" label="Cardholder Name" value={formData.cardholderName} onChange={(v) => { updateFormData("cardholderName", v); if (v.length > 0) validateFieldRealtime("cardholderName", v) }} onBlur={() => handleFieldBlur("cardholderName")} error={errors.cardholderName} icon={<User className="h-5 w-5" />} placeholder="Name on card" required theme={theme} autoComplete="cc-name" validationStatus={validationState.cardholderName} />
                      <StripeCardForm stripe={stripe} theme={theme} onCardChange={handleCardChange} cardError={cardError || errors.payment} />
                      <div className={`pt-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Billing Address</h3>
                        <div className="space-y-4">
                          <FormInput id="billingAddress" label="Street Address" value={formData.billingAddress} onChange={(v) => { updateFormData("billingAddress", v); if (v.length > 0) validateFieldRealtime("billingAddress", v) }} onBlur={() => handleFieldBlur("billingAddress")} error={errors.billingAddress} icon={<Home className="h-5 w-5" />} placeholder="123 Main Street" required theme={theme} autoComplete="street-address" validationStatus={validationState.billingAddress} />
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput id="billingCity" label="City" value={formData.billingCity} onChange={(v) => { updateFormData("billingCity", v); if (v.length > 0) validateFieldRealtime("billingCity", v) }} onBlur={() => handleFieldBlur("billingCity")} error={errors.billingCity} icon={<MapPin className="h-5 w-5" />} placeholder="New York" required theme={theme} autoComplete="address-level2" validationStatus={validationState.billingCity} />
                            <FormInput id="billingState" label="State / Province" value={formData.billingState} onChange={(v) => { updateFormData("billingState", v); if (v.length > 0) validateFieldRealtime("billingState", v) }} onBlur={() => handleFieldBlur("billingState")} error={errors.billingState} placeholder="NY" required theme={theme} autoComplete="address-level1" validationStatus={validationState.billingState} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput id="billingZip" label="ZIP / Postal Code" value={formData.billingZip} onChange={(v) => { updateFormData("billingZip", v); if (v.length > 0) validateFieldRealtime("billingZip", v) }} onBlur={() => handleFieldBlur("billingZip")} error={errors.billingZip} icon={<Hash className="h-5 w-5" />} placeholder="10001" required theme={theme} autoComplete="postal-code" validationStatus={validationState.billingZip} />
                            <div className="space-y-1">
                              <label htmlFor="billingCountry" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Country <span className="text-red-500">*</span></label>
                              <select id="billingCountry" value={formData.billingCountry} onChange={(e) => updateFormData("billingCountry", e.target.value)} className={`w-full px-4 py-3 rounded-xl border transition-all ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white focus:border-red-500" : "bg-white border-gray-300 text-gray-900 focus:border-red-500"} focus:outline-none focus:ring-4 focus:ring-red-500/20`} required aria-required="true">
                                {COUNTRIES.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <PaymentMethodButtons theme={theme} />
                      <SecurityBadges theme={theme} />
                    </div>
                  </div>
                  <div className="lg:col-span-2"><OrderSummary plan={selectedPlan} billingCycle={formData.billingCycle} theme={theme} enableWhiteLabel={formData.enableWhiteLabel} /></div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="max-w-2xl mx-auto">
                <div className={`p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Review Your Order</h2>
                  <OrderSummary plan={selectedPlan} billingCycle={formData.billingCycle} theme={theme} enableWhiteLabel={formData.enableWhiteLabel} />
                  <div className={`mt-6 p-4 rounded-xl ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
                    <h3 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Account Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Name</span><span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.fullName}</span></div>
                      <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Email</span><span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.email}</span></div>
                      {formData.companyName && <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Company</span><span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formData.companyName}</span></div>}
                      <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Account Type</span><span className={`capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.accountType}</span></div>
                      <div className="flex justify-between"><span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>White‑label add‑on</span><span className={`font-medium ${formData.enableWhiteLabel ? "text-green-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.enableWhiteLabel ? `Enabled — $${WHITE_LABEL_PRICE_MONTHLY}/mo` : "Off"}</span></div>
                    </div>
                  </div>
                  {!skipPayment && (
                    <div className={`mt-4 p-4 rounded-xl ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
                      <h3 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Payment Method</h3>
                      <div className="flex items-center gap-3"><CreditCard className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} /><span className={theme === "dark" ? "text-white" : "text-gray-900"}>Card ending in ****</span></div>
                      <div className="mt-2"><span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Billing: {formData.billingCity}, {formData.billingState} {formData.billingZip}</span></div>
                    </div>
                  )}
                  <div className="space-y-4 mt-8 mb-8">
                    <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onChange={(v) => updateFormData("agreeToTerms", v)} error={errors.agreeToTerms} theme={theme} label={<>I agree to the <Link href="/legal/terms" className="text-red-500 hover:text-red-400 underline">Terms of Service</Link><span className="text-red-500 ml-1">*</span></>} />
                    <Checkbox id="agreeToPrivacy" checked={formData.agreeToPrivacy} onChange={(v) => updateFormData("agreeToPrivacy", v)} error={errors.agreeToPrivacy} theme={theme} label={<>I agree to the <Link href="/legal/privacy" className="text-red-500 hover:text-red-400 underline">Privacy Policy</Link><span className="text-red-500 ml-1">*</span></>} />
                    <Checkbox id="subscribeMarketing" checked={formData.subscribeMarketing} onChange={(v) => updateFormData("subscribeMarketing", v)} theme={theme} label="Send me product updates, tips, and exclusive offers" />
                  </div>
                  <button onClick={handleSubmit} disabled={isLoading || supabaseLoading} className={`w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 ${isLoading ? "" : "hover:shadow-red-500/40"}`} aria-busy={isLoading} aria-disabled={isLoading || supabaseLoading}>
                    {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Creating Account...</> : <><Sparkles className="h-5 w-5" />Create Account{!skipPayment && selectedPlan.monthlyPrice > 0 && <span>{" — $"}{formatPrice(formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice)}</span>}</>}
                  </button>
                  <p className={`text-xs text-center mt-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>🔒 Your information is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto mt-10 flex items-center justify-between">
            {currentStep > 1 ? <button onClick={prevStep} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`} aria-label="Go back to previous step"><ArrowLeft className="h-5 w-5" />Back</button> : <div />}
            {currentStep < 4 && <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40" aria-label="Continue to next step">Continue<ArrowRight className="h-5 w-5" /></button>}
          </div>
          <p className={`text-center mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Already have an account? <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold">Sign in</Link></p>
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  )
}
