"use client"

// ============================================================================
// DOMAINPRO CHECKOUT PAGE
// Complete E-Commerce Checkout with Stripe, Upsells, Cart Management
// Features: Smart Upsell System, Multi-Step Validation, Real-Time Pricing
// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Globe, Check, X, ShoppingCart, CreditCard, Lock, Shield, ShieldCheck,
  ChevronDown, ChevronUp, Sun, Moon, Menu, Loader2, AlertCircle, Trash2,
  Plus, Minus, Tag, Mail, Building, Phone, MapPin, User, Eye, EyeOff,
  ArrowRight, ArrowLeft, CheckCircle, Info, Sparkles, Crown, Server,
  Cloud, HardDrive, Database, Headphones, Users, Activity, Code,
  MessageCircle, RefreshCw, BarChart3, Network, Layers, Zap, Star,
  Gift, Clock, AlertTriangle, ExternalLink, Copy, Heart, Package,
  Twitter, Instagram, Facebook,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Theme = "light" | "dark"
type ProductType = "domain" | "protection" | "hosting" | "email" | "ssl" | "builder" | "addon"
type UpsellModal = "whois" | "hosting" | "email" | "ssl" | "builder" | null
type PaymentMethod = "card" | "paypal"
type CheckoutStep = "cart" | "account" | "billing" | "payment" | "review"

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
  saveForNext: boolean
}

interface FormErrors {
  [key: string]: string | undefined
}

