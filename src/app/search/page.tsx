"use client"

// ============================================================================
// DOMAINPRO DOMAIN SEARCH PAGE - REAL API INTEGRATION
// Uses /api/domain-check for actual availability checking
// Path: /src/app/search/page.tsx// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Globe, Check, X, Search, ShoppingCart, Filter, Grid, List, ChevronDown,
  ChevronUp, Sun, Moon, Menu, Loader2, AlertCircle, Star, Crown, Shield,
  ShieldCheck, Lock, Sparkles, Heart, Plus, RefreshCw, ExternalLink,
  Server, Cloud, HardDrive, Mail, Layers, Activity, Headphones, Code,
  MessageCircle, BarChart3, Network, Zap, Twitter, Instagram, Facebook,
  Eye, ArrowRight, Info, Tag, Clock, Award, CheckCircle, Database,
} from "lucide-react"
import { Toaster, toast } from "sonner"

// ============================================================================
// TYPES
// ============================================================================

type Theme = "light" | "dark"
type ViewMode = "grid" | "list"
type AvailabilityStatus = "available" | "taken" | "premium" | "checking" | "error"
type SortOption = "relevance" | "price-asc" | "price-desc" | "length" | "name"

interface DomainResult {
  domain: string
  available: boolean
  premium: boolean
  price: number | null
  }

  interface WatchlistItem {
  domain: string
  addedAt: string
  lastChecked?: string
  lastStatus?: AvailabilityStatus
}

interface SearchHistoryItem {
  query: string
  timestamp: string
  resultCount: number
}

interface BulkCheckItem {
  domain: string
  status: 'pending' | 'checking' | 'complete' | 'error'
  result?: DomainResult
  renewalPrice: number | null
  status: AvailabilityStatus
  error?: string 
expirationDate?: string
}

interface FilterState {
  tlds: string[]
  maxPrice: number
  minLength: number
  maxLength: number
  excludeNumbers: boolean
  excludeHyphens: boolean
  availableOnly: boolean
  premiumOnly: boolean
}

interface CartItem {
  id: string
  domain: string
  price: number
  period: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: { label: string; href: string; icon: React.ReactNode; description?: string }[]
}

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

// ============================================================================
// CONSTANTS
// ============================================================================

const POPULAR_TLDS = [
  { tld: "com", name: ".com", price: 12.99, discount: 40 },

  // ============================================================================
// CUSTOM HOOKS
// ============================================================================
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

  { tld: "net", name: ".net", price: 15.99 },
  { tld: "org", name: ".org", price: 13.99 },
  { tld: "io", name: ".io", price: 54.99, popular: true },
  { tld: "co", name: ".co", price: 30.99 },
  { tld: "ai", name: ".ai", price: 89.99, hot: true },
  { tld: "app", name: ".app", price: 18.99 },
  { tld: "dev", name: ".dev", price: 16.99 },
  { tld: "tech", name: ".tech", price: 12.99 },
  { tld: "online", name: ".online", price: 3.99 },
  { tld: "store", name: ".store", price: 3.99 },
  { tld: "shop", name: ".shop", price: 3.99 },
  { tld: "xyz", name: ".xyz", price: 9.99 },
  { tld: "site", name: ".site", price: 3.99 },
  { tld: "cloud", name: ".cloud", price: 11.99 },
  { tld: "digital", name: ".digital", price: 9.99 },
]

const DEFAULT_FILTERS: FilterState = {
  tlds: [], maxPrice: 100, minLength: 1, maxLength: 63,
  excludeNumbers: false, excludeHyphens: false, availableOnly: false, premiumOnly: false,
}

