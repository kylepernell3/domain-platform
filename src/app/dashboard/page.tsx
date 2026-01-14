"use client"
import Link from "next/link"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Globe, 
  TrendingUp, 
  Shield, 
  Activity, 
  Plus, 
  Search, 
  Settings, 
  Bell, 
  User, 
  ChevronDown, 
  ChevronUp,
  ExternalLink, 
  Clock, 
  Check,
  X,
  Menu,
  ArrowUpDown,
  LogOut,
  CreditCard,
  Inbox,
  Info,
  Key,
  Mail,
  Users,
  Trash2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Zap,
  ChevronRight,
  BarChart3,
  Cloud,
  Calculator,
  BadgeCheck,
  Receipt,
  Keyboard,
  Lock,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  PlayCircle,
  PieChart,
  HeartPulse,
  CheckSquare,
  Square,
  Server,
  Plug,
  ShoppingBag,
  Code,
  LifeBuoy,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Moon,
  Sun,
  MoreHorizontal,
  ArrowRightLeft,
  Award,
  Wifi,
  PanelLeftClose,
  PanelLeft,
  Filter,
  History,
  RotateCcw,
  Trash,
  MoreVertical,
  Download,
  Power,
  PowerOff,
  FileText,
  BellRing,
  AlertTriangle,
  CheckCheck,
  Circle,
  Copy,
  Save,
  Edit3,
  Link2,
  AtSign,
  Send,
  ShieldAlert,
  KeyRound,
  Webhook,
  FileJson,
  Upload,
  Database,
  Network,
  Smartphone,
  MessageSquare,
  ArrowRight,
  Unlock,
  UserCircle,
  Calendar,
  Sliders,
  SlidersHorizontal
} from "lucide-react"

// ============================================
// DATA & CONSTANTS
// ============================================