interface UpsellItem {
  id: string
  name: string
  description: string
  price: number
  period: string
  features: string[]
  popular?: boolean
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

const WHOIS_FEATURES = [
  "Hide your name, address & phone from public WHOIS",
  "Prevent spam and identity theft",
  "Stay compliant with domain registration rules",
  "Protect against domain hijacking attempts",
]

const HOSTING_PLANS: UpsellItem[] = [
  { id: "hosting-starter", name: "Starter", description: "Perfect for personal websites", price: 3.99, period: "month", features: ["10GB SSD Storage", "1 Website", "Free SSL Certificate", "10 Email Accounts", "24/7 Support"] },
  { id: "hosting-business", name: "Business", description: "Great for growing businesses", price: 9.99, period: "month", features: ["50GB SSD Storage", "5 Websites", "Free SSL + CDN", "Unlimited Email", "Priority Support", "Daily Backups"], popular: true },
  { id: "hosting-pro", name: "Pro", description: "For high-traffic sites", price: 19.99, period: "month", features: ["Unlimited Storage", "Unlimited Websites", "Premium SSL + CDN", "Unlimited Email", "Dedicated Support", "Auto Backups + Staging"] },
]

const EMAIL_PLANS: UpsellItem[] = [
  { id: "email-basic", name: "Basic", description: "For individuals", price: 2.99, period: "month", features: ["2 Mailboxes", "10GB Storage Each", "Webmail Access", "Mobile Apps", "Spam Protection"] },
  { id: "email-business", name: "Business", description: "For small teams", price: 5.99, period: "month", features: ["10 Mailboxes", "25GB Storage Each", "Custom Aliases", "Calendar & Contacts", "Advanced Security"], popular: true },
  { id: "email-enterprise", name: "Enterprise", description: "For large organizations", price: 12.99, period: "month", features: ["Unlimited Mailboxes", "50GB Storage Each", "Archive & Compliance", "Admin Console", "SSO Integration"] },
]

const SSL_OPTIONS: UpsellItem[] = [
  { id: "ssl-free", name: "Basic SSL", description: "Standard encryption", price: 0, period: "year", features: ["Domain Validation", "256-bit Encryption", "Browser Trust", "Auto-Renewal"] },
  { id: "ssl-wildcard", name: "Wildcard SSL", description: "Unlimited subdomains", price: 79.99, period: "year", features: ["All Subdomains Covered", "Organization Validation", "$250K Warranty", "Site Seal"], popular: true },
  { id: "ssl-ev", name: "Extended Validation", description: "Maximum trust", price: 199.99, period: "year", features: ["Green Address Bar", "Full Company Verification", "$1.75M Warranty", "Premium Site Seal"] },
]

const BUILDER_PLANS: UpsellItem[] = [
  { id: "builder-basic", name: "Basic", description: "Simple websites", price: 9.99, period: "month", features: ["50+ Templates", "Drag & Drop Editor", "Mobile Responsive", "SEO Tools", "Analytics"] },
  { id: "builder-pro", name: "Pro", description: "E-commerce ready", price: 19.99, period: "month", features: ["E-commerce Store", "Custom Code Access", "Advanced SEO", "Priority Support", "Unlimited Pages"], popular: true },
  { id: "builder-agency", name: "Agency", description: "For professionals", price: 49.99, period: "month", features: ["Client Management", "White Label", "Team Collaboration", "API Access", "Dedicated Support"] },
]

const RECOMMENDED_PRODUCTS: CartItem[] = [
  { id: "rec-ssl", type: "ssl", name: "SSL Certificate", description: "Secure your website with HTTPS", price: 0, period: "year", quantity: 1 },
  { id: "rec-backup", type: "addon", name: "Daily Backups", description: "Automatic daily backups", price: 2.99, period: "month", quantity: 1 },
  { id: "rec-cdn", type: "addon", name: "CDN Service", description: "Faster global delivery", price: 4.99, period: "month", quantity: 1 },
]

const DEFAULT_BILLING: BillingInfo = {
  firstName: "", lastName: "", company: "", email: "", phone: "",
  country: "US", address1: "", address2: "", city: "", state: "", zip: "",
  saveForNext: true,
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Domains",
    dropdown: [
      { label: "Domain Search", href: "/domains", icon: <Globe className="h-4 w-4" />, description: "Find your perfect domain" },
      { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
      { label: "Bulk Registration", href: "/domains/bulk", icon: <Layers className="h-4 w-4" />, description: "Register multiple domains" },
      { label: "Domain Auctions", href: "/domains/auctions", icon: <BarChart3 className="h-4 w-4" />, description: "Bid on premium domains" },
      { label: "WHOIS Lookup", href: "/domains/whois", icon: <Eye className="h-4 w-4" />, description: "Check domain ownership" },
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
    ],
  },
  { label: "Pricing", href: "/pricing" },
]

const FOOTER_SECTIONS: FooterSection[] = [
  { title: "DOMAINS", links: [{ label: "Domain Search", href: "/domains" }, { label: "Domain Transfer", href: "/domains/transfer" }, { label: "Bulk Registration", href: "/domains/bulk" }, { label: "Domain Auctions", href: "/domains/auctions" }, { label: "WHOIS Lookup", href: "/domains/whois" }] },
  { title: "HOSTING", links: [{ label: "Web Hosting", href: "/hosting/web" }, { label: "WordPress Hosting", href: "/hosting/wordpress" }, { label: "Cloud Hosting", href: "/hosting/cloud" }, { label: "VPS Hosting", href: "/hosting/vps" }, { label: "Dedicated Servers", href: "/hosting/dedicated" }] },
  { title: "SERVICES", links: [{ label: "SSL Certificates", href: "/services/ssl" }, { label: "CDN Services", href: "/services/cdn" }, { label: "Email Hosting", href: "/services/email" }, { label: "Website Builder", href: "/services/builder" }] },
  { title: "SECURITY", links: [{ label: "VPN Services", href: "/security/vpn" }, { label: "DDoS Protection", href: "/security/ddos" }, { label: "Backup Services", href: "/security/backup" }, { label: "Security Monitoring", href: "/security/monitoring" }] },
  { title: "COMPANY", links: [{ label: "About Us", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Careers", href: "/careers" }, { label: "Press", href: "/press" }, { label: "Partners", href: "/partners" }] },
  { title: "SUPPORT", links: [{ label: "Help Center", href: "/support/help" }, { label: "Contact Us", href: "/support/contact" }, { label: "System Status", href: "/support/status" }, { label: "API Docs", href: "/support/api" }] },
  { title: "LEGAL", links: [{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }, { label: "GDPR", href: "/legal/gdpr" }, { label: "Acceptable Use", href: "/legal/acceptable-use" }] },
]

// Sample cart for demo
const SAMPLE_CART: CartItem[] = [
  { id: "domain-1", type: "domain", name: "myawesomesite.com", price: 12.99, period: "year", quantity: 1 },
  { id: "domain-2", type: "domain", name: "myawesomesite.io", price: 39.99, period: "year", quantity: 1 },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{10,}$/.test(phone)
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

function calculateTax(subtotal: number, country: string, state: string): number {
  // Simplified tax calculation - in production, use a tax service
  const taxRates: { [key: string]: number } = {
    "US-CA": 0.0725, "US-NY": 0.08, "US-TX": 0.0625, "US-FL": 0.06,
    "CA": 0.05, "GB": 0.20, "DE": 0.19, "AU": 0.10,
  }
  const key = country === "US" ? `${country}-${state}` : country
  const rate = taxRates[key] || 0
  return subtotal * rate
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

function groupCartItems(items: CartItem[]): { [key: string]: CartItem[] } {
  return items.reduce((groups, item) => {
    const type = item.type
    if (!groups[type]) groups[type] = []
    groups[type].push(item)
    return groups
  }, {} as { [key: string]: CartItem[] })
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

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch (e) { console.error("Error reading localStorage:", e) }
  }, [key])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value
      try { localStorage.setItem(key, JSON.stringify(valueToStore)) } catch (e) { console.error("Error saving:", e) }
      return valueToStore
    })
  }, [key])

