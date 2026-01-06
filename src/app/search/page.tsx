"use client"

// ============================================================================
// DOMAINPRO DOMAIN SEARCH PAGE
// Industry-Leading Domain Search Experience
// Features: AI-Powered Search, Bulk Check, Domain Scoring, Real-Time Availability
// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Globe, Search, Sparkles, Check, X, Heart, HeartOff, ShoppingCart,
  Filter, ChevronDown, ChevronUp, Sun, Moon, Menu, Loader2, AlertCircle,
  Crown, Gavel, Eye, Send, Volume2, Share2, Copy, ExternalLink,
  TrendingUp, Zap, Award, Shield, Clock, RefreshCw, Star, ArrowRight,
  Server, Cloud, HardDrive, Database, ShieldCheck, Headphones, Users,
  Activity, Code, MessageCircle, BarChart3, Network, Layers, Lock, Mail,
  CheckCircle, Info, Sliders, SlidersHorizontal, Grid3X3, List, Plus,
  Minus, Twitter, Instagram, Facebook, AtSign, Mic, Play, Pause,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Theme = "light" | "dark"
type SearchMode = "standard" | "ai"
type ViewMode = "grid" | "list"
type AvailabilityStatus = "available" | "premium" | "taken" | "auction"
type SortOption = "relevance" | "price-asc" | "price-desc" | "length" | "score"

interface DomainResult {
  domain: string
  tld: string
  available: boolean
  status: AvailabilityStatus
  price: number
  renewalPrice: number
  score: number
  scoreBreakdown: {
    length: number
    memorability: number
    seo: number
    brandability: number
  }
  premium: boolean
  auction?: {
    currentBid: number
    endTime: string
  }
  history?: {
    registeredDate: string
    isParked: boolean
    estimatedValue: number
  }
  socialAvailability?: {
    twitter: boolean
    instagram: boolean
    facebook: boolean
  }
}

interface TLDPromo {
  tld: string
  name: string
  price: number
  originalPrice: number
  discount: number
  badge: string
  icon: React.ReactNode
  color: string
}