const NAV_ITEMS: NavItem[] = [
  { label: "Domains", dropdown: [
    { label: "Domain Search", href: "/search", icon: <Globe className="h-4 w-4" />, description: "Find your perfect domain" },
    { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
    { label: "Bulk Registration", href: "/domains/bulk", icon: <Layers className="h-4 w-4" />, description: "Register multiple domains" },
  ]},
  { label: "Hosting", dropdown: [
    { label: "Web Hosting", href: "/hosting/web", icon: <Server className="h-4 w-4" />, description: "Reliable shared hosting" },
    { label: "WordPress Hosting", href: "/hosting/wordpress", icon: <Globe className="h-4 w-4" />, description: "Optimized for WordPress" },
    { label: "VPS Hosting", href: "/hosting/vps", icon: <HardDrive className="h-4 w-4" />, description: "Virtual private servers" },
  ]},
  { label: "Services", dropdown: [
    { label: "SSL Certificates", href: "/services/ssl", icon: <ShieldCheck className="h-4 w-4" />, description: "Secure your website" },
    { label: "Email Hosting", href: "/services/email", icon: <Mail className="h-4 w-4" />, description: "Professional email" },
  ]},
  { label: "Support", dropdown: [
    { label: "Help Center", href: "/support/help", icon: <Headphones className="h-4 w-4" />, description: "Browse articles" },
    { label: "Contact Us", href: "/support/contact", icon: <MessageCircle className="h-4 w-4" />, description: "Get in touch" },
  ]},
  { label: "Pricing", href: "/pricing" },
]

const FOOTER_SECTIONS: FooterSection[] = [
  { title: "DOMAINS", links: [{ label: "Domain Search", href: "/search" }, { label: "Domain Transfer", href: "/domains/transfer" }] },
  { title: "HOSTING", links: [{ label: "Web Hosting", href: "/hosting/web" }, { label: "WordPress Hosting", href: "/hosting/wordpress" }] },
  { title: "SERVICES", links: [{ label: "SSL Certificates", href: "/services/ssl" }, { label: "Email Hosting", href: "/services/email" }] },
  { title: "COMPANY", links: [{ label: "About Us", href: "/about" }, { label: "Blog", href: "/blog" }] },
  { title: "SUPPORT", links: [{ label: "Help Center", href: "/support/help" }, { label: "Contact Us", href: "/support/contact" }] },
  { title: "LEGAL", links: [{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }] },
]

const TRUST_BADGES = [
  { icon: <Globe className="h-6 w-6" />, label: "500K+ Domains", sublabel: "Registered" },
  { icon: <Headphones className="h-6 w-6" />, label: "24/7 Support", sublabel: "Always Here" },
  { icon: <Shield className="h-6 w-6" />, label: "Free WHOIS", sublabel: "Privacy" },
  { icon: <Lock className="h-6 w-6" />, label: "Free SSL", sublabel: "Included" },
]

// ============================================================================
// HOOKS
// ============================================================================

function useTheme(): [Theme, () => void, boolean] {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    try { const saved = localStorage.getItem("theme") as Theme | null; if (saved === "light" || saved === "dark") setTheme(saved) } catch {}
  }, [])
  const toggle = useCallback(() => {
    setTheme(p => { const n = p === "dark" ? "light" : "dark"; try { localStorage.setItem("theme", n) } catch {}; return n })
  }, [])
  return [theme, toggle, mounted]
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial)
  useEffect(() => { try { const i = localStorage.getItem(key); if (i) setValue(JSON.parse(i)) } catch {} }, [key])
  const setStored = useCallback((v: T | ((p: T) => T)) => {
    setValue(prev => { const next = v instanceof Function ? v(prev) : v; try { localStorage.setItem(key, JSON.stringify(next)) } catch {}; return next })
  }, [key])
  return [value, setStored]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatPrice(price: number): string { return "$" + price.toFixed(2) }
function normalizeDomain(input: string): string { return input.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/i, "").split("/")[0].replace(/\s/g, "") }
function extractName(domain: string): string { return domain.split(".")[0] }
function generateDomainVariations(query: string): string[] {
  // Extract just the domain name, removing any existing TLD
  const normalized = normalizeDomain(query)
  const parts = normalized.split(".")
  // If input has multiple parts (like mindscapesmedia.com), take all BUT the last part
  // This handles: mindscapesmedia.com -> mindscapesmedia, example.co.uk -> example.co
  const name = parts.length > 1 ? parts.slice(0, -1).join(".") : parts[0]
      if (!name) return []
  return POPULAR_TLDS.map(t => name + "." + t.tld).slice(0, 16)
}

// ========================================================================
// NAVIGATION
// ============================================================================