  return [storedValue, setValue]
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// ============================================================================
// UI COMPONENTS - NAVIGATION
// ============================================================================

function ThemeToggle({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
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
      <button onClick={onToggle} className={`flex items-center gap-1 font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`} aria-expanded={isOpen}>
        {item.label}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="p-2">
            {item.dropdown.map((dropdownItem) => (
              <Link key={dropdownItem.href} href={dropdownItem.href} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`} onClick={onClose}>
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
  const toggleExpanded = (label: string) => { setExpandedItems((prev) => { const next = new Set(prev); next.has(label) ? next.delete(label) : next.add(label); return next }) }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}><Globe className="h-8 w-8 text-red-500" /><span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-6 w-6" /></button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="mb-2">
            {item.dropdown ? (
              <>
                <button onClick={() => toggleExpanded(item.label)} className={`w-full flex items-center justify-between p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>
                  {item.label}
                  {expandedItems.has(item.label) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {expandedItems.has(item.label) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((di) => (<Link key={di.href} href={di.href} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"}`} onClick={onClose}><span className="text-red-400">{di.icon}</span>{di.label}</Link>))}
                  </div>
                )}
              </>
            ) : (<Link href={item.href || "#"} className={`block p-3 rounded-lg font-medium ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`} onClick={onClose}>{item.label}</Link>)}
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-700"><Link href="/auth/login" className="block w-full p-3 text-center font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl" onClick={onClose}>Sign In</Link></div>
      </nav>
    </div>
  )
}

function Navigation({ theme, toggleTheme, cartCount }: { theme: Theme; toggleTheme: () => void; cartCount: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
            {NAV_ITEMS.map((item) => (<NavDropdown key={item.label} item={item} theme={theme} isOpen={openDropdown === item.label} onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} onClose={() => setOpenDropdown(null)} />))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link href="/checkout" className={`relative p-2 rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <Link href="/auth/login" className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>Sign In</Link>
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(true)}><Menu className="h-6 w-6" /></button>
          </div>
        </div>
      </div>
      <MobileMenu theme={theme} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}

function Footer({ theme }: { theme: Theme }) {
  const socialLinks = [
    { name: "Twitter", href: "#", icon: <Twitter className="h-5 w-5" /> },
    { name: "Instagram", href: "#", icon: <Instagram className="h-5 w-5" /> },
    { name: "Facebook", href: "#", icon: <Facebook className="h-5 w-5" /> },
  ]

  return (
    <footer className={`border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{section.title}</h3>
              <ul className="space-y-3">{section.links.map((link) => (<li key={link.href}><Link href={link.href} className={`text-sm ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{link.label}</Link></li>))}</ul>
            </div>
          ))}
        </div>
        <div className={`pt-8 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2"><Globe className="h-6 w-6 text-red-500" /><span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
              <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>© {new Date().getFullYear()} DomainPro. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">{socialLinks.map((s) => (<a key={s.name} href={s.href} className={`p-2 rounded-lg ${theme === "dark" ? "text-gray-500 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>{s.icon}</a>))}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

function FormInput({ id, label, type = "text", value, onChange, error, icon, placeholder, required, theme, autoComplete, disabled }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; error?: string; icon?: React.ReactNode; placeholder?: string; required?: boolean; theme: Theme; autoComplete?: string; disabled?: boolean }) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative">
        {icon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{icon}</div>}
        <input id={id} type={inputType} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} required={required} disabled={disabled} className={`w-full px-4 py-3 rounded-xl border transition-all ${icon ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""} ${error ? "border-red-500 focus:border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-red-500"} focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50`} />
        {type === "password" && <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </div>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

function FormSelect({ id, label, value, onChange, options, error, required, theme, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; options: { code: string; name: string }[]; error?: string; required?: boolean; theme: Theme; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full px-4 py-3 rounded-xl border transition-all ${error ? "border-red-500" : theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (<option key={opt.code} value={opt.code}>{opt.name}</option>))}
      </select>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  )
}

function Checkbox({ id, label, checked, onChange, theme, description }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; theme: Theme; description?: string }) {
  return (
    <label htmlFor={id} className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-all ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
      <div className="pt-0.5">
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
      <div>
        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{label}</span>
        {description && <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>}
      </div>
    </label>
  )
}

// ============================================================================
// CART COMPONENTS
// ============================================================================

function CartItemRow({ item, theme, onUpdateQuantity, onRemove }: { item: CartItem; theme: Theme; onUpdateQuantity: (id: string, qty: number) => void; onRemove: (id: string) => void }) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
      <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
        {getProductIcon(item.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.name}</div>
        {item.description && <div className={`text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{item.description}</div>}
        <div className="flex items-center gap-4 mt-2">
          <div className={`flex items-center rounded-lg border ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
            <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className={`p-1.5 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}><Minus className="h-3 w-3" /></button>
            <span className={`px-3 text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className={`p-1.5 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}><Plus className="h-3 w-3" /></button>
          </div>
          <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>/{item.period}</span>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(item.price * item.quantity)}</div>
        {item.originalPrice && item.originalPrice > item.price && (
          <div className={`text-sm line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{formatPrice(item.originalPrice * item.quantity)}</div>
        )}
        <button onClick={() => onRemove(item.id)} className="mt-2 text-red-500 hover:text-red-400 text-sm flex items-center gap-1"><Trash2 className="h-3 w-3" />Remove</button>
      </div>
    </div>
  )
}

function CartSummary({ theme, cart, onUpdateQuantity, onRemove, subtotal, tax, total, promoCode, setPromoCode, applyPromo, promoDiscount, promoError, promoLoading }: { theme: Theme; cart: CartItem[]; onUpdateQuantity: (id: string, qty: number) => void; onRemove: (id: string) => void; subtotal: number; tax: number; total: number; promoCode: string; setPromoCode: (code: string) => void; applyPromo: () => void; promoDiscount: number; promoError: string; promoLoading: boolean }) {
  const [showPromo, setShowPromo] = useState(false)
  const groupedItems = useMemo(() => groupCartItems(cart), [cart])

  const typeLabels: { [key: string]: string } = {
    domain: "Domains", protection: "Protection Services", hosting: "Hosting", email: "Email Services", ssl: "SSL Certificates", builder: "Website Builder", addon: "Additional Services"
  }

  if (cart.length === 0) {
    return (
      <div className={`p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <ShoppingCart className={`h-16 w-16 mx-auto mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`} />
        <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your cart is empty</h3>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Start by searching for your perfect domain</p>
        <Link href="/domains" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
          <Globe className="h-5 w-5" />Search Domains
        </Link>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className={`text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <ShoppingCart className="h-5 w-5" />Your Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
        </h2>
      </div>

      <div className="p-4 space-y-6 max-h-[50vh] overflow-y-auto">
        {Object.entries(groupedItems).map(([type, items]) => (
          <div key={type}>
            <h3 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{typeLabels[type] || type.toUpperCase()}</h3>
            <div className="space-y-3">
              {items.map((item) => (<CartItemRow key={item.id} item={item} theme={theme} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />))}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700 bg-gray-800/30" : "border-gray-200 bg-gray-50"}`}>
        <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>RECOMMENDED FOR YOU</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {RECOMMENDED_PRODUCTS.map((rec) => (
            <button key={rec.id} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${theme === "dark" ? "border-gray-700 hover:border-red-500/50 hover:bg-red-500/10" : "border-gray-300 hover:border-red-500 hover:bg-red-50"}`}>
              <Plus className="h-4 w-4 text-red-500" />
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{rec.name}</span>
              <span className="text-green-500 font-medium">{rec.price === 0 ? "FREE" : formatPrice(rec.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <button onClick={() => setShowPromo(!showPromo)} className={`flex items-center gap-2 text-sm font-medium ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
          <Tag className="h-4 w-4" />Have a promo code?
          {showPromo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showPromo && (
          <div className="mt-3 flex gap-2">
            <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code" className={`flex-1 px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`} />
            <button onClick={applyPromo} disabled={!promoCode || promoLoading} className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium rounded-lg">
              {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </button>
          </div>
        )}
        {promoError && <p className="mt-2 text-sm text-red-500">{promoError}</p>}
        {promoDiscount > 0 && <p className="mt-2 text-sm text-green-500">Promo applied! You save {formatPrice(promoDiscount)}</p>}
      </div>

      {/* Totals */}
      <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-100"}`}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(subtotal)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Tax</span>
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatPrice(tax)}</span>
          </div>
          <div className={`flex justify-between pt-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
            <span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Total</span>
            <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(total)}</span>
          </div>
        </div>
        <Link href="/domains" className={`block text-center mt-4 text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
          <ArrowLeft className="h-4 w-4 inline mr-1" />Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// UPSELL MODAL COMPONENTS
// ============================================================================

function UpsellModalOverlay({ theme, children, onClose }: { theme: Theme; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} style={{ animation: "fadeIn 0.3s ease-out" }}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-lg z-10 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}><X className="h-5 w-5" /></button>
        {children}
      </div>
    </div>
  )
}

function WHOISModal({ theme, onClose, onAccept, domains }: { theme: Theme; onClose: () => void; onAccept: (addAll: boolean) => void; domains: CartItem[] }) {
  const [addAll, setAddAll] = useState(true)

  return (
    <UpsellModalOverlay theme={theme} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
            <Shield className="h-8 w-8 text-green-500" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Protect Your Personal Information</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Keep your contact details private from public WHOIS lookups</p>
        </div>

        <div className={`p-4 rounded-xl mb-6 ${theme === "dark" ? "bg-green-500/10 border border-green-500/30" : "bg-green-50 border border-green-200"}`}>
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-green-500" />
            <div>
              <div className={`font-bold ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>FREE for the first year!</div>
              <div className={`text-sm ${theme === "dark" ? "text-green-400/80" : "text-green-600"}`}>$9.99/year after (per domain)</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {WHOIS_FEATURES.map((feature, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{feature}</span>
            </div>
          ))}
        </div>

        {domains.length > 1 && (
          <div className={`p-4 rounded-xl mb-6 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <Checkbox id="addAll" label={`Add WHOIS privacy to all ${domains.length} domains`} checked={addAll} onChange={setAddAll} theme={theme} description="Recommended for complete protection" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => onAccept(addAll)} className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />Add Protection (FREE)
          </button>
          <button onClick={onClose} className={`flex-1 py-4 rounded-xl font-medium ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            No Thanks
          </button>
        </div>
      </div>
    </UpsellModalOverlay>
  )
}

function HostingModal({ theme, onClose, onAccept }: { theme: Theme; onClose: () => void; onAccept: (plan: UpsellItem) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string>("hosting-business")

  return (
    <UpsellModalOverlay theme={theme} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
            <Server className="h-8 w-8 text-purple-500" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Get Your Website Online Today</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Complete your online presence with reliable hosting</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {HOSTING_PLANS.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
              {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">POPULAR</div>}
              <div className={`font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</div>
              <div className="mb-3">
                <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(plan.price)}</span>
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/mo</span>
              </div>
              <ul className="space-y-1">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Check className="h-3 w-3 text-green-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { const plan = HOSTING_PLANS.find(p => p.id === selectedPlan); if (plan) onAccept(plan) }} className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Server className="h-5 w-5" />Add Hosting
          </button>
          <button onClick={onClose} className={`flex-1 py-4 rounded-xl font-medium ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            Maybe Later
          </button>
        </div>
      </div>
    </UpsellModalOverlay>
  )
}

function EmailModal({ theme, onClose, onAccept }: { theme: Theme; onClose: () => void; onAccept: (plan: UpsellItem) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string>("email-business")

  return (
    <UpsellModalOverlay theme={theme} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Professional Email with Your Domain</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Get email@yourdomain.com for a professional look</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {EMAIL_PLANS.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
              {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">POPULAR</div>}
              <div className={`font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</div>
              <div className="mb-3">
                <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(plan.price)}</span>
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/mo</span>
              </div>
              <ul className="space-y-1">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Check className="h-3 w-3 text-green-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { const plan = EMAIL_PLANS.find(p => p.id === selectedPlan); if (plan) onAccept(plan) }} className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />Add Email
          </button>
          <button onClick={onClose} className={`flex-1 py-4 rounded-xl font-medium ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            Skip
          </button>
        </div>
      </div>
    </UpsellModalOverlay>
  )
}

function SSLModal({ theme, onClose, onAccept }: { theme: Theme; onClose: () => void; onAccept: (plan: UpsellItem) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string>("ssl-wildcard")

  return (
    <UpsellModalOverlay theme={theme} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
            <Lock className="h-8 w-8 text-green-500" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Secure Your Website</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Build trust with HTTPS encryption</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {SSL_OPTIONS.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
              {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">POPULAR</div>}
              <div className={`font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</div>
              <div className="mb-3">
                <span className={`text-2xl font-bold ${plan.price === 0 ? "text-green-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.price === 0 ? "FREE" : formatPrice(plan.price)}</span>
                {plan.price > 0 && <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/yr</span>}
              </div>
              <ul className="space-y-1">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Check className="h-3 w-3 text-green-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { const plan = SSL_OPTIONS.find(p => p.id === selectedPlan); if (plan) onAccept(plan) }} className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />Add SSL
          </button>
          <button onClick={onClose} className={`flex-1 py-4 rounded-xl font-medium ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            No Thanks
          </button>
        </div>
      </div>
    </UpsellModalOverlay>
  )
}

function BuilderModal({ theme, onClose, onAccept }: { theme: Theme; onClose: () => void; onAccept: (plan: UpsellItem) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string>("builder-pro")

  return (
    <UpsellModalOverlay theme={theme} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
            <Layers className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Build Your Website in Minutes</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No coding required - just drag and drop</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {BUILDER_PLANS.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
              {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">POPULAR</div>}
              <div className={`font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</div>
              <div className="mb-3">
                <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatPrice(plan.price)}</span>
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/mo</span>
              </div>
              <ul className="space-y-1">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Check className="h-3 w-3 text-green-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => { const plan = BUILDER_PLANS.find(p => p.id === selectedPlan); if (plan) onAccept(plan) }} className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Layers className="h-5 w-5" />Start Building
          </button>
          <button onClick={onClose} className={`flex-1 py-4 rounded-xl font-medium ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            Not Now
          </button>
        </div>
      </div>
    </UpsellModalOverlay>
  )
}

// ============================================================================
// CHECKOUT FORM COMPONENTS
// ============================================================================

function BillingForm({ theme, billing, setBilling, errors, createAccount, setCreateAccount, password, setPassword, confirmPassword, setConfirmPassword }: { theme: Theme; billing: BillingInfo; setBilling: (b: BillingInfo) => void; errors: FormErrors; createAccount: boolean; setCreateAccount: (v: boolean) => void; password: string; setPassword: (v: string) => void; confirmPassword: string; setConfirmPassword: (v: string) => void }) {
  const updateField = (field: keyof BillingInfo, value: string | boolean) => {
    setBilling({ ...billing, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <User className="h-5 w-5 text-red-500" />Account Information
        </h3>
        <div className="space-y-4">
          <FormInput id="email" label="Email Address" type="email" value={billing.email} onChange={(v) => updateField("email", v)} error={errors.email} icon={<Mail className="h-5 w-5" />} placeholder="john@example.com" required theme={theme} autoComplete="email" />
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Already have an account? <Link href="/auth/login" className="text-red-500 hover:text-red-400 font-medium">Sign in</Link></p>
          </div>
          <Checkbox id="createAccount" label="Create an account" checked={createAccount} onChange={setCreateAccount} theme={theme} description="Save your information for faster checkout" />
          {createAccount && (
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <FormInput id="password" label="Password" type="password" value={password} onChange={setPassword} error={errors.password} icon={<Lock className="h-5 w-5" />} placeholder="Create password" required theme={theme} />
              <FormInput id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword} icon={<Lock className="h-5 w-5" />} placeholder="Confirm password" required theme={theme} />
            </div>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <MapPin className="h-5 w-5 text-red-500" />Billing Address
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput id="firstName" label="First Name" value={billing.firstName} onChange={(v) => updateField("firstName", v)} error={errors.firstName} icon={<User className="h-5 w-5" />} placeholder="John" required theme={theme} />
            <FormInput id="lastName" label="Last Name" value={billing.lastName} onChange={(v) => updateField("lastName", v)} error={errors.lastName} icon={<User className="h-5 w-5" />} placeholder="Doe" required theme={theme} />
          </div>
          <FormInput id="company" label="Company (Optional)" value={billing.company} onChange={(v) => updateField("company", v)} icon={<Building className="h-5 w-5" />} placeholder="Your company" theme={theme} />
          <FormSelect id="country" label="Country" value={billing.country} onChange={(v) => updateField("country", v)} options={COUNTRIES} required theme={theme} />
          <FormInput id="address1" label="Address Line 1" value={billing.address1} onChange={(v) => updateField("address1", v)} error={errors.address1} icon={<MapPin className="h-5 w-5" />} placeholder="123 Main Street" required theme={theme} />
          <FormInput id="address2" label="Address Line 2 (Optional)" value={billing.address2} onChange={(v) => updateField("address2", v)} icon={<MapPin className="h-5 w-5" />} placeholder="Apt, Suite, etc." theme={theme} />
          <div className="grid md:grid-cols-3 gap-4">
            <FormInput id="city" label="City" value={billing.city} onChange={(v) => updateField("city", v)} error={errors.city} placeholder="New York" required theme={theme} />
            {billing.country === "US" ? (
              <FormSelect id="state" label="State" value={billing.state} onChange={(v) => updateField("state", v)} options={US_STATES} error={errors.state} required theme={theme} placeholder="Select state" />
            ) : (
              <FormInput id="state" label="State/Province" value={billing.state} onChange={(v) => updateField("state", v)} error={errors.state} placeholder="State" required theme={theme} />
            )}
            <FormInput id="zip" label="ZIP/Postal Code" value={billing.zip} onChange={(v) => updateField("zip", v)} error={errors.zip} placeholder="10001" required theme={theme} />
          </div>
          <FormInput id="phone" label="Phone Number" type="tel" value={billing.phone} onChange={(v) => updateField("phone", v)} error={errors.phone} icon={<Phone className="h-5 w-5" />} placeholder="+1 (555) 123-4567" required theme={theme} />
          <Checkbox id="saveForNext" label="Save this information for next time" checked={billing.saveForNext} onChange={(v) => updateField("saveForNext", v)} theme={theme} />
        </div>
      </div>
    </div>
  )
}

function PaymentSection({ theme, paymentMethod, setPaymentMethod, isProcessing, onSubmit, agreeTerms, setAgreeTerms, total }: { theme: Theme; paymentMethod: PaymentMethod; setPaymentMethod: (m: PaymentMethod) => void; isProcessing: boolean; onSubmit: () => void; agreeTerms: boolean; setAgreeTerms: (v: boolean) => void; total: number }) {
  return (
    <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <CreditCard className="h-5 w-5 text-red-500" />Payment Method
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => setPaymentMethod("card")} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === "card" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <CreditCard className={`h-5 w-5 ${paymentMethod === "card" ? "text-red-500" : ""}`} />
          <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Credit Card</span>
        </button>
        <button onClick={() => setPaymentMethod("paypal")} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === "paypal" ? "border-red-500 bg-red-500/10" : theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"}`}>
          <span className="text-xl font-bold text-blue-500">P</span>
          <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>PayPal</span>
        </button>
      </div>

      {paymentMethod === "card" && (
        <div className="space-y-4 mb-6">
          <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
            <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Card Number</div>
            <div className={`h-10 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} border flex items-center px-3`}>
              <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>Stripe Element loads here</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Expiry</div>
              <div className={`h-10 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} border flex items-center px-3`}>
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>MM / YY</span>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>CVC</div>
              <div className={`h-10 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} border flex items-center px-3`}>
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>123</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className={`p-8 rounded-xl border text-center mb-6 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>You will be redirected to PayPal</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <Checkbox id="agreeTerms" label="I agree to the Terms of Service and Privacy Policy" checked={agreeTerms} onChange={setAgreeTerms} theme={theme} />
        <div className={`flex items-center justify-center gap-6 py-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>SSL Secured</span></div>
          <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>256-bit Encryption</span></div>
          <div className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-green-500" /><span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>30-Day Guarantee</span></div>
        </div>
      </div>

      <button onClick={onSubmit} disabled={isProcessing || !agreeTerms} className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-500/25">
        {isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" />Processing...</> : <><Lock className="h-5 w-5" />Pay {formatPrice(total)}</>}
      </button>
    </div>
  )
}

function OrderSuccessMessage({ theme, orderId }: { theme: Theme; orderId: string }) {
  return (
    <div className={`p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Order Confirmed!</h2>
      <p className={`text-lg mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Thank you for your purchase</p>
      <p className={`mb-6 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Order #{orderId}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard" className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          <User className="h-5 w-5" />Go to Dashboard
        </Link>
        <Link href="/domains" className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
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

// ============================================================================
// MAIN CHECKOUT CONTENT COMPONENT
// ============================================================================

function CheckoutContent() {
  const router = useRouter()
  const [theme, toggleTheme, mounted] = useTheme()
  
  // Cart State
  const [cart, setCart] = useLocalStorage<CartItem[]>("domainpro-cart", SAMPLE_CART)
  
  // Form State
  const [billing, setBilling] = useState<BillingInfo>(DEFAULT_BILLING)
  const [errors, setErrors] = useState<FormErrors>({})
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  
  // Promo State
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  
  // Upsell State
  const [currentUpsell, setCurrentUpsell] = useState<UpsellModal>(null)
  const [shownUpsells, setShownUpsells] = useState<Set<string>>(new Set())
  const [upsellsComplete, setUpsellsComplete] = useState(false)

  // Calculate totals
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const tax = useMemo(() => calculateTax(subtotal - promoDiscount, billing.country, billing.state), [subtotal, promoDiscount, billing.country, billing.state])
  const total = subtotal - promoDiscount + tax

  // Cart operations
  const updateQuantity = useCallback((id: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item))
  }, [setCart])

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }, [setCart])

  const addItem = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, item]
    })
  }, [setCart])

  // Promo code
  const applyPromo = useCallback(async () => {
    if (!promoCode) return
    setPromoLoading(true)
    setPromoError("")
    
    await new Promise(r => setTimeout(r, 1000))
    
    if (promoCode === "SAVE20") {
      setPromoDiscount(subtotal * 0.2)
    } else if (promoCode === "WELCOME10") {
      setPromoDiscount(subtotal * 0.1)
    } else {
      setPromoError("Invalid promo code")
    }
    setPromoLoading(false)
  }, [promoCode, subtotal])

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!billing.email) newErrors.email = "Email is required"
    else if (!validateEmail(billing.email)) newErrors.email = "Invalid email format"
    
    if (!billing.firstName) newErrors.firstName = "First name is required"
    if (!billing.lastName) newErrors.lastName = "Last name is required"
    if (!billing.address1) newErrors.address1 = "Address is required"
    if (!billing.city) newErrors.city = "City is required"
    if (!billing.state) newErrors.state = "State is required"
    if (!billing.zip) newErrors.zip = "ZIP code is required"
    if (!billing.phone) newErrors.phone = "Phone is required"
    else if (!validatePhone(billing.phone)) newErrors.phone = "Invalid phone format"
    
    if (createAccount) {
      if (!password) newErrors.password = "Password is required"
      else if (password.length < 8) newErrors.password = "Password must be at least 8 characters"
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [billing, createAccount, password, confirmPassword])

  // Upsell flow
  const domains = useMemo(() => cart.filter(item => item.type === "domain"), [cart])
  const hasHosting = useMemo(() => cart.some(item => item.type === "hosting"), [cart])
  const hasEmail = useMemo(() => cart.some(item => item.type === "email"), [cart])
  const hasSSL = useMemo(() => cart.some(item => item.type === "ssl"), [cart])

  const showNextUpsell = useCallback(() => {
    if (domains.length > 0 && !shownUpsells.has("whois") && !cart.some(i => i.type === "protection")) {
      setCurrentUpsell("whois")
      setShownUpsells(prev => new Set(prev).add("whois"))
    } else if (!shownUpsells.has("hosting") && !hasHosting) {
      setCurrentUpsell("hosting")
      setShownUpsells(prev => new Set(prev).add("hosting"))
    } else if (!shownUpsells.has("email") && !hasEmail) {
      setCurrentUpsell("email")
      setShownUpsells(prev => new Set(prev).add("email"))
    } else if (!shownUpsells.has("ssl") && !hasSSL && !hasHosting) {
      setCurrentUpsell("ssl")
      setShownUpsells(prev => new Set(prev).add("ssl"))
    } else if (!shownUpsells.has("builder") && total < 50) {
      setCurrentUpsell("builder")
      setShownUpsells(prev => new Set(prev).add("builder"))
    } else {
      setUpsellsComplete(true)
      setCurrentUpsell(null)
    }
  }, [domains, cart, hasHosting, hasEmail, hasSSL, total, shownUpsells])

  const handleUpsellClose = useCallback(() => {
    setCurrentUpsell(null)
    setTimeout(showNextUpsell, 300)
  }, [showNextUpsell])

  const handleWHOISAccept = useCallback((addAll: boolean) => {
    const domainsToProtect = addAll ? domains : [domains[0]]
    domainsToProtect.forEach(domain => {
      addItem({
        id: `whois-${domain.id}`,
        type: "protection",
        name: `WHOIS Privacy - ${domain.name}`,
        description: "Hide your personal info from WHOIS",
        price: 0,
        period: "year",
        quantity: 1,
        domain: domain.name,
      })
    })
    handleUpsellClose()
  }, [domains, addItem, handleUpsellClose])

  const handleHostingAccept = useCallback((plan: UpsellItem) => {
    addItem({
      id: plan.id,
      type: "hosting",
      name: `${plan.name} Hosting`,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      quantity: 1,
      features: plan.features,
    })
    handleUpsellClose()
  }, [addItem, handleUpsellClose])

  const handleEmailAccept = useCallback((plan: UpsellItem) => {
    addItem({
      id: plan.id,
      type: "email",
      name: `${plan.name} Email`,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      quantity: 1,
      features: plan.features,
    })
    handleUpsellClose()
  }, [addItem, handleUpsellClose])

  const handleSSLAccept = useCallback((plan: UpsellItem) => {
    addItem({
      id: plan.id,
      type: "ssl",
      name: plan.name,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      quantity: 1,
      features: plan.features,
    })
    handleUpsellClose()
  }, [addItem, handleUpsellClose])

  const handleBuilderAccept = useCallback((plan: UpsellItem) => {
    addItem({
      id: plan.id,
      type: "builder",
      name: `Website Builder - ${plan.name}`,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      quantity: 1,
      features: plan.features,
    })
    handleUpsellClose()
  }, [addItem, handleUpsellClose])

  // Process payment
  const handleSubmit = useCallback(async () => {
    if (!upsellsComplete && cart.length > 0) {
      showNextUpsell()
      return
    }
    
    if (!validateForm()) return
    
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))
    
    const newOrderId = `DP-${Date.now().toString(36).toUpperCase()}`
    setOrderId(newOrderId)
    setOrderComplete(true)
    setCart([])
    setIsProcessing(false)
  }, [upsellsComplete, cart, validateForm, showNextUpsell, setCart])

  if (!mounted) return <LoadingFallback />

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <Navigation theme={theme} toggleTheme={toggleTheme} cartCount={cart.length} />

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {orderComplete ? "Thank You!" : "Secure Checkout"}
            </h1>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {orderComplete ? "Your order has been placed successfully" : "Complete your purchase securely"}
            </p>
          </div>

          {orderComplete ? (
            <OrderSuccessMessage theme={theme} orderId={orderId} />
          ) : (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Cart Summary - Sticky on Desktop */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24">
                  <CartSummary
                    theme={theme}
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    applyPromo={applyPromo}
                    promoDiscount={promoDiscount}
                    promoError={promoError}
                    promoLoading={promoLoading}
                  />
                </div>
              </div>

              {/* Checkout Form */}
              <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
                <BillingForm
                  theme={theme}
                  billing={billing}
                  setBilling={setBilling}
                  errors={errors}
                  createAccount={createAccount}
                  setCreateAccount={setCreateAccount}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                />

                <PaymentSection
                  theme={theme}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  isProcessing={isProcessing}
                  onSubmit={handleSubmit}
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  total={total}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upsell Modals */}
      {currentUpsell === "whois" && (
        <WHOISModal theme={theme} onClose={handleUpsellClose} onAccept={handleWHOISAccept} domains={domains} />
      )}
      {currentUpsell === "hosting" && (
        <HostingModal theme={theme} onClose={handleUpsellClose} onAccept={handleHostingAccept} />
      )}
      {currentUpsell === "email" && (
        <EmailModal theme={theme} onClose={handleUpsellClose} onAccept={handleEmailAccept} />
      )}
      {currentUpsell === "ssl" && (
        <SSLModal theme={theme} onClose={handleUpsellClose} onAccept={handleSSLAccept} />
      )}
      {currentUpsell === "builder" && (
        <BuilderModal theme={theme} onClose={handleUpsellClose} onAccept={handleBuilderAccept} />
      )}

      <Footer theme={theme} />
    </div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT (DEFAULT EXPORT)
// Wraps CheckoutContent in Suspense boundary for Next.js 13+ App Router
// ============================================================================

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
