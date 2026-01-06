"use client"

// ============================================================================
// DOMAINPRO MULTI-STEP CHECKOUT PAGE
// Complete E-Commerce Checkout with Authentication, Step Flow, Payment Validation
// Features: 4-Step Flow, Real Card Validation, Multiple Payment Methods, Upsells
// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Globe, Check, X, ShoppingCart, CreditCard, Lock, Shield, ShieldCheck,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Sun, Moon, Menu,
  Loader2, AlertCircle, Trash2, Plus, Minus, Tag, Mail, Building, Phone,
  MapPin, User, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Info,
  Sparkles, Crown, Server, Cloud, HardDrive, Database, Headphones, Users,
  Activity, Code, MessageCircle, RefreshCw, BarChart3, Network, Layers,
  Zap, Star, Gift, Clock, Package, Twitter, Instagram, Facebook,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Theme = "light" | "dark"
type ProductType = "domain" | "protection" | "hosting" | "email" | "ssl" | "builder" | "addon"
type PaymentMethod = "card" | "paypal" | "applepay" | "googlepay"
type CheckoutStep = 1 | 2 | 3 | 4

interface CartItem {
  id: string
  type: ProductType
  name: string
  description?: string
  price: number
  originalPrice?: number
  period: string
  quantity: number
  domain?: string
  features?: string[]
}

interface BillingInfo {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  country: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
}

interface CardInfo {
  number: string
  expiry: string
  cvc: string
  name: string
  zip: string
}

interface FormErrors {
  [key: string]: string | undefined
}

interface UpsellProduct {
  id: string
  type: ProductType
  name: string
  description: string
  price: number
  originalPrice?: number
  period: string
  features: string[]
  badge?: string
  popular?: boolean
  icon: React.ReactNode
  color: string
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

// ============================================================================
// CONSTANTS
// ============================================================================

const STEP_LABELS = ["Order Summary", "Recommended", "Billing", "Payment"]

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
]

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
]

const UPSELL_PRODUCTS: UpsellProduct[] = [
  // WHOIS Privacy
  {
    id: "whois-privacy",
    type: "protection",
    name: "WHOIS Privacy Protection",
    description: "Keep your personal information hidden from public WHOIS lookups",
    price: 0,
    originalPrice: 9.99,
    period: "year",
    features: ["Hide name, address & phone from WHOIS", "Prevent spam and unwanted contact", "Protect against identity theft", "Stay compliant with registration rules"],
    badge: "FREE 1st Year!",
    popular: true,
    icon: <Shield className="h-8 w-8" />,
    color: "from-green-500 to-emerald-600",
  },
  // Hosting Plans
  {
    id: "hosting-starter",
    type: "hosting",
    name: "Starter Hosting",
    description: "Perfect for personal websites and blogs",
    price: 3.99,
    period: "month",
    features: ["10GB SSD Storage", "1 Website", "Free SSL Certificate", "10 Email Accounts", "24/7 Support"],
    icon: <Server className="h-8 w-8" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "hosting-business",
    type: "hosting",
    name: "Business Hosting",
    description: "Ideal for growing businesses",
    price: 9.99,
    period: "month",
    features: ["50GB SSD Storage", "5 Websites", "Free SSL + CDN", "Unlimited Email", "Priority Support", "Daily Backups"],
    badge: "Most Popular",
    popular: true,
    icon: <Server className="h-8 w-8" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "hosting-pro",
    type: "hosting",
    name: "Pro Hosting",
    description: "For high-traffic sites",
    price: 19.99,
    period: "month",
    features: ["Unlimited Storage", "Unlimited Websites", "Premium SSL + CDN", "Unlimited Email", "Dedicated Support", "Staging Environment"],
    icon: <Server className="h-8 w-8" />,
    color: "from-indigo-500 to-indigo-600",
  },
  // Email Plans
  {
    id: "email-basic",
    type: "email",
    name: "Basic Email",
    description: "Professional email for individuals",
    price: 2.99,
    period: "month",
    features: ["2 Mailboxes", "10GB Storage Each", "Webmail Access", "Mobile Apps", "Spam Protection"],
    icon: <Mail className="h-8 w-8" />,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "email-business",
    type: "email",
    name: "Business Email",
    description: "For small teams",
    price: 5.99,
    period: "month",
    features: ["10 Mailboxes", "25GB Storage Each", "Custom Aliases", "Calendar & Contacts", "Advanced Security"],
    badge: "Best Value",
    popular: true,
    icon: <Mail className="h-8 w-8" />,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "email-enterprise",
    type: "email",
    name: "Enterprise Email",
    description: "For large organizations",
    price: 12.99,
    period: "month",
    features: ["Unlimited Mailboxes", "50GB Storage Each", "Archive & Compliance", "Admin Console", "SSO Integration"],
    icon: <Mail className="h-8 w-8" />,
    color: "from-emerald-500 to-emerald-600",
  },
  // SSL Certificates
  {
    id: "ssl-basic",
    type: "ssl",
    name: "Basic SSL",
    description: "Standard domain encryption",
    price: 0,
    period: "year",
    features: ["Domain Validation", "256-bit Encryption", "Browser Trust", "Auto-Renewal"],
    badge: "FREE",
    icon: <Lock className="h-8 w-8" />,
    color: "from-lime-500 to-lime-600",
  },
  {
    id: "ssl-wildcard",
    type: "ssl",
    name: "Wildcard SSL",
    description: "Secure unlimited subdomains",
    price: 79.99,
    period: "year",
    features: ["All Subdomains Covered", "Organization Validation", "$250K Warranty", "Site Seal Badge"],
    popular: true,
    icon: <Lock className="h-8 w-8" />,
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "ssl-ev",
    type: "ssl",
    name: "Extended Validation SSL",
    description: "Maximum trust for e-commerce",
    price: 199.99,
    period: "year",
    features: ["Green Address Bar", "Full Company Verification", "$1.75M Warranty", "Premium Site Seal"],
    icon: <Lock className="h-8 w-8" />,
    color: "from-orange-500 to-orange-600",
  },
  // Website Builder
  {
    id: "builder-basic",
    type: "builder",
    name: "Basic Website Builder",
    description: "Simple websites made easy",
    price: 9.99,
    period: "month",
    features: ["50+ Templates", "Drag & Drop Editor", "Mobile Responsive", "SEO Tools", "Analytics"],
    icon: <Layers className="h-8 w-8" />,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "builder-pro",
    type: "builder",
    name: "Pro Website Builder",
    description: "E-commerce ready",
    price: 19.99,
    period: "month",
    features: ["E-commerce Store", "Custom Code Access", "Advanced SEO", "Priority Support", "Unlimited Pages"],
    badge: "E-Commerce Ready",
    popular: true,
    icon: <Layers className="h-8 w-8" />,
    color: "from-rose-500 to-rose-600",
  },
  {
    id: "builder-agency",
    type: "builder",
    name: "Agency Website Builder",
    description: "For web professionals",
    price: 49.99,
    period: "month",
    features: ["Client Management", "White Label", "Team Collaboration", "API Access", "Dedicated Support"],
    icon: <Layers className="h-8 w-8" />,
    color: "from-red-500 to-red-600",
  },
]

