"use client"

// ============================================================================
// DOMAINPRO RESET PASSWORD PAGE
// Complete Production-Ready with Webhook Integration, Supabase Auth
// COLOR SCHEME: TRUE BLACK background, RED primary, TEAL secondary
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Globe, Check, X, Eye, EyeOff, Sun, Moon, ArrowRight, ArrowLeft,
  Mail, Lock, Shield, Loader2, AlertCircle, CheckCircle, Menu,
  ChevronDown, ChevronUp, Server, Cloud, HardDrive, Database,
  ShieldCheck, Headphones, Users, Activity, Code, MessageCircle,
  RefreshCw, BarChart3, Network, Layers, KeyRound, Clock,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Theme = "light" | "dark"
type ValidationStatus = "idle" | "validating" | "valid" | "invalid"
type ResetStep = "request" | "reset" | "success"

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface PasswordRequirement {
  id: string
  label: string
  test: (password: string) => boolean
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

interface WebhookPayload {
  email: string
  timestamp: string
  action: "request_reset" | "password_changed"
  ipAddress: string
  userAgent?: string
}

// Clock Icon Component
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

// ============================================================================
// CONSTANTS
// ============================================================================

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const NAV_ITEMS: NavItem[] = [
  {
    label: "Domains",
    dropdown: [
      { label: "Domain Search", href: "/domains/search", icon: <Globe className="h-4 w-4" />, description: "Find your perfect domain" },
      { label: "Domain Transfer", href: "/domains/transfer", icon: <RefreshCw className="h-4 w-4" />, description: "Transfer existing domains" },
      { label: "Domain Backorder", href: "/domains/backorder", icon: <ClockIcon className="h-4 w-4" />, description: "Catch expiring domains" },
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

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip || "unknown"
  } catch {
    return "unknown"
  }
}

async function triggerWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_RESET_PASSWORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn("Reset password webhook URL not configured")
    return
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) console.error("Webhook failed with status:", response.status)
  } catch (error) {
    console.error("Webhook error:", error)
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
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        setSupabase(createClient())
        setError(null)
      } catch (e) {
        console.error("Failed to load Supabase client:", e)
        setError("Failed to initialize authentication")
      } finally { setLoading(false) }
    }
    loadSupabase()
  }, [])

  return { supabase, loading, error }
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
dToggle validationStatus={passwordValidationStatus} ariaDescribedBy="password-requirements" disabled={isLoading} />
        <div id="password-requirements"><PasswordStrengthIndicator password={password} theme={theme} /></div>
        <FormInput id="confirmPassword" label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} onBlur={onConfirmPasswordBlur} error={errors.confirmPassword} icon={<Lock className="h-5 w-5" />} placeholder="Confirm your password" required theme={theme} autoComplete="new-password" showPasswordToggle validationStatus={confirmPasswordValidationStatus} disabled={isLoading} />
        <button onClick={onSubmit} disabled={isLoading} className={`w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 ${isLoading ? "" : "hover:shadow-red-500/40"}`} aria-busy={isLoading} aria-disabled={isLoading}>
          {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Updating Password...</> : <><KeyRound className="h-5 w-5" />Reset Password</>}
        </button>
      </div>
      <SecurityBadges theme={theme} />
    </div>
  )
}