const timelineOptions = [
  { label: "7 Days", value: "7d" },
  { label: "14 Days", value: "14d" },
  { label: "30 Days", value: "30d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "5 Years", value: "5y" },
  { label: "10 Years", value: "10y" },
  { label: "All Time", value: "all" },
]

const getStatsForTimeline = (timeline: string) => {
  const variations: Record<string, { value: string; change: string }[]> = {
    "7d": [
      { value: "12", change: "+1 vs last 7 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "24.5K", change: "+12% vs last 7 days" },
      { value: "99.9%", change: "Last 7 days" },
    ],
    "14d": [
      { value: "12", change: "+2 vs last 14 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "48.2K", change: "+15% vs last 14 days" },
      { value: "99.8%", change: "Last 14 days" },
    ],
    "30d": [
      { value: "12", change: "+2 vs last 30 days" },
      { value: "8/10", change: "2 remaining" },
      { value: "98.7K", change: "+18% vs last 30 days" },
      { value: "99.9%", change: "Last 30 days" },
    ],
    "6m": [
      { value: "12", change: "+5 vs last 6 months" },
      { value: "8/10", change: "2 remaining" },
      { value: "542K", change: "+45% vs last 6 months" },
      { value: "99.7%", change: "Last 6 months" },
    ],
    "1y": [
      { value: "12", change: "+8 vs last year" },
      { value: "8/10", change: "2 remaining" },
      { value: "1.2M", change: "+78% vs last year" },
      { value: "99.6%", change: "Last year" },
    ],
    "5y": [
      { value: "12", change: "+10 vs last 5 years" },
      { value: "8/10", change: "2 remaining" },
      { value: "4.8M", change: "+320% vs last 5 years" },
      { value: "99.4%", change: "Last 5 years" },
    ],
    "10y": [
      { value: "12", change: "+12 vs last 10 years" },
      { value: "8/10", change: "2 remaining" },
      { value: "12.5M", change: "+890% vs last 10 years" },
      { value: "99.2%", change: "Last 10 years" },
    ],
    "all": [
      { value: "12", change: "+12 all time" },
      { value: "8/10", change: "2 remaining" },
      { value: "18.2M", change: "+1200% all time" },
      { value: "99.1%", change: "All time average" },
    ],
  }
  
  const baseStats = [
    { label: "Total Domains", icon: Globe, trend: "up" as const },
    { label: "SSL Certificates", icon: Shield, trend: "neutral" as const },
    { label: "Total Visits", icon: TrendingUp, trend: "up" as const },
    { label: "Uptime", icon: Activity, trend: "up" as const },
  ]
  
  return baseStats.map((stat, index) => ({
    ...stat,
    ...variations[timeline][index],
  }))
}

const initialDomains = [
  { 
    id: 1,
    name: "example.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Jan 20, 2026", 
    expiryDate: "2026-01-20",
    visits: "8.2K",
    visitsNum: 8200,
    sslExpiry: "2025-01-18",
    initialPrice: 12.99,
    renewalPrice: 14.99,
    emailCount: 1,
    locked: true,
    autoRenew: true,
    marketValue: 2500,
    purchasePrice: 12.99,
    pinned: true,
    lastViewed: "2025-01-02T10:30:00",
    privacy: true,
    dnssec: false,
    registrationYears: 1,
    nameservers: ["ns1.domainpro.com", "ns2.domainpro.com"],
  },
  { 
    id: 2,
    name: "mystore.io", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Jun 22, 2026", 
    expiryDate: "2026-06-22",
    visits: "5.1K",
    visitsNum: 5100,
    sslExpiry: "2025-03-15",
    initialPrice: 29.99,
    renewalPrice: 34.99,
    emailCount: 1,
    locked: true,
    autoRenew: true,
    marketValue: 1800,
    purchasePrice: 29.99,
    pinned: false,
    lastViewed: "2025-01-01T14:20:00",
    privacy: true,
    dnssec: true,
    registrationYears: 2,
    nameservers: ["ns1.domainpro.com", "ns2.domainpro.com"],
  },
  { 
    id: 3,
    name: "portfolio.dev", 
    status: "active" as const, 
    ssl: false, 
    expiry: "Apr 30, 2026", 
    expiryDate: "2026-04-30",
    visits: "3.8K",
    visitsNum: 3800,
    sslExpiry: null,
    initialPrice: 14.99,
    renewalPrice: 16.99,
    emailCount: 1,
    locked: true,
    autoRenew: false,
    marketValue: 950,
    purchasePrice: 14.99,
    pinned: true,
    lastViewed: "2024-12-30T09:15:00",
    privacy: false,
    dnssec: false,
    registrationYears: 1,
    nameservers: ["ns1.domainpro.com", "ns2.domainpro.com"],
  },
  { 
    id: 4,
    name: "blog.net", 
    status: "pending" as const, 
    ssl: false, 
    expiry: "May 10, 2026", 
    expiryDate: "2026-05-10",
    visits: "2.4K",
    visitsNum: 2400,
    sslExpiry: null,
    initialPrice: 11.99,
    renewalPrice: 13.99,
    emailCount: 0,
    locked: false,
    autoRenew: true,
    marketValue: 450,
    purchasePrice: 11.99,
    pinned: false,
    lastViewed: "2024-12-28T16:45:00",
    privacy: true,
    dnssec: false,
    registrationYears: 1,
    nameservers: ["ns1.domainpro.com", "ns2.domainpro.com"],
  },
  { 
    id: 5,
    name: "acmecorp.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Aug 05, 2026", 
    expiryDate: "2026-08-05",
    visits: "12.3K",
    visitsNum: 12300,
    sslExpiry: "2025-02-28",
    initialPrice: 12.99,
    renewalPrice: 14.99,
    emailCount: 0,
    locked: true,
    autoRenew: true,
    marketValue: 8500,
    purchasePrice: 500,
    pinned: false,
    lastViewed: "2024-12-25T11:00:00",
    privacy: true,
    dnssec: true,
    registrationYears: 3,
    nameservers: ["ns1.custom.com", "ns2.custom.com"],
  },
  { 
    id: 6,
    name: "zenith.tech", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Dec 01, 2026", 
    expiryDate: "2026-12-01",
    visits: "1.9K",
    visitsNum: 1900,
    sslExpiry: "2025-04-20",
    initialPrice: 34.99,
    renewalPrice: 39.99,
    emailCount: 0,
    locked: true,
    autoRenew: true,
    marketValue: 3200,
    purchasePrice: 34.99,
    pinned: false,
    lastViewed: "2024-12-20T08:30:00",
    privacy: false,
    dnssec: false,
    registrationYears: 1,
    nameservers: ["ns1.domainpro.com", "ns2.domainpro.com"],
  },
]

const subscriptions = [
  { id: 1, name: "Professional Email", domain: "example.com", price: 6, billingCycle: "monthly", nextBilling: "Feb 1, 2026", status: "active" },
  { id: 2, name: "SSL Certificate", domain: "example.com", price: 69.99, billingCycle: "yearly", nextBilling: "Jan 18, 2026", status: "active" },
  { id: 3, name: "Domain Privacy", domain: "mystore.io", price: 9.99, billingCycle: "yearly", nextBilling: "Jun 22, 2026", status: "active" },
  { id: 4, name: "Website Builder", domain: "portfolio.dev", price: 12, billingCycle: "monthly", nextBilling: "Feb 1, 2026", status: "active" },
]

// DNS Records for domain settings modal
const initialDNSRecords = [
  { id: 1, type: "A", name: "@", value: "192.168.1.1", ttl: 3600, priority: 0 },
  { id: 2, type: "A", name: "www", value: "192.168.1.1", ttl: 3600, priority: 0 },
  { id: 3, type: "CNAME", name: "mail", value: "mail.example.com", ttl: 3600, priority: 0 },
  { id: 4, type: "MX", name: "@", value: "mail.example.com", ttl: 3600, priority: 10 },
  { id: 5, type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: 3600, priority: 0 },
]

// Email Forwarding Rules
const initialEmailForwarding = [
  { id: 1, from: "info@", to: "john@gmail.com", active: true },
  { id: 2, from: "support@", to: "support@company.com", active: true },
]

// Access History for security tab
const accessHistory = [
  { action: "DNS Record Updated", user: 'User', ip: "192.168.1.100", time: "2 hours ago" },
  { action: "Auto-Renew Enabled", user: 'User', ip: "192.168.1.100", time: "1 day ago" },
  { action: "SSL Certificate Renewed", user: "System", ip: "N/A", time: "5 days ago" },
  { action: "Domain Lock Enabled", user: 'User', ip: "192.168.1.100", time: "1 week ago" },
  { action: "Contact Info Updated", user: 'User', ip: "192.168.1.100", time: "2 weeks ago" },
]

const integrations = [
  { name: "WordPress", icon: Code, connected: true, description: "One-click WordPress setup" },
  { name: "Shopify", icon: ShoppingBag, connected: false, description: "Connect your store" },
  { name: "GoHighLevel", icon: Zap, connected: true, description: "Marketing automation" },
  { name: "Zapier", icon: Zap, connected: false, description: "5,000+ app integrations" },
  { name: "Cloudflare", icon: Cloud, connected: true, description: "CDN & security" },
  { name: "Google Analytics", icon: BarChart3, connected: true, description: "Traffic insights" },
]

const educationContent = [
  { title: "Domain Basics 101", type: "course", duration: "15 min", icon: BookOpen },
  { title: "DNS Explained Simply", type: "video", duration: "8 min", icon: PlayCircle },
  { title: "SSL Security Guide", type: "guide", duration: "10 min", icon: Shield },
  { title: "Email Setup Walkthrough", type: "video", duration: "12 min", icon: Mail },
  { title: "Transfer Your Domain", type: "guide", duration: "5 min", icon: ArrowRightLeft },
]

const keyboardShortcuts = [
  { keys: ["⌘", "K"], action: "Quick search" },
  { keys: ["?"], action: "Show shortcuts" },
  { keys: ["D"], action: "Go to Dashboard" },
  { keys: ["N"], action: "New Domain" },
  { keys: ["E"], action: "Professional Email" },
  { keys: ["S"], action: "Settings" },
  { keys: ["⌘", "B"], action: "Bulk actions" },
  { keys: ["⌘", "E"], action: "Export data" },
  { keys: ["Esc"], action: "Close modal" },
]

const chartData = {
  domainGrowth: [
    { month: "Jul", value: 4 },
    { month: "Aug", value: 5 },
    { month: "Sep", value: 6 },
    { month: "Oct", value: 8 },
    { month: "Nov", value: 10 },
    { month: "Dec", value: 12 },
  ],
  sslStatus: [
    { label: "Active", value: 8, color: "bg-emerald-500" },
    { label: "Expiring Soon", value: 2, color: "bg-yellow-500" },
    { label: "Expired", value: 0, color: "bg-red-500" },
    { label: "None", value: 2, color: "bg-neutral-600" },
  ],
  trafficTrends: [
    { month: "Jul", value: 15200 },
    { month: "Aug", value: 18400 },
    { month: "Sep", value: 16800 },
    { month: "Oct", value: 21500 },
    { month: "Nov", value: 19200 },
    { month: "Dec", value: 24500 },
  ],
  uptimeHistory: [
    { month: "Jul", value: 99.8 },
    { month: "Aug", value: 99.9 },
    { month: "Sep", value: 99.7 },
    { month: "Oct", value: 100 },
    { month: "Nov", value: 99.9 },
    { month: "Dec", value: 99.9 },
  ],
}

const activities = [
  { action: "SSL Certificate renewed", domain: "example.com", time: "2 hours ago" },
  { action: "Domain registered", domain: "newsite.io", time: "1 day ago" },
  { action: "DNS updated", domain: "mystore.io", time: "3 days ago" },
]

const insights = [
  { id: 1, type: "action", icon: AlertCircle, title: "2 SSL certificates expiring soon", description: "Renew before Jan 18 to avoid downtime", color: "text-yellow-400", bgColor: "bg-yellow-500/10", read: false },
  { id: 2, type: "security", icon: Shield, title: "Enable 2FA for better security", description: "Protect your account with multi-factor authentication", color: "text-red-400", bgColor: "bg-red-500/10", read: false },
  { id: 3, type: "savings", icon: DollarSign, title: "Save 20% with annual billing", description: "Switch to yearly payment and save $28.80", color: "text-emerald-400", bgColor: "bg-emerald-500/10", read: true },
  { id: 4, type: "performance", icon: Zap, title: "Enable CDN for faster loading", description: "Improve load times by up to 60%", color: "text-blue-400", bgColor: "bg-blue-500/10", read: true },
]

const initialNotifications = [
  { id: 1, type: "warning", icon: AlertTriangle, title: "SSL expiring in 5 days", description: "example.com SSL certificate expires Jan 18", time: "2 hours ago", read: false },
  { id: 2, type: "info", icon: BellRing, title: "Domain renewal reminder", description: "example.com renews in 17 days", time: "5 hours ago", read: false },
  { id: 3, type: "success", icon: CheckCircle, title: "Payment successful", description: "$69.99 charged for SSL certificate", time: "1 day ago", read: true },
  { id: 4, type: "info", icon: Mail, title: "New email account created", description: "admin@example.com is now active", time: "2 days ago", read: true },
]

const settingsOptions = [
  { label: "Account Settings", icon: User, path: "/settings/account" },
  { label: "Security Settings", icon: Shield, path: "/settings/security" },
  { label: "Billing & Payments", icon: CreditCard, path: "/settings/billing" },
  { label: "Notifications", icon: Bell, path: "/settings/notifications" },
  { label: "API Keys", icon: Key, path: "/settings/api" },
  { label: "Team Members", icon: Users, path: "/settings/team" },
  { label: "Domain Defaults", icon: Globe, path: "/settings/domains" },
  { label: "DNS Templates", icon: Settings, path: "/settings/dns" },
]

// Navigation Structure
const navigationSections = [
  {
    id: "core",
    title: "CORE SERVICES",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Activity, href: "/dashboard", badge: null },
      { id: "domains", label: "My Domains", icon: Globe, href: "/search", badge: null },
      { id: "email", label: "Professional Email", icon: Mail, href: "/email", badge: null },
      { id: "ssl", label: "SSL Certificates", icon: Shield, href: "/ssl", badge: 2 },
      { id: "dns", label: "DNS Settings", icon: Server, href: "/dns", badge: null, subtitle: "Downtown DNS" },
      { id: "hosting", label: "Cloud Hosting", icon: Cloud, href: "/hosting", badge: null },
    ]
  },
  {
    id: "integrations",
    title: "INTEGRATIONS & TOOLS",
    items: [
      { id: "integrations", label: "Integrations", icon: Plug, href: "/integrations", badge: null },
      { id: "analytics", label: "Portfolio Analytics", icon: PieChart, href: "/analytics", badge: null },
      { id: "transfer", label: "Transfer Center", icon: RefreshCw, href: "/transfer", badge: null },
      { id: "security", label: "Security & VPN", icon: Lock, href: "/security", badge: null },
    ]
  },
  {
    id: "management",
    title: "MANAGEMENT",
    items: [
      { id: "team", label: "Team & Clients", icon: Users, href: "/team", badge: null },
      { id: "billing", label: "Billing & Subscriptions", icon: CreditCard, href: "/billing", badge: null },
      { id: "education", label: "Domain University", icon: GraduationCap, href: "/education", badge: null },
      { id: "health", label: "Health Checks", icon: HeartPulse, href: "/health", badge: 1 },
    ]
  },
  {
    id: "other",
    title: "OTHER",
    items: [
      { id: "home", label: "Back to Home", icon: ExternalLink, href: "/", badge: null },
    ]
  }
]

// Default widget visibility
const defaultWidgetVisibility = {
  statsCards: true,
  domainsTable: true,
  quickActions: true,
  recentActivity: true,
  analyticsCharts: true,
  subscriptions: true,
  pinnedDomains: true,
  recentlyViewed: true,
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const calculate5YearCost = (initialPrice: number, renewalPrice: number): number => {
  return initialPrice + (renewalPrice * 4)
}

const formatTimeAgo = (minutes: number): string => {
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

function SkeletonCard({ theme }: { theme: string }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800/50' : 'bg-white border-gray-200'} border rounded-xl p-6 animate-pulse`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded-lg`} />
        <div className={`h-4 w-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded`} />
      </div>
      <div className="mb-1">
        <div className={`h-8 w-16 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded mb-2`} />
        <div className={`h-4 w-24 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded`} />
      </div>
      <div className={`h-3 w-20 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded mt-3`} />
    </div>
  )
}

function EmptyState({ theme }: { theme: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`h-20 w-20 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
        <Inbox className={`h-10 w-10 ${theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'}`} />
      </div>
      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>No domains yet</h3>
      <p className={`${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} text-sm text-center mb-6 max-w-sm`}>
        Get started by registering your first domain or transferring an existing one.
      </p>
      <button className="btn-swipe flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-lg">
        <Plus className="h-4 w-4" />
        Add Your First Domain
      </button>
    </div>
  )
}

function PricingTooltip({ initialPrice, renewalPrice, children, theme }: { initialPrice: number; renewalPrice: number; children: React.ReactNode; theme: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tax = initialPrice * 0.08
  const icannFee = 0.18
  const total = initialPrice + tax + icannFee
  const fiveYearCost = calculate5YearCost(initialPrice, renewalPrice)
  
  return (
    <div className="relative inline-flex items-center gap-1">
      {children}
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`${theme === 'dark' ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      
      {showTooltip && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200 shadow-lg'} border rounded-lg p-3 z-50`}>
          <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'}`}>
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">What You See Is What You Pay</span>
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'}>Initial price:</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${initialPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'}>Renewal price:</span>
              <span className="text-yellow-500">${renewalPrice.toFixed(2)}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'}>Tax (8%):</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'}>ICANN fee:</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${icannFee.toFixed(2)}</span>
            </div>
            <div className={`border-t ${theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'} pt-1.5 mt-1.5 flex justify-between font-medium`}>
              <span className={theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}>First year total:</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>5-year total cost:</span>
              <span className="font-bold">${fiveYearCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BarChart({ data, maxValue, formatValue, theme }: { 
  data: { month: string; value: number }[]; 
  maxValue: number;
  formatValue?: (val: number) => string;
  theme: string;
}) {
  return (
    <div className="flex items-end justify-between gap-2 h-48 px-4">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end h-40">
              <span className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} mb-1`}>
                {formatValue ? formatValue(item.value) : item.value}
              </span>
              <div 
                className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-500 ease-out hover:from-red-500 hover:to-red-300"
                style={{ height: `${height}%`, minHeight: item.value > 0 ? '8px' : '0' }}
              />
            </div>
            <span className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'}`}>{item.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function HorizontalBarChart({ data, theme }: { data: { label: string; value: number; color: string }[]; theme: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div className="space-y-4 px-4">
      {data.map((item, index) => {
        const width = total > 0 ? (item.value / total) * 100 : 0
        return (
          <div key={index} className="space-y-2 group">
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}>{item.label}</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
            </div>
            <div className={`h-3 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out group-hover:brightness-110`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Breadcrumbs({ items, theme }: { items: { label: string; href?: string }[]; theme: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className={`h-4 w-4 ${theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'}`} />}
          {item.href ? (
            <Link href={item.href} className={`${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

function ToggleSwitch({ enabled, onChange, theme }: { enabled: boolean; onChange: () => void; theme: string }) {
  return (
    <button 
      onClick={onChange} 
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-red-500' : theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DashboardPage() {
  // Router and Supabase
    const router = useRouter()
  const supabase = createClient()

  // User state
  const [user, setUser] = useState<{ email: string } | null>(null)

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  // Performance tracking
  const [loadStartTime] = useState(Date.now())
  const [loadTime, setLoadTime] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState(0)
  
  // Widget visibility
  const [widgetVisibility, setWidgetVisibility] = useState(defaultWidgetVisibility)
  const [widgetModalOpen, setWidgetModalOpen] = useState(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [searchFiltersOpen, setSearchFiltersOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    status: "all",
    ssl: "all",
    email: "all",
    sortBy: "name"
  })
  
  // Notifications state
  const [notifications, setNotifications] = useState(initialNotifications)
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false)
  const [notificationsTab, setNotificationsTab] = useState<'notifications' | 'insights'>('notifications')
  const [insightsData, setInsightsData] = useState(insights)
  
  // Core states
  const [isLoading, setIsLoading] = useState(true)
  const [showEmptyState] = useState(false)
  const [selectedTimeline, setSelectedTimeline] = useState("30d")
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeChart, setActiveChart] = useState("domainGrowth")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [domains, setDomains] = useState(initialDomains)

  const [userProfile, setUserProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Fetch current user and profile
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.push('/login')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
        } else {
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    loadUserProfile()
  }, [router])

  // Fetch domains for current user
  useEffect(() => {
    async function loadDomains() {
      if (!userProfile) return
      
      try {
        const supabase = createClient()
        const { data: domainsData, error } = await supabase
          .from('domains')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching domains:', error)
        } else if (domainsData) {
          const transformedDomains = domainsData.map(d => ({
            id: d.id,
            domain: d.domain_name,
            status: d.status as 'active' | 'pending' | 'expired',
            registrar: 'DomainPro',
            expiryDate: d.expires_at,
            autoRenew: true,
            privacy: true,
            nameservers: []
          }))
          setDomains(transformedDomains)
        }
      } catch (error) {
        console.error('Error loading domains:', error)
      }
    }
    loadDomains()
  }, [userProfile])


  // Fetch current user and profile
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.push('/login')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
        } else {
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    loadUserProfile()
  }, [router])

  // Fetch domains for current user
  useEffect(() => {
    async function loadDomains() {
      if (!userProfile) return
      
      try {
        const supabase = createClient()
        const { data: domainsData, error } = await supabase
          .from('domains')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching domains:', error)
        } else if (domainsData) {
          const transformedDomains = domainsData.map(d => ({
            id: d.id,
            domain: d.domain_name,
            status: d.status as 'active' | 'pending' | 'expired',
            registrar: 'DomainPro',
            expiryDate: d.expires_at,
            autoRenew: true,
            privacy: true,
            nameservers: []
          }))
          setDomains(transformedDomains)
        }
      } catch (error) {
        console.error('Error loading domains:', error)
      }
    }
    loadDomains()
  }, [userProfile])
  const [searchMode, setSearchMode] = useState<"domains" | "settings">("domains")
  
  // View states
  const [compactView, setCompactView] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  
  // Selection states for bulk actions
  const [selectedDomains, setSelectedDomains] = useState<number[]>([])
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false)
  
  // Add dropdown state
  const [addDropdownOpen, setAddDropdownOpen] = useState(false)
  
  // Modal states
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [subscriptionsModalOpen, setSubscriptionsModalOpen] = useState(false)
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false)
  const [protectionModalOpen, setProtectionModalOpen] = useState(false)
  const [educationModalOpen, setEducationModalOpen] = useState(false)
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)
  const [integrationsModalOpen, setIntegrationsModalOpen] = useState(false)
  const [healthChecksModalOpen, setHealthChecksModalOpen] = useState(false)
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'default' | 'calculator'>('default')
  const [costCalculatorOpen, setCostCalculatorOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  
  // Domain Settings Modal State
  const [domainSettingsOpen, setDomainSettingsOpen] = useState(false)
  const [selectedDomainForSettings, setSelectedDomainForSettings] = useState<typeof initialDomains[0] | null>(null)
  const [domainSettingsTab, setDomainSettingsTab] = useState<'general' | 'dns' | 'email' | 'security' | 'advanced'>('general')
  const [dnsRecords, setDnsRecords] = useState(initialDNSRecords)
  const [emailForwarding, setEmailForwarding] = useState(initialEmailForwarding)
  const [domainSettingsForm, setDomainSettingsForm] = useState({
    locked: true, autoRenew: true, privacy: true, dnssec: false, useCustomNS: false,
    ns1: "", ns2: "", ns3: "", ns4: "", forwardUrl: "", forwardType: "301", forwardWww: true,
    registrationYears: 1, emailNotifications: true, smsNotifications: false, pushNotifications: true,
    twoFactorForChanges: false, webhookUrl: "", apiToken: "dp_live_xxxxxxxxxxxxxxxxxxxx",
  })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showEppCode, setShowEppCode] = useState(false)
  const [addDnsRecordOpen, setAddDnsRecordOpen] = useState(false)
  const [newDnsRecord, setNewDnsRecord] = useState({ type: "A", name: "", value: "", ttl: 3600, priority: 10 })
  const [tableFiltersOpen, setTableFiltersOpen] = useState(false)
  
  // Form states
  const [calculatorYears, setCalculatorYears] = useState(5)
  
  // Refs
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  const addDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsPanelRef = useRef<HTMLDivElement>(null)
  const bulkActionsRef = useRef<HTMLDivElement>(null)
  const searchFiltersRef = useRef<HTMLDivElement>(null)
  const tableFiltersRef = useRef<HTMLDivElement>(null)


    // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUser({ email: user.email })
      }
    }
    getUser()
  }, [supabase.auth])
  // Load theme and widget visibility from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('domainpro-theme') as 'dark' | 'light' | null
    if (savedTheme) setTheme(savedTheme)
    
    const savedWidgets = localStorage.getItem('domainpro-widgets')
    if (savedWidgets) setWidgetVisibility(JSON.parse(savedWidgets))
    
    const savedSearchHistory = localStorage.getItem('domainpro-search-history')
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory))
  }, [])

    // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('domainpro-theme', newTheme)
  }
  
  // Save widget visibility to localStorage
  const updateWidgetVisibility = (widget: keyof typeof defaultWidgetVisibility, visible: boolean) => {
    const newVisibility = { ...widgetVisibility, [widget]: visible }
    setWidgetVisibility(newVisibility)
    localStorage.setItem('domainpro-widgets', JSON.stringify(newVisibility))
  }
  
  // Reset widgets to default
  const resetWidgets = () => {
    setWidgetVisibility(defaultWidgetVisibility)
    localStorage.setItem('domainpro-widgets', JSON.stringify(defaultWidgetVisibility))
  }
  
  // Add search to history
  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem('domainpro-search-history', JSON.stringify(newHistory))
  }
  
  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('domainpro-search-history')
  }
  
  // Mark notification as read
  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }
  
  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setInsightsData(prev => prev.map(i => ({ ...i, read: true })))
  }
  
  // Get unread count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length + insightsData.filter(i => !i.read).length
  
  // Get recently viewed domains
  const recentlyViewedDomains = [...domains]
    .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
    .slice(0, 3)
  
  // Get pinned domains
  const pinnedDomains = domains.filter(d => d.pinned)
  
  // Get upcoming renewals (within 30 days)
  const upcomingRenewals = domains
    .map(d => ({ ...d, daysUntilExpiry: getDaysUntilExpiry(d.expiryDate) }))
    .filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0)
    .sort((a, b) => (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999))
  
  // SSL expiring count
  const sslExpiringCount = domains.filter(d => {
    if (!d.sslExpiry) return false
    const days = getDaysUntilExpiry(d.sslExpiry)
    return days !== null && days <= 30 && days > 0
  }).length
  
  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }
  
  // Toggle domain pin
  const togglePinDomain = (domainId: number) => {
    setDomains(prev => {
      const updated = prev.map(d => 
        d.id === domainId ? { ...d, pinned: !d.pinned } : d
      )
      // Persist pinned state to localStorage
      const pinnedIds = updated.filter(d => d.pinned).map(d => d.id)
      localStorage.setItem('domainpro-pinned', JSON.stringify(pinnedIds))
      return updated
    })
  }
  
  // Load pinned domains from localStorage on mount
  useEffect(() => {
    const savedPinned = localStorage.getItem('domainpro-pinned')
    if (savedPinned) {
      try {
        const pinnedIds = JSON.parse(savedPinned) as number[]
        setDomains(prev => prev.map(d => ({
          ...d,
          pinned: pinnedIds.includes(d.id)
        })))
      } catch (e) {
        console.error('Failed to load pinned domains:', e)
      }
    }
  }, [])
  
  // Open domain settings modal
  const openDomainSettings = (domain: typeof initialDomains[0]) => {
    setSelectedDomainForSettings(domain)
    setDomainSettingsForm({
      locked: domain.locked, 
      autoRenew: domain.autoRenew, 
      privacy: domain.privacy ?? true, 
      dnssec: domain.dnssec ?? false,
      useCustomNS: (domain.nameservers?.[0] ?? "ns1.domainpro.com") !== "ns1.domainpro.com",
      ns1: domain.nameservers?.[0] || "", 
      ns2: domain.nameservers?.[1] || "", 
      ns3: "", 
      ns4: "",
      forwardUrl: "", 
      forwardType: "301", 
      forwardWww: true, 
      registrationYears: domain.registrationYears ?? 1,
      emailNotifications: true, 
      smsNotifications: false, 
      pushNotifications: true,
      twoFactorForChanges: false, 
      webhookUrl: "", 
      apiToken: "dp_live_xxxxxxxxxxxxxxxxxxxx",
    })
    setDomainSettingsTab('general')
    setHasUnsavedChanges(false)
    setSettingsSaved(false)
    setDomainSettingsOpen(true)
  }

  // Save domain settings
  const saveDomainSettings = async () => {
    setSettingsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (selectedDomainForSettings) {
      setDomains(prev => prev.map(d => d.id === selectedDomainForSettings.id ? {
        ...d, 
        locked: domainSettingsForm.locked, 
        autoRenew: domainSettingsForm.autoRenew,
        privacy: domainSettingsForm.privacy, 
        dnssec: domainSettingsForm.dnssec,
        registrationYears: domainSettingsForm.registrationYears,
        nameservers: domainSettingsForm.useCustomNS 
          ? [domainSettingsForm.ns1, domainSettingsForm.ns2].filter(Boolean) 
          : ["ns1.domainpro.com", "ns2.domainpro.com"],
      } : d))
    }
    setSettingsSaving(false)
    setSettingsSaved(true)
    setHasUnsavedChanges(false)
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  // Close domain settings modal
  const closeDomainSettings = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        setDomainSettingsOpen(false)
      }
    } else {
      setDomainSettingsOpen(false)
    }
  }

  // Add DNS record
  const addDnsRecord = () => {
    const newId = Math.max(...dnsRecords.map(r => r.id)) + 1
    setDnsRecords([...dnsRecords, { ...newDnsRecord, id: newId }])
    setAddDnsRecordOpen(false)
    setNewDnsRecord({ type: "A", name: "", value: "", ttl: 3600, priority: 10 })
    setHasUnsavedChanges(true)
  }

  // Delete DNS record
  const deleteDnsRecord = (id: number) => {
    if (confirm("Delete this DNS record?")) {
      setDnsRecords(dnsRecords.filter(r => r.id !== id))
      setHasUnsavedChanges(true)
    }
  }
  
  // Keyboard shortcuts handler
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault()
          setSearchDropdownOpen(true)
          break
        case 'e':
          e.preventDefault()
          setExportModalOpen(true)
          break
      }
    } else {
      switch (e.key) {
        case '?':
          e.preventDefault()
          setShortcutsModalOpen(true)
          break
        case 'n':
        case 'N':
          e.preventDefault()
          setCheckoutModalOpen(true)
          break
        case 'Escape':
          setEmailModalOpen(false)
          setCheckoutModalOpen(false)
          setTransferModalOpen(false)
          setShortcutsModalOpen(false)
          setSubscriptionsModalOpen(false)
          setRecoveryModalOpen(false)
          setProtectionModalOpen(false)
          setEducationModalOpen(false)
          setAnalyticsModalOpen(false)
          setIntegrationsModalOpen(false)
          setHealthChecksModalOpen(false)
          setCostCalculatorOpen(false)
          setStatusModalOpen(false)
          setExportModalOpen(false)
          setWidgetModalOpen(false)
          setNotificationsPanelOpen(false)
          setDomainSettingsOpen(false)
          setAddDnsRecordOpen(false)
          break
      }
    }
  }, [])
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
  
  // Loading and performance tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setLoadTime((Date.now() - loadStartTime) / 1000)
    }, 1500)
    return () => clearTimeout(timer)
  }, [loadStartTime])
  
  // Auto-refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
      setMinutesSinceUpdate(minutes)
      
      if (autoRefresh && minutes >= 5) {
        setLastUpdated(new Date())
        setMinutesSinceUpdate(0)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [autoRefresh, lastUpdated])
  
  // Manual refresh
  const refreshData = () => {
    setLastUpdated(new Date())
    setMinutesSinceUpdate(0)
  }
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false)
      }
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setAddDropdownOpen(false)
      }
      if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target as Node)) {
        setNotificationsPanelOpen(false)
      }
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target as Node)) {
        setBulkActionsOpen(false)
      }
      if (searchFiltersRef.current && !searchFiltersRef.current.contains(event.target as Node)) {
        setSearchFiltersOpen(false)
      }
      if (tableFiltersRef.current && !tableFiltersRef.current.contains(event.target as Node)) {
        setTableFiltersOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  const stats = getStatsForTimeline(selectedTimeline)
  
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
    
    const sorted = [...domains].sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""
      
      switch (key) {
        case "name":
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case "expiry":
          aVal = new Date(a.expiry).getTime()
          bVal = new Date(b.expiry).getTime()
          break
        case "price":
          aVal = a.initialPrice
          bVal = b.initialPrice
          break
        case "visits":
          aVal = a.visitsNum
          bVal = b.visitsNum
          break
        default:
          return 0
      }
      
      if (aVal < bVal) return direction === "asc" ? -1 : 1
      if (aVal > bVal) return direction === "asc" ? 1 : -1
      return 0
    })
    
    setDomains(sorted)
  }
  
  // Apply search filters
  const filteredDomains = domains.filter(d => {
    // Text search
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Status filter
    if (searchFilters.status !== "all" && d.status !== searchFilters.status) return false
    
    // SSL filter
    if (searchFilters.ssl === "hasSSL" && !d.ssl) return false
    if (searchFilters.ssl === "noSSL" && d.ssl) return false
    
    // Email filter
    if (searchFilters.email === "hasEmail" && d.emailCount === 0) return false
    if (searchFilters.email === "noEmail" && d.emailCount > 0) return false
    
    return true
  })
  
  // Sort filtered domains
  const sortedFilteredDomains = [...filteredDomains].sort((a, b) => {
    switch (searchFilters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "expiry":
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      case "price":
        return a.initialPrice - b.initialPrice
      case "visits":
        return b.visitsNum - a.visitsNum
      default:
        return 0
    }
  })
  
  const filteredSettings = settingsOptions.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const toggleDomainSelection = (id: number) => {
    setSelectedDomains(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }
  
  const toggleAllDomains = () => {
    if (selectedDomains.length === sortedFilteredDomains.length) {
      setSelectedDomains([])
    } else {
      setSelectedDomains(sortedFilteredDomains.map(d => d.id))
    }
  }
  
  const clearSelection = () => {
    setSelectedDomains([])
  }
  
  // Bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on domains:`, selectedDomains)
    setBulkActionsOpen(false)
    // In real app, perform the action here
  }
  
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    }
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-3 w-3 ml-1" />
      : <ChevronDown className="h-3 w-3 ml-1" />
  }
  
  const chartTabs = [
    { id: "domainGrowth", label: "Domain Growth" },
    { id: "sslStatus", label: "SSL Status" },
    { id: "trafficTrends", label: "Traffic Trends" },
    { id: "uptimeHistory", label: "Uptime History" },
  ]
  
  const renderChart = () => {
    switch (activeChart) {
      case "domainGrowth":
        return (
          <div className="pt-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} px-4 mb-4`}>Total domains registered per month</p>
            <BarChart data={chartData.domainGrowth} maxValue={Math.max(...chartData.domainGrowth.map(d => d.value)) * 1.2} theme={theme} />
          </div>
        )
      case "sslStatus":
        return (
          <div className="pt-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} px-4 mb-6`}>SSL certificate distribution</p>
            <HorizontalBarChart data={chartData.sslStatus} theme={theme} />
          </div>
        )
      case "trafficTrends":
        return (
          <div className="pt-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} px-4 mb-4`}>Monthly traffic across all domains</p>
            <BarChart data={chartData.trafficTrends} maxValue={Math.max(...chartData.trafficTrends.map(d => d.value)) * 1.2} formatValue={(val) => `${(val / 1000).toFixed(1)}K`} theme={theme} />
          </div>
        )
      case "uptimeHistory":
        return (
          <div className="pt-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'} px-4 mb-4`}>Average uptime percentage</p>
            <BarChart data={chartData.uptimeHistory.map(d => ({ ...d, value: d.value - 99 }))} maxValue={1.2} formatValue={(val) => `${(val + 99).toFixed(1)}%`} theme={theme} />
          </div>
        )
      default:
        return null
    }
  }

  // Theme-based class helpers
  const bgMain = theme === 'dark' ? 'bg-neutral-950' : 'bg-gray-50'
  const bgCard = theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800/50' : 'bg-white border-gray-200'
  const bgSidebar = theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-gray-200'
  const bgHeader = theme === 'dark' ? 'bg-neutral-950/90 border-neutral-800/50' : 'bg-white/90 border-gray-200'
  const bgInput = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-300'
  const bgDropdown = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-lg'
  const bgHover = theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
  const textMuted = theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'
  const borderColor = theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'

  return (
    <div className={`min-h-screen ${bgMain} flex transition-colors duration-300`}>
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUpBounce {
          0% { transform: translateY(100px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .btn-swipe {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .btn-swipe::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(107,114,128,0.3));
          transition: left 0.4s ease;
          z-index: -1;
        }
        .btn-swipe:hover::before {
          left: 100%;
        }
        .btn-swipe-red {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .btn-swipe-red::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(75,85,99,0.5));
          transition: left 0.4s ease;
          z-index: -1;
        }
        .btn-swipe-red:hover::before {
          left: 100%;
        }
        .btn-swipe-red:hover {
          background-color: rgb(185 28 28) !important;
        }
        .card-hover-glow {
          transition: all 0.3s ease;
        }
        .card-hover-glow:hover {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15), 0 0 40px rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3) !important;
        }
        .row-hover-glow {
          transition: all 0.3s ease;
        }
        .row-hover-glow:hover {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.1), 0 0 30px rgba(239, 68, 68, 0.05);
          background-color: rgba(239, 68, 68, 0.05) !important;
        }
        .pill-hover-glow {
          transition: all 0.3s ease;
        }
        .pill-hover-glow:hover {
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
        }
        .action-hover-glow {
          transition: all 0.3s ease;
        }
        .action-hover-glow:hover {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3) !important;
        }
        .kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 6px;
          font-size: 11px;
          font-family: ui-monospace, monospace;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          min-width: 20px;
        }
        .light .kbd {
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.15);
        }
        .sidebar-transition {
          transition: width 0.3s ease, opacity 0.3s ease;
        }
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        /* Improved touch targets for mobile */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
          }
          input[type="checkbox"], input[type="radio"] {
            min-width: 20px;
            min-height: 20px;
          }
        }
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
      `}</style>

      {/* ============================================ */}
      {/* DESKTOP SIDEBAR */}
      {/* ============================================ */}
      <aside className={`hidden lg:flex flex-col border-r ${bgSidebar} sticky top-0 h-screen sidebar-transition ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Globe className="h-8 w-8 text-red-500" />
                <div className="absolute inset-0 bg-red-500/20 blur-lg" />
              </div>
              <span className={`text-xl font-bold ${textPrimary}`}>DomainPro</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="relative mx-auto">
              <Globe className="h-8 w-8 text-red-500" />
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-1.5 ${textSecondary} ${bgHover} rounded-lg transition-colors`}
          >
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {navigationSections.map((section) => (
            <div key={section.id} className="mb-2">
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium ${textMuted} hover:${textSecondary} transition-colors`}
                >
                  <span>{section.title}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${collapsedSections.includes(section.id) ? '-rotate-90' : ''}`} />
                </button>
              )}
              
              {!collapsedSections.includes(section.id) && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.id === "dashboard"
                    const badge = item.id === "ssl" ? sslExpiringCount : item.badge
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-red-500/10 text-red-400' 
                            : `${textSecondary} ${bgHover} hover:${textPrimary}`
                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm block truncate">{item.label}</span>
                              {item.subtitle && (
                                <span className={`text-xs ${textMuted} block truncate`}>{item.subtitle}</span>
                              )}
                            </div>
                            {badge && badge > 0 && (
                              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                                {badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && upcomingRenewals.length > 0 && (
          <div className={`p-3 border-t ${borderColor}`}>
            <h4 className={`text-xs font-medium ${textMuted} mb-2 px-2`}>UPCOMING RENEWALS</h4>
            <div className="space-y-1">
              {upcomingRenewals.slice(0, 3).map((domain) => (
                <div key={domain.id} className={`flex items-center justify-between px-2 py-1.5 rounded-lg ${bgHover}`}>
                  <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'} truncate`}>{domain.name}</span>
                  <span className="text-xs text-yellow-500">{domain.daysUntilExpiry}d</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <header className={`border-b backdrop-blur-xl ${bgHeader} sticky top-0 z-40`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button 
                className={`lg:hidden p-2 ${textSecondary} ${bgHover} rounded-lg`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="lg:hidden flex items-center gap-3">
                <Globe className="h-8 w-8 text-red-500" />
                <span className={`text-xl font-bold ${textPrimary}`}>DomainPro</span>
              </Link>

              {/* Enhanced Search */}
              <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchDropdownRef}>
                <div className="relative w-full">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        addToSearchHistory(searchQuery)
                      }
                    }}
                    placeholder="Search domains..."
                    className={`w-full pl-10 pr-24 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary} placeholder-${textMuted} focus:outline-none focus:ring-2 focus:ring-red-500/30`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {/* Search Filters Button */}
                    <div className="relative" ref={searchFiltersRef}>
                      <button 
                        onClick={() => setSearchFiltersOpen(!searchFiltersOpen)}
                        className={`p-1 ${textMuted} hover:${textSecondary} transition-colors`}
                      >
                        <Filter className="h-4 w-4" />
                      </button>
                      
                      {searchFiltersOpen && (
                        <div className={`absolute right-0 top-full mt-2 w-64 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                          <div className={`p-3 border-b ${borderColor}`}>
                            <h4 className={`text-sm font-medium ${textPrimary}`}>Search Filters</h4>
                          </div>
                          <div className="p-3 space-y-3">
                            {/* Status Filter */}
                            <div>
                              <label className={`text-xs font-medium ${textSecondary} block mb-1`}>Status</label>
                              <select 
                                value={searchFilters.status} 
                                onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
                                className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}
                              >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                              </select>
                            </div>
                            {/* SSL Filter */}
                            <div>
                              <label className={`text-xs font-medium ${textSecondary} block mb-1`}>SSL</label>
                              <select 
                                value={searchFilters.ssl} 
                                onChange={(e) => setSearchFilters(prev => ({ ...prev, ssl: e.target.value }))}
                                className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}
                              >
                                <option value="all">All</option>
                                <option value="hasSSL">Has SSL</option>
                                <option value="noSSL">No SSL</option>
                              </select>
                            </div>
                            {/* Email Filter */}
                            <div>
                              <label className={`text-xs font-medium ${textSecondary} block mb-1`}>Email</label>
                              <select 
                                value={searchFilters.email} 
                                onChange={(e) => setSearchFilters(prev => ({ ...prev, email: e.target.value }))}
                                className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}
                              >
                                <option value="all">All</option>
                                <option value="hasEmail">Has Email</option>
                                <option value="noEmail">No Email</option>
                              </select>
                            </div>
                            {/* Sort By */}
                            <div>
                              <label className={`text-xs font-medium ${textSecondary} block mb-1`}>Sort By</label>
                              <select 
                                value={searchFilters.sortBy} 
                                onChange={(e) => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}
                              >
                                <option value="name">Name</option>
                                <option value="expiry">Expiry Date</option>
                                <option value="price">Price</option>
                                <option value="visits">Visits</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`kbd ${textMuted}`}>⌘K</span>
                  </div>
                  
                  {searchDropdownOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-2 ${bgDropdown} border rounded-xl overflow-hidden z-50`}>
                      {/* Search History */}
                      {searchHistory.length > 0 && !searchQuery && (
                        <div className={`border-b ${borderColor}`}>
                          <div className="flex items-center justify-between px-4 py-2">
                            <span className={`text-xs font-medium ${textMuted}`}>Recent Searches</span>
                            <button onClick={clearSearchHistory} className="text-xs text-red-400 hover:text-red-300">
                              Clear
                            </button>
                          </div>
                          <div className="py-1">
                            {searchHistory.map((query, index) => (
                              <button 
                                key={index} 
                                onClick={() => {
                                  setSearchQuery(query)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}
                              >
                                <History className="h-4 w-4" />
                                {query}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Search Mode Tabs */}
                      <div className={`flex border-b ${borderColor}`}>
                        <button onClick={() => setSearchMode("domains")} className={`flex-1 px-4 py-2.5 text-sm font-medium ${searchMode === "domains" ? "text-red-400 bg-red-500/10" : `${textSecondary}`}`}>
                          Domains
                        </button>
                        <button onClick={() => setSearchMode("settings")} className={`flex-1 px-4 py-2.5 text-sm font-medium ${searchMode === "settings" ? "text-red-400 bg-red-500/10" : `${textSecondary}`}`}>
                          Settings
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto py-2">
                        {searchMode === "settings" ? (
                          filteredSettings.map((setting, index) => (
                            <Link key={index} href={setting.path} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`} onClick={() => setSearchDropdownOpen(false)}>
                              <setting.icon className={`h-4 w-4 ${textMuted}`} />
                              {setting.label}
                            </Link>
                          ))
                        ) : (
                          domains.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((domain) => (
                            <button key={domain.id} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`} onClick={() => setSearchDropdownOpen(false)}>
                              <Globe className={`h-4 w-4 ${textMuted}`} />
                              {domain.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Global Add Button */}
                <div className="relative" ref={addDropdownRef}>
                  <button 
                    onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                    className="btn-swipe-red flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${addDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {addDropdownOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                      <div className="py-2">
                        <button onClick={() => { setAddDropdownOpen(false); setCheckoutModalOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <Globe className="h-4 w-4 text-red-400" />
                          Add Domain
                        </button>
                        <button onClick={() => { setAddDropdownOpen(false); setEmailModalOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <Mail className="h-4 w-4 text-red-400" />
                          Add Email
                        </button>
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <Shield className="h-4 w-4 text-red-400" />
                          Add SSL Certificate
                        </button>
                        <button onClick={() => { setAddDropdownOpen(false); setTransferModalOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <ArrowRightLeft className="h-4 w-4 text-red-400" />
                          Transfer Domain
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Status Indicator */}
                <button onClick={() => setStatusModalOpen(true)} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 ${bgInput} border rounded-lg`}>
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className={`text-xs ${textSecondary}`}>Operational</span>
                </button>
                
                {/* Keyboard Shortcuts */}
                <button 
                  onClick={() => setShortcutsModalOpen(true)}
                  className={`hidden sm:flex p-2 ${textSecondary} ${bgHover} rounded-lg`}
                  title="Keyboard shortcuts (?)"
                >
                  <Keyboard className="h-5 w-5" />
                </button>
                
                {/* Notifications Panel (merged with Insights) */}
                <div className="relative" ref={notificationsPanelRef}>
                  <button 
                    onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                    className={`relative p-2 ${textSecondary} ${bgHover} rounded-lg`}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  
                  {notificationsPanelOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-96 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                      <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
                        <h3 className={`text-sm font-extrabold ${textPrimary}`}>Notifications</h3>
                        <button onClick={markAllNotificationsRead} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                          <CheckCheck className="h-3 w-3" />
                          Mark all read
                        </button>
                      </div>
                      
                      {/* Tabs */}
                      <div className={`flex border-b ${borderColor}`}>
                        <button 
                          onClick={() => setNotificationsTab('notifications')} 
                          className={`flex-1 px-4 py-2.5 text-sm font-medium ${notificationsTab === 'notifications' ? 'text-red-400 bg-red-500/10' : textSecondary}`}
                        >
                          Notifications
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              {notifications.filter(n => !n.read).length}
                            </span>
                          )}
                        </button>
                        <button 
                          onClick={() => setNotificationsTab('insights')} 
                          className={`flex-1 px-4 py-2.5 text-sm font-medium ${notificationsTab === 'insights' ? 'text-red-400 bg-red-500/10' : textSecondary}`}
                        >
                          Insights
                          {insightsData.filter(i => !i.read).length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              {insightsData.filter(i => !i.read).length}
                            </span>
                          )}
                        </button>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notificationsTab === 'notifications' ? (
                          <div className="py-2">
                            {notifications.map((notification) => (
                              <button 
                                key={notification.id}
                                onClick={() => markNotificationRead(notification.id)}
                                className={`w-full flex items-start gap-3 px-4 py-3 ${bgHover} ${!notification.read ? (theme === 'dark' ? 'bg-neutral-800/50' : 'bg-blue-50') : ''}`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                                  notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                  'bg-blue-500/10 text-blue-400'
                                }`}>
                                  <notification.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${textPrimary}`}>{notification.title}</p>
                                    {!notification.read && <Circle className="h-2 w-2 fill-red-500 text-red-500" />}
                                  </div>
                                  <p className={`text-xs ${textSecondary}`}>{notification.description}</p>
                                  <p className={`text-xs ${textMuted} mt-1`}>{notification.time}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-2">
                            {insightsData.map((insight) => (
                              <button 
                                key={insight.id}
                                onClick={() => setInsightsData(prev => prev.map(i => i.id === insight.id ? { ...i, read: true } : i))}
                                className={`w-full flex items-start gap-3 px-4 py-3 ${bgHover} ${!insight.read ? (theme === 'dark' ? 'bg-neutral-800/50' : 'bg-blue-50') : ''}`}
                              >
                                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${textPrimary}`}>{insight.title}</p>
                                    {!insight.read && <Circle className="h-2 w-2 fill-red-500 text-red-500" />}
                                  </div>
                                  <p className={`text-xs ${textSecondary}`}>{insight.description}</p>
                                </div>
                                <ChevronRight className={`h-4 w-4 ${textMuted}`} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${userDropdownOpen ? `${textPrimary} ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-200'}` : `${textSecondary} ${bgHover}`}`} onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                    <User className="h-5 w-5" />
                    <ChevronDown className={`h-4 w-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-64 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                      <div className={`p-3 border-b ${borderColor}`}>
                        <p className={`text-sm font-medium ${textPrimary}`}>John Doe</p>
                        <p className={`text-xs ${textSecondary}`}>john@example.com</p>
                      </div>
                      <div className="py-2">
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </button>
                        <button onClick={() => { setUserDropdownOpen(false); setSubscriptionsModalOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <Receipt className="h-4 w-4" />
                          Subscriptions
                        </button>
                        <button onClick={() => { setUserDropdownOpen(false); setRecoveryModalOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <LifeBuoy className="h-4 w-4" />
                          Account Recovery
                        </button>
                        <button onClick={() => { setUserDropdownOpen(false); setProtectionModalOpen(true); }} className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4" />
                            Domain Protection
                          </div>
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">ON</span>
                        </button>
                        
                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className={textSecondary}>{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className={`${textSecondary} hover:${textPrimary} transition-colors`}
                    >
                      Not you? Sign out
                    </button>
                  </div>
                )}
                        <button onClick={toggleTheme} className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${textSecondary} ${bgHover}`}>
                          <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-red-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                        </button>
                      </div>
                      <div className={`border-t ${borderColor} py-2`}>
                        <Link href="/login" className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 ${bgHover}`}>
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className={`absolute left-0 top-0 bottom-0 w-72 ${bgSidebar} border-r transform transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-red-500" />
                <span className={`text-xl font-bold ${textPrimary}`}>DomainPro</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className={`p-2 ${textSecondary}`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4">
              {navigationSections.map((section) => (
                <div key={section.id} className="mb-4">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between px-2 py-2 text-xs font-medium ${textMuted}`}
                  >
                    <span>{section.title}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${collapsedSections.includes(section.id) ? '-rotate-90' : ''}`} />
                  </button>
                  {!collapsedSections.includes(section.id) && (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = item.id === "dashboard"
                        const badge = item.id === "ssl" ? sslExpiringCount : item.badge
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isActive ? 'bg-red-500/10 text-red-400' : `${textSecondary} ${bgHover}`}`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            {badge && badge > 0 && (
                              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">{badge}</span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* ============================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================ */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-6">
          <Breadcrumbs items={[{ label: "Dashboard" }]} theme={theme} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary}`}>Dashboard</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className={textSecondary}>Welcome back! Here&apos;s your domain overview</p>
                {/* Data Freshness Indicator */}
                <div className="flex items-center gap-1.5">
                  <button onClick={refreshData} className={`p-1 ${textMuted} hover:text-red-400 transition-colors`}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <span className={`text-xs ${textMuted}`}>
                    Updated {formatTimeAgo(minutesSinceUpdate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-refresh Toggle */}
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`btn-swipe hidden sm:flex items-center gap-2 px-3 py-2 border rounded-lg text-sm ${autoRefresh ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : `${bgInput} ${textSecondary}`}`}
              >
                {autoRefresh ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
              </button>
              
              {/* Widget Visibility Toggle */}
              <button 
                onClick={() => setWidgetModalOpen(true)}
                className={`btn-swipe flex items-center gap-2 px-3 py-2 ${bgInput} border ${textSecondary} rounded-lg text-sm`}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Widgets</span>
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg overflow-hidden border">
                <button 
                  onClick={() => setViewMode('default')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${viewMode === 'default' ? 'bg-red-500/10 text-red-400' : `${bgInput} ${textSecondary}`}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Default</span>
                </button>
                <button 
                  onClick={() => setViewMode('calculator')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${viewMode === 'calculator' ? 'bg-red-500/10 text-red-400' : `${bgInput} ${textSecondary}`}`}
                >
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </button>
              </div>
              
              {/* Compact View Toggle */}
              <button 
                onClick={() => setCompactView(!compactView)}
                className={`btn-swipe flex items-center gap-2 px-3 py-2 border rounded-lg text-sm ${compactView ? 'bg-red-500/10 border-red-500/30 text-red-400' : `${bgInput} ${textSecondary}`}`}
              >
                {compactView ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                <span className="hidden sm:inline">{compactView ? 'Compact' : 'Grid'}</span>
              </button>
              
              <button onClick={() => setCostCalculatorOpen(true)} className={`btn-swipe hidden sm:flex items-center gap-2 px-3 py-2 ${bgInput} border ${textSecondary} rounded-lg text-sm`}>
                <Calculator className="h-4 w-4" />
                Calculator
              </button>
            </div>
          </div>

          {/* Transparent Pricing Badge */}
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <p className={`text-sm font-medium ${textPrimary}`}>What You See Is What You Pay</p>
                <p className={`text-xs ${textSecondary}`}>No hidden fees. Initial AND renewal prices shown upfront.</p>
              </div>
            </div>
            <button onClick={() => setCostCalculatorOpen(true)} className="btn-swipe flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg">
              <Calculator className="h-4 w-4" />
              5-Year Calculator
            </button>
          </div>

          {/* CALCULATOR VIEW */}
          {viewMode === 'calculator' && (
            <div className={`${bgCard} border rounded-xl p-6 mb-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Calculator className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className={`text-lg font-extrabold ${textPrimary}`}>Portfolio Cost Calculator</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400">What You See Is What You Pay</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Calculate for how many years?</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calculatorYears}
                    onChange={(e) => setCalculatorYears(parseInt(e.target.value))}
                    className={`flex-1 h-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-300'} rounded-full accent-red-500`}
                  />
                  <span className={`text-2xl font-bold ${textPrimary} w-16 text-center`}>{calculatorYears}yr</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {domains.map((domain) => {
                  const totalCost = domain.initialPrice + (domain.renewalPrice * (calculatorYears - 1))
                  return (
                    <div key={domain.id} className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${textPrimary}`}>{domain.name}</span>
                        {domain.ssl && <Shield className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <div className={`text-xs ${textSecondary} mb-3`}>
                        ${domain.initialPrice} first year + ${domain.renewalPrice}/yr renewal
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${textMuted}`}>{calculatorYears}-year cost</span>
                        <span className={`text-lg font-bold ${textPrimary}`}>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-300 font-medium">Total Portfolio {calculatorYears}-Year Cost</p>
                    <p className="text-xs text-emerald-400/70">{domains.length} domains combined</p>
                  </div>
                  <span className={`text-3xl font-bold ${textPrimary}`}>
                    ${domains.reduce((sum, d) => sum + d.initialPrice + (d.renewalPrice * (calculatorYears - 1)), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT VIEW */}
          {viewMode === 'default' && (
            <>
          {/* Stats Cards */}
          {widgetVisibility.statsCards && (
            <div className={`grid gap-4 sm:gap-6 mb-8 ${compactView ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
              {isLoading ? (
                <><SkeletonCard theme={theme} /><SkeletonCard theme={theme} /><SkeletonCard theme={theme} /><SkeletonCard theme={theme} /></>
              ) : (
                stats.map((stat) => (
                  <div key={stat.label} className={`${bgCard} border rounded-xl card-hover-glow ${compactView ? 'p-3' : 'p-4 sm:p-6'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`bg-red-500/10 border border-red-500/30 rounded-lg ${compactView ? 'p-1.5' : 'p-2'}`}>
                        <stat.icon className={`text-red-400 ${compactView ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      </div>
                      {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <div className={`font-bold ${textPrimary} ${compactView ? 'text-lg' : 'text-xl sm:text-2xl'}`}>{stat.value}</div>
                    <div className={`${textMuted} ${compactView ? 'text-xs' : 'text-sm'}`}>{stat.label}</div>
                    {!compactView && <div className={`text-xs ${textSecondary} mt-2`}>{stat.change}</div>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Domains Table */}
            {widgetVisibility.domainsTable && (
              <div className="lg:col-span-2">
                <div className={`${bgCard} border rounded-xl overflow-hidden card-hover-glow`}>
                  <div className={`px-4 sm:px-6 py-4 border-b ${borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3">
                      <h2 className={`text-lg font-extrabold ${textPrimary}`}>Your Domains</h2>
                      {/* Table Action Icons */}
                      <div className="flex items-center gap-1">
                        <button onClick={() => setWidgetModalOpen(true)} className={`p-1.5 ${textMuted} hover:${textSecondary} rounded-lg`} title="Toggle widgets">
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative" ref={tableFiltersRef}>
                          <button onClick={() => setTableFiltersOpen(!tableFiltersOpen)} className={`p-1.5 ${textMuted} hover:${textSecondary} rounded-lg`} title="Filter">
                            <Filter className="h-4 w-4" />
                          </button>
                          {tableFiltersOpen && (
                            <div className={`absolute left-0 top-full mt-2 w-64 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                              <div className={`p-3 border-b ${borderColor}`}>
                                <h4 className={`text-sm font-medium ${textPrimary}`}>Filter Domains</h4>
                              </div>
                              <div className="p-3 space-y-3">
                                <div>
                                  <label className={`text-xs font-medium ${textSecondary} block mb-1`}>Status</label>
                                  <select value={searchFilters.status} onChange={(e) => setSearchFilters(p => ({ ...p, status: e.target.value }))} className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}>
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={`text-xs font-medium ${textSecondary} block mb-1`}>SSL</label>
                                  <select value={searchFilters.ssl} onChange={(e) => setSearchFilters(p => ({ ...p, ssl: e.target.value }))} className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}>
                                    <option value="all">All</option>
                                    <option value="hasSSL">Has SSL</option>
                                    <option value="noSSL">No SSL</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={`text-xs font-medium ${textSecondary} block mb-1`}>Sort By</label>
                                  <select value={searchFilters.sortBy} onChange={(e) => setSearchFilters(p => ({ ...p, sortBy: e.target.value }))} className={`w-full px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`}>
                                    <option value="name">Name</option>
                                    <option value="expiry">Expiry</option>
                                    <option value="price">Price</option>
                                    <option value="visits">Visits</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button className={`p-1.5 ${textMuted} hover:${textSecondary} rounded-lg`} title="Table Settings">
                          <SlidersHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Results Count */}
                      <span className={`text-xs ${textMuted}`}>
                        Showing {sortedFilteredDomains.length} of {domains.length} domains
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDomains.length > 0 && (
                        <>
                          <span className={`text-xs ${textSecondary}`}>{selectedDomains.length} selected</span>
                          <div className="relative" ref={bulkActionsRef}>
                            <button onClick={() => setBulkActionsOpen(!bulkActionsOpen)} className="btn-swipe-red flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg">
                              Bulk Actions
                              <ChevronDown className={`h-3 w-3 ${bulkActionsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {bulkActionsOpen && (
                              <div className={`absolute right-0 top-full mt-2 w-48 ${bgDropdown} border rounded-xl overflow-hidden z-50`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                                <div className="py-2">
                                  <button onClick={() => handleBulkAction('renew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                                    <RefreshCw className="h-4 w-4" />
                                    Renew Selected
                                  </button>
                                  <button onClick={() => handleBulkAction('transfer')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                                    <ArrowRightLeft className="h-4 w-4" />
                                    Transfer Selected
                                  </button>
                                  <button onClick={() => handleBulkAction('enable-autorenew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                                    <Power className="h-4 w-4" />
                                    Enable Auto-Renew
                                  </button>
                                  <button onClick={() => handleBulkAction('disable-autorenew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                                    <PowerOff className="h-4 w-4" />
                                    Disable Auto-Renew
                                  </button>
                                  <button onClick={() => handleBulkAction('export')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                                    <Download className="h-4 w-4" />
                                    Export Selected
                                  </button>
                                  <div className={`border-t ${borderColor} my-1`} />
                                  <button onClick={() => handleBulkAction('delete')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 ${bgHover}`}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <button onClick={clearSelection} className={`p-1.5 ${textSecondary} ${bgHover} rounded-lg`}>
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {showEmptyState ? (
                    <EmptyState theme={theme} />
                  ) : isLoading ? (
                    <div className="p-8 space-y-4">
                      {[1, 2, 3].map((i) => <div key={i} className={`h-16 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-200'} rounded-lg animate-pulse`} />)}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead>
                          <tr className={`text-left text-xs border-b ${borderColor}`}>
                            <th className="px-4 py-3 font-medium">
                              <button onClick={toggleAllDomains} className={`p-1 ${textSecondary}`}>
                                {selectedDomains.length === sortedFilteredDomains.length && sortedFilteredDomains.length > 0 ? <CheckSquare className="h-4 w-4 text-red-400" /> : <Square className="h-4 w-4" />}
                              </button>
                            </th>
                            <th className="px-4 py-3 font-medium">
                              <button onClick={() => handleSort("name")} className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-gray-100 text-gray-500 border-gray-300'} border text-xs`}>
                                Domain {getSortIndicator("name")}
                              </button>
                            </th>
                            <th className="px-4 py-3 font-medium">
                              <span className={`px-3 py-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-gray-100 text-gray-500 border-gray-300'} border text-xs`}>Status</span>
                            </th>
                            <th className="px-4 py-3 font-medium">
                              <span className={`px-3 py-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-gray-100 text-gray-500 border-gray-300'} border text-xs`}>SSL</span>
                            </th>
                            <th className="px-4 py-3 font-medium">
                              <span className={`px-3 py-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-gray-100 text-gray-500 border-gray-300'} border text-xs`}>Price</span>
                            </th>
                            <th className="px-4 py-3 font-medium">
                              <button onClick={() => handleSort("expiry")} className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-gray-100 text-gray-500 border-gray-300'} border text-xs`}>
                                Expiry {getSortIndicator("expiry")}
                              </button>
                            </th>
                            <th className="px-4 py-3 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedFilteredDomains.map((domain) => (
                            <tr key={domain.id} className={`border-b ${theme === 'dark' ? 'border-neutral-800/30' : 'border-gray-100'} row-hover-glow`}>
                              <td className="px-4 py-4">
                                <button onClick={() => toggleDomainSelection(domain.id)} className={`p-1 ${textSecondary}`}>
                                  {selectedDomains.includes(domain.id) ? <CheckSquare className="h-4 w-4 text-red-400" /> : <Square className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => togglePinDomain(domain.id)} className={`${textMuted} hover:text-yellow-400`}>
                                    <Star className={`h-4 w-4 ${domain.pinned ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                  </button>
                                  <span className={`text-sm font-medium ${textPrimary}`}>{domain.name}</span>
                                  {domain.locked && <Lock className="h-3 w-3 text-emerald-400" />}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${domain.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"}`}>
                                  {domain.status === "active" && <Check className="h-3 w-3" />}
                                  {domain.status === "active" ? "Active" : "Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {domain.ssl ? <Shield className="h-4 w-4 text-emerald-400" /> : <Shield className={`h-4 w-4 ${textMuted}`} />}
                              </td>
                              <td className="px-4 py-4">
                                <PricingTooltip initialPrice={domain.initialPrice} renewalPrice={domain.renewalPrice} theme={theme}>
                                  <div className="text-left">
                                    <p className={`text-sm font-medium ${textPrimary}`}>${domain.initialPrice}</p>
                                    <p className="text-xs text-yellow-500">${domain.renewalPrice}/yr</p>
                                  </div>
                                </PricingTooltip>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm ${textSecondary}`}>{domain.expiry}</span>
                              </td>
                              <td className="px-4 py-4">
                                <button onClick={() => openDomainSettings(domain)} className={`p-1.5 ${textSecondary} hover:text-red-400`} title="Domain Settings">
                                  <Settings className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pinned Domains */}
              {widgetVisibility.pinnedDomains && pinnedDomains.length > 0 && (
                <div className={`${bgCard} border rounded-xl p-4 card-hover-glow`}>
                  <h3 className={`text-sm font-extrabold ${textPrimary} mb-3 flex items-center gap-2`}>
                    <Star className="h-4 w-4 text-yellow-400" />
                    Pinned Domains
                  </h3>
                  <div className="space-y-2">
                    {pinnedDomains.map((domain) => (
                      <div key={domain.id} className={`flex items-center justify-between p-2 ${theme === 'dark' ? 'bg-neutral-800/30' : 'bg-gray-100'} rounded-lg`}>
                        <span className={`text-sm ${textPrimary}`}>{domain.name}</span>
                        <button onClick={() => togglePinDomain(domain.id)} className="text-yellow-400 hover:text-yellow-300">
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed */}
              {widgetVisibility.recentlyViewed && (
                <div className={`${bgCard} border rounded-xl p-4 card-hover-glow`}>
                  <h3 className={`text-sm font-extrabold ${textPrimary} mb-3 flex items-center gap-2`}>
                    <Eye className="h-4 w-4 text-neutral-400" />
                    Recently Viewed
                  </h3>
                  <div className="space-y-2">
                    {recentlyViewedDomains.map((domain) => (
                      <div key={domain.id} className={`flex items-center justify-between p-2 ${theme === 'dark' ? 'bg-neutral-800/30' : 'bg-gray-100'} rounded-lg ${bgHover} cursor-pointer`}>
                        <span className={`text-sm ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>{domain.name}</span>
                        <ChevronRight className={`h-4 w-4 ${textMuted}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {widgetVisibility.quickActions && (
                <div className={`${bgCard} border rounded-xl p-4 card-hover-glow`}>
                  <h3 className={`text-sm font-extrabold ${textPrimary} mb-3`}>Quick Actions</h3>
                  <div className="space-y-2">
                    <button onClick={() => setIntegrationsModalOpen(true)} className={`btn-swipe w-full flex items-center gap-3 p-2.5 ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-gray-100 border-gray-200'} border rounded-lg text-sm ${textPrimary} action-hover-glow`}>
                      <Plug className="h-4 w-4 text-red-400" />
                      <span>Integrations</span>
                    </button>
                    <button onClick={() => setHealthChecksModalOpen(true)} className={`btn-swipe w-full flex items-center gap-3 p-2.5 ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-gray-100 border-gray-200'} border rounded-lg text-sm ${textPrimary} action-hover-glow`}>
                      <HeartPulse className="h-4 w-4 text-red-400" />
                      <span>Health Checks</span>
                    </button>
                    <button onClick={() => setAnalyticsModalOpen(true)} className={`btn-swipe w-full flex items-center gap-3 p-2.5 ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-gray-100 border-gray-200'} border rounded-lg text-sm ${textPrimary} action-hover-glow`}>
                      <PieChart className="h-4 w-4 text-red-400" />
                      <span>Portfolio Analytics</span>
                    </button>
                    <button onClick={() => setEducationModalOpen(true)} className={`btn-swipe w-full flex items-center gap-3 p-2.5 ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-gray-100 border-gray-200'} border rounded-lg text-sm ${textPrimary} action-hover-glow`}>
                      <GraduationCap className="h-4 w-4 text-red-400" />
                      <span>Domain University</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {widgetVisibility.recentActivity && (
                <div className={`${bgCard} border rounded-xl p-4 card-hover-glow`}>
                  <h3 className={`text-sm font-extrabold ${textPrimary} mb-3`}>Recent Activity</h3>
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="h-8 w-8 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <p className={`text-sm ${textPrimary}`}>{activity.action}</p>
                          <p className={`text-xs ${textMuted}`}>{activity.domain} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Charts */}
          {widgetVisibility.analyticsCharts && (
            <div className="mt-8">
              <div className={`${bgCard} border rounded-xl overflow-hidden card-hover-glow`}>
                <div className={`px-4 sm:px-6 py-4 border-b ${borderColor}`}>
                  <h2 className={`text-lg font-extrabold ${textPrimary} mb-4`}>Analytics</h2>
                  <div className="flex flex-wrap gap-2">
                    {chartTabs.map((tab) => (
                      <button key={tab.id} onClick={() => setActiveChart(tab.id)} className={`pill-hover-glow px-4 py-2 rounded-full text-sm font-medium ${activeChart === tab.id ? "bg-red-600 text-white" : `${theme === 'dark' ? 'bg-neutral-800 text-neutral-400' : 'bg-gray-100 text-gray-500'}`}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 sm:p-6 min-h-[280px]">
                  {renderChart()}
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </main>

        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}
        <footer className={`${bgSidebar} border-t mt-auto hidden lg:block`}>
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className={`flex items-center gap-4 ${textSecondary} text-sm`}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-red-500" />
                  <span>© 2026 DomainPro. All rights reserved.</span>
                </div>
                {/* Performance Indicator */}
                {loadTime && (
                  <span className={`text-xs ${textMuted}`}>
                    Dashboard loaded in {loadTime.toFixed(1)}s
                  </span>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 ${bgInput} border rounded-lg`}>
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>ICANN Accredited</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 ${bgInput} border rounded-lg`}>
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>SSL Secure</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 ${bgInput} border rounded-lg`}>
                  <Wifi className="h-4 w-4 text-emerald-400" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>99.9% Uptime</span>
                </div>
              </div>
              
              <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link href="/terms" className={`text-sm ${textSecondary} hover:text-red-400`}>Terms</Link>
                <Link href="/privacy" className={`text-sm ${textSecondary} hover:text-red-400`}>Privacy</Link>
                <Link href="/docs" className={`text-sm ${textSecondary} hover:text-red-400`}>Docs</Link>
                <button onClick={() => setStatusModalOpen(true)} className={`text-sm ${textSecondary} hover:text-red-400`}>System Status</button>
                <Link href="/support" className={`text-sm ${textSecondary} hover:text-red-400`}>Support</Link>
              </nav>
            </div>
          </div>
        </footer>

        {/* ============================================ */}
        {/* MOBILE BOTTOM NAVIGATION */}
        {/* ============================================ */}
        <nav className={`lg:hidden fixed bottom-0 left-0 right-0 ${bgSidebar} border-t z-30 safe-area-pb`}>
          <div className="flex items-center justify-around py-2 px-2">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] justify-center text-red-400">
              <Activity className="h-6 w-6" />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link href="/search" className={`flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] justify-center ${textSecondary}`}>
              <Globe className="h-6 w-6" />
              <span className="text-xs">Domains</span>
            </Link>
            <button onClick={() => setCheckoutModalOpen(true)} className="flex flex-col items-center gap-1 p-2 -mt-4">
              <div className="p-4 bg-red-600 rounded-full shadow-lg">
                <Plus className="h-7 w-7 text-white" />
              </div>
            </button>
            <button onClick={() => setEmailModalOpen(true)} className={`flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] justify-center ${textSecondary}`}>
              <Mail className="h-6 w-6" />
              <span className="text-xs">Email</span>
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className={`flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] justify-center ${textSecondary}`}>
              <MoreHorizontal className="h-6 w-6" />
              <span className="text-xs">More</span>
            </button>
          </div>
        </nav>

        {/* ============================================ */}
        {/* BULK ACTIONS FLOATING BAR */}
        {/* ============================================ */}
        {selectedDomains.length > 0 && (
          <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40" style={{ animation: "slideUpBounce 0.3s ease-out" }}>
            <div className={`flex items-center gap-3 px-4 py-3 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-300'} border rounded-xl shadow-2xl`}>
              <span className={`text-sm font-medium ${textPrimary}`}>
                {selectedDomains.length} domain{selectedDomains.length > 1 ? 's' : ''} selected
              </span>
              
              <div className="h-4 w-px bg-neutral-600" />
              
              <div className="relative" ref={bulkActionsRef}>
                <button 
                  onClick={() => setBulkActionsOpen(!bulkActionsOpen)}
                  className="btn-swipe-red flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg"
                >
                  Actions
                  <ChevronDown className={`h-4 w-4 transition-transform ${bulkActionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {bulkActionsOpen && (
                  <div className={`absolute bottom-full left-0 mb-2 w-48 ${bgDropdown} border rounded-xl overflow-hidden`} style={{ animation: "scaleIn 0.2s ease-out" }}>
                    <div className="py-2">
                      <button onClick={() => handleBulkAction('renew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                        <RefreshCw className="h-4 w-4" />
                        Renew Selected
                      </button>
                      <button onClick={() => handleBulkAction('transfer')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                        <ArrowRightLeft className="h-4 w-4" />
                        Transfer Selected
                      </button>
                      <button onClick={() => handleBulkAction('enable-autorenew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                        <Power className="h-4 w-4" />
                        Enable Auto-Renew
                      </button>
                      <button onClick={() => handleBulkAction('disable-autorenew')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                        <PowerOff className="h-4 w-4" />
                        Disable Auto-Renew
                      </button>
                      <button onClick={() => handleBulkAction('export')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${textSecondary} ${bgHover}`}>
                        <Download className="h-4 w-4" />
                        Export Selected
                      </button>
                      <div className={`border-t ${borderColor} my-1`} />
                      <button onClick={() => handleBulkAction('delete')} className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 ${bgHover}`}>
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={clearSelection}
                className={`p-1.5 ${textSecondary} ${bgHover} rounded-lg`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* WIDGET VISIBILITY MODAL */}
      {/* ============================================ */}
      {widgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setWidgetModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-md`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <LayoutGrid className="h-5 w-5 text-red-400" />
                </div>
                <h2 className={`text-lg font-extrabold ${textPrimary}`}>Dashboard Widgets</h2>
              </div>
              <button onClick={() => setWidgetModalOpen(false)} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Widget Toggles */}
              {[
                { key: 'statsCards', label: 'Stats Cards', description: 'Total Domains, SSL, Visits, Uptime' },
                { key: 'domainsTable', label: 'Your Domains Table', description: 'Domain listing with actions' },
                { key: 'quickActions', label: 'Quick Actions', description: 'Integrations, Health Checks, etc.' },
                { key: 'recentActivity', label: 'Recent Activity', description: 'Latest domain activities' },
                { key: 'analyticsCharts', label: 'Analytics Charts', description: 'Domain growth, SSL status, traffic' },
                { key: 'pinnedDomains', label: 'Pinned Domains', description: 'Your favorite domains' },
                { key: 'recentlyViewed', label: 'Recently Viewed', description: 'Last viewed domains' },
              ].map((widget) => (
                <div key={widget.key} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-lg`}>
                  <div>
                    <p className={`text-sm font-medium ${textPrimary}`}>{widget.label}</p>
                    <p className={`text-xs ${textMuted}`}>{widget.description}</p>
                  </div>
                  <button
                    onClick={() => updateWidgetVisibility(widget.key as keyof typeof defaultWidgetVisibility, !widgetVisibility[widget.key as keyof typeof defaultWidgetVisibility])}
                    className={`p-2 rounded-lg transition-colors ${widgetVisibility[widget.key as keyof typeof defaultWidgetVisibility] ? 'bg-red-500/10 text-red-400' : `${theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'} ${textMuted}`}`}
                  >
                    {widgetVisibility[widget.key as keyof typeof defaultWidgetVisibility] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              ))}
              
              {/* Reset Button */}
              <button 
                onClick={resetWidgets}
                className={`w-full flex items-center justify-center gap-2 p-3 ${theme === 'dark' ? 'bg-neutral-800/50 hover:bg-neutral-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-sm ${textSecondary} transition-colors`}
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* KEYBOARD SHORTCUTS MODAL */}
      {/* ============================================ */}
      {shortcutsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShortcutsModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-md`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Keyboard className="h-5 w-5 text-red-400" />
                </div>
                <h2 className={`text-lg font-extrabold ${textPrimary}`}>Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShortcutsModalOpen(false)} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-lg`}>
                  <span className={`text-sm ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i} className={`kbd ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>{key}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* COST CALCULATOR MODAL */}
      {/* ============================================ */}
      {costCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCostCalculatorOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-lg`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Calculator className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className={`text-lg font-extrabold ${textPrimary}`}>Total Cost Calculator</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400">What You See Is What You Pay</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setCostCalculatorOpen(false)} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'} mb-2`}>Calculate for how many years?</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calculatorYears}
                    onChange={(e) => setCalculatorYears(parseInt(e.target.value))}
                    className={`flex-1 h-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-300'} rounded-full accent-red-500`}
                  />
                  <span className={`text-2xl font-bold ${textPrimary} w-16 text-center`}>{calculatorYears}yr</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                <h3 className={`text-sm font-medium ${textSecondary}`}>Your Domain Portfolio Cost</h3>
                {domains.slice(0, 4).map((domain) => {
                  const totalCost = domain.initialPrice + (domain.renewalPrice * (calculatorYears - 1))
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

                  return (
                    <div key={domain.id} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-lg`}>
                      <div>
                        <p className={`text-sm ${textPrimary}`}>{domain.name}</p>
                        <p className={`text-xs ${textMuted}`}>${domain.initialPrice} + ${domain.renewalPrice}/yr</p>
                      </div>
                      <span className={`text-lg font-bold ${textPrimary}`}>${totalCost.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
              
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-300">Total {calculatorYears}-Year Cost</p>
                    <p className="text-xs text-emerald-400/70">All domains combined</p>
                  </div>
                  <span className={`text-3xl font-bold ${textPrimary}`}>
                    ${domains.reduce((sum, d) => sum + d.initialPrice + (d.renewalPrice * (calculatorYears - 1)), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STATUS MODAL */}
      {/* ============================================ */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setStatusModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-md`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className={`text-lg font-extrabold ${textPrimary}`}>System Status</h2>
              </div>
              <button onClick={() => setStatusModalOpen(false)} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-300 font-medium">All Systems Operational</span>
              </div>
              <div className="space-y-3">
                {["Domain Registration", "DNS Services", "SSL Certificates", "Email Services", "API", "Dashboard"].map((service) => (
                  <div key={service} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-lg`}>
                    <span className={`text-sm ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-600'}`}>{service}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-emerald-400">Operational</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DOMAIN SETTINGS MODAL */}
      {/* ============================================ */}
      {domainSettingsOpen && selectedDomainForSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeDomainSettings} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${borderColor} flex-shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Settings className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className={`text-lg font-extrabold ${textPrimary}`}>Domain Settings</h2>
                  <p className={`text-sm ${textSecondary}`}>{selectedDomainForSettings.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settingsSaved && <span className="text-sm text-emerald-400 flex items-center gap-1"><CheckCircle className="h-4 w-4" />Saved!</span>}
                {hasUnsavedChanges && <span className="text-sm text-yellow-400">Unsaved changes</span>}
                <button onClick={closeDomainSettings} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}><X className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${borderColor} flex-shrink-0 overflow-x-auto`}>
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'dns', label: 'DNS Management', icon: Server },
                { id: 'email', label: 'Email & Forwarding', icon: Mail },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'advanced', label: 'Advanced', icon: Sliders }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setDomainSettingsTab(tab.id as typeof domainSettingsTab)} 
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${domainSettingsTab === tab.id ? 'text-red-400 border-b-2 border-red-400' : textSecondary}`}
                >
                  <tab.icon className="h-4 w-4" />{tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* GENERAL TAB */}
              {domainSettingsTab === 'general' && (
                <div className="space-y-6">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Domain Lock</p><p className={`text-xs ${textSecondary}`}>Prevents unauthorized transfers</p></div></div>
                      <ToggleSwitch enabled={domainSettingsForm.locked} onChange={() => { setDomainSettingsForm(p => ({ ...p, locked: !p.locked })); setHasUnsavedChanges(true); }} theme={theme} />
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><RefreshCw className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Auto-Renew</p><p className={`text-xs ${textSecondary}`}>Next renewal: {selectedDomainForSettings.expiry}</p></div></div>
                      <ToggleSwitch enabled={domainSettingsForm.autoRenew} onChange={() => { setDomainSettingsForm(p => ({ ...p, autoRenew: !p.autoRenew })); setHasUnsavedChanges(true); }} theme={theme} />
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><EyeOff className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>WHOIS Privacy</p><p className={`text-xs ${textSecondary}`}>Hide personal info from public records</p></div></div>
                      <ToggleSwitch enabled={domainSettingsForm.privacy} onChange={() => { setDomainSettingsForm(p => ({ ...p, privacy: !p.privacy })); setHasUnsavedChanges(true); }} theme={theme} />
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Calendar className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Registration Period</p><p className={`text-xs ${textSecondary}`}>Extend your registration</p></div></div>
                    <select value={domainSettingsForm.registrationYears} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, registrationYears: parseInt(e.target.value) })); setHasUnsavedChanges(true); }} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}>
                      {[1,2,3,4,5,6,7,8,9,10].map(y => <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><ArrowRight className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Domain Forwarding</p><p className={`text-xs ${textSecondary}`}>Redirect visitors to another URL</p></div></div>
                    <div className="space-y-3">
                      <input type="url" placeholder="https://example.com" value={domainSettingsForm.forwardUrl} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, forwardUrl: e.target.value })); setHasUnsavedChanges(true); }} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                      <div className="flex gap-3">
                        <select value={domainSettingsForm.forwardType} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, forwardType: e.target.value })); setHasUnsavedChanges(true); }} className={`flex-1 px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}>
                          <option value="301">301 Permanent</option><option value="302">302 Temporary</option><option value="masked">Masked</option>
                        </select>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={domainSettingsForm.forwardWww} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, forwardWww: e.target.checked })); setHasUnsavedChanges(true); }} className="rounded" /><span className={`text-sm ${textSecondary}`}>Include www</span></label>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><UserCircle className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Contact Information</p><p className={`text-xs ${textSecondary}`}>Registrant, Admin, Technical, Billing</p></div></div>
                      <button className="btn-swipe px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg">Edit Contacts</button>
                    </div>
                  </div>
                </div>
              )}

              {/* DNS TAB */}
              {domainSettingsTab === 'dns' && (
                <div className="space-y-6">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-4"><Server className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Nameservers</p><p className={`text-xs ${textSecondary}`}>Configure DNS management</p></div></div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={!domainSettingsForm.useCustomNS} onChange={() => { setDomainSettingsForm(p => ({ ...p, useCustomNS: false })); setHasUnsavedChanges(true); }} className="text-red-500" /><span className={`text-sm ${textPrimary}`}>Use DomainPro Nameservers (Recommended)</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={domainSettingsForm.useCustomNS} onChange={() => { setDomainSettingsForm(p => ({ ...p, useCustomNS: true })); setHasUnsavedChanges(true); }} className="text-red-500" /><span className={`text-sm ${textPrimary}`}>Use Custom Nameservers</span></label>
                      {domainSettingsForm.useCustomNS && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <input placeholder="NS1" value={domainSettingsForm.ns1} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, ns1: e.target.value })); setHasUnsavedChanges(true); }} className={`px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                          <input placeholder="NS2" value={domainSettingsForm.ns2} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, ns2: e.target.value })); setHasUnsavedChanges(true); }} className={`px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                          <input placeholder="NS3 (optional)" value={domainSettingsForm.ns3} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, ns3: e.target.value })); setHasUnsavedChanges(true); }} className={`px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                          <input placeholder="NS4 (optional)" value={domainSettingsForm.ns4} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, ns4: e.target.value })); setHasUnsavedChanges(true); }} className={`px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3"><Database className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>DNS Records</p><p className={`text-xs ${textSecondary}`}>Manage A, AAAA, CNAME, MX, TXT records</p></div></div>
                      <button onClick={() => setAddDnsRecordOpen(true)} className="btn-swipe-red flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg"><Plus className="h-3 w-3" />Add Record</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className={`text-left border-b ${borderColor}`}><th className={`py-2 ${textSecondary} font-medium`}>Type</th><th className={`py-2 ${textSecondary} font-medium`}>Name</th><th className={`py-2 ${textSecondary} font-medium`}>Value</th><th className={`py-2 ${textSecondary} font-medium`}>TTL</th><th></th></tr></thead>
                        <tbody>
                          {dnsRecords.map((r) => (
                            <tr key={r.id} className={`border-b ${borderColor}`}>
                              <td className={`py-2 ${textPrimary}`}><span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">{r.type}</span></td>
                              <td className={`py-2 ${textPrimary}`}>{r.name}</td>
                              <td className={`py-2 ${textSecondary} max-w-[200px] truncate`}>{r.value}</td>
                              <td className={`py-2 ${textSecondary}`}>{r.ttl}</td>
                              <td className="py-2"><button onClick={() => deleteDnsRecord(r.id)} className="p-1 text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>DNSSEC</p><p className={`text-xs ${textSecondary}`}>Add cryptographic security to DNS</p></div></div>
                      <ToggleSwitch enabled={domainSettingsForm.dnssec} onChange={() => { setDomainSettingsForm(p => ({ ...p, dnssec: !p.dnssec })); setHasUnsavedChanges(true); }} theme={theme} />
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL TAB */}
              {domainSettingsTab === 'email' && (
                <div className="space-y-6">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3"><Send className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Email Forwarding</p><p className={`text-xs ${textSecondary}`}>Forward emails to external addresses</p></div></div>
                      <button onClick={() => setEmailForwarding(p => [...p, { id: Date.now(), from: "", to: "", active: true }])} className="btn-swipe-red flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg"><Plus className="h-3 w-3" />Add Rule</button>
                    </div>
                    <div className="space-y-3">
                      {emailForwarding.map((rule, i) => (
                        <div key={rule.id} className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-white'} rounded-lg border ${borderColor}`}>
                          <input placeholder="from@" value={rule.from} onChange={(e) => { const newRules = [...emailForwarding]; newRules[i].from = e.target.value; setEmailForwarding(newRules); setHasUnsavedChanges(true); }} className={`flex-1 px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                          <ArrowRight className={`h-4 w-4 ${textMuted}`} />
                          <input placeholder="to@example.com" value={rule.to} onChange={(e) => { const newRules = [...emailForwarding]; newRules[i].to = e.target.value; setEmailForwarding(newRules); setHasUnsavedChanges(true); }} className={`flex-1 px-3 py-1.5 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                          <button onClick={() => { setEmailForwarding(emailForwarding.filter(r => r.id !== rule.id)); setHasUnsavedChanges(true); }} className="p-1 text-red-400"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-4"><Mail className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Email Hosting Integration</p><p className={`text-xs ${textSecondary}`}>Connect to email providers</p></div></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button className={`btn-swipe p-4 ${bgInput} border rounded-xl text-center`}><div className="text-2xl mb-2">📧</div><p className={`text-sm font-medium ${textPrimary}`}>Google Workspace</p><p className={`text-xs ${textSecondary}`}>Gmail for business</p></button>
                      <button className={`btn-swipe p-4 ${bgInput} border rounded-xl text-center`}><div className="text-2xl mb-2">📨</div><p className={`text-sm font-medium ${textPrimary}`}>Microsoft 365</p><p className={`text-xs ${textSecondary}`}>Outlook for business</p></button>
                      <button className={`btn-swipe p-4 ${bgInput} border rounded-xl text-center`}><div className="text-2xl mb-2">⚙️</div><p className={`text-sm font-medium ${textPrimary}`}>Custom SMTP</p><p className={`text-xs ${textSecondary}`}>Your own server</p></button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {domainSettingsTab === 'security' && (
                <div className="space-y-6">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>SSL/TLS Certificate</p><p className={`text-xs ${textSecondary}`}>{selectedDomainForSettings.ssl ? `Expires: ${selectedDomainForSettings.sslExpiry}` : 'No SSL installed'}</p></div></div>
                      <button className={`btn-swipe px-3 py-1.5 ${selectedDomainForSettings.ssl ? 'bg-emerald-600' : 'bg-red-600'} text-white text-xs font-medium rounded-lg`}>{selectedDomainForSettings.ssl ? 'Renew SSL' : 'Install SSL'}</button>
                    </div>
                    {selectedDomainForSettings.ssl && (
                      <div className={`p-3 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'} border border-emerald-500/30 rounded-lg flex items-center gap-2`}>
                        <CheckCircle className="h-4 w-4 text-emerald-400" /><span className="text-sm text-emerald-400">SSL Active • Auto-renewal enabled</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>2FA for Domain Changes</p><p className={`text-xs ${textSecondary}`}>Require 2FA for sensitive operations</p></div></div>
                      <ToggleSwitch enabled={domainSettingsForm.twoFactorForChanges} onChange={() => { setDomainSettingsForm(p => ({ ...p, twoFactorForChanges: !p.twoFactorForChanges })); setHasUnsavedChanges(true); }} theme={theme} />
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Key className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>EPP/Authorization Code</p><p className={`text-xs ${textSecondary}`}>Required for domain transfers</p></div></div>
                    <div className="flex gap-2">
                      <input type={showEppCode ? "text" : "password"} value="ABCD-1234-EFGH-5678" readOnly className={`flex-1 px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                      <button onClick={() => setShowEppCode(!showEppCode)} className={`px-3 py-2 ${bgInput} border rounded-lg`}>{showEppCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      <button className={`px-3 py-2 ${bgInput} border rounded-lg`}><Copy className="h-4 w-4" /></button>
                      <button className="btn-swipe px-3 py-2 bg-red-600 text-white rounded-lg text-sm">Generate New</button>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Clock className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Access History</p><p className={`text-xs ${textSecondary}`}>Recent changes to this domain</p></div></div>
                    <div className="space-y-2">
                      {accessHistory.map((h, i) => (
                        <div key={i} className={`flex items-center justify-between p-2 ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-white'} rounded-lg`}>
                          <div><p className={`text-sm ${textPrimary}`}>{h.action}</p><p className={`text-xs ${textSecondary}`}>{h.user} • {h.ip}</p></div>
                          <span className={`text-xs ${textMuted}`}>{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Bell className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Security Alerts</p><p className={`text-xs ${textSecondary}`}>Get notified of changes</p></div></div>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between"><span className={`text-sm ${textSecondary}`}>Email notifications</span><ToggleSwitch enabled={domainSettingsForm.emailNotifications} onChange={() => { setDomainSettingsForm(p => ({ ...p, emailNotifications: !p.emailNotifications })); setHasUnsavedChanges(true); }} theme={theme} /></label>
                      <label className="flex items-center justify-between"><span className={`text-sm ${textSecondary}`}>SMS notifications</span><ToggleSwitch enabled={domainSettingsForm.smsNotifications} onChange={() => { setDomainSettingsForm(p => ({ ...p, smsNotifications: !p.smsNotifications })); setHasUnsavedChanges(true); }} theme={theme} /></label>
                      <label className="flex items-center justify-between"><span className={`text-sm ${textSecondary}`}>Push notifications</span><ToggleSwitch enabled={domainSettingsForm.pushNotifications} onChange={() => { setDomainSettingsForm(p => ({ ...p, pushNotifications: !p.pushNotifications })); setHasUnsavedChanges(true); }} theme={theme} /></label>
                    </div>
                  </div>
                </div>
              )}

              {/* ADVANCED TAB */}
              {domainSettingsTab === 'advanced' && (
                <div className="space-y-6">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><ArrowRightLeft className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Transfer Domain Out</p><p className={`text-xs ${textSecondary}`}>Move to another registrar</p></div></div>
                      <button className="btn-swipe px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded-lg">Initiate Transfer</button>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Key className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>API Access Token</p><p className={`text-xs ${textSecondary}`}>For programmatic access</p></div></div>
                    <div className="flex gap-2">
                      <input type="password" value={domainSettingsForm.apiToken} readOnly className={`flex-1 px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                      <button className={`px-3 py-2 ${bgInput} border rounded-lg`}><Copy className="h-4 w-4" /></button>
                      <button className="btn-swipe px-3 py-2 bg-red-600 text-white rounded-lg text-sm">Regenerate</button>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Webhook className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Webhook URL</p><p className={`text-xs ${textSecondary}`}>Receive domain event notifications</p></div></div>
                    <input type="url" placeholder="https://your-server.com/webhook" value={domainSettingsForm.webhookUrl} onChange={(e) => { setDomainSettingsForm(p => ({ ...p, webhookUrl: e.target.value })); setHasUnsavedChanges(true); }} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} />
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Download className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Export Configuration</p><p className={`text-xs ${textSecondary}`}>Download domain settings</p></div></div>
                    <div className="flex gap-2">
                      <button className={`btn-swipe flex-1 px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}><FileJson className="h-4 w-4 inline mr-2" />Export JSON</button>
                      <button className={`btn-swipe flex-1 px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}><FileText className="h-4 w-4 inline mr-2" />Export XML</button>
                    </div>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-100'} rounded-xl`}>
                    <div className="flex items-center gap-3 mb-3"><Upload className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Import DNS Records</p><p className={`text-xs ${textSecondary}`}>Bulk upload from file</p></div></div>
                    <button className={`btn-swipe w-full px-3 py-3 ${bgInput} border border-dashed rounded-lg text-sm ${textSecondary}`}><Upload className="h-4 w-4 inline mr-2" />Drop file or click to upload</button>
                  </div>
                  <div className={`p-4 bg-red-500/10 border border-red-500/30 rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><Trash2 className="h-5 w-5 text-red-400" /><div><p className={`text-sm font-medium ${textPrimary}`}>Delete Domain</p><p className="text-xs text-red-400">Cancel registration and remove from account</p></div></div>
                      <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg">Delete Domain</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-between p-6 border-t ${borderColor} flex-shrink-0`}>
              <button onClick={closeDomainSettings} className={`px-4 py-2 ${bgInput} border rounded-lg text-sm ${textSecondary}`}>Cancel</button>
              <button onClick={saveDomainSettings} disabled={settingsSaving || !hasUnsavedChanges} className={`btn-swipe-red flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50`}>
                {settingsSaving ? <><RefreshCw className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ADD DNS RECORD MODAL */}
      {/* ============================================ */}
      {addDnsRecordOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAddDnsRecordOpen(false)} />
          <div className={`relative ${bgDropdown} border rounded-2xl shadow-2xl w-full max-w-md`} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
              <h3 className={`text-lg font-extrabold ${textPrimary}`}>Add DNS Record</h3>
              <button onClick={() => setAddDnsRecordOpen(false)} className={`p-2 ${textSecondary} ${bgHover} rounded-lg`}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={`text-sm font-medium ${textSecondary} block mb-1`}>Type</label><select value={newDnsRecord.type} onChange={(e) => setNewDnsRecord(p => ({ ...p, type: e.target.value }))} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}><option value="A">A</option><option value="AAAA">AAAA</option><option value="CNAME">CNAME</option><option value="MX">MX</option><option value="TXT">TXT</option><option value="SRV">SRV</option><option value="CAA">CAA</option></select></div>
              <div><label className={`text-sm font-medium ${textSecondary} block mb-1`}>Name</label><input value={newDnsRecord.name} onChange={(e) => setNewDnsRecord(p => ({ ...p, name: e.target.value }))} placeholder="@ or subdomain" className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} /></div>
              <div><label className={`text-sm font-medium ${textSecondary} block mb-1`}>Value</label><input value={newDnsRecord.value} onChange={(e) => setNewDnsRecord(p => ({ ...p, value: e.target.value }))} placeholder="IP or hostname" className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`text-sm font-medium ${textSecondary} block mb-1`}>TTL</label><select value={newDnsRecord.ttl} onChange={(e) => setNewDnsRecord(p => ({ ...p, ttl: parseInt(e.target.value) }))} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`}><option value={300}>5 min</option><option value={3600}>1 hour</option><option value={14400}>4 hours</option><option value={86400}>1 day</option></select></div>
                {newDnsRecord.type === "MX" && <div><label className={`text-sm font-medium ${textSecondary} block mb-1`}>Priority</label><input type="number" value={newDnsRecord.priority} onChange={(e) => setNewDnsRecord(p => ({ ...p, priority: parseInt(e.target.value) }))} className={`w-full px-3 py-2 ${bgInput} border rounded-lg text-sm ${textPrimary}`} /></div>}
              </div>
            </div>
            <div className={`flex justify-end gap-3 p-6 border-t ${borderColor}`}>
              <button onClick={() => setAddDnsRecordOpen(false)} className={`px-4 py-2 ${bgInput} border rounded-lg text-sm ${textSecondary}`}>Cancel</button>
              <button onClick={addDnsRecord} className="btn-swipe-red px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">Add Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