const DEFAULT_BILLING: BillingInfo = {
  firstName: "", lastName: "", company: "", email: "", phone: "",
  country: "US", address1: "", address2: "", city: "", state: "", zip: "",
}

const DEFAULT_CARD: CardInfo = {
  number: "", expiry: "", cvc: "", name: "", zip: "",
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Domains",
    dropdown: [
      { label: "Domain Search", href: "/domains", icon: <Globe className="h-4 w-4" />, description: "Find your perfect domain" },
      { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
      { label: "Bulk Registration", href: "/domains/bulk", icon: <Layers className="h-4 w-4" />, description: "Register multiple domains" },
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
    ],
  },
  {
    label: "Services",
    dropdown: [
      { label: "SSL Certificates", href: "/services/ssl", icon: <ShieldCheck className="h-4 w-4" />, description: "Secure your website" },
      { label: "Email Hosting", href: "/services/email", icon: <Mail className="h-4 w-4" />, description: "Professional email" },
      { label: "Website Builder", href: "/services/builder", icon: <Layers className="h-4 w-4" />, description: "Build without code" },
    ],
  },
  {
    label: "Security",
    dropdown: [
      { label: "DDoS Protection", href: "/security/ddos", icon: <Shield className="h-4 w-4" />, description: "Attack mitigation" },
      { label: "Backup Services", href: "/security/backup", icon: <HardDrive className="h-4 w-4" />, description: "Automated backups" },
    ],
  },
  {
    label: "Support",
    dropdown: [
      { label: "Help Center", href: "/support/help", icon: <Headphones className="h-4 w-4" />, description: "Browse articles" },
      { label: "Contact Us", href: "/support/contact", icon: <MessageCircle className="h-4 w-4" />, description: "Get in touch" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
]

const FOOTER_SECTIONS: FooterSection[] = [
  { title: "DOMAINS", links: [{ label: "Domain Search", href: "/domains" }, { label: "Domain Transfer", href: "/domains/transfer" }, { label: "Bulk Registration", href: "/domains/bulk" }] },
  { title: "HOSTING", links: [{ label: "Web Hosting", href: "/hosting/web" }, { label: "WordPress Hosting", href: "/hosting/wordpress" }, { label: "VPS Hosting", href: "/hosting/vps" }] },
  { title: "SERVICES", links: [{ label: "SSL Certificates", href: "/services/ssl" }, { label: "Email Hosting", href: "/services/email" }, { label: "Website Builder", href: "/services/builder" }] },
  { title: "SECURITY", links: [{ label: "DDoS Protection", href: "/security/ddos" }, { label: "Backup Services", href: "/security/backup" }] },
  { title: "COMPANY", links: [{ label: "About Us", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Careers", href: "/careers" }] },
  { title: "SUPPORT", links: [{ label: "Help Center", href: "/support/help" }, { label: "Contact Us", href: "/support/contact" }] },
  { title: "LEGAL", links: [{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }] },
]

// Sample cart items for demo
const SAMPLE_CART: CartItem[] = [
  { id: "domain-1", type: "domain", name: "myawesomesite.com", price: 12.99, period: "year", quantity: 1 },
  { id: "domain-2", type: "domain", name: "myawesomesite.io", price: 39.99, period: "year", quantity: 1 },
]

// ============================================================================
// UTILITY FUNCTIONS - VALIDATION
// ============================================================================

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{10,}$/.test(phone.replace(/\s/g, ""))
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

// Luhn Algorithm for card number validation
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// Detect card type from number
function getCardType(number: string): string {
  const cleaned = number.replace(/\D/g, "")
  
  if (/^4/.test(cleaned)) return "visa"
  if (/^5[1-5]/.test(cleaned)) return "mastercard"
  if (/^3[47]/.test(cleaned)) return "amex"
  if (/^6(?:011|5)/.test(cleaned)) return "discover"
  if (/^35(?:2[89]|[3-8])/.test(cleaned)) return "jcb"
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return "diners"
  
  return "unknown"
}

// Get expected card number length
function getCardLength(cardType: string): number {
  if (cardType === "amex") return 15
  if (cardType === "diners") return 14
  return 16
}

// Get expected CVC length
function getCVCLength(cardType: string): number {
  return cardType === "amex" ? 4 : 3
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const cardType = getCardType(cleaned)
  
  if (cardType === "amex") {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3").trim()
  }
  
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

// Format expiry date
function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + (cleaned.length > 2 ? " / " + cleaned.slice(2, 4) : "")
  }
  return cleaned
}

// Validate expiry date
function validateExpiry(expiry: string): boolean {
  const cleaned = expiry.replace(/\D/g, "")
  if (cleaned.length !== 4) return false
  
  const month = parseInt(cleaned.slice(0, 2), 10)
  const year = parseInt("20" + cleaned.slice(2, 4), 10)
  
  if (month < 1 || month > 12) return false
  
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

// Validate CVC
function validateCVC(cvc: string, cardType: string): boolean {
  const cleaned = cvc.replace(/\D/g, "")
  const expectedLength = getCVCLength(cardType)
  return cleaned.length === expectedLength
}

// Validate entire card
function validateCard(card: CardInfo): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {}
  const cardType = getCardType(card.number)
  const cleanNumber = card.number.replace(/\D/g, "")
  
  if (!cleanNumber) {
    errors.cardNumber = "Card number is required"
  } else if (!luhnCheck(cleanNumber)) {
    errors.cardNumber = "Invalid card number"
  } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    errors.cardNumber = "Card number must be 13-19 digits"
  }
  
  if (!card.expiry) {
    errors.cardExpiry = "Expiration date is required"
  } else if (!validateExpiry(card.expiry)) {
    errors.cardExpiry = "Invalid or expired date"
  }
  
  if (!card.cvc) {
    errors.cardCVC = "Security code is required"
  } else if (!validateCVC(card.cvc, cardType)) {
    errors.cardCVC = `CVC must be ${getCVCLength(cardType)} digits`
  }
  
  if (!card.name.trim()) {
    errors.cardName = "Cardholder name is required"
  }
  
  if (!card.zip.trim()) {
    errors.cardZip = "ZIP code is required"
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

function calculateTax(subtotal: number, country: string, state: string): number {
  const taxRates: { [key: string]: number } = {
    "US-CA": 0.0725, "US-NY": 0.08, "US-TX": 0.0625, "US-FL": 0.06,
    "CA": 0.05, "GB": 0.20, "DE": 0.19, "AU": 0.10,
  }
  const key = country === "US" ? `${country}-${state}` : country
  return subtotal * (taxRates[key] || 0)
}

function getProductIcon(type: ProductType) {
  switch (type) {
    case "domain": return <Globe className="h-5 w-5" />
    case "protection": return <Shield className="h-5 w-5" />
    case "hosting": return <Server className="h-5 w-5" />
    case "email": return <Mail className="h-5 w-5" />
    case "ssl": return <Lock className="h-5 w-5" />
    case "builder": return <Layers className="h-5 w-5" />
    default: return <Package className="h-5 w-5" />
  }
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useTheme(): [Theme, () => void, boolean] {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("theme") as Theme | null
      if (saved === "light" || saved === "dark") setTheme(saved)
      else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light")
    } catch (e) { console.error(e) }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark"
      try { localStorage.setItem("theme", next) } catch (e) { console.error(e) }
      return next
    })
  }, [])

  return [theme, toggleTheme, mounted]
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch (e) { console.error(e) }
  }, [key])

  const setStored = useCallback((v: T | ((p: T) => T)) => {
    setValue(prev => {
      const next = v instanceof Function ? v(prev) : v
      try { localStorage.setItem(key, JSON.stringify(next)) } catch (e) { console.error(e) }
      return next
    })
  }, [key])

  return [value, setStored]
}

function useSupabaseAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        setUser(currentSession?.user || null)
      } catch (e) {
        console.error("Auth check failed:", e)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  return { session, user, loading }
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

function ThemeToggle({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

function NavDropdown({ item, theme, isOpen, onToggle, onClose }: { item: NavItem; theme: Theme; isOpen: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen, onClose])

  if (!item.dropdown) return <Link href={item.href || "#"} className={`font-medium ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{item.label}</Link>

  return (
    <div className="relative" ref={ref}>
      <button onClick={onToggle} className={`flex items-center gap-1 font-medium ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
        {item.label}{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="p-2">
            {item.dropdown.map(di => (
              <Link key={di.href} href={di.href} className={`flex items-start gap-3 p-3 rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`} onClick={onClose}>
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>{di.icon}</div>
                <div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{di.label}</div>
                  {di.description && <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{di.description}</div>}
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (label: string) => setExpanded(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n })

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}><Globe className="h-8 w-8 text-red-500" /><span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-6 w-6" /></button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {NAV_ITEMS.map(item => (
          <div key={item.label} className="mb-2">
            {item.dropdown ? (
              <>
                <button onClick={() => toggle(item.label)} className={`w-full flex items-center justify-between p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>
                  {item.label}{expanded.has(item.label) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {expanded.has(item.label) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map(di => <Link key={di.href} href={di.href} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"}`} onClick={onClose}><span className="text-red-400">{di.icon}</span>{di.label}</Link>)}
                  </div>
                )}
              </>
            ) : <Link href={item.href || "#"} className={`block p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`} onClick={onClose}>{item.label}</Link>}
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-700"><Link href="/login" className="block w-full p-3 text-center font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl" onClick={onClose}>Sign In</Link></div>
      </nav>
    </div>
  )
}