function SuccessMessage({ theme, type }: { theme: Theme; type: "request" | "reset" }) {
  return (
    <div className={`p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6"><CheckCircle className="h-10 w-10 text-white" /></div>
        {type === "request" ? (
          <>
            <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Check Your Email</h2>
            <p className={`text-lg mb-8 max-w-md mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
            <div className={`p-4 rounded-xl mb-8 max-w-md mx-auto ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}><strong>Didn&apos;t receive the email?</strong> Check your spam folder or request another reset link.</p>
            </div>
          </>
        ) : (
          <>
            <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Password Updated!</h2>
            <p className={`text-lg mb-8 max-w-md mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Your password has been successfully updated. You can now sign in with your new password.</p>
          </>
        )}
        <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40">Continue to Sign In<ArrowRight className="h-5 w-5" /></Link>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, toggleTheme, mounted] = useTheme()
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabaseClient()

  const [currentStep, setCurrentStep] = useState<ResetStep>("request")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [emailValidationStatus, setEmailValidationStatus] = useState<ValidationStatus>("idle")
  const [passwordValidationStatus, setPasswordValidationStatus] = useState<ValidationStatus>("idle")
  const [confirmPasswordValidationStatus, setConfirmPasswordValidationStatus] = useState<ValidationStatus>("idle")
  const [rateLimited, setRateLimited] = useState(false)
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null)

  useEffect(() => {
    if (!mounted) return
    const checkRecoverySession = async () => {
      if (!supabase) return
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (session && !error) {
          const hash = window.location.hash
          const type = searchParams.get("type")
          if (hash.includes("type=recovery") || type === "recovery") setCurrentStep("reset")
        }
        if (window.location.hash.includes("access_token") && window.location.hash.includes("type=recovery")) setCurrentStep("reset")
      } catch (e) { console.error("Error checking recovery session:", e) }
    }
    checkRecoverySession()
  }, [mounted, supabase, searchParams])

  useEffect(() => {
    if (rateLimitReset && rateLimitReset > 0) {
      const timer = setInterval(() => {
        setRateLimitReset((prev) => {
          if (prev && prev > 1) return prev - 1
          setRateLimited(false)
          return null
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [rateLimitReset])

  const validateEmailField = useCallback(() => {
    setEmailValidationStatus("validating")
    setTimeout(() => {
      if (email && validateEmail(email)) { setEmailValidationStatus("valid"); setErrors((prev) => ({ ...prev, email: undefined })) }
      else if (email) { setEmailValidationStatus("invalid"); setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" })) }
      else setEmailValidationStatus("idle")
    }, 300)
  }, [email])

  const validatePasswordField = useCallback(() => {
    setPasswordValidationStatus("validating")
    setTimeout(() => {
      if (password && validatePassword(password).isValid) { setPasswordValidationStatus("valid"); setErrors((prev) => ({ ...prev, password: undefined })) }
      else if (password) { setPasswordValidationStatus("invalid"); setErrors((prev) => ({ ...prev, password: "Password does not meet requirements" })) }
      else setPasswordValidationStatus("idle")
    }, 300)
  }, [password])

  const validateConfirmPasswordField = useCallback(() => {
    setConfirmPasswordValidationStatus("validating")
    setTimeout(() => {
      if (confirmPassword && confirmPassword === password) { setConfirmPasswordValidationStatus("valid"); setErrors((prev) => ({ ...prev, confirmPassword: undefined })) }
      else if (confirmPassword) { setConfirmPasswordValidationStatus("invalid"); setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" })) }
      else setConfirmPasswordValidationStatus("idle")
    }, 300)
  }, [confirmPassword, password])

  const handleRequestReset = useCallback(async () => {
    if (!email.trim()) { setErrors({ email: "Email is required" }); return }
    if (!validateEmail(email)) { setErrors({ email: "Please enter a valid email address" }); return }
    if (!supabase) { setErrors({ general: "Authentication system not available. Please try again." }); return }
    setIsLoading(true)
    setErrors({})
    try {
      const ipAddress = await getClientIP()
      triggerWebhook({ email, timestamp: new Date().toISOString(), action: "request_reset", ipAddress, userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined })
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password?type=recovery` })
      if (error) {
        if (error.message.includes("rate") || error.status === 429) { setRateLimited(true); setRateLimitReset(60); return }
        throw error
      }
      setCurrentStep("success")
    } catch (error: any) {
      console.error("Reset password error:", error)
      if (error.message.includes("rate")) { setRateLimited(true); setRateLimitReset(60) }
      else setErrors({ general: error.message || "Failed to send reset link. Please try again." })
    } finally { setIsLoading(false) }
  }, [email, supabase])

  const handlePasswordReset = useCallback(async () => {
    const newErrors: FormErrors = {}
    if (!password) newErrors.password = "Password is required"
    else if (!validatePassword(password).isValid) newErrors.password = "Password does not meet requirements"
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    if (!supabase) { setErrors({ general: "Authentication system not available. Please try again." }); return }
    setIsLoading(true)
    setErrors({})
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userEmail = user?.email || "unknown"
      const { error } = await supabase.auth.updateUser({ password: password })
      if (error) throw error
      const ipAddress = await getClientIP()
      triggerWebhook({ email: userEmail, timestamp: new Date().toISOString(), action: "password_changed", ipAddress, userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined })
      setCurrentStep("success")
    } catch (error: any) {
      console.error("Password update error:", error)
      if (error.message.includes("same")) setErrors({ password: "New password must be different from your current password" })
      else if (error.message.includes("weak")) setErrors({ password: "Password is too weak. Please choose a stronger password." })
      else setErrors({ general: error.message || "Failed to update password. Please try again." })
    } finally { setIsLoading(false) }
  }, [password, confirmPassword, supabase])

  if (!mounted) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="h-8 w-8 text-red-500 animate-spin" aria-label="Loading" /></div>

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <main className="py-12 px-4" role="main">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{currentStep === "success" ? "Success!" : "Password Reset"}</h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {currentStep === "request" && "Forgot your password? No problem."}
              {currentStep === "reset" && "Almost done! Create your new password."}
              {currentStep === "success" && "Your request has been processed."}
            </p>
          </div>
          {supabaseError && <div className="mb-6"><ErrorAlert message={supabaseError} theme={theme} /></div>}
          {currentStep === "request" && (
            <RequestResetForm theme={theme} email={email} setEmail={(val) => { setEmail(val); if (val.length > 0) { setEmailValidationStatus("validating"); setTimeout(() => { if (validateEmail(val)) { setEmailValidationStatus("valid"); setErrors((prev) => ({ ...prev, email: undefined })) } else setEmailValidationStatus("invalid") }, 300) } else setEmailValidationStatus("idle") }} errors={errors} isLoading={isLoading} onSubmit={handleRequestReset} emailValidationStatus={emailValidationStatus} onEmailBlur={validateEmailField} rateLimited={rateLimited} rateLimitReset={rateLimitReset} />
          )}
          {currentStep === "reset" && (
            <ResetPasswordForm theme={theme} password={password} setPassword={(val) => { setPassword(val); if (val.length > 0) { setPasswordValidationStatus("validating"); setTimeout(() => { if (validatePassword(val).isValid) { setPasswordValidationStatus("valid"); setErrors((prev) => ({ ...prev, password: undefined })) } else setPasswordValidationStatus("invalid") }, 300) } else setPasswordValidationStatus("idle") }} confirmPassword={confirmPassword} setConfirmPassword={(val) => { setConfirmPassword(val); if (val.length > 0) { setConfirmPasswordValidationStatus("validating"); setTimeout(() => { if (val === password) { setConfirmPasswordValidationStatus("valid"); setErrors((prev) => ({ ...prev, confirmPassword: undefined })) } else setConfirmPasswordValidationStatus("invalid") }, 300) } else setConfirmPasswordValidationStatus("idle") }} errors={errors} isLoading={isLoading} onSubmit={handlePasswordReset} passwordValidationStatus={passwordValidationStatus} confirmPasswordValidationStatus={confirmPasswordValidationStatus} onPasswordBlur={validatePasswordField} onConfirmPasswordBlur={validateConfirmPasswordField} />
          )}
          {currentStep === "success" && <SuccessMessage theme={theme} type={password ? "reset" : "request"} />}
          {currentStep === "request" && <p className={`text-center mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Don&apos;t have an account? <Link href="/signup" className="text-red-500 hover:text-red-400 font-semibold">Sign up</Link></p>}
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  )
}