interface FilterState {
  tlds: string[]
  priceMin: number
  priceMax: number
  lengthMin: number
  lengthMax: number
  excludeNumbers: boolean
  excludeHyphens: boolean
  premiumOnly: boolean
  availableOnly: boolean
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

const POPULAR_TLDS = [".com", ".net", ".io", ".ai", ".co", ".app", ".dev", ".org"]

const TLD_PROMOS: TLDPromo[] = [
  { tld: ".com", name: "Most Popular", price: 8.99, originalPrice: 14.99, discount: 40, badge: "Best Seller", icon: <Globe className="h-6 w-6" />, color: "from-blue-500 to-blue-600" },
  { tld: ".io", name: "Tech Favorite", price: 29.99, originalPrice: 49.99, discount: 40, badge: "Developer Pick", icon: <Code className="h-6 w-6" />, color: "from-purple-500 to-purple-600" },
  { tld: ".ai", name: "AI & Tech", price: 49.99, originalPrice: 89.99, discount: 44, badge: "Hot TLD! 🔥", icon: <Sparkles className="h-6 w-6" />, color: "from-amber-500 to-orange-500" },
  { tld: ".app", name: "Applications", price: 12.99, originalPrice: 19.99, discount: 35, badge: "App Builders", icon: <Layers className="h-6 w-6" />, color: "from-green-500 to-emerald-500" },
  { tld: ".dev", name: "Developers", price: 11.99, originalPrice: 17.99, discount: 33, badge: "Code Ready", icon: <Server className="h-6 w-6" />, color: "from-cyan-500 to-teal-500" },
  { tld: ".co", name: "Companies", price: 9.99, originalPrice: 29.99, discount: 67, badge: "Biggest Save!", icon: <TrendingUp className="h-6 w-6" />, color: "from-red-500 to-rose-500" },
]

const TRUST_BADGES = [
  { icon: <Users className="h-5 w-5" />, text: "500K+ Domains Registered" },
  { icon: <Headphones className="h-5 w-5" />, text: "24/7 Expert Support" },
  { icon: <Shield className="h-5 w-5" />, text: "Free WHOIS Privacy" },
  { icon: <Lock className="h-5 w-5" />, text: "Free SSL Certificate" },
]

const WHY_CHOOSE_US = [
  { icon: <Shield className="h-8 w-8" />, title: "Free WHOIS Privacy", description: "Protect your personal information for life at no extra cost" },
  { icon: <Zap className="h-8 w-8" />, title: "One-Click DNS", description: "Manage your DNS records with our intuitive control panel" },
  { icon: <Headphones className="h-8 w-8" />, title: "24/7 Support", description: "Expert help available around the clock via chat, phone, or email" },
  { icon: <Eye className="h-8 w-8" />, title: "Transparent Pricing", description: "No hidden fees. What you see is what you pay" },
  { icon: <ShieldCheck className="h-8 w-8" />, title: "Free SSL Certificates", description: "Secure your website with industry-standard encryption" },
  { icon: <RefreshCw className="h-8 w-8" />, title: "Easy Transfers", description: "Move your domains to us in minutes with no downtime" },
]

const DEFAULT_FILTERS: FilterState = {
  tlds: [],
  priceMin: 0,
  priceMax: 500,
  lengthMin: 1,
  lengthMax: 63,
  excludeNumbers: false,
  excludeHyphens: false,
  premiumOnly: false,
  availableOnly: false,
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Domains",
    dropdown: [
      { label: "Domain Search", href: "/domains", icon: <Search className="h-4 w-4" />, description: "Find your perfect domain" },
      { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
      { label: "Bulk Registration", href: "/domains/bulk", icon: <Layers className="h-4 w-4" />, description: "Register multiple domains" },
      { label: "Domain Auctions", href: "/domains/auctions", icon: <Gavel className="h-4 w-4" />, description: "Bid on premium domains" },
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateMockResults(query: string, tlds: string[]): DomainResult[] {
  const baseName = query.toLowerCase().replace(/[^a-z0-9]/g, "")
  const targetTlds = tlds.length > 0 ? tlds : POPULAR_TLDS
  const results: DomainResult[] = []

  targetTlds.forEach((tld, index) => {
    const domain = `${baseName}${tld}`
    const isAvailable = Math.random() > 0.3
    const isPremium = isAvailable && Math.random() > 0.8
    const isAuction = !isAvailable && Math.random() > 0.7

    const lengthScore = Math.max(0, 100 - (baseName.length - 5) * 10)
    const memorabilityScore = baseName.includes("-") || /\d/.test(baseName) ? 60 : 90
    const seoScore = Math.floor(Math.random() * 40) + 60
    const brandabilityScore = baseName.length <= 8 ? 85 : 65

    results.push({
      domain,
      tld,
      available: isAvailable,
      status: isPremium ? "premium" : isAuction ? "auction" : isAvailable ? "available" : "taken",
      price: isPremium ? Math.floor(Math.random() * 5000) + 500 : TLD_PROMOS.find(p => p.tld === tld)?.price || 12.99,
      renewalPrice: TLD_PROMOS.find(p => p.tld === tld)?.originalPrice || 14.99,
      score: Math.floor((lengthScore + memorabilityScore + seoScore + brandabilityScore) / 4),
      scoreBreakdown: { length: lengthScore, memorability: memorabilityScore, seo: seoScore, brandability: brandabilityScore },
      premium: isPremium,
      auction: isAuction ? { currentBid: Math.floor(Math.random() * 1000) + 100, endTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() } : undefined,
      history: !isAvailable ? { registeredDate: "2018-03-15", isParked: Math.random() > 0.5, estimatedValue: Math.floor(Math.random() * 10000) + 1000 } : undefined,
      socialAvailability: isAvailable ? { twitter: Math.random() > 0.4, instagram: Math.random() > 0.5, facebook: Math.random() > 0.6 } : undefined,
    })
  })

  return results.sort((a, b) => {
    if (a.available && !b.available) return -1
    if (!a.available && b.available) return 1
    return b.score - a.score
  })
}

function generateAISuggestions(idea: string): DomainResult[] {
  const words = idea.toLowerCase().split(" ").filter(w => w.length > 2)
  const suggestions: string[] = []
  
  // Generate creative combinations
  if (words.length >= 2) {
    suggestions.push(words.slice(0, 2).join(""))
    suggestions.push(words[0] + words[words.length - 1])
  }
  if (words[0]) {
    suggestions.push(words[0] + "hub")
    suggestions.push(words[0] + "ify")
    suggestions.push("get" + words[0])
    suggestions.push(words[0] + "ly")
    suggestions.push("my" + words[0])
    suggestions.push(words[0] + "io")
    suggestions.push("the" + words[0])
    suggestions.push(words[0] + "app")
  }

  return suggestions.slice(0, 12).flatMap(name => 
    [".com", ".io", ".co", ".app"].map(tld => {
      const isAvailable = Math.random() > 0.25
      const isPremium = isAvailable && Math.random() > 0.85
      return {
        domain: name + tld,
        tld,
        available: isAvailable,
        status: isPremium ? "premium" as AvailabilityStatus : isAvailable ? "available" as AvailabilityStatus : "taken" as AvailabilityStatus,
        price: isPremium ? Math.floor(Math.random() * 2000) + 200 : TLD_PROMOS.find(p => p.tld === tld)?.price || 12.99,
        renewalPrice: TLD_PROMOS.find(p => p.tld === tld)?.originalPrice || 14.99,
        score: Math.floor(Math.random() * 30) + 70,
        scoreBreakdown: { length: 80, memorability: 85, seo: 75, brandability: 90 },
        premium: isPremium,
        socialAvailability: isAvailable ? { twitter: Math.random() > 0.4, instagram: Math.random() > 0.5, facebook: Math.random() > 0.6 } : undefined,
      }
    })
  ).filter(d => d.available).slice(0, 15)
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400"
  if (score >= 75) return "text-lime-400"
  if (score >= 60) return "text-yellow-400"
  if (score >= 40) return "text-orange-400"
  return "text-red-400"
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 75) return "Great"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Poor"
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
  const toggleExpanded = (label: string) => { setExpandedItems((prev) => { const next = new Set(prev); next.has(label) ? next.delete(label) : next.add(label); return next }) }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} role="dialog" aria-modal="true">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}><Globe className="h-8 w-8 text-red-500" /><span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
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
                    {item.dropdown.map((di) => (<Link key={di.href} href={di.href} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"}`} onClick={onClose}><span className={theme === "dark" ? "text-red-400" : "text-red-500"}>{di.icon}</span>{di.label}</Link>))}
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

function Navigation({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="DomainPro Home">
            <div className="relative"><Globe className="h-8 w-8 text-red-500" /><div className="absolute inset-0 h-8 w-8 bg-red-500 blur-lg opacity-30 animate-pulse" /></div>
            <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (<NavDropdown key={item.label} item={item} theme={theme} isOpen={openDropdown === item.label} onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} onClose={() => setOpenDropdown(null)} />))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link href="/auth/login" className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>Sign In</Link>
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
    { name: "Twitter", href: "#", icon: <Twitter className="h-5 w-5" /> },
    { name: "Instagram", href: "#", icon: <Instagram className="h-5 w-5" /> },
    { name: "Facebook", href: "#", icon: <Facebook className="h-5 w-5" /> },
  ]

  return (
    <footer className={`border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{section.title}</h3>
              <ul className="space-y-3">{section.links.map((link) => (<li key={link.href}><Link href={link.href} className={`text-sm transition-colors ${theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{link.label}</Link></li>))}</ul>
            </div>
          ))}
        </div>
        <div className={`pt-8 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2"><Globe className="h-6 w-6 text-red-500" /><span className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>DomainPro</span></Link>
              <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>© {new Date().getFullYear()} DomainPro. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">{socialLinks.map((s) => (<a key={s.name} href={s.href} className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-gray-500 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`} aria-label={`Follow us on ${s.name}`}>{s.icon}</a>))}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

