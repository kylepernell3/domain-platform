"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
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
  AlertTriangle,
  Menu,
  ArrowUpDown,
  Filter,
  LogOut,
  CreditCard,
  HelpCircle,
  Inbox,
  Bot,
  Info,
  Key,
  Smartphone,
  Mail,
  Download,
  FileText,
  Users,
  Trash2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Zap,
  ChevronRight,
  Send,
  Sparkles,
  MailPlus,
  MailCheck,
  Forward,
  Reply,
  BarChart3,
  HardDrive,
  Cloud,
  Edit3,
  Link2,
  Calculator,
  ShoppingCart,
  BadgeCheck,
  Phone,
  Video,
  FileCheck,
  Receipt,
  CalendarX,
  Keyboard,
  Layers,
  ArrowRightLeft,
  Clipboard,
  Timer,
  Lock,
  ShieldCheck,
  BellRing,
  MessageSquare,
  GraduationCap,
  BookOpen,
  PlayCircle,
  PieChart,
  TrendingDown,
  Target,
  Building2,
  UserPlus,
  Eye,
  UserCog,
  Rss,
  HeartPulse,
  Wifi,
  MailWarning,
  Flame,
  Brain,
  RefreshCcw,
  CheckSquare,
  Square,
  Minus,
  ArrowRight,
  Package,
  Gauge,
  Server,
  Database,
  Plug,
  ShoppingBag,
  Code,
  Briefcase,
  Award,
  Star,
  CircleDollarSign,
  Banknote,
  LineChart,
  Percent,
  AlertOctagon,
  Fingerprint,
  QrCode,
  FileWarning,
  PhoneCall,
  Headphones,
  LifeBuoy,
  XCircle,
  History,
  MousePointerClick,
  Command,
  CornerDownLeft,
  Hash,
  AtSign,
  Truck,
  PackageCheck,
  FileSearch,
  ClipboardCheck,
  BadgePercent,
  Route,
  RotateCcw,
  Workflow,
  Share2,
  Network,
  MonitorSmartphone,
  Blocks
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
  },
]

const emailAccounts = [
  { email: "admin@example.com", storage: "1.2GB", storageNum: 1.2, limit: "15GB", limitNum: 15, status: "active" as const, domain: "example.com" },
  { email: "support@mystore.io", storage: "0.8GB", storageNum: 0.8, limit: "15GB", limitNum: 15, status: "active" as const, domain: "mystore.io" },
  { email: "hello@portfolio.dev", storage: "0.4GB", storageNum: 0.4, limit: "5GB", limitNum: 5, status: "active" as const, domain: "portfolio.dev" },
]

const emailStats = {
  sent: 1240,
  received: 3560,
  bounceRate: "0.8%",
  storageUsed: "2.4GB",
  storageUsedNum: 2.4,
  storageTotal: "30GB",
  storageTotalNum: 30,
}

const subscriptions = [
  { id: 1, name: "Professional Email", domain: "example.com", price: 6, billingCycle: "monthly", nextBilling: "Feb 1, 2026", status: "active" },
  { id: 2, name: "SSL Certificate", domain: "example.com", price: 69.99, billingCycle: "yearly", nextBilling: "Jan 18, 2026", status: "active" },
  { id: 3, name: "Domain Privacy", domain: "mystore.io", price: 9.99, billingCycle: "yearly", nextBilling: "Jun 22, 2026", status: "active" },
  { id: 4, name: "Website Builder", domain: "portfolio.dev", price: 12, billingCycle: "monthly", nextBilling: "Feb 1, 2026", status: "active" },
]

const healthChecks = [
  { domain: "example.com", ssl: "valid", dns: "optimal", email: "healthy", lastCheck: "2 min ago" },
  { domain: "mystore.io", ssl: "valid", dns: "optimal", email: "healthy", lastCheck: "5 min ago" },
  { domain: "portfolio.dev", ssl: "none", dns: "warning", email: "healthy", lastCheck: "3 min ago" },
  { domain: "blog.net", ssl: "none", dns: "optimal", email: "not configured", lastCheck: "8 min ago" },
  { domain: "acmecorp.com", ssl: "expiring", dns: "optimal", email: "not configured", lastCheck: "1 min ago" },
  { domain: "zenith.tech", ssl: "valid", dns: "optimal", email: "not configured", lastCheck: "4 min ago" },
]

const teamMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", avatar: "JD", status: "active" },
  { name: "Sarah Smith", email: "sarah@example.com", role: "Billing", avatar: "SS", status: "active" },
  { name: "Mike Johnson", email: "mike@example.com", role: "Technical", avatar: "MJ", status: "active" },
]

const clientPortals = [
  { id: 1, clientName: "Acme Corp", domains: 3, accessLevel: "View Only", lastActive: "2 hours ago" },
  { id: 2, clientName: "TechStart Inc", domains: 5, accessLevel: "Edit", lastActive: "1 day ago" },
]

const activityFeed = [
  { user: "John Doe", action: "Updated DNS for", target: "example.com", time: "10 min ago" },
  { user: "Sarah Smith", action: "Renewed SSL for", target: "mystore.io", time: "2 hours ago" },
  { user: "Mike Johnson", action: "Added email account to", target: "portfolio.dev", time: "1 day ago" },
  { user: "Client: Acme Corp", action: "Viewed", target: "acmecorp.com", time: "2 days ago" },
]