function Navigation({ theme, toggleTheme, cartCount }: { theme: Theme; toggleTheme: () => void; cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative"><Globe className="h-8 w-8 text-red-500" /><div className="absolute inset-0 h-8 w-8 bg-red-500 blur-lg opacity-30 animate-pulse" /></div>
            <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => <NavDropdown key={item.label} item={item} theme={theme} isOpen={openDropdown === item.label} onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} onClose={() => setOpenDropdown(null)} />)}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link href="/checkout" className={`relative p-2 rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <Link href="/login" className={`hidden sm:flex px-4 py-2 rounded-lg font-bold ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>Sign In</Link>
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileOpen(true)}><Menu className="h-6 w-6" /></button>
          </div>
        </div>
      </div>
      <MobileMenu theme={theme} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

function Footer({ theme }: { theme: Theme }) {
  return (
    <footer className={`border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{section.title}</h3>
              <ul className="space-y-3">{section.links.map(link => <li key={link.href}><Link href={link.href} className={`text-sm ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{link.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={`pt-8 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2"><Globe className="h-6 w-6 text-red-500" /><span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
              <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>© {new Date().getFullYear()} DomainPro</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className={`p-2 rounded-lg ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}><Twitter className="h-5 w-5" /></a>
              <a href="#" className={`p-2 rounded-lg ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}><Instagram className="h-5 w-5" /></a>
              <a href="#" className={`p-2 rounded-lg ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

function FormInput({ id, label, type = "text", value, onChange, error, icon, placeholder, required, theme, autoComplete, disabled, maxLength }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; icon?: React.ReactNode; placeholder?: string; required?: boolean; theme: Theme; autoComplete?: string; disabled?: boolean; maxLength?: number }) {
  const [showPw, setShowPw] = useState(false)
  const inputType = type === "password" && showPw ? "text" : type

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative">
        {icon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{icon}</div>}
        <input id={id} type={inputType} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} required={required} disabled={disabled} maxLength={maxLength} className={`w-full px-4 py-3 rounded-xl border transition-all ${icon ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""} ${error ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-red-500"} focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50`} />
        {type === "password" && <button type="button" onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </div>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

function FormSelect({ id, label, value, onChange, options, error, required, theme, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { code: string; name: string }[]; error?: string; required?: boolean; theme: Theme; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
      </select>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

function StepIndicator({ currentStep, theme }: { currentStep: CheckoutStep; theme: Theme }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEP_LABELS.map((label, index) => {
          const step = (index + 1) as CheckoutStep
          const isActive = step === currentStep
          const isComplete = step < currentStep

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${isComplete ? "bg-green-500 text-white" : isActive ? "bg-red-500 text-white ring-4 ring-red-500/30" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                  {isComplete ? <Check className="h-5 w-5" /> : step}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? "text-red-500" : isComplete ? "text-green-500" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{label}</span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step < currentStep ? "bg-green-500" : theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// STEP 1: ORDER SUMMARY
// ============================================================================

function Step1OrderSummary({ theme, cart, onUpdateQty, onRemove, subtotal, onContinue }: { theme: Theme; cart: CartItem[]; onUpdateQty: (id: string, qty: number) => void; onRemove: (id: string) => void; subtotal: number; onContinue: () => void }) {
  if (cart.length === 0) {
    return (
      <div className={`p-12 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <ShoppingCart className={`h-20 w-20 mx-auto mb-6 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your Cart is Empty</h2>
        <p className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Find your perfect domain to get started</p>
        <Link href="/domains" className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
          <Globe className="h-5 w-5" />Search Domains
        </Link>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className={`p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <ShoppingCart className="h-6 w-6 text-red-500" />Order Summary
        </h2>
      </div>

      <div className="divide-y divide-gray-700">
        {cart.map(item => (
          <div key={item.id} className="p-6 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
              {getProductIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.name}</div>
              {item.description && <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{item.description}</div>}
              <div className="flex items-center gap-4 mt-3">
                <div className={`flex items-center rounded-lg border ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
                  <button onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-white/10"><Minus className="h-4 w-4" /></button>
                  <span className={`px-3 font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="p-2 hover:bg-white/10"><Plus className="h-4 w-4" /></button>
                </div>
                <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>/{item.period}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(item.price * item.quantity)}</div>
              <button onClick={() => onRemove(item.id)} className="mt-2 text-red-500 hover:text-red-400 text-sm flex items-center gap-1 ml-auto"><Trash2 className="h-4 w-4" />Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-6 border-t ${theme === "dark" ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}>
        <div className="flex items-center justify-between mb-6">
          <span className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Subtotal</span>
          <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(subtotal)}</span>
        </div>
        <button onClick={onContinue} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
          Continue<ArrowRight className="h-5 w-5" />
        </button>
        <Link href="/domains" className={`block text-center mt-4 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
          <ArrowLeft className="h-4 w-4 inline mr-1" />Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// STEP 2: RECOMMENDED UPSELLS (REVENUE CRITICAL)
// ============================================================================

function UpsellCard({ product, theme, isAdded, onAdd }: { product: UpsellProduct; theme: Theme; isAdded: boolean; onAdd: () => void }) {
  return (
    <div className={`relative p-6 rounded-2xl border-2 transition-all ${product.popular ? "ring-2 ring-red-500/50" : ""} ${isAdded ? "border-green-500 bg-green-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600 bg-gray-800/50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
      {product.badge && (
        <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${product.color}`}>
          {product.badge}
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${product.color} text-white`}>
          {product.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.name}</h3>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{product.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${product.price === 0 ? "text-green-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {product.price === 0 ? "FREE" : formatPrice(product.price)}
          </span>
          {product.price > 0 && <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/{product.period}</span>}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={`text-sm line-through ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {product.features.slice(0, 4).map((feature, i) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />{feature}
          </li>
        ))}
      </ul>

      <button onClick={onAdd} disabled={isAdded} className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isAdded ? "bg-green-500 text-white cursor-default" : `bg-gradient-to-r ${product.color} text-white hover:opacity-90`}`}>
        {isAdded ? <><Check className="h-5 w-5" />Added to Cart</> : <><Plus className="h-5 w-5" />Add to Cart</>}
      </button>
    </div>
  )
}

function Step2Upsells({ theme, cart, onAddProduct, onContinue, onBack }: { theme: Theme; cart: CartItem[]; onAddProduct: (product: UpsellProduct) => void; onContinue: () => void; onBack: () => void }) {
  const addedIds = useMemo(() => new Set(cart.map(i => i.id)), [cart])

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: UpsellProduct[] } = {
      protection: [], hosting: [], email: [], ssl: [], builder: []
    }
    UPSELL_PRODUCTS.forEach(p => {
      if (groups[p.type]) groups[p.type].push(p)
    })
    return groups
  }, [])

  const sectionOrder = [
    { key: "protection", title: "🛡️ Protect Your Privacy", subtitle: "Keep your personal information hidden from public WHOIS lookups" },
    { key: "hosting", title: "🚀 Web Hosting", subtitle: "Get your website online with reliable, fast hosting" },
    { key: "email", title: "📧 Professional Email", subtitle: "Get email@yourdomain.com for a professional look" },
    { key: "ssl", title: "🔒 SSL Certificates", subtitle: "Secure your website and build trust with visitors" },
    { key: "builder", title: "🎨 Website Builder", subtitle: "Create a stunning website without any coding" },
  ]

  return (
    <div className="space-y-12">
      {/* Prominent Header */}
      <div className={`p-8 rounded-2xl text-center ${theme === "dark" ? "bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/30" : "bg-gradient-to-br from-red-50 to-purple-50 border border-red-200"}`}>
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Complete Your Online Presence</h2>
        <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Add these recommended services to maximize your success</p>
      </div>

      {sectionOrder.map(section => {
        const products = groupedProducts[section.key]
        if (!products || products.length === 0) return null

        return (
          <div key={section.key}>
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{section.title}</h3>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{section.subtitle}</p>
            </div>
            <div className={`grid gap-6 ${products.length === 1 ? "grid-cols-1 max-w-md" : products.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {products.map(product => (
                <UpsellCard key={product.id} product={product} theme={theme} isAdded={addedIds.has(product.id)} onAdd={() => onAddProduct(product)} />
              ))}
            </div>
          </div>
        )
      })}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
          <ArrowLeft className="h-5 w-5" />Back to Cart
        </button>
        <button onClick={onContinue} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
          Continue to Billing<ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// STEP 3: BILLING ADDRESS
// ============================================================================

function Step3Billing({ theme, billing, setBilling, errors, onContinue, onBack }: { theme: Theme; billing: BillingInfo; setBilling: (b: BillingInfo) => void; errors: FormErrors; onContinue: () => void; onBack: () => void }) {
  const update = (field: keyof BillingInfo, value: string) => setBilling({ ...billing, [field]: value })

  return (
    <div className={`p-6 md:p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <MapPin className="h-6 w-6 text-red-500" />Billing Information
      </h2>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput id="firstName" label="First Name" value={billing.firstName} onChange={v => update("firstName", v)} error={errors.firstName} icon={<User className="h-5 w-5" />} placeholder="John" required theme={theme} />
          <FormInput id="lastName" label="Last Name" value={billing.lastName} onChange={v => update("lastName", v)} error={errors.lastName} icon={<User className="h-5 w-5" />} placeholder="Doe" required theme={theme} />
        </div>

        <FormInput id="email" label="Email Address" type="email" value={billing.email} onChange={v => update("email", v)} error={errors.email} icon={<Mail className="h-5 w-5" />} placeholder="john@example.com" required theme={theme} />

        <FormInput id="company" label="Company (Optional)" value={billing.company} onChange={v => update("company", v)} icon={<Building className="h-5 w-5" />} placeholder="Your company" theme={theme} />

        <FormSelect id="country" label="Country" value={billing.country} onChange={v => update("country", v)} options={COUNTRIES} required theme={theme} />

        <FormInput id="address1" label="Address Line 1" value={billing.address1} onChange={v => update("address1", v)} error={errors.address1} icon={<MapPin className="h-5 w-5" />} placeholder="123 Main Street" required theme={theme} />

        <FormInput id="address2" label="Address Line 2 (Optional)" value={billing.address2} onChange={v => update("address2", v)} icon={<MapPin className="h-5 w-5" />} placeholder="Apt, Suite, etc." theme={theme} />

        <div className="grid md:grid-cols-3 gap-4">
          <FormInput id="city" label="City" value={billing.city} onChange={v => update("city", v)} error={errors.city} placeholder="New York" required theme={theme} />
          {billing.country === "US" ? (
            <FormSelect id="state" label="State" value={billing.state} onChange={v => update("state", v)} options={US_STATES} error={errors.state} required theme={theme} placeholder="Select state" />
          ) : (
            <FormInput id="state" label="State/Province" value={billing.state} onChange={v => update("state", v)} error={errors.state} placeholder="State" required theme={theme} />
          )}
          <FormInput id="zip" label="ZIP/Postal Code" value={billing.zip} onChange={v => update("zip", v)} error={errors.zip} placeholder="10001" required theme={theme} />
        </div>

        <FormInput id="phone" label="Phone Number" type="tel" value={billing.phone} onChange={v => update("phone", v)} error={errors.phone} icon={<Phone className="h-5 w-5" />} placeholder="+1 (555) 123-4567" required theme={theme} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button onClick={onBack} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
          <ArrowLeft className="h-5 w-5" />Back
        </button>
        <button onClick={onContinue} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
          Continue to Payment<ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// STEP 4: PAYMENT
// ============================================================================

function CardInput({ theme, card, setCard, errors }: { theme: Theme; card: CardInfo; setCard: (c: CardInfo) => void; errors: FormErrors }) {
  const cardType = getCardType(card.number)

  const handleNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    if (formatted.replace(/\s/g, "").length <= 19) {
      setCard({ ...card, number: formatted })
    }
  }

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value)
    if (formatted.replace(/\D/g, "").length <= 4) {
      setCard({ ...card, expiry: formatted })
    }
  }

  const handleCVCChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const maxLen = getCVCLength(cardType)
    if (cleaned.length <= maxLen) {
      setCard({ ...card, cvc: cleaned })
    }
  }

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div className="space-y-1">
        <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Card Number<span className="text-red-500 ml-1">*</span></label>
        <div className="relative">
          <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
          <input type="text" value={card.number} onChange={e => handleNumberChange(e.target.value)} placeholder="1234 5678 9012 3456" className={`w-full pl-10 pr-20 py-3 rounded-xl border ${errors.cardNumber ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`} />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <div className={`w-8 h-5 rounded ${cardType === "visa" ? "bg-blue-600" : "bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>V</div>
            <div className={`w-8 h-5 rounded ${cardType === "mastercard" ? "bg-orange-500" : "bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>M</div>
            <div className={`w-8 h-5 rounded ${cardType === "amex" ? "bg-blue-400" : "bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>A</div>
          </div>
        </div>
        {errors.cardNumber && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Expiry */}
        <div className="space-y-1">
          <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Expiry Date<span className="text-red-500 ml-1">*</span></label>
          <input type="text" value={card.expiry} onChange={e => handleExpiryChange(e.target.value)} placeholder="MM / YY" className={`w-full px-4 py-3 rounded-xl border ${errors.cardExpiry ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`} />
          {errors.cardExpiry && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.cardExpiry}</p>}
        </div>

        {/* CVC */}
        <div className="space-y-1">
          <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>CVC<span className="text-red-500 ml-1">*</span></label>
          <input type="text" value={card.cvc} onChange={e => handleCVCChange(e.target.value)} placeholder={cardType === "amex" ? "1234" : "123"} className={`w-full px-4 py-3 rounded-xl border ${errors.cardCVC ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`} />
          {errors.cardCVC && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.cardCVC}</p>}
        </div>
      </div>

      {/* Name on Card */}
      <div className="space-y-1">
        <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Name on Card<span className="text-red-500 ml-1">*</span></label>
        <input type="text" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="John Doe" className={`w-full px-4 py-3 rounded-xl border ${errors.cardName ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`} />
        {errors.cardName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.cardName}</p>}
      </div>

      {/* Billing ZIP */}
      <div className="space-y-1">
        <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Billing ZIP Code<span className="text-red-500 ml-1">*</span></label>
        <input type="text" value={card.zip} onChange={e => setCard({ ...card, zip: e.target.value })} placeholder="10001" className={`w-full px-4 py-3 rounded-xl border ${errors.cardZip ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`} />
        {errors.cardZip && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.cardZip}</p>}
      </div>
    </div>
  )
}

function Step4Payment({ theme, paymentMethod, setPaymentMethod, card, setCard, cardErrors, total, isProcessing, onPay, onBack, agreeTerms, setAgreeTerms }: { theme: Theme; paymentMethod: PaymentMethod; setPaymentMethod: (m: PaymentMethod) => void; card: CardInfo; setCard: (c: CardInfo) => void; cardErrors: FormErrors; total: number; isProcessing: boolean; onPay: () => void; onBack: () => void; agreeTerms: boolean; setAgreeTerms: (v: boolean) => void }) {
  const cardValid = useMemo(() => validateCard(card).isValid, [card])

  return (
    <div className={`p-6 md:p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <CreditCard className="h-6 w-6 text-red-500" />Payment Method
      </h2>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button onClick={() => setPaymentMethod("card")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "card" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <CreditCard className={`h-6 w-6 ${paymentMethod === "card" ? "text-red-500" : ""}`} />
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Card</span>
        </button>
        <button onClick={() => setPaymentMethod("paypal")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "paypal" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <span className="text-2xl font-bold text-blue-500">P</span>
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>PayPal</span>
        </button>
        <button onClick={() => setPaymentMethod("applepay")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "applepay" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <span className="text-2xl">🍎</span>
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Apple Pay</span>
        </button>
        <button onClick={() => setPaymentMethod("googlepay")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "googlepay" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <span className="text-2xl">G</span>
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Google Pay</span>
        </button>
      </div>

      {/* Card Form */}
      {paymentMethod === "card" && (
        <CardInput theme={theme} card={card} setCard={setCard} errors={cardErrors} />
      )}

      {/* PayPal */}
      {paymentMethod === "paypal" && (
        <div className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
          <div className="text-4xl font-bold text-blue-500 mb-2">PayPal</div>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>You will be redirected to PayPal to complete your purchase</p>
        </div>
      )}

      {/* Apple Pay */}
      {paymentMethod === "applepay" && (
        <div className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
          <div className="text-4xl mb-2">🍎</div>
          <div className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Apple Pay</div>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Use Face ID or Touch ID to pay</p>
        </div>
      )}

      {/* Google Pay */}
      {paymentMethod === "googlepay" && (
        <div className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
          <div className="text-4xl font-bold mb-2" style={{ color: "#4285F4" }}>G</div>
          <div className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Google Pay</div>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Pay with your Google account</p>
        </div>
      )}

      {/* Terms */}
      <div className="mt-6">
        <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
          <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="sr-only" />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${agreeTerms ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {agreeTerms && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            I agree to the <Link href="/legal/terms" className="text-red-500 hover:underline">Terms of Service</Link> and <Link href="/legal/privacy" className="text-red-500 hover:underline">Privacy Policy</Link>
          </span>
        </label>
      </div>

      {/* Security Badges */}
      <div className={`flex items-center justify-center gap-6 py-4 mt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>SSL Secured</span></div>
        <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>256-bit Encryption</span></div>
        <div className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>30-Day Guarantee</span></div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button onClick={onBack} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
          <ArrowLeft className="h-5 w-5" />Back
        </button>
        <button onClick={onPay} disabled={isProcessing || !agreeTerms || (paymentMethod === "card" && !cardValid)} className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
          {isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" />Processing...</> : <><Lock className="h-5 w-5" />Pay {formatPrice(total)}</>}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// ORDER SUCCESS
// ============================================================================

function OrderSuccess({ theme, orderId }: { theme: Theme; orderId: string }) {
  return (
    <div className={`p-12 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6">
        <CheckCircle className="h-12 w-12 text-white" />
      </div>
      <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Order Confirmed!</h2>
      <p className={`text-lg mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Thank you for your purchase</p>
      <p className={`mb-8 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Order #{orderId}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard" className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          <User className="h-5 w-5" />Go to Dashboard
        </Link>
        <Link href="/domains" className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
          <Globe className="h-5 w-5" />Search More Domains
        </Link>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading checkout...</p>
      </div>
    </div>
  )
}

function AuthRequired({ theme }: { theme: Theme }) {
  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center p-4`}>
      <div className={`max-w-md w-full p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <Lock className="h-16 w-16 mx-auto mb-6 text-red-500" />
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Sign In Required</h2>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Please sign in to continue with your checkout</p>
        <Link href="/login?redirect=/checkout" className="block w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
          Sign In to Continue
        </Link>
        <p className={`mt-4 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
          Don&apos;t have an account? <Link href="/signup" className="text-red-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
Cart(prev => {
      if (prev.find(i => i.id === product.id)) return prev
      return [...prev, item]
    })
  }, [setCart])

  // Validation
  const validateBilling = useCallback((): boolean => {
    const errors: FormErrors = {}
    if (!billing.firstName.trim()) errors.firstName = "First name is required"
    if (!billing.lastName.trim()) errors.lastName = "Last name is required"
    if (!billing.email.trim()) errors.email = "Email is required"
    else if (!validateEmail(billing.email)) errors.email = "Invalid email format"
    if (!billing.address1.trim()) errors.address1 = "Address is required"
    if (!billing.city.trim()) errors.city = "City is required"
    if (!billing.state.trim()) errors.state = "State is required"
    if (!billing.zip.trim()) errors.zip = "ZIP code is required"
    if (!billing.phone.trim()) errors.phone = "Phone is required"
    else if (!validatePhone(billing.phone)) errors.phone = "Invalid phone format"
    setBillingErrors(errors)
    return Object.keys(errors).length === 0
  }, [billing])

  // Step handlers
  const goToStep = (step: CheckoutStep) => {
    if (step < currentStep || canProceed(step - 1 as CheckoutStep)) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const canProceed = (fromStep: CheckoutStep): boolean => {
    if (fromStep === 1) return cart.length > 0
    if (fromStep === 2) return true
    if (fromStep === 3) return validateBilling()
    return false
  }

  const handleStep1Continue = () => {
    if (cart.length > 0) goToStep(2)
  }

  const handleStep2Continue = () => {
    goToStep(3)
  }

  const handleStep3Continue = () => {
    if (validateBilling()) goToStep(4)
  }

  const handlePay = async () => {
    if (paymentMethod === "card") {
      const validation = validateCard(card)
      setCardErrors(validation.errors)
      if (!validation.isValid) return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2500))

    const newOrderId = `DP-${Date.now().toString(36).toUpperCase()}`
    setOrderId(newOrderId)
    setOrderComplete(true)
    setCart([])
    setIsProcessing(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Populate email from user
  useEffect(() => {
    if (user?.email && !billing.email) {
      setBilling(prev => ({ ...prev, email: user.email }))
    }
  }, [user, billing.email])

  // Loading state
  if (!mounted || authLoading) {
    return <LoadingFallback />
  }

  // Auth check - redirect if not logged in
  if (!session) {
    return <AuthRequired theme={theme} />
  }

  // Order complete view
  if (orderComplete) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <Navigation theme={theme} toggleTheme={toggleTheme} cartCount={0} />
        <main className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <OrderSuccess theme={theme} orderId={orderId} />
          </div>
        </main>
        <Footer theme={theme} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navigation theme={theme} toggleTheme={toggleTheme} cartCount={cart.length} />

      <main className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Secure Checkout
            </h1>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Complete your purchase securely
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} theme={theme} />

          {/* Step Content */}
          <div className="max-w-3xl mx-auto">
            {currentStep === 1 && (
              <Step1OrderSummary
                theme={theme}
                cart={cart}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
                subtotal={subtotal}
                onContinue={handleStep1Continue}
              />
            )}

            {currentStep === 2 && (
              <Step2Upsells
                theme={theme}
                cart={cart}
                onAddProduct={addProduct}
                onContinue={handleStep2Continue}
                onBack={() => goToStep(1)}
              />
            )}

            {currentStep === 3 && (
              <Step3Billing
                theme={theme}
                billing={billing}
                setBilling={setBilling}
                errors={billingErrors}
                onContinue={handleStep3Continue}
                onBack={() => goToStep(2)}
              />
            )}

            {currentStep === 4 && (
              <Step4Payment
                theme={theme}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                card={card}
                setCard={setCard}
                cardErrors={cardErrors}
                total={total}
                isProcessing={isProcessing}
                onPay={handlePay}
                onBack={() => goToStep(3)}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
              />
            )}
          </div>

          {/* Order Summary Sidebar (Steps 3 & 4) */}
          {(currentStep === 3 || currentStep === 4) && cart.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8">
              <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Order Summary</h3>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{item.name} x{item.quantity}</span>
                      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className={`pt-2 mt-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex justify-between text-sm">
                      <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
                      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Tax</span>
                      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Total</span>
                      <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  )
}

// ============================================================================
// MAIN PAGE EXPORT WITH SUSPENSE
// ============================================================================

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