function SearchBar({ theme, searchMode, setSearchMode, searchQuery, setSearchQuery, onSearch, isSearching }: { theme: Theme; searchMode: SearchMode; setSearchMode: (mode: SearchMode) => void; searchQuery: string; setSearchQuery: (query: string) => void; onSearch: () => void; isSearching: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) onSearch()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className={`inline-flex rounded-full p-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
          <button onClick={() => setSearchMode("standard")} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${searchMode === "standard" ? "bg-red-500 text-white shadow-lg" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <Search className="h-4 w-4 inline mr-2" />Standard Search
          </button>
          <button onClick={() => setSearchMode("ai")} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${searchMode === "ai" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <Sparkles className="h-4 w-4 inline mr-2" />AI-Powered Search
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${theme === "dark" ? "bg-gray-800 ring-1 ring-gray-700" : "bg-white ring-1 ring-gray-200"}`}>
        <div className="flex items-center">
          <div className="pl-6">
            {searchMode === "ai" ? <Sparkles className="h-6 w-6 text-purple-400" /> : <Search className="h-6 w-6 text-gray-400" />}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchMode === "ai" ? "Describe your business or idea..." : "Search for your perfect domain..."}
            className={`flex-1 px-4 py-5 text-lg bg-transparent border-none outline-none ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
          />
          <button
            onClick={onSearch}
            disabled={!searchQuery.trim() || isSearching}
            className={`m-2 px-8 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${searchMode === "ai" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : "bg-red-500 hover:bg-red-600"} shadow-lg`}
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : searchMode === "ai" ? <><Sparkles className="h-5 w-5 inline mr-2" />Generate</> : <><Search className="h-5 w-5 inline mr-2" />Search</>}
          </button>
        </div>
      </div>

      {/* Quick TLD Pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {POPULAR_TLDS.map((tld) => (
          <button key={tld} onClick={() => setSearchQuery(searchQuery.replace(/\.[a-z]+$/i, "") + tld)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-red-500/20 hover:text-red-400 border border-gray-700 hover:border-red-500/50" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200"}`}>
            {tld}
          </button>
        ))}
      </div>
    </div>
  )
}