const integrations = [
  { name: "WordPress", icon: Code, connected: true, description: "One-click WordPress setup" },
  { name: "Shopify", icon: ShoppingBag, connected: false, description: "Connect your store" },
  { name: "GoHighLevel", icon: Workflow, connected: true, description: "Marketing automation" },
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
  { keys: ["⌘", "N"], action: "New domain" },
  { keys: ["⌘", "B"], action: "Bulk actions" },
  { keys: ["⌘", "E"], action: "Export data" },
  { keys: ["⌘", "/"], action: "Show shortcuts" },
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
  { type: "action", icon: AlertCircle, title: "2 SSL certificates expiring soon", description: "Renew before Jan 18 to avoid downtime", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  { type: "security", icon: Shield, title: "Enable 2FA for better security", description: "Protect your account with multi-factor authentication", color: "text-red-400", bgColor: "bg-red-500/10" },
  { type: "savings", icon: DollarSign, title: "Save 20% with annual billing", description: "Switch to yearly payment and save $28.80", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  { type: "performance", icon: Zap, title: "Enable CDN for faster loading", description: "Improve load times by up to 60%", color: "text-blue-400", bgColor: "bg-blue-500/10" },
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

const transferSteps = [
  { id: 1, title: "Unlock Domain", description: "Unlock at current registrar", status: "completed" },
  { id: 2, title: "Get EPP Code", description: "Request authorization code", status: "completed" },
  { id: 3, title: "Initiate Transfer", description: "Enter EPP code here", status: "current" },
  { id: 4, title: "Confirm Email", description: "Approve transfer request", status: "pending" },
  { id: 5, title: "Complete", description: "Domain transferred!", status: "pending" },
]

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

const formatExpiryDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const calculate5YearCost = (initialPrice: number, renewalPrice: number): number => {
  return initialPrice + (renewalPrice * 4)
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

function SkeletonCard() {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 bg-neutral-800 rounded-lg" />
        <div className="h-4 w-4 bg-neutral-800 rounded" />
      </div>
      <div className="mb-1">
        <div className="h-8 w-16 bg-neutral-800 rounded mb-2" />
        <div className="h-4 w-24 bg-neutral-800 rounded" />
      </div>
      <div className="h-3 w-20 bg-neutral-800 rounded mt-3" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-20 w-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4">
        <Inbox className="h-10 w-10 text-neutral-600" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No domains yet</h3>
      <p className="text-neutral-400 text-sm text-center mb-6 max-w-sm">
        Get started by registering your first domain or transferring an existing one.
      </p>
      <button className="btn-swipe flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-lg">
        <Plus className="h-4 w-4" />
        Add Your First Domain
      </button>
    </div>
  )
}

function PricingTooltip({ initialPrice, renewalPrice, children }: { initialPrice: number; renewalPrice: number; children: React.ReactNode }) {
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
        className="text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl z-50">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-700">
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">What You See Is What You Pay</span>
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Initial price:</span>
              <span className="text-white">${initialPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Renewal price:</span>
              <span className="text-yellow-400">${renewalPrice.toFixed(2)}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tax (8%):</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">ICANN fee:</span>
              <span className="text-white">${icannFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-neutral-700 pt-1.5 mt-1.5 flex justify-between font-medium">
              <span className="text-neutral-300">First year total:</span>
              <span className="text-white">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>5-year total cost:</span>
              <span className="font-bold">${fiveYearCost.toFixed(2)}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-neutral-800" />
          </div>
        </div>
      )}
    </div>
  )
}

function StorageBar({ used, total, size = "default" }: { used: number; total: number; size?: "small" | "default" }) {
  const percentage = (used / total) * 100
  const isLow = percentage > 80
  
  return (
    <div className={`w-full ${size === "small" ? "h-1.5" : "h-2"} bg-neutral-800 rounded-full overflow-hidden`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-yellow-500" : "bg-red-500"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function BarChart({ data, maxValue, formatValue }: { 
  data: { month: string; value: number }[]; 
  maxValue: number;
  formatValue?: (val: number) => string;
}) {
  return (
    <div className="flex items-end justify-between gap-2 h-48 px-4">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end h-40">
              <span className="text-xs text-neutral-400 mb-1">
                {formatValue ? formatValue(item.value) : item.value}
              </span>
              <div 
                className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-500 ease-out hover:from-red-500 hover:to-red-300"
                style={{ height: `${height}%`, minHeight: item.value > 0 ? '8px' : '0' }}
              />
            </div>
            <span className="text-xs text-neutral-500">{item.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function HorizontalBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div className="space-y-4 px-4">
      {data.map((item, index) => {
        const width = total > 0 ? (item.value / total) * 100 : 0
        return (
          <div key={index} className="space-y-2 group">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-300">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
            <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
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

function HealthStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; bg: string; text: string }> = {
    valid: { color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Valid" },
    healthy: { color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Healthy" },
    optimal: { color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Optimal" },
    expiring: { color: "text-yellow-400", bg: "bg-yellow-500/10", text: "Expiring" },
    warning: { color: "text-yellow-400", bg: "bg-yellow-500/10", text: "Warning" },
    none: { color: "text-neutral-400", bg: "bg-neutral-500/10", text: "None" },
    "not configured": { color: "text-neutral-400", bg: "bg-neutral-500/10", text: "Not Set" },
  }
  
  const config = statusConfig[status] || statusConfig.none
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
      {config.text}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DashboardPage() {
  // Core states
  const [isLoading, setIsLoading] = useState(true)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [selectedTimeline, setSelectedTimeline] = useState("30d")
  const [timelineDropdownOpen, setTimelineDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [activeChart, setActiveChart] = useState("domainGrowth")
  const [sslAlertDismissed, setSslAlertDismissed] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [domains, setDomains] = useState(initialDomains)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"domains" | "settings">("domains")
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  
  // Selection states for bulk actions
  const [selectedDomains, setSelectedDomains] = useState<number[]>([])
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false)
  
  // Modal states
  const [aiWizardOpen, setAiWizardOpen] = useState(false)
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [domainExpiryBannerDismissed, setDomainExpiryBannerDismissed] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  
  // New modal states
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
  const [costCalculatorOpen, setCostCalculatorOpen] = useState(false)
  const [collaborationModalOpen, setCollaborationModalOpen] = useState(false)
  
  // Tab states
  const [emailActiveTab, setEmailActiveTab] = useState("mailboxes")
  const [teamActiveTab, setTeamActiveTab] = useState("members")
  const [transferStep, setTransferStep] = useState(3)
  
  // Form states
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("View-only")
  const [aiWizardInput, setAiWizardInput] = useState("")
  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false)
  const [spamFilterLevel, setSpamFilterLevel] = useState(50)
  const [emailSignature, setEmailSignature] = useState("Best regards,\nJohn Doe\nDomainPro User")
  const [transferDomain, setTransferDomain] = useState("")
  const [transferEppCode, setTransferEppCode] = useState("")
  const [calculatorYears, setCalculatorYears] = useState(5)
  
  // Refs
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const timelineDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  
  // Keyboard shortcuts handler
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault()
          setSearchDropdownOpen(true)
          break
        case 'n':
          e.preventDefault()
          setCheckoutModalOpen(true)
          break
        case 'b':
          e.preventDefault()
          setBulkActionsOpen(true)
          break
        case 'e':
          e.preventDefault()
          setExportModalOpen(true)
          break
        case '/':
          e.preventDefault()
          setShortcutsModalOpen(true)
          break
      }
    }
    if (e.key === 'Escape') {
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
      setCollaborationModalOpen(false)
      setInsightsPanelOpen(false)
      setAiWizardOpen(false)
      setSecurityModalOpen(false)
      setTeamModalOpen(false)
      setExportModalOpen(false)
      setStatusModalOpen(false)
    }
  }, [])
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (timelineDropdownRef.current && !timelineDropdownRef.current.contains(event.target as Node)) {
        setTimelineDropdownOpen(false)
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  const stats = getStatsForTimeline(selectedTimeline)
  
  const sslExpiringDomain = domains
    .filter(d => d.ssl && d.sslExpiry)
    .map(d => ({ ...d, daysUntilExpiry: getDaysUntilExpiry(d.sslExpiry) }))
    .filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0)
    .sort((a, b) => (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999))[0]
  
  const domainExpiringSoon = domains
    .map(d => ({ ...d, daysUntilExpiry: getDaysUntilExpiry(d.expiryDate) }))
    .filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0)
    .sort((a, b) => (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999))[0]
  
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
        case "ssl":
          aVal = a.ssl ? 1 : 0
          bVal = b.ssl ? 1 : 0
          break
        case "expiry":
          aVal = new Date(a.expiry).getTime()
          bVal = new Date(b.expiry).getTime()
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
  
  const filteredDomains = domains.filter(d => {
    if (statusFilter === "all") return true
    return d.status === statusFilter
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
    if (selectedDomains.length === filteredDomains.length) {
      setSelectedDomains([])
    } else {
      setSelectedDomains(filteredDomains.map(d => d.id))
    }
  }
  
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    }
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-3 w-3 ml-1" />
      : <ChevronDown className="h-3 w-3 ml-1" />
  }
  
  // Portfolio analytics calculations
  const totalInvestment = domains.reduce((sum, d) => sum + d.purchasePrice, 0)
  const totalMarketValue = domains.reduce((sum, d) => sum + d.marketValue, 0)
  const totalROI = ((totalMarketValue - totalInvestment) / totalInvestment * 100).toFixed(1)
  const yearlyRenewalCost = domains.reduce((sum, d) => sum + d.renewalPrice, 0)
  
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
            <p className="text-sm text-neutral-400 px-4 mb-4">Total domains registered per month</p>
            <BarChart 
              data={chartData.domainGrowth} 
              maxValue={Math.max(...chartData.domainGrowth.map(d => d.value)) * 1.2}
            />
          </div>
        )
      case "sslStatus":
        return (
          <div className="pt-4">
            <p className="text-sm text-neutral-400 px-4 mb-6">SSL certificate distribution</p>
            <HorizontalBarChart data={chartData.sslStatus} />
          </div>
        )
      case "trafficTrends":
        return (
          <div className="pt-4">
            <p className="text-sm text-neutral-400 px-4 mb-4">Monthly traffic across all domains</p>
            <BarChart 
              data={chartData.trafficTrends} 
              maxValue={Math.max(...chartData.trafficTrends.map(d => d.value)) * 1.2}
              formatValue={(val) => `${(val / 1000).toFixed(1)}K`}
            />
          </div>
        )
      case "uptimeHistory":
        return (
          <div className="pt-4">
            <p className="text-sm text-neutral-400 px-4 mb-4">Average uptime percentage</p>
            <BarChart 
              data={chartData.uptimeHistory.map(d => ({ ...d, value: d.value - 99 }))} 
              maxValue={1.2}
              formatValue={(val) => `${(val + 99).toFixed(1)}%`}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
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
        .btn-swipe:hover {
          background-color: rgb(75 85 99) !important;
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
          background-color: rgb(75 85 99) !important;
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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
        }
        .floating-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
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
      `}</style>

      {/* Expiry Banners */}
      {domainExpiringSoon && !domainExpiryBannerDismissed && !sslAlertDismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: "slideUp 0.4s ease-out forwards" }}>
          <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 border-t border-orange-500/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full animate-pulse">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Domain Expiring Soon!</p>
                    <p className="text-orange-100 text-sm">
                      <span className="font-medium">{domainExpiringSoon.name}</span> expires in{" "}
                      <span className="font-bold">{domainExpiringSoon.daysUntilExpiry} days</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-swipe px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg">
                    Auto-Renew Now
                  </button>
                  <button onClick={() => setDomainExpiryBannerDismissed(true)} className="p-2 text-white/80 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Insights Button */}
      <button
        onClick={() => setInsightsPanelOpen(true)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-red-600 text-white rounded-full shadow-lg floating-pulse hover:bg-red-700 transition-colors"
        title="View Insights"
      >
        <Lightbulb className="h-5 w-5" />
      </button>

      {/* ============================================ */}
      {/* KEYBOARD SHORTCUTS MODAL */}
      {/* ============================================ */}
      {shortcutsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShortcutsModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Keyboard className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShortcutsModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <span className="text-sm text-neutral-300">{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i} className="kbd text-neutral-300">{key}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* 5-YEAR COST CALCULATOR MODAL */}
      {/* ============================================ */}
      {costCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCostCalculatorOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Calculator className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Total Cost Calculator</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400">What You See Is What You Pay</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setCostCalculatorOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Calculate for how many years?</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calculatorYears}
                    onChange={(e) => setCalculatorYears(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-neutral-700 rounded-full"
                  />
                  <span className="text-2xl font-bold text-white w-16 text-center">{calculatorYears}yr</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400">Your Domain Portfolio Cost</h3>
                {domains.slice(0, 4).map((domain) => {
                  const totalCost = domain.initialPrice + (domain.renewalPrice * (calculatorYears - 1))
                  return (
                    <div key={domain.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{domain.name}</p>
                        <p className="text-xs text-neutral-500">
                          ${domain.initialPrice} first year + ${domain.renewalPrice}/yr renewal
                        </p>
                      </div>
                      <span className="text-lg font-bold text-white">${totalCost.toFixed(2)}</span>
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
                  <span className="text-3xl font-bold text-white">
                    ${domains.reduce((sum, d) => sum + d.initialPrice + (d.renewalPrice * (calculatorYears - 1)), 0).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 text-center">
                Prices include all taxes and ICANN fees. No hidden charges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TRANSFER WIZARD MODAL */}
      {/* ============================================ */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTransferModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ArrowRightLeft className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Easy Transfer Wizard</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Transfer Guarantee - We&apos;ll help if anything goes wrong</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setTransferModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {transferSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex flex-col items-center ${index < transferSteps.length - 1 ? 'flex-1' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'current' ? 'bg-red-500 text-white' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {step.status === 'completed' ? <Check className="h-5 w-5" /> : step.id}
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 text-center max-w-[80px]">{step.title}</p>
                    </div>
                    {index < transferSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        step.status === 'completed' ? 'bg-emerald-500' : 'bg-neutral-800'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Current Step Content */}
              <div className="space-y-4">
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <h3 className="text-sm font-medium text-white mb-2">Step 3: Enter EPP/Authorization Code</h3>
                  <p className="text-xs text-neutral-400 mb-4">
                    Enter the authorization code you received from your current registrar.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={transferDomain}
                      onChange={(e) => setTransferDomain(e.target.value)}
                      placeholder="Domain name (e.g., example.com)"
                      className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    />
                    <input
                      type="text"
                      value={transferEppCode}
                      onChange={(e) => setTransferEppCode(e.target.value)}
                      placeholder="EPP/Authorization Code"
                      className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    />
                  </div>
                </div>
                
                {/* Migration Checklist */}
                <div className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-red-400" />
                    Migration Checklist
                  </h4>
                  <div className="space-y-2">
                    {[
                      { text: "Domain unlocked at current registrar", done: true },
                      { text: "EPP code obtained", done: true },
                      { text: "Domain not expired (60+ days remaining)", done: true },
                      { text: "Admin email accessible", done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {item.done ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4 text-neutral-500" />
                        )}
                        <span className={item.done ? "text-neutral-300" : "text-neutral-500"}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="btn-swipe flex-1 px-4 py-3 bg-neutral-800 text-white font-medium rounded-xl">
                  Back
                </button>
                <button className="btn-swipe-red flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                  Continue Transfer
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SUBSCRIPTIONS MANAGEMENT MODAL */}
      {/* ============================================ */}
      {subscriptionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSubscriptionsModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Receipt className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">All Active Subscriptions</h2>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Cancel Anything Anytime - No hidden fees
                  </p>
                </div>
              </div>
              <button onClick={() => setSubscriptionsModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{sub.name}</p>
                        <p className="text-xs text-neutral-500">{sub.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">${sub.price}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                        <p className="text-xs text-neutral-500">Next: {sub.nextBilling}</p>
                      </div>
                      <button className="btn-swipe px-3 py-1.5 text-xs text-red-400 bg-red-500/10 rounded-lg font-medium hover:bg-red-500/20">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <BellRing className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Email Reminders Enabled</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      You&apos;ll receive email reminders 30 days before ANY charge with an easy cancel link.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-neutral-800/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Monthly Total:</span>
                  <span className="text-lg font-bold text-white">
                    ${subscriptions.filter(s => s.billingCycle === 'monthly').reduce((sum, s) => sum + s.price, 0).toFixed(2)}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-neutral-400">Yearly Total:</span>
                  <span className="text-lg font-bold text-white">
                    ${subscriptions.filter(s => s.billingCycle === 'yearly').reduce((sum, s) => sum + s.price, 0).toFixed(2)}/yr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ACCOUNT RECOVERY MODAL */}
      {/* ============================================ */}
      {recoveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setRecoveryModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <LifeBuoy className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Account Recovery Options</h2>
              </div>
              <button onClick={() => setRecoveryModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Emergency Hotline */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-6 w-6 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Emergency Recovery Hotline</p>
                    <p className="text-lg font-bold text-red-400">1-800-DOMAIN-HELP</p>
                    <p className="text-xs text-neutral-400">Available 24/7 for account recovery</p>
                  </div>
                </div>
              </div>
              
              {/* Recovery Methods */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Multi-Factor Recovery Options</h3>
                
                <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">ID Verification</p>
                        <p className="text-xs text-neutral-500">Upload government ID</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Available</span>
                  </div>
                </div>
                
                <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Video Call Verification</p>
                        <p className="text-xs text-neutral-500">Live video with support team</p>
                      </div>
                    </div>
                    <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                      Schedule
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Notarized Documents</p>
                        <p className="text-xs text-neutral-500">Legal document verification</p>
                      </div>
                    </div>
                    <button className="btn-swipe text-xs text-neutral-400 bg-neutral-700 px-3 py-1.5 rounded-lg font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Domain Insurance */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">Domain Insurance</p>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">+$2.99/yr</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Get backup codes and priority recovery support. Never lose access to your domains.
                    </p>
                    <button className="btn-swipe-red mt-3 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg">
                      Add Insurance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DOMAIN PROTECTION MODAL */}
      {/* ============================================ */}
      {protectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setProtectionModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Domain Protection</h2>
              </div>
              <button onClick={() => setProtectionModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">All protections enabled by default</span>
                </div>
                <p className="text-xs text-neutral-400">Your domains are secure from unauthorized transfers and changes.</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">Domain Lock</p>
                      <p className="text-xs text-neutral-500">Prevents unauthorized transfers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400">Enabled</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">2FA for Changes</p>
                      <p className="text-xs text-neutral-500">Required for all domain modifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400">Required</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-neutral-300 mt-4">Instant Alerts</h4>
                
                {[
                  { icon: Mail, label: "Email Alerts", enabled: true },
                  { icon: MessageSquare, label: "SMS Alerts", enabled: false },
                  { icon: Bell, label: "Push Notifications", enabled: true },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <alert.icon className="h-5 w-5 text-neutral-400" />
                      <span className="text-sm text-white">{alert.label}</span>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${alert.enabled ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${alert.enabled ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* EDUCATION CENTER MODAL */}
      {/* ============================================ */}
      {educationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEducationModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Domain University</h2>
                  <p className="text-xs text-neutral-400">Learn everything about domains in plain language</p>
                </div>
              </div>
              <button onClick={() => setEducationModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* AI Assistant */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">AI Domain Assistant</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Ask any question about domains, DNS, SSL, or hosting in plain language.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="What is DNS and why do I need it?"
                        className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500"
                      />
                      <button className="btn-swipe-red px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg">
                        Ask
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Course List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Popular Guides</h3>
                {educationContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <content.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{content.title}</p>
                        <p className="text-xs text-neutral-500">{content.type} • {content.duration}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-500" />
                  </div>
                ))}
              </div>
              
              {/* Downtown DNS Section */}
              <div className="mt-6 p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Server className="h-5 w-5 text-red-400" />
                  <h3 className="text-sm font-medium text-white">Downtown DNS</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  Our interactive DNS configuration wizard makes setting up your domain easy.
                </p>
                <button className="btn-swipe-red w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2">
                  <Bot className="h-4 w-4" />
                  Launch DNS Wizard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* PORTFOLIO ANALYTICS MODAL */}
      {/* ============================================ */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAnalyticsModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Portfolio Analytics</h2>
              </div>
              <button onClick={() => setAnalyticsModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">Total Investment</p>
                  <p className="text-2xl font-bold text-white">${totalInvestment.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">Market Value</p>
                  <p className="text-2xl font-bold text-emerald-400">${totalMarketValue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">Portfolio ROI</p>
                  <p className="text-2xl font-bold text-emerald-400">+{totalROI}%</p>
                </div>
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">Yearly Renewal Cost</p>
                  <p className="text-2xl font-bold text-yellow-400">${yearlyRenewalCost.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Domain Values */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Domain Valuations</h3>
                {domains.map((domain) => {
                  const roi = ((domain.marketValue - domain.purchasePrice) / domain.purchasePrice * 100).toFixed(0)
                  return (
                    <div key={domain.id} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-white">{domain.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">${domain.marketValue.toLocaleString()}</p>
                          <p className={`text-xs ${Number(roi) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {Number(roi) >= 0 ? '+' : ''}{roi}% ROI
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* INTEGRATIONS MODAL */}
      {/* ============================================ */}
      {integrationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIntegrationsModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Plug className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Service Integrations</h2>
                  <p className="text-xs text-neutral-400">Connect Domain → Email → Hosting → SSL seamlessly</p>
                </div>
              </div>
              <button onClick={() => setIntegrationsModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* One-Click Setup */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { name: "WordPress", icon: Code, color: "blue" },
                  { name: "Shopify", icon: ShoppingBag, color: "green" },
                  { name: "Wix", icon: Blocks, color: "purple" },
                  { name: "Squarespace", icon: MonitorSmartphone, color: "red" },
                ].map((platform, i) => (
                  <button key={i} className="btn-swipe p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl flex items-center gap-3 action-hover-glow">
                    <platform.icon className={`h-6 w-6 text-${platform.color}-400`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{platform.name}</p>
                      <p className="text-xs text-neutral-500">One-click setup</p>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Connected Services */}
              <h3 className="text-sm font-medium text-neutral-300 mb-3">Connected Services</h3>
              <div className="space-y-3">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <integration.icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{integration.name}</p>
                        <p className="text-xs text-neutral-500">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">Connected</span>
                    ) : (
                      <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* HEALTH CHECKS MODAL */}
      {/* ============================================ */}
      {healthChecksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setHealthChecksModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <HeartPulse className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Automated Health Checks</h2>
                  <p className="text-xs text-neutral-400">Daily monitoring for all your domains</p>
                </div>
              </div>
              <button onClick={() => setHealthChecksModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Health Overview */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-neutral-400 border-b border-neutral-800">
                      <th className="pb-3 font-medium">Domain</th>
                      <th className="pb-3 font-medium">SSL</th>
                      <th className="pb-3 font-medium">DNS</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Last Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthChecks.map((check, index) => (
                      <tr key={index} className="border-b border-neutral-800/50">
                        <td className="py-3">
                          <span className="text-sm text-white">{check.domain}</span>
                        </td>
                        <td className="py-3"><HealthStatusBadge status={check.ssl} /></td>
                        <td className="py-3"><HealthStatusBadge status={check.dns} /></td>
                        <td className="py-3"><HealthStatusBadge status={check.email} /></td>
                        <td className="py-3">
                          <span className="text-xs text-neutral-500">{check.lastCheck}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Additional Checks */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Additional Monitoring</h3>
                
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MailWarning className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-white">Email Deliverability Testing</p>
                      <p className="text-xs text-neutral-500">Check spam scores and inbox placement</p>
                    </div>
                  </div>
                  <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                    Run Test
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-white">Email Warm-up</p>
                      <p className="text-xs text-neutral-500">Gradually build sender reputation</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Available</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-white">Auto-Renewal Intelligence</p>
                      <p className="text-xs text-neutral-400">Suggests turning off renewal for unused domains</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-400">1 suggestion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* COLLABORATION/TEAM MODAL */}
      {/* ============================================ */}
      {collaborationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCollaborationModalOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Team & Collaboration</h2>
              </div>
              <button onClick={() => setCollaborationModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 px-6">
              {[
                { id: "members", label: "Team Members", icon: Users },
                { id: "clients", label: "Client Portals", icon: Briefcase },
                { id: "activity", label: "Activity Feed", icon: Rss },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTeamActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    teamActiveTab === tab.id
                      ? "text-red-400 border-red-500"
                      : "text-neutral-400 border-transparent hover:text-white"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {teamActiveTab === "members" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Manage team access and permissions</p>
                    <button className="btn-swipe-red flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </button>
                  </div>
                  
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{member.name}</p>
                          <p className="text-xs text-neutral-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select className="px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-xs text-white">
                          <option>Admin</option>
                          <option>Billing</option>
                          <option>Technical</option>
                          <option>View Only</option>
                        </select>
                        <button className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {teamActiveTab === "clients" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Give clients access to view their domains</p>
                    <button className="btn-swipe-red flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">
                      <UserPlus className="h-4 w-4" />
                      Add Client
                    </button>
                  </div>
                  
                  {clientPortals.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{client.clientName}</p>
                          <p className="text-xs text-neutral-500">{client.domains} domains • {client.accessLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500">{client.lastActive}</span>
                        <button className="btn-swipe text-xs text-neutral-400 bg-neutral-700 px-3 py-1.5 rounded-lg">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {teamActiveTab === "activity" && (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-400 mb-4">Recent team activity across all domains</p>
                  {activityFeed.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-neutral-800/30 rounded-lg">
                      <div className="h-8 w-8 bg-neutral-700 rounded-full flex items-center justify-center text-xs font-medium text-white">
                        {activity.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-neutral-400">{activity.action}</span>{' '}
                          <span className="text-red-400">{activity.target}</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* INSIGHTS PANEL */}
      {/* ============================================ */}
      {insightsPanelOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setInsightsPanelOpen(false)} style={{ animation: "fadeIn 0.2s ease-out" }} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl" style={{ animation: "slideInRight 0.3s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Insights & Recommendations</h2>
              </div>
              <button onClick={() => setInsightsPanelOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 ${insight.bgColor} border border-neutral-800 rounded-xl card-hover-glow cursor-pointer`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-neutral-900/50 rounded-lg ${insight.color}`}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white mb-1">{insight.title}</h3>
                      <p className="text-xs text-neutral-400">{insight.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <header className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Globe className="h-8 w-8 text-red-500" />
                <div className="absolute inset-0 bg-red-500/20 blur-lg" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">DomainPro</span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchDropdownRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchDropdownOpen(true)}
                  placeholder="Search... (⌘K)"
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
                
                {searchDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="flex border-b border-neutral-800">
                      <button
                        onClick={() => setSearchMode("domains")}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium ${searchMode === "domains" ? "text-red-400 bg-red-500/10" : "text-neutral-400 hover:text-white"}`}
                      >
                        Domains
                      </button>
                      <button
                        onClick={() => setSearchMode("settings")}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium ${searchMode === "settings" ? "text-red-400 bg-red-500/10" : "text-neutral-400 hover:text-white"}`}
                      >
                        Settings
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                      {searchMode === "settings" ? (
                        filteredSettings.map((setting, index) => (
                          <Link key={index} href={setting.path} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => setSearchDropdownOpen(false)}>
                            <setting.icon className="h-4 w-4 text-neutral-500" />
                            {setting.label}
                          </Link>
                        ))
                      ) : (
                        domains.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((domain) => (
                          <button key={domain.id} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => setSearchDropdownOpen(false)}>
                            <Globe className="h-4 w-4 text-neutral-500" />
                            {domain.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => setStatusModalOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-neutral-400">Operational</span>
              </button>
              
              <button className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              
              <div className="relative" ref={userDropdownRef}>
                <button className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${userDropdownOpen ? "text-white bg-neutral-800" : "text-neutral-400 hover:text-white hover:bg-neutral-900"}`} onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <User className="h-5 w-5" />
                  <ChevronDown className={`h-4 w-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right ${userDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                  <div className="p-3 border-b border-neutral-800">
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-neutral-400">john@example.com</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button onClick={() => { setUserDropdownOpen(false); setSubscriptionsModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <Receipt className="h-4 w-4" />
                      Subscriptions
                    </button>
                    <button onClick={() => { setUserDropdownOpen(false); setRecoveryModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <LifeBuoy className="h-4 w-4" />
                      Account Recovery
                    </button>
                    <button onClick={() => { setUserDropdownOpen(false); setProtectionModalOpen(true); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4" />
                        Domain Protection
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">ON</span>
                    </button>
                    <button onClick={() => { setUserDropdownOpen(false); setShortcutsModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800">
                      <Keyboard className="h-4 w-4" />
                      Keyboard Shortcuts
                    </button>
                  </div>
                  <div className="border-t border-neutral-800 py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-30 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-neutral-950 border-r border-neutral-800 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">DomainPro</span>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              <Activity className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/domains" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              <Globe className="h-5 w-5" />
              My Domains
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); setEmailModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg">
              <Mail className="h-5 w-5" />
              Professional Email
            </button>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              <ExternalLink className="h-5 w-5" />
              Back to Home
            </Link>
          </nav>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-neutral-400">Welcome back! Here&apos;s your domain overview</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCostCalculatorOpen(true)} className="btn-swipe hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg">
                <Calculator className="h-4 w-4" />
                Cost Calculator
              </button>
              <button onClick={() => setTransferModalOpen(true)} className="btn-swipe hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg">
                <ArrowRightLeft className="h-4 w-4" />
                Transfer In
              </button>
            </div>
          </div>
        </div>

        {/* Transparent Pricing Badge */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">What You See Is What You Pay</p>
              <p className="text-xs text-neutral-400">No hidden fees, no surprise renewals. Initial AND renewal prices shown upfront.</p>
            </div>
          </div>
          <button onClick={() => setCostCalculatorOpen(true)} className="btn-swipe flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg">
            <Calculator className="h-4 w-4" />
            5-Year Calculator
          </button>
        </div>

        {/* Timeline + Bulk Actions */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-neutral-400">Showing:</span>
          <div className="relative" ref={timelineDropdownRef}>
            <button className={`btn-swipe flex items-center gap-2 px-4 py-2 bg-neutral-900 border rounded-lg text-sm font-medium ${timelineDropdownOpen ? "border-red-500 text-white" : "border-neutral-800 text-neutral-300"}`} onClick={() => setTimelineDropdownOpen(!timelineDropdownOpen)}>
              {timelineOptions.find(t => t.value === selectedTimeline)?.label}
              <ChevronDown className={`h-4 w-4 transition-transform ${timelineDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute left-0 top-full mt-2 w-40 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 z-20 ${timelineDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
              <div className="py-2">
                {timelineOptions.map((option) => (
                  <button key={option.value} className={`w-full px-4 py-2 text-sm text-left ${selectedTimeline === option.value ? "bg-red-500/10 text-red-400" : "text-neutral-300 hover:text-white hover:bg-neutral-800"}`} onClick={() => { setSelectedTimeline(option.value); setTimelineDropdownOpen(false); }}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {selectedDomains.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-neutral-400">{selectedDomains.length} selected</span>
              <button className="btn-swipe px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg">
                Bulk Renew
              </button>
              <button className="btn-swipe px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg">
                Bulk Export
              </button>
              <button onClick={() => setSelectedDomains([])} className="p-1.5 text-neutral-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {isLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <stat.icon className="h-5 w-5 text-red-400" />
                  </div>
                  {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                </div>
                <div className="mb-1">
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </div>
                <div className="text-xs text-neutral-400">{stat.change}</div>
              </div>
            ))
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Domains Table */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl overflow-hidden card-hover-glow">
              <div className="px-4 sm:px-6 py-4 border-b border-neutral-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">Your Domains</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => setCheckoutModalOpen(true)} className="btn-swipe-red flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">
                    <Plus className="h-4 w-4" />
                    Add Domain
                  </button>
                </div>
              </div>
              
              {showEmptyState ? (
                <EmptyState />
              ) : isLoading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-neutral-800/50 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="text-left text-xs border-b border-neutral-800/50">
                        <th className="px-4 py-3 font-medium">
                          <button onClick={toggleAllDomains} className="p-1 text-neutral-400 hover:text-white">
                            {selectedDomains.length === filteredDomains.length ? (
                              <CheckSquare className="h-4 w-4 text-red-400" />
                            ) : selectedDomains.length > 0 ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 font-medium">
                          <button onClick={() => handleSort("name")} className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full ${sortConfig?.key === "name" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-neutral-800 text-neutral-400 border border-neutral-700"}`}>
                            Domain {getSortIndicator("name")}
                          </button>
                        </th>
                        <th className="px-4 py-3 font-medium">
                          <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs">Status</span>
                        </th>
                        <th className="px-4 py-3 font-medium">
                          <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs">SSL</span>
                        </th>
                        <th className="px-4 py-3 font-medium">
                          <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs">Price</span>
                        </th>
                        <th className="px-4 py-3 font-medium">
                          <button onClick={() => handleSort("expiry")} className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full ${sortConfig?.key === "expiry" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-neutral-800 text-neutral-400 border border-neutral-700"}`}>
                            Expiry {getSortIndicator("expiry")}
                          </button>
                        </th>
                        <th className="px-4 py-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDomains.map((domain) => (
                        <tr key={domain.id} className="border-b border-neutral-800/30 row-hover-glow">
                          <td className="px-4 py-4">
                            <button onClick={() => toggleDomainSelection(domain.id)} className="p-1 text-neutral-400 hover:text-white">
                              {selectedDomains.includes(domain.id) ? (
                                <CheckSquare className="h-4 w-4 text-red-400" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-neutral-500" />
                              <span className="text-sm font-medium text-white">{domain.name}</span>
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
                            {domain.ssl ? <Shield className="h-4 w-4 text-emerald-400" /> : <Shield className="h-4 w-4 text-neutral-600" />}
                          </td>
                          <td className="px-4 py-4">
                            <PricingTooltip initialPrice={domain.initialPrice} renewalPrice={domain.renewalPrice}>
                              <div className="text-left">
                                <p className="text-sm font-medium text-white">${domain.initialPrice}</p>
                                <p className="text-xs text-yellow-400">${domain.renewalPrice}/yr renew</p>
                              </div>
                            </PricingTooltip>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-neutral-400">{domain.expiry}</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="p-1.5 text-neutral-400 hover:text-white">
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

          {/* Sidebar */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Quick Actions */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setCheckoutModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Plus className="h-4 w-4 text-red-400" />
                  <span>Register Domain</span>
                </button>
                <button onClick={() => setTransferModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <ArrowRightLeft className="h-4 w-4 text-red-400" />
                  <span>Transfer Domain</span>
                </button>
                <button onClick={() => setEmailModalOpen(true)} className="btn-swipe w-full flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-red-400" />
                    <div className="text-left">
                      <span className="block">Professional Email</span>
                      <span className="text-[10px] text-neutral-500">Powered by Google Workspace</span>
                    </div>
                  </div>
                </button>
                <button onClick={() => setIntegrationsModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Plug className="h-4 w-4 text-red-400" />
                  <span>Integrations</span>
                </button>
                <button onClick={() => setHealthChecksModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <HeartPulse className="h-4 w-4 text-red-400" />
                  <span>Health Checks</span>
                </button>
                <button onClick={() => setAnalyticsModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <PieChart className="h-4 w-4 text-red-400" />
                  <span>Portfolio Analytics</span>
                </button>
                <button onClick={() => setCollaborationModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Users className="h-4 w-4 text-red-400" />
                  <span>Team & Clients</span>
                </button>
                <button onClick={() => setEducationModalOpen(true)} className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <GraduationCap className="h-4 w-4 text-red-400" />
                  <span>Domain University</span>
                </button>
              </div>
            </div>

            {/* Subscriptions Preview */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Subscriptions</h3>
                <button onClick={() => setSubscriptionsModalOpen(true)} className="text-xs text-red-400 hover:text-red-300">View All</button>
              </div>
              <div className="space-y-3">
                {subscriptions.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{sub.name}</p>
                      <p className="text-xs text-neutral-500">{sub.domain}</p>
                    </div>
                    <span className="text-sm font-medium text-white">${sub.price}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Cancel Anything Anytime
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="h-8 w-8 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-neutral-500">{activity.domain}</p>
                      <p className="text-xs text-neutral-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="mt-8">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl overflow-hidden card-hover-glow">
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-800/50">
              <h2 className="text-lg font-semibold text-white mb-4">Analytics</h2>
              <div className="flex flex-wrap gap-2">
                {chartTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveChart(tab.id)} className={`pill-hover-glow px-4 py-2 rounded-full text-sm font-medium ${activeChart === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"}`}>
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
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Globe className="h-4 w-4 text-red-500" />
              <span>© 2026 DomainPro. All rights reserved.</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="/terms" className="text-sm text-neutral-400 hover:text-red-400">Terms</Link>
              <Link href="/privacy" className="text-sm text-neutral-400 hover:text-red-400">Privacy</Link>
              <Link href="/docs" className="text-sm text-neutral-400 hover:text-red-400">Docs</Link>
              <Link href="/support" className="text-sm text-neutral-400 hover:text-red-400">Support</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