function ThemeToggle({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return <button onClick={toggleTheme} className={"p-2 rounded-lg transition-all " + (theme === "dark" ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700")} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
}

function NavDropdown({ item, theme, isOpen, onToggle, onClose }: { item: NavItem; theme: Theme; isOpen: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }; if (isOpen) document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h) }, [isOpen, onClose])
  if (!item.dropdown) return <Link href={item.href || "#"} className={"font-medium " + (theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{item.label}</Link>
  return (
    <div className="relative" ref={ref}>
      <button onClick={onToggle} className={"flex items-center gap-1 font-medium " + (theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{item.label}{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
      {isOpen && (
        <div className={"absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 " + (theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}>
          <div className="p-2">{item.dropdown.map(di => (
            <Link key={di.href} href={di.href} className={"flex items-start gap-3 p-3 rounded-lg " + (theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100")} onClick={onClose}>
              <div className={"p-2 rounded-lg " + (theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600")}>{di.icon}</div>
              <div><div className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{di.label}</div>{di.description && <div className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>{di.description}</div>}</div>
            </Link>
          ))}</div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ theme, isOpen, onClose }: { theme: Theme; isOpen: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  if (!isOpen) return null
  return (
    <div className={"fixed inset-0 z-50 " + (theme === "dark" ? "bg-gray-900" : "bg-white")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}><Globe className="h-8 w-8 text-red-500" /><span className={"text-xl font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>DomainPro</span></Link>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-6 w-6" /></button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {NAV_ITEMS.map(item => (
          <div key={item.label} className="mb-2">
            {item.dropdown ? (
              <>
                <button onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(item.label) ? n.delete(item.label) : n.add(item.label); return n })} className={"w-full flex items-center justify-between p-3 rounded-lg font-medium " + (theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100")}>{item.label}{expanded.has(item.label) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
                {expanded.has(item.label) && <div className="ml-4 mt-1 space-y-1">{item.dropdown.map(di => <Link key={di.href} href={di.href} className={"flex items-center gap-3 p-3 rounded-lg " + (theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50")} onClick={onClose}><span className="text-red-400">{di.icon}</span>{di.label}</Link>)}</div>}
              </>
            ) : <Link href={item.href || "#"} className={"block p-3 rounded-lg font-medium " + (theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100")} onClick={onClose}>{item.label}</Link>}
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
    <header className={"sticky top-0 z-40 border-b backdrop-blur-xl " + (theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2"><div className="relative"><Globe className="h-8 w-8 text-red-500" /><div className="absolute inset-0 h-8 w-8 bg-red-500 blur-lg opacity-30 animate-pulse" /></div><span className={"text-xl font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>DomainPro</span></Link>
          <nav className="hidden lg:flex items-center gap-6">{NAV_ITEMS.map(item => <NavDropdown key={item.label} item={item} theme={theme} isOpen={openDropdown === item.label} onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} onClose={() => setOpenDropdown(null)} />)}</nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link href="/checkout" className={"relative p-2 rounded-lg " + (theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100")}><ShoppingCart className="h-5 w-5" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</Link>
            <Link href="/login" className={"hidden sm:flex px-4 py-2 rounded-lg font-bold " + (theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100")}>Sign In</Link>
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
    <footer className={"border-t " + (theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className={"text-sm font-semibold mb-4 " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>{section.title}</h3>
              <ul className="space-y-3">{section.links.map(link => <li key={link.href}><Link href={link.href} className={"text-sm " + (theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{link.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className={"pt-8 border-t " + (theme === "dark" ? "border-gray-800" : "border-gray-200")}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4"><Link href="/" className="flex items-center gap-2"><Globe className="h-6 w-6 text-red-500" /><span className={"font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>DomainPro</span></Link><span className={"text-sm " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>© {new Date().getFullYear()} DomainPro</span></div>
            <div className="flex gap-4"><a href="#" className={"p-2 rounded-lg " + (theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600")}><Twitter className="h-5 w-5" /></a><a href="#" className={"p-2 rounded-lg " + (theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600")}><Facebook className="h-5 w-5" /></a></div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

function SearchBar({ theme, query, setQuery, onSearch, isSearching }: { theme: Theme; query: string; setQuery: (q: string) => void; onSearch: () => void; isSearching: boolean }) {
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") onSearch() }
  return (
    <div className={"p-2 rounded-2xl " + (theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white border border-gray-200 shadow-lg")}>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className={"absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 " + (theme === "dark" ? "text-gray-500" : "text-gray-400")} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder onFocus={() => setShowSuggestions(true)}="Search for your perfect domain..." className={"w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 " + (theme === "dark" ? "bg-gray-900 text-white placeholder-gray-500" : "bg-gray-50 text-gray-900 placeholder-gray-400") + " focus:outline-none focus:ring-2 focus:ring-red-500"} />
        </div>
                  {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(suggestion)
                    setShowSuggestions(false)
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${idx === selectedSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        <button onClick={onSearch} disabled={isSearching || !query.trim()} className="px-8 py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold text-lg rounded-xl flex items-center gap-2 transition-all">
          {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}<span className="hidden sm:inline">Search</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 px-2">
        {POPULAR_TLDS.slice(0, 8).map(t => (
          <button key={t.tld} onClick={() => { if (query) setQuery(extractName(query) + "." + t.tld) }} className={"px-3 py-1 text-sm rounded-full transition-all " + (theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600")}>{t.name} <span className="text-green-500 ml-1">{formatPrice(t.price)}</span></button>
        ))}
      </div>
    </div>

            {/* Action Buttons Row */}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowBulkCheck(!showBulkCheck)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Layers className="h-4 w-4" />
            Bulk Check
          </button>
          <button
            onClick={checkWatchlist}
            disabled={watchlist.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Heart className="h-4 w-4" />
            Check Watchlist ({watchlist.length})
          </button>
          {searchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Clear History
            </button>
          )}
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+K</kbd> or <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">/</kbd> to search
          </div>
        </div>
  )
}

        {/* Bulk Check Modal */}
        {showBulkCheck && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-600" />
                Bulk Domain Check
              </h3>
              <button onClick={() => setShowBulkCheck(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 mb-3"
              placeholder="Enter domains, one per line:\nexample.com\nanother-domain.net\ncool-startup.io"
              onChange={(e) => {
                const domains = e.target.value.split('\n').filter(d => d.trim())
                setBulkCheckList(domains.map(d => ({ domain: d.trim(), status: 'pending' })))
              }}
            />
            <button
              onClick={() => {
                const domains = bulkCheckList.map(item => item.domain)
                if (domains.length > 0) handleBulkCheck(domains)
              }}
              disabled={bulkCheckList.length === 0}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Check {bulkCheckList.length} Domain{bulkCheckList.length !== 1 ? 's' : ''}
            </button>
            
            {/* Bulk Check Results */}
            {bulkCheckList.length > 0 && bulkCheckList.some(item => item.status !== 'pending') && (
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {bulkCheckList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="font-medium">{item.domain}</span>
                    {item.status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                    {item.status === 'complete' && item.result && (
                      <span className={item.result.available ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {item.result.available ? '✓ Available' : '✗ Taken'}
                      </span>
                    )}
                    {item.status === 'error' && <span className="text-red-600">Error</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

function TrustBadges({ theme }: { theme: Theme }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8">
      {TRUST_BADGES.map((badge, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={"p-2 rounded-lg " + (theme === "dark" ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600")}>{badge.icon}</div>
          <div><div className={"font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{badge.label}</div><div className={"text-xs " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>{badge.sublabel}</div></div>
        </div>
      ))}
    </div>
  )
}

function DomainCardSkeleton({ theme, viewMode }: { theme: Theme; viewMode: ViewMode }) {
  if (viewMode === "list") return <div className={"p-4 rounded-xl border animate-pulse " + (theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}><div className="flex items-center gap-4"><div className={"w-6 h-6 rounded-full " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /><div className={"h-6 w-48 rounded " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /><div className="flex-1" /><div className={"h-10 w-32 rounded-lg " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /></div></div>
  return <div className={"p-6 rounded-2xl border animate-pulse " + (theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}><div className={"h-6 w-3/4 rounded mb-4 " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /><div className={"h-4 w-1/2 rounded mb-4 " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /><div className={"h-12 w-full rounded-xl " + (theme === "dark" ? "bg-gray-700" : "bg-gray-200")} /></div>
}

function DomainCard({ result, theme, viewMode, onAddToCart, inCart, onToggleWatchlist, inWatchlist }: { result: DomainResult; theme: Theme; viewMode: ViewMode; onAddToCart: () => void; inCart: boolean; onToggleWatchlist: () => void; inWatchlist: boolean }) {
  const getStatusBadge = () => {
    if (result.status === "checking") return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Checking</span>
    if (result.status === "error") return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">Error</span>
    if (result.available && result.premium) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><Crown className="h-3 w-3" />Premium</span>
    if (result.available) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><Check className="h-3 w-3" />Available</span>
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 flex items-center gap-1"><X className="h-3 w-3" />Taken</span>
  }

  if (viewMode === "list") {
    return (
      <div className={"p-4 rounded-xl border transition-all " + (result.available ? (theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-green-500/50" : "bg-white border-gray-200 hover:border-green-500") : (theme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"))}>
        <div className="flex items-center gap-4">
          <div className={"w-2 h-2 rounded-full " + (result.status === "checking" ? "bg-blue-500 animate-pulse" : result.available ? "bg-green-500" : "bg-red-500")} />
          <div className="flex-1 min-w-0"><div className={"font-semibold truncate " + (theme === "dark" ? "text-white" : "text-gray-900")}>{result.domain}</div></div>
          {getStatusBadge()}
          {result.available && result.price && <div className={"font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formatPrice(result.price)}<span className={"text-sm font-normal " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>/yr</span></div>}
          {result.available ? (
            <div className="flex items-center gap-2">
              <button onClick={onToggleWatchlist} className={"p-2 rounded-lg " + (inWatchlist ? "text-red-500" : theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600")}><Heart className={"h-5 w-5 " + (inWatchlist ? "fill-current" : "")} /></button>
              <button onClick={onAddToCart} disabled={inCart} className={"px-4 py-2 rounded-lg font-medium " + (inCart ? "bg-green-500 text-white" : "bg-red-500 hover:bg-red-600 text-white")}>{inCart ? <><Check className="h-4 w-4 inline mr-1" />Added</> : <><Plus className="h-4 w-4 inline mr-1" />Add</>}</button>
            </div>
          ) : <button className={"px-4 py-2 rounded-lg font-medium " + (theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500")}>View Details</button>}
        </div>
      </div>
    )
  }

  return (
    <div className={"p-6 rounded-2xl border transition-all " + (result.available ? (theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10" : "bg-white border-gray-200 hover:border-green-500 hover:shadow-lg") : (theme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"))}>
      <div className="flex items-start justify-between mb-3">
        {getStatusBadge()}
        {result.available && <button onClick={onToggleWatchlist} className={"p-1 rounded " + (inWatchlist ? "text-red-500" : theme === "dark" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-600")}><Heart className={"h-5 w-5 " + (inWatchlist ? "fill-current" : "")} /></button>}
      </div>
      <div className={"text-xl font-bold mb-2 truncate " + (theme === "dark" ? "text-white" : "text-gray-900")}>{result.domain}</div>
      {result.available && result.price ? (
        <>
          <div className="mb-4"><span className={"text-2xl font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{formatPrice(result.price)}</span><span className={"text-sm " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>/year</span>{result.renewalPrice && result.renewalPrice !== result.price && <div className={"text-xs mt-1 " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>Renews at {formatPrice(result.renewalPrice)}/yr</div>}</div>
          <button onClick={onAddToCart} disabled={inCart} className={"w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 " + (inCart ? "bg-green-500 text-white" : "bg-red-500 hover:bg-red-600 text-white")}>{inCart ? <><Check className="h-5 w-5" />In Cart</> : <><Plus className="h-5 w-5" />Add to Cart</>}</button>
        </>
      ) : result.status === "checking" ? (
        <div className={"flex items-center gap-2 " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}><Loader2 className="h-4 w-4 animate-spin" />Checking availability...</div>
      ) : (
        <div className={"text-sm " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>{result.expirationDate ? "Expires: " + new Date(result.expirationDate).toLocaleDateString() : "This domain is registered"}</div>
      )}
    </div>
  )
}

function FilterSidebar({ theme, filters, setFilters, isOpen, onClose }: { theme: Theme; filters: FilterState; setFilters: (f: FilterState) => void; isOpen: boolean; onClose: () => void }) {
  const toggleTLD = (tld: string) => setFilters({ ...filters, tlds: filters.tlds.includes(tld) ? filters.tlds.filter(t => t !== tld) : [...filters.tlds, tld] })
  const content = (
    <div className="space-y-6">
      <div>
        <h3 className={"font-bold mb-3 " + (theme === "dark" ? "text-white" : "text-gray-900")}>TLD Extensions</h3>
        <div className="flex flex-wrap gap-2">{POPULAR_TLDS.map(t => <button key={t.tld} onClick={() => toggleTLD(t.tld)} className={"px-3 py-1.5 text-sm rounded-lg transition-all " + (filters.tlds.includes(t.tld) ? "bg-red-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>.{t.tld}</button>)}</div>
      </div>
      <div>
        <h3 className={"font-bold mb-3 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Max Price</h3>
        <input type="range" min="5" max="200" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })} className="w-full accent-red-500" />
        <div className={"text-sm " + (theme === "dark" ? "text-gray-400" : "text-gray-500")}>Up to {formatPrice(filters.maxPrice)}/year</div>
      </div>
      <div className="space-y-3">
        <label className={"flex items-center gap-3 cursor-pointer " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}><input type="checkbox" checked={filters.availableOnly} onChange={e => setFilters({ ...filters, availableOnly: e.target.checked })} className="w-4 h-4 accent-red-500" />Available only</label>
        <label className={"flex items-center gap-3 cursor-pointer " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}><input type="checkbox" checked={filters.premiumOnly} onChange={e => setFilters({ ...filters, premiumOnly: e.target.checked })} className="w-4 h-4 accent-red-500" />Premium only</label>
        <label className={"flex items-center gap-3 cursor-pointer " + (theme === "dark" ? "text-gray-300" : "text-gray-700")}><input type="checkbox" checked={filters.excludeNumbers} onChange={e => setFilters({ ...filters, excludeNumbers: e.target.checked })} className="w-4 h-4 accent-red-500" />Exclude numbers</label>
      </div>
      <button onClick={() => setFilters(DEFAULT_FILTERS)} className={"w-full py-2 rounded-lg text-sm " + (theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600")}>Reset Filters</button>
    </div>
  )
  return (
    <>
      <div className={"hidden lg:block w-64 flex-shrink-0 p-6 rounded-2xl border " + (theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}>{content}</div>
      {isOpen && <div className="lg:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/50" onClick={onClose} /><div className={"absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl p-6 " + (theme === "dark" ? "bg-gray-900" : "bg-white")}><div className="flex items-center justify-between mb-6"><h2 className={"text-lg font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>Filters</h2><button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700"><X className="h-5 w-5" /></button></div>{content}</div></div>}
    </>
  )
}

function ResultsHeader({ theme, count, sortBy, setSortBy, viewMode, setViewMode, onOpenFilters }: { theme: Theme; count: number; sortBy: SortOption; setSortBy: (s: SortOption) => void; viewMode: ViewMode; setViewMode: (v: ViewMode) => void; onOpenFilters: () => void }) {
  return (
    <div className={"flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl mb-4 " + (theme === "dark" ? "bg-gray-800/50" : "bg-gray-100")}>
      <div className={"font-medium " + (theme === "dark" ? "text-white" : "text-gray-900")}>{count} domain{count !== 1 ? "s" : ""} found</div>
      <div className="flex items-center gap-3">
        <button onClick={onOpenFilters} className={"lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg " + (theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-700")}><Filter className="h-4 w-4" />Filters</button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className={"px-3 py-2 rounded-lg border " + (theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300")}><option value="relevance">Relevance</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="length">Length</option><option value="name">Name A-Z</option></select>
        <div className={"flex rounded-lg overflow-hidden border " + (theme === "dark" ? "border-gray-700" : "border-gray-300")}><button onClick={() => setViewMode("grid")} className={"p-2 " + (viewMode === "grid" ? "bg-red-500 text-white" : theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500")}><Grid className="h-4 w-4" /></button><button onClick={() => setViewMode("list")} className={"p-2 " + (viewMode === "list" ? "bg-red-500 text-white" : theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500")}><List className="h-4 w-4" /></button></div>
      </div>
    </div>
  )
}

function TLDPromoSection({ theme }: { theme: Theme }) {
  const promos = POPULAR_TLDS.filter(t => t.discount || t.popular || t.hot).slice(0, 6)
  return (
    <div className="mb-12">
      <h2 className={"text-2xl font-bold mb-6 text-center " + (theme === "dark" ? "text-white" : "text-gray-900")}>Popular Domain Extensions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {promos.map(t => (
          <div key={t.tld} className={"p-4 rounded-xl border text-center transition-all hover:scale-105 " + (theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:border-red-500/50" : "bg-white border-gray-200 hover:border-red-500")}>
            {t.discount && <div className="text-xs font-bold text-green-500 mb-1">{t.discount}% OFF</div>}
            {t.hot && <div className="text-xs font-bold text-orange-500 mb-1">🔥 HOT</div>}
            {t.popular && !t.discount && !t.hot && <div className="text-xs font-bold text-blue-500 mb-1">Popular</div>}
            <div className={"text-xl font-bold " + (theme === "dark" ? "text-white" : "text-gray-900")}>{t.name}</div>
            <div className="text-green-500 font-bold">{formatPrice(t.price)}<span className={"text-xs font-normal " + (theme === "dark" ? "text-gray-500" : "text-gray-400")}>/yr</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-center"><Loader2 className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" /><p className="text-gray-400">Loading...</p></div></div>
}

// ============================================================================
// MAIN CONTENT
// ============================================================================

function DomainSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, toggleTheme, mounted] = useTheme()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterOpen, setFilterOpen] = useState(false)
  const [cart, setCart] = useLocalStorage<CartItem[]>("domainpro-cart", [])
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("domainpro-watchlist", [])
    const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>("domainpro-search-history", [])
  const [bulkCheckList, setBulkCheckList] = useState<BulkCheckItem[]>([])
  const [showBulkCheck, setShowBulkCheck] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const checkDomains = useCallback(async (domains: string[]) => {
    setResults(domains.map(d => ({ domain: d, available: false, premium: false, price: null, renewalPrice: null, status: "checking" as AvailabilityStatus })))
    try {
      const response = await fetch("/api/domain-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domains }) })
      if (!response.ok) throw new Error("API error")

        // ============================================================================
  // DOMAIN SUGGESTIONS
  // ============================================================================
  const generateSuggestions = useCallback((searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([])
      return
    }
    
    const term = searchTerm.toLowerCase().replace(/\s+/g, '')
    const suggestedDomains: string[] = []
    
    // Add exact term with popular TLDs
    POPULAR_TLDS.slice(0, 5).forEach(tld => {
      suggestedDomains.push(`${term}${tld.tld}`)
    })
    
    // Add variations
    const variations = [
      `get${term}`,
      `${term}app`,
      `${term}hq`,
      `${term}pro`,
      `${term}online`,
      `my${term}`,
      `the${term}`,
    ]
    
    variations.slice(0, 3).forEach(v => {
      suggestedDomains.push(`${v}.com`)
    })
    
    setSuggestions(suggestedDomains.slice(0, 8))
  }, [])

  // Debounced suggestion generator
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && !isSearching) {
        generateSuggestions(query)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, isSearching, generateSuggestions])

        // ============================================================================
  // BULK DOMAIN CHECKING
  // ============================================================================
  const handleBulkCheck = useCallback(async (domains: string[]) => {
    setShowBulkCheck(true)
    const items: BulkCheckItem[] = domains.map(d => ({ domain: d, status: 'pending' }))
    setBulkCheckList(items)
    
    toast.info(`Checking ${domains.length} domains...`)
    
    for (let i = 0; i < domains.length; i++) {
      setBulkCheckList(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'checking' } : item
      ))
      
      try {
        const response = await fetch(`/api/domain-check?domain=${encodeURIComponent(domains[i])}`)
        const data = await response.json()
        
        setBulkCheckList(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'complete', result: data } : item
        ))
      } catch (error) {
        setBulkCheckList(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'error' } : item
        ))
      }
    }
    
    toast.success('Bulk check complete!')
  }, [])

        // ============================================================================
  // WATCHLIST MANAGEMENT
  // ============================================================================
  const addToWatchlist = useCallback((domain: string) => {
    const existing = watchlist.find(item => item === domain)
    if (existing) {
      toast.error('Domain already in watchlist')
      return
    }
    setWatchlist([...watchlist, domain])
    toast.success(`Added ${domain} to watchlist`)
  }, [watchlist, setWatchlist])

  const removeFromWatchlist = useCallback((domain: string) => {
    setWatchlist(watchlist.filter(item => item !== domain))
    toast.success(`Removed ${domain} from watchlist`)
  }, [watchlist, setWatchlist])

  const checkWatchlist = useCallback(async () => {
    if (watchlist.length === 0) {
      toast.error('Watchlist is empty')
      return
    }
    toast.info('Checking watchlist domains...')
    await handleBulkCheck(watchlist)
  }, [watchlist, handleBulkCheck])

        // ============================================================================
  // SEARCH HISTORY
  // ============================================================================
  const addToHistory = useCallback((searchQuery: string, count: number) => {
    const newItem: SearchHistoryItem = {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      resultCount: count
    }
    setSearchHistory([newItem, ...searchHistory.filter(h => h.query !== searchQuery)].slice(0, 10))
  }, [searchHistory, setSearchHistory])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
    toast.success('Search history cleared')
  }, [setSearchHistory])

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
        toast('Press / to search, Esc to close', { duration: 2000 })
      }
      
      // Forward slash: Focus search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
      }
      
      // Escape: Clear and blur search
      if (e.key === 'Escape') {
        setQuery('')
        setShowSuggestions(false)
        document.querySelector<HTMLInputElement>('input[type="search"]')?.blur()
      }
      
      // Arrow keys for suggestion navigation
      if (showSuggestions && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
        } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
          e.preventDefault()
          setQuery(suggestions[selectedSuggestionIndex])
          setShowSuggestions(false)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showSuggestions, suggestions, selectedSuggestionIndex, setQuery])
      const data = await response.json()
      setResults(data.results.map((r: any) => ({ domain: r.domain, available: r.available, premium: r.premium, price: r.p
              addToHistory(domains[0], data.results.length)rice, renewalPrice: r.renewalPrice, status: r.error ? "error" : r.available ? (r.premium ? "premium" : "available") : "taken", error: r.error, expirationDate: r.expirationDate })))
    } catch (error) {
      console.error("Domain check failed:", error)
      for (let i = 0; i < domains.length; i++) {
        try {
          const res = await fetch("/api/domain-check?domain=" + encodeURIComponent(domains[i]))
          const data = await res.json()
          setResults(prev => prev.map((r, idx) => idx === i ? { domain: data.domain, available: data.available, premium: data.premium, price: data.price, renewalPrice: data.renewalPrice, status: data.error ? "error" : data.available ? (data.premium ? "premium" : "available") : "taken", error: data.error, expirationDate: data.expirationDate } : r))
        } catch { setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: "error", error: "Check failed" } : r)) }
      }
    }
  }, [])

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    setIsSearching(true)
    setHasSearched(true)
    const normalized = normalizeDomain(query)
    const domains = normalized.includes(".") ? [normalized] : generateDomainVariations(normalized)
    router.push("/search?q=" + encodeURIComponent(query), { scroll: false })
    checkDomains(domains).finally(() => setIsSearching(false))
  }, [query, router, checkDomains])

  useEffect(() => {
    const q = searchParams.get("q")
    if (q && !hasSearched) {
      setQuery(q)
      const normalized = normalizeDomain(q)
      const domains = normalized.includes(".") ? [normalized] : generateDomainVariations(normalized)
      setIsSearching(true)
      setHasSearched(true)
      checkDomains(domains).finally(() => setIsSearching(false))
    }
  }, [searchParams, hasSearched, checkDomains])

  const addToCart = useCallback((domain: string, price: number) => {
    const item: CartItem = { id: "domain-" + domain, domain, price, period: "year" }
    setCart(prev => prev.find(i => i.domain === domain) ? prev : [...prev, item])
  }, [setCart])

  const toggleWatchlist = useCallback((domain: string) => {
    setWatchlist(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain])
  }, [setWatchlist])

  const filteredResults = useMemo(() => {
    let filtered = [...results]
    if (filters.tlds.length > 0) filtered = filtered.filter(r => filters.tlds.some(t => r.domain.endsWith("." + t)))
    if (filters.availableOnly) filtered = filtered.filter(r => r.available)
    if (filters.premiumOnly) filtered = filtered.filter(r => r.premium)
    if (filters.excludeNumbers) filtered = filtered.filter(r => !/\d/.test(extractName(r.domain)))
    if (filters.excludeHyphens) filtered = filtered.filter(r => !extractName(r.domain).includes("-"))
    filtered = filtered.filter(r => { const name = extractName(r.domain); return name.length >= filters.minLength && name.length <= filters.maxLength })
    if (filters.maxPrice < 200) filtered = filtered.filter(r => !r.price || r.price <= filters.maxPrice)
    switch (sortBy) {
      case "price-asc": filtered.sort((a, b) => (a.price || 999) - (b.price || 999)); break
      case "price-desc": filtered.sort((a, b) => (b.price || 0) - (a.price || 0)); break
      case "length": filtered.sort((a, b) => extractName(a.domain).length - extractName(b.domain).length); break
      case "name": filtered.sort((a, b) => a.domain.localeCompare(b.domain)); break
    }
    return filtered
  }, [results, filters, sortBy])

  if (!mounted) return <LoadingFallback />

  return (
    <div className={"min-h-screen " + (theme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
      <Navigation theme={theme} toggleTheme={toggleTheme} cartCount={cart.length} />
      <section className={"py-16 px-4 " + (theme === "dark" ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-gradient-to-b from-white to-gray-50")}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={"text-4xl md:text-5xl font-bold mb-4 " + (theme === "dark" ? "text-white" : "text-gray-900")}>Find Your <span className="text-red-500">Perfect Domain</span></h1>
          <p className={"text-xl mb-8 " + (theme === "dark" ? "text-gray-400" : "text-gray-600")}>Search millions of domains with real-time availability</p>
          <SearchBar theme={theme} query={query} setQuery={setQuery} onSearch={handleSearch} isSearching={isSearching} />
          <TrustBadges theme={theme} />
        </div>
      </section>
      {hasSearched && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              <FilterSidebar theme={theme} filters={filters} setFilters={setFilters} isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
              <div className="flex-1">
                <ResultsHeader theme={theme} count={filteredResults.length} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} onOpenFilters={() => setFilterOpen(true)} />
                {isSearching ? (
                  <div className={"grid gap-4 " + (viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "")}>{Array.from({ length: 6 }).map((_, i) => <DomainCardSkeleton key={i} theme={theme} viewMode={viewMode} />)}</div>
                ) : filteredResults.length > 0 ? (
                  <div className={"grid gap-4 " + (viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "")}>{filteredResults.map(result => <DomainCard key={result.domain} result={result} theme={theme} viewMode={viewMode} onAddToCart={() => result.price && addToCart(result.domain, result.price)} inCart={cart.some(i => i.domain === result.domain)} onToggleWatchlist={() => toggleWatchlist(result.domain)} inWatchlist={watchlist.includes(result.domain)} />)}</div>
                ) : (
                  <div className={"p-12 rounded-2xl border text-center " + (theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}><Search className={"h-16 w-16 mx-auto mb-4 " + (theme === "dark" ? "text-gray-600" : "text-gray-300")} /><h3 className={"text-xl font-bold mb-2 " + (theme === "dark" ? "text-white" : "text-gray-900")}>No domains match your filters</h3><p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Try adjusting your filters or search for something else</p></div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {!hasSearched && <section className="py-12 px-4"><div className="max-w-7xl mx-auto"><TLDPromoSection theme={theme} /></div></section>}
      <Footer theme={theme} />
    </div>
          <Toaster position="top-right" richColors closeButton />
  )
}

// ============================================================================
// PAGE EXPORT WITH SUSPENSE
// ============================================================================

export default function DomainSearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DomainSearchContent />
    </Suspense>
  )
}