function TrustBadges({ theme }: { theme: Theme }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {TRUST_BADGES.map((badge, index) => (
        <div key={index} className={`flex items-center gap-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <span className="text-green-500">{badge.icon}</span>
          <span className="text-sm font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// DOMAIN RESULT COMPONENTS
// ============================================================================

function DomainScore({ score, breakdown, theme }: { score: number; breakdown: DomainResult["scoreBreakdown"]; theme: Theme }) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setShowBreakdown(!showBreakdown)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${theme === "dark" ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
        <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</div>
        <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Score</div>
        <Info className="h-3 w-3 text-gray-500" />
      </button>
      
      {showBreakdown && (
        <div className={`absolute top-full right-0 mt-2 p-4 rounded-xl shadow-xl z-20 w-64 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Domain Score Breakdown</div>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between mb-2">
              <span className={`text-sm capitalize ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{key}</span>
              <div className="flex items-center gap-2">
                <div className={`w-20 h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className={`h-full rounded-full ${value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${value}%` }} />
                </div>
                <span className={`text-sm font-medium ${getScoreColor(value)}`}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SocialAvailability({ social, theme }: { social: DomainResult["socialAvailability"]; theme: Theme }) {
  if (!social) return null

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Social:</span>
      <div className={`p-1 rounded ${social.twitter ? "text-green-400" : "text-red-400"}`}><Twitter className="h-3.5 w-3.5" /></div>
      <div className={`p-1 rounded ${social.instagram ? "text-green-400" : "text-red-400"}`}><Instagram className="h-3.5 w-3.5" /></div>
      <div className={`p-1 rounded ${social.facebook ? "text-green-400" : "text-red-400"}`}><Facebook className="h-3.5 w-3.5" /></div>
    </div>
  )
}

function DomainCard({ domain, theme, isInCart, isInWatchlist, onAddToCart, onToggleWatchlist, viewMode }: { domain: DomainResult; theme: Theme; isInCart: boolean; isInWatchlist: boolean; onAddToCart: () => void; onToggleWatchlist: () => void; viewMode: ViewMode }) {
  const statusConfig = {
    available: { icon: <Check className="h-4 w-4" />, text: "Available", color: "text-green-400 bg-green-500/10 border-green-500/30" },
    premium: { icon: <Crown className="h-4 w-4" />, text: "Premium", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    taken: { icon: <X className="h-4 w-4" />, text: "Taken", color: "text-red-400 bg-red-500/10 border-red-500/30" },
    auction: { icon: <Gavel className="h-4 w-4" />, text: "Auction", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  }

  const status = statusConfig[domain.status]

  if (viewMode === "list") {
    return (
      <div className={`p-4 rounded-xl border transition-all ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"} ${domain.status === "taken" ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${status.color}`}>{status.icon}{status.text}</div>
            <div className={`text-lg font-bold truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{domain.domain}</div>
            <DomainScore score={domain.score} breakdown={domain.scoreBreakdown} theme={theme} />
            {domain.socialAvailability && <SocialAvailability social={domain.socialAvailability} theme={theme} />}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${domain.price.toFixed(2)}<span className="text-sm font-normal text-gray-500">/yr</span></div>
              {domain.renewalPrice !== domain.price && <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Renews ${domain.renewalPrice.toFixed(2)}/yr</div>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onToggleWatchlist} className={`p-2 rounded-lg transition-all ${isInWatchlist ? "text-red-500 bg-red-500/10" : theme === "dark" ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10" : "text-gray-500 hover:text-red-500 hover:bg-red-50"}`} aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
                {isInWatchlist ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}
              </button>
              {domain.available && (
                <button onClick={onAddToCart} className={`px-4 py-2 rounded-lg font-semibold transition-all ${isInCart ? "bg-green-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}>
                  {isInCart ? <><Check className="h-4 w-4 inline mr-1" />Added</> : <><ShoppingCart className="h-4 w-4 inline mr-1" />Add</>}
                </button>
              )}
              {domain.status === "auction" && domain.auction && (
                <button className="px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"><Gavel className="h-4 w-4 inline mr-1" />Bid ${domain.auction.currentBid}</button>
              )}
              {domain.status === "taken" && (
                <button className={`px-4 py-2 rounded-lg font-semibold transition-all ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}><Send className="h-4 w-4 inline mr-1" />Make Offer</button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className={`p-5 rounded-xl border transition-all ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"} ${domain.status === "taken" ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${status.color}`}>{status.icon}{status.text}</div>
        <button onClick={onToggleWatchlist} className={`p-1.5 rounded-lg transition-all ${isInWatchlist ? "text-red-500 bg-red-500/10" : theme === "dark" ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}>
          {isInWatchlist ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
        </button>
      </div>
      
      <div className={`text-xl font-bold mb-2 truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{domain.domain}</div>
      
      <div className="flex items-center justify-between mb-3">
        <DomainScore score={domain.score} breakdown={domain.scoreBreakdown} theme={theme} />
        {domain.socialAvailability && <SocialAvailability social={domain.socialAvailability} theme={theme} />}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${domain.price.toFixed(2)}</div>
          <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>/year • Renews ${domain.renewalPrice.toFixed(2)}</div>
        </div>
        {domain.available && (
          <button onClick={onAddToCart} className={`px-4 py-2 rounded-lg font-semibold transition-all ${isInCart ? "bg-green-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}>
            {isInCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
        {domain.status === "taken" && <button className={`px-3 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}>Make Offer</button>}
      </div>

      {domain.history && (
        <div className={`mt-3 pt-3 border-t text-xs ${theme === "dark" ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
          Registered: {domain.history.registeredDate} • Est. Value: ${domain.history.estimatedValue.toLocaleString()}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FILTER & RESULTS COMPONENTS
// ============================================================================

function FilterSidebar({ theme, filters, setFilters, isOpen, onClose }: { theme: Theme; filters: FilterState; setFilters: (filters: FilterState) => void; isOpen: boolean; onClose: () => void }) {
  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  const content = (
    <div className={`p-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" />Filters</h3>
        <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-400">Reset All</button>
      </div>

      {/* TLD Selection */}
      <div className="mb-6">
        <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Extensions (TLDs)</h4>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_TLDS.map((tld) => (
            <label key={tld} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${filters.tlds.includes(tld) ? "bg-red-500/20 border border-red-500/50" : theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
              <input type="checkbox" checked={filters.tlds.includes(tld)} onChange={(e) => setFilters({ ...filters, tlds: e.target.checked ? [...filters.tlds, tld] : filters.tlds.filter(t => t !== tld) })} className="sr-only" />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.tlds.includes(tld) ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
                {filters.tlds.includes(tld) && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm">{tld}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Price Range</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input type="number" value={filters.priceMin} onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })} min={0} className={`w-full px-3 py-2 rounded-lg text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"} border`} placeholder="Min" />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <input type="number" value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })} min={0} className={`w-full px-3 py-2 rounded-lg text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"} border`} placeholder="Max" />
          </div>
        </div>
      </div>

      {/* Domain Length */}
      <div className="mb-6">
        <h4 className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Domain Length</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input type="number" value={filters.lengthMin} onChange={(e) => setFilters({ ...filters, lengthMin: Number(e.target.value) })} min={1} max={63} className={`w-full px-3 py-2 rounded-lg text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"} border`} placeholder="Min" />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <input type="number" value={filters.lengthMax} onChange={(e) => setFilters({ ...filters, lengthMax: Number(e.target.value) })} min={1} max={63} className={`w-full px-3 py-2 rounded-lg text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"} border`} placeholder="Max" />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
          <input type="checkbox" checked={filters.excludeNumbers} onChange={(e) => setFilters({ ...filters, excludeNumbers: e.target.checked })} className="sr-only" />
          <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.excludeNumbers ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {filters.excludeNumbers && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm">Exclude numbers</span>
        </label>
        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
          <input type="checkbox" checked={filters.excludeHyphens} onChange={(e) => setFilters({ ...filters, excludeHyphens: e.target.checked })} className="sr-only" />
          <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.excludeHyphens ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {filters.excludeHyphens && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm">Exclude hyphens</span>
        </label>
        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
          <input type="checkbox" checked={filters.premiumOnly} onChange={(e) => setFilters({ ...filters, premiumOnly: e.target.checked })} className="sr-only" />
          <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.premiumOnly ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {filters.premiumOnly && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm">Premium domains only</span>
        </label>
        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
          <input type="checkbox" checked={filters.availableOnly} onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })} className="sr-only" />
          <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.availableOnly ? "bg-red-500 border-red-500" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            {filters.availableOnly && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm">Available only</span>
        </label>
      </div>
    </div>
  )

  // Mobile: Bottom sheet
  if (isOpen) {
    return (
      <div className="lg:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className={`absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold">Filters</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
          {content}
          <div className="sticky bottom-0 p-4 border-t border-gray-700">
            <button onClick={onClose} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">Apply Filters</button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop: Sidebar
  return (
    <div className={`hidden lg:block w-72 flex-shrink-0 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      {content}
    </div>
  )
}

function ResultsHeader({ theme, resultCount, sortOption, setSortOption, viewMode, setViewMode, onOpenFilters }: { theme: Theme; resultCount: number; sortOption: SortOption; setSortOption: (sort: SortOption) => void; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void; onOpenFilters: () => void }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl mb-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
      <div className="flex items-center gap-4">
        <button onClick={onOpenFilters} className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>
          <Filter className="h-4 w-4" />Filters
        </button>
        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{resultCount} domains found</span>
      </div>
      <div className="flex items-center gap-3">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"} border`}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="length">Domain Length</option>
          <option value="score">Domain Score</option>
        </select>
        <div className={`flex rounded-lg overflow-hidden border ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-red-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-white text-gray-600"}`}><Grid3X3 className="h-4 w-4" /></button>
          <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-red-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-white text-gray-600"}`}><List className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}

function CartSummary({ theme, cart, watchlist, onRemoveFromCart, onClearCart }: { theme: Theme; cart: DomainResult[]; watchlist: DomainResult[]; onRemoveFromCart: (domain: string) => void; onClearCart: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const total = cart.reduce((sum, d) => sum + d.price, 0)

  if (cart.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-2xl transition-all">
        <ShoppingCart className="h-5 w-5" />
        <span>{cart.length} domain{cart.length !== 1 ? "s" : ""}</span>
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">${total.toFixed(2)}</span>
      </button>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-4 w-96 rounded-2xl shadow-2xl border overflow-hidden ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your Cart ({cart.length})</h3>
              <button onClick={onClearCart} className="text-sm text-red-500 hover:text-red-400">Clear All</button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
            {cart.map((domain) => (
              <div key={domain.domain} className={`flex items-center justify-between p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                <div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{domain.domain}</div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>${domain.price.toFixed(2)}/yr</div>
                </div>
                <button onClick={() => onRemoveFromCart(domain.domain)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Total (1st year)</span>
              <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-center rounded-xl">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PROMOTIONAL SECTIONS
// ============================================================================

function TLDPromoSection({ theme }: { theme: Theme }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Popular Extensions on Sale</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Grab these amazing deals before they&apos;re gone</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TLD_PROMOS.map((promo) => (
            <div key={promo.tld} className={`relative p-5 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"}`}>
              <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${promo.color}`}>{promo.badge}</div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${promo.color} text-white`}>{promo.icon}</div>
              <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{promo.tld}</div>
              <div className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{promo.name}</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>${promo.price}</span>
                <span className={`text-sm line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>${promo.originalPrice}</span>
              </div>
              <div className="text-xs text-green-400 font-medium mt-1">Save {promo.discount}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUsSection({ theme }: { theme: Theme }) {
  return (
    <section className={`py-16 ${theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Why Choose DomainPro?</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Everything you need to launch and grow your online presence</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, index) => (
            <div key={index} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"}`}>
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">{item.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// LOADING & SKELETON COMPONENTS
// ============================================================================

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function DomainCardSkeleton({ theme, viewMode }: { theme: Theme; viewMode: ViewMode }) {
  const skeletonBase = theme === "dark" ? "bg-gray-700" : "bg-gray-200"
  
  if (viewMode === "list") {
    return (
      <div className={`p-4 rounded-xl border animate-pulse ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-20 h-6 rounded-full ${skeletonBase}`} />
            <div className={`w-48 h-6 rounded ${skeletonBase}`} />
            <div className={`w-16 h-8 rounded-lg ${skeletonBase}`} />
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-24 h-8 rounded ${skeletonBase}`} />
            <div className={`w-20 h-10 rounded-lg ${skeletonBase}`} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-5 rounded-xl border animate-pulse ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-20 h-6 rounded-full ${skeletonBase}`} />
        <div className={`w-8 h-8 rounded-lg ${skeletonBase}`} />
      </div>
      <div className={`w-3/4 h-7 rounded mb-3 ${skeletonBase}`} />
      <div className="flex items-center justify-between mb-3">
        <div className={`w-16 h-8 rounded-lg ${skeletonBase}`} />
        <div className={`w-24 h-5 rounded ${skeletonBase}`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className={`w-20 h-8 rounded mb-1 ${skeletonBase}`} />
          <div className={`w-32 h-4 rounded ${skeletonBase}`} />
        </div>
        <div className={`w-12 h-10 rounded-lg ${skeletonBase}`} />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN CONTENT COMPONENT (uses useSearchParams - wrapped in Suspense)
// ============================================================================

function DomainSearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  
  const [theme, toggleTheme, mounted] = useTheme()
  const [searchMode, setSearchMode] = useState<SearchMode>("standard")
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<DomainResult[]>([])
  
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortOption, setSortOption] = useState<SortOption>("relevance")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [showFilters, setShowFilters] = useState(false)
  
  const [cart, setCart] = useState<DomainResult[]>([])
  const [watchlist, setWatchlist] = useState<DomainResult[]>([])

  const debouncedQuery = useDebounce(searchQuery, 300)

  // Auto-search if query param exists
  useEffect(() => {
    if (initialQuery && !hasSearched) {
      handleSearch()
    }
  }, [initialQuery])

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    // Update URL
    router.push(`/domains?q=${encodeURIComponent(searchQuery)}`, { scroll: false })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    if (searchMode === "ai") {
      const suggestions = generateAISuggestions(searchQuery)
      setAiSuggestions(suggestions)
      setResults([])
    } else {
      const searchResults = generateMockResults(searchQuery, filters.tlds)
      setResults(searchResults)
      setAiSuggestions([])
    }

    setIsSearching(false)
  }, [searchQuery, searchMode, filters.tlds, router])

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let filtered = searchMode === "ai" ? aiSuggestions : results

    if (filters.availableOnly) {
      filtered = filtered.filter(d => d.available)
    }
    if (filters.premiumOnly) {
      filtered = filtered.filter(d => d.premium)
    }
    if (filters.excludeNumbers) {
      filtered = filtered.filter(d => !/\d/.test(d.domain))
    }
    if (filters.excludeHyphens) {
      filtered = filtered.filter(d => !d.domain.includes("-"))
    }
    if (filters.tlds.length > 0) {
      filtered = filtered.filter(d => filters.tlds.includes(d.tld))
    }
    filtered = filtered.filter(d => d.price >= filters.priceMin && d.price <= filters.priceMax)
    filtered = filtered.filter(d => {
      const nameLength = d.domain.replace(/\.[a-z]+$/i, "").length
      return nameLength >= filters.lengthMin && nameLength <= filters.lengthMax
    })

    // Sort
    switch (sortOption) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price)
      case "length":
        return [...filtered].sort((a, b) => a.domain.length - b.domain.length)
      case "score":
        return [...filtered].sort((a, b) => b.score - a.score)
      default:
        return filtered
    }
  }, [results, aiSuggestions, searchMode, filters, sortOption])

  const addToCart = (domain: DomainResult) => {
    if (!cart.find(d => d.domain === domain.domain)) {
      setCart([...cart, domain])
    }
  }

  const removeFromCart = (domainName: string) => {
    setCart(cart.filter(d => d.domain !== domainName))
  }

  const toggleWatchlist = (domain: DomainResult) => {
    if (watchlist.find(d => d.domain === domain.domain)) {
      setWatchlist(watchlist.filter(d => d.domain !== domain.domain))
    } else {
      setWatchlist([...watchlist, domain])
    }
  }

  if (!mounted) return <LoadingFallback />

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navigation theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className={`py-16 md:py-24 ${theme === "dark" ? "bg-gradient-to-b from-gray-800/50 to-gray-900" : "bg-gradient-to-b from-gray-100 to-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Perfect Domain</span>
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              AI-powered search, instant availability, unbeatable pricing. Your online journey starts here.
            </p>
          </div>

          <SearchBar
            theme={theme}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

          <TrustBadges theme={theme} />
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <FilterSidebar
                theme={theme}
                filters={filters}
                setFilters={setFilters}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
              />

              {/* Results */}
              <div className="flex-1 min-w-0">
                <ResultsHeader
                  theme={theme}
                  resultCount={filteredResults.length}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onOpenFilters={() => setShowFilters(true)}
                />

                {isSearching ? (
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <DomainCardSkeleton key={i} theme={theme} viewMode={viewMode} />
                    ))}
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                    {filteredResults.map((domain) => (
                      <DomainCard
                        key={domain.domain}
                        domain={domain}
                        theme={theme}
                        isInCart={cart.some(d => d.domain === domain.domain)}
                        isInWatchlist={watchlist.some(d => d.domain === domain.domain)}
                        onAddToCart={() => addToCart(domain)}
                        onToggleWatchlist={() => toggleWatchlist(domain)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>No domains found</h3>
                    <p>Try adjusting your filters or search for a different term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promotional Sections (shown when no search) */}
      {!hasSearched && (
        <>
          <TLDPromoSection theme={theme} />
          <WhyChooseUsSection theme={theme} />
        </>
      )}

      {/* Cart Summary */}
      <CartSummary
        theme={theme}
        cart={cart}
        watchlist={watchlist}
        onRemoveFromCart={removeFromCart}
        onClearCart={() => setCart([])}
      />

      <Footer theme={theme} />
    </div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT (DEFAULT EXPORT)
// Wraps DomainSearchContent in Suspense boundary for Next.js 13+ App Router
// ============================================================================

export default function DomainSearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DomainSearchContent />
    </Suspense>
  )
}
