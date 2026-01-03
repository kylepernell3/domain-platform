"use client"

import { useState, useEffect, useRef } from "react"
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
  UserPlus,
  Trash2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Zap,
  Lock,
  FileJson,
  FileSpreadsheet,
  ChevronRight,
  RefreshCw,
  Eye,
  Copy,
  Send,
  Sparkles,
  MailPlus,
  MailCheck,
  Forward,
  Reply,
  BarChart3,
  HardDrive,
  Cloud,
  Play,
  Pause,
  Edit3,
  Link2
} from "lucide-react"

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
    name: "example.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Jan 20, 2026", 
    expiryDate: "2026-01-20",
    visits: "8.2K",
    visitsNum: 8200,
    sslExpiry: "2025-01-18",
    price: 12.99,
    emailCount: 1,
  },
  { 
    name: "mystore.io", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Jun 22, 2026", 
    expiryDate: "2026-06-22",
    visits: "5.1K",
    visitsNum: 5100,
    sslExpiry: "2025-03-15",
    price: 29.99,
    emailCount: 1,
  },
  { 
    name: "portfolio.dev", 
    status: "active" as const, 
    ssl: false, 
    expiry: "Apr 30, 2026", 
    expiryDate: "2026-04-30",
    visits: "3.8K",
    visitsNum: 3800,
    sslExpiry: null,
    price: 14.99,
    emailCount: 1,
  },
  { 
    name: "blog.net", 
    status: "pending" as const, 
    ssl: false, 
    expiry: "May 10, 2026", 
    expiryDate: "2026-05-10",
    visits: "2.4K",
    visitsNum: 2400,
    sslExpiry: null,
    price: 11.99,
    emailCount: 0,
  },
  { 
    name: "acmecorp.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Aug 05, 2026", 
    expiryDate: "2026-08-05",
    visits: "12.3K",
    visitsNum: 12300,
    sslExpiry: "2025-02-28",
    price: 12.99,
    emailCount: 0,
  },
  { 
    name: "zenith.tech", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Dec 01, 2026", 
    expiryDate: "2026-12-01",
    visits: "1.9K",
    visitsNum: 1900,
    sslExpiry: "2025-04-20",
    price: 34.99,
    emailCount: 0,
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

const emailStorageTrends = [
  { month: "Jul", value: 1.2 },
  { month: "Aug", value: 1.5 },
  { month: "Sep", value: 1.8 },
  { month: "Oct", value: 2.0 },
  { month: "Nov", value: 2.2 },
  { month: "Dec", value: 2.4 },
]

const automationTemplates = [
  { id: 1, name: "Forward to Slack", description: "Send email notifications to a Slack channel", icon: Send, connected: true },
  { id: 2, name: "Save attachments to Drive", description: "Automatically save attachments to Google Drive", icon: Cloud, connected: false },
  { id: 3, name: "Auto-reply to new contacts", description: "Send welcome message to first-time contacts", icon: Reply, connected: false },
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

const teamMembers = [
  { name: "John Doe", email: "john@example.com", role: "Admin", avatar: "JD" },
  { name: "Sarah Smith", email: "sarah@example.com", role: "Billing", avatar: "SS" },
  { name: "Mike Johnson", email: "mike@example.com", role: "Technical", avatar: "MJ" },
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

function PricingTooltip({ basePrice, children }: { basePrice: number; children: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tax = basePrice * 0.08
  const icannFee = 0.18
  const total = basePrice + tax + icannFee
  
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl z-50">
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Base price:</span>
              <span className="text-white">${basePrice.toFixed(2)}</span>
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
              <span className="text-neutral-300">Total:</span>
              <span className="text-white">${total.toFixed(2)}</span>
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

function WorkspacePricingTooltip({ children }: { children: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false)
  
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
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Base price:</span>
              <span className="text-white">$6.00/user/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Taxes & fees:</span>
              <span className="text-emerald-400">Included</span>
            </div>
            <div className="border-t border-neutral-700 pt-1.5 mt-1.5 flex justify-between font-medium">
              <span className="text-neutral-300">Total:</span>
              <span className="text-white">$6.00/user/month</span>
            </div>
            <p className="text-neutral-500 pt-1">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-neutral-800" />
          </div>
        </div>
      )}
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

function HorizontalBarChart({ data }: { 
  data: { label: string; value: number; color: string }[] 
}) {
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

export default function DashboardPage() {
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
  
  // Modal states
  const [aiWizardOpen, setAiWizardOpen] = useState(false)
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [domainExpiryBannerDismissed, setDomainExpiryBannerDismissed] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("View-only")
  const [aiWizardInput, setAiWizardInput] = useState("")
  
  // Email modal states
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailActiveTab, setEmailActiveTab] = useState("mailboxes")
  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false)
  const [spamFilterLevel, setSpamFilterLevel] = useState(50)
  const [emailSignature, setEmailSignature] = useState("Best regards,\nJohn Doe\nDomainPro User")
  const [newMailboxEmail, setNewMailboxEmail] = useState("")
  const [newMailboxDomain, setNewMailboxDomain] = useState("example.com")
  
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const timelineDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
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
  
  const emailTabs = [
    { id: "mailboxes", label: "My Mailboxes", icon: Mail },
    { id: "settings", label: "Email Settings", icon: Settings },
    { id: "stats", label: "Email Stats", icon: BarChart3 },
    { id: "automation", label: "Automation", icon: Zap },
  ]
  
  const domainsWithEmail = domains.filter(d => d.emailCount > 0).map(d => d.name)
  
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
  
  const renderEmailModalContent = () => {
    switch (emailActiveTab) {
      case "mailboxes":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">Manage your professional email accounts</p>
              <button className="btn-swipe-red flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">
                <MailPlus className="h-4 w-4" />
                Add New Mailbox
              </button>
            </div>
            
            <div className="space-y-3">
              {emailAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{account.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-500">{account.storage} / {account.limit}</span>
                        <div className="w-16">
                          <StorageBar used={account.storageNum} total={account.limitNum} size="small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      account.status === "active" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {account.status === "active" ? "Active" : "Suspended"}
                    </span>
                    <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add new mailbox form */}
            <div className="mt-6 p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-3">Quick Add Mailbox</h4>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={newMailboxEmail}
                    onChange={(e) => setNewMailboxEmail(e.target.value)}
                    placeholder="username"
                    className="flex-1 px-3 py-2 bg-transparent text-white text-sm placeholder-neutral-500 focus:outline-none"
                  />
                  <span className="text-neutral-500 px-2">@</span>
                  <select
                    value={newMailboxDomain}
                    onChange={(e) => setNewMailboxDomain(e.target.value)}
                    className="bg-neutral-700 text-white text-sm py-2 px-3 border-l border-neutral-600 focus:outline-none"
                  >
                    {domainsWithEmail.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-swipe-red px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">
                  Create
                </button>
              </div>
            </div>
          </div>
        )
      
      case "settings":
        return (
          <div className="space-y-6">
            {/* Forwarding */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Forward className="h-5 w-5 text-red-400" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Email Forwarding</h4>
                    <p className="text-xs text-neutral-500">Forward emails to another address</p>
                  </div>
                </div>
                <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                  Configure
                </button>
              </div>
            </div>
            
            {/* Auto-responder */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Reply className="h-5 w-5 text-red-400" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Auto-Responder</h4>
                    <p className="text-xs text-neutral-500">Automatically reply to incoming emails</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoResponderEnabled(!autoResponderEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoResponderEnabled ? "bg-red-600" : "bg-neutral-700"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoResponderEnabled ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
            </div>
            
            {/* Spam filter */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-red-400" />
                <div>
                  <h4 className="text-sm font-medium text-white">Spam Filter Level</h4>
                  <p className="text-xs text-neutral-500">Adjust how aggressive spam filtering should be</p>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={spamFilterLevel}
                  onChange={(e) => setSpamFilterLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Low</span>
                  <span className="text-red-400 font-medium">{spamFilterLevel}%</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            {/* Email signature */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Edit3 className="h-5 w-5 text-red-400" />
                <div>
                  <h4 className="text-sm font-medium text-white">Email Signature</h4>
                  <p className="text-xs text-neutral-500">Default signature for outgoing emails</p>
                </div>
              </div>
              <textarea
                value={emailSignature}
                onChange={(e) => setEmailSignature(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
              />
            </div>
            
            {/* DNS Records link */}
            <div className="flex items-center justify-between p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-neutral-400" />
                <div>
                  <h4 className="text-sm font-medium text-white">DNS Records</h4>
                  <p className="text-xs text-neutral-500">MX, SPF, DKIM configuration</p>
                </div>
              </div>
              <Link href="/settings/dns" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                View in DNS Settings →
              </Link>
            </div>
          </div>
        )
      
      case "stats":
        return (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl card-hover-glow">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-neutral-400">Emails Sent</span>
                </div>
                <p className="text-2xl font-bold text-white">{emailStats.sent.toLocaleString()}</p>
                <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
              </div>
              
              <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl card-hover-glow">
                <div className="flex items-center gap-2 mb-2">
                  <MailCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-neutral-400">Emails Received</span>
                </div>
                <p className="text-2xl font-bold text-white">{emailStats.received.toLocaleString()}</p>
                <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
              </div>
              
              <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl card-hover-glow">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-neutral-400">Bounce Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">{emailStats.bounceRate}</p>
                <p className="text-xs text-emerald-400 mt-1">Excellent</p>
              </div>
              
              <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl card-hover-glow">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-neutral-400">Storage Used</span>
                </div>
                <p className="text-2xl font-bold text-white">{emailStats.storageUsed}</p>
                <p className="text-xs text-neutral-500 mt-1">of {emailStats.storageTotal}</p>
              </div>
            </div>
            
            {/* Storage trends */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-4">Storage Trends</h4>
              <BarChart 
                data={emailStorageTrends}
                maxValue={3}
                formatValue={(val) => `${val.toFixed(1)}GB`}
              />
            </div>
            
            {/* Most active addresses */}
            <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-3">Most Active Addresses</h4>
              <div className="space-y-2">
                {emailAccounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-700/50 last:border-0">
                    <span className="text-sm text-neutral-300">{account.email}</span>
                    <span className="text-xs text-neutral-500">{Math.floor(Math.random() * 500 + 100)} emails</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case "automation":
        return (
          <div className="space-y-6">
            {/* Zapier connection */}
            <div className="p-5 bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Connect with Zapier</h4>
                    <p className="text-xs text-neutral-400">Automate workflows with 5,000+ apps</p>
                  </div>
                </div>
                <button className="btn-swipe px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Connect
                </button>
              </div>
            </div>
            
            {/* Automation templates */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Pre-built Automations</h4>
              <div className="space-y-3">
                {automationTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <template.icon className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{template.name}</p>
                        <p className="text-xs text-neutral-500">{template.description}</p>
                      </div>
                    </div>
                    {template.connected ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                        <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                        Enable
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom automation link */}
            <button className="w-full p-4 bg-neutral-800/30 border border-dashed border-neutral-700 rounded-xl text-sm text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              Create Custom Automation
            </button>
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
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
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
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
          }
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
      `}</style>

      {/* Domain Expiring Banner */}
      {domainExpiringSoon && !domainExpiryBannerDismissed && !sslAlertDismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: "slideUp 0.4s ease-out forwards" }}>
          <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 border-t border-orange-500/50 shadow-lg shadow-orange-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-full animate-pulse">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Domain Expiring Soon!</p>
                    <p className="text-orange-100 text-sm">
                      <span className="font-medium">{domainExpiringSoon.name}</span> expires in{" "}
                      <span className="font-bold">{domainExpiringSoon.daysUntilExpiry} days</span>{" "}
                      ({formatExpiryDate(domainExpiringSoon.expiryDate)})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="btn-swipe flex-1 sm:flex-none px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg transition-colors">
                    Auto-Renew Now
                  </button>
                  <button 
                    onClick={() => setDomainExpiryBannerDismissed(true)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SSL Expiring Alert */}
      {sslExpiringDomain && !sslAlertDismissed && domainExpiryBannerDismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50" style={{ animation: "slideUp 0.4s ease-out forwards" }}>
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-t border-red-500/50 shadow-lg shadow-red-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-full animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">SSL Certificate Expiring Soon!</p>
                    <p className="text-red-100 text-sm">
                      <span className="font-medium">{sslExpiringDomain.name}</span> expires in{" "}
                      <span className="font-bold">{sslExpiringDomain.daysUntilExpiry} days</span>{" "}
                      ({formatExpiryDate(sslExpiringDomain.sslExpiry!)})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="btn-swipe flex-1 sm:flex-none px-6 py-2 bg-white text-red-600 font-semibold rounded-lg transition-colors">
                    Renew Now
                  </button>
                  <button 
                    onClick={() => setSslAlertDismissed(true)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
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

      {/* Insights Sidebar Panel */}
      {insightsPanelOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setInsightsPanelOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl"
            style={{ animation: "slideInRight 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Insights & Recommendations</h2>
              </div>
              <button 
                onClick={() => setInsightsPanelOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 ${insight.bgColor} border border-neutral-800 rounded-xl card-hover-glow cursor-pointer`}
                >
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
              
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-300 mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Enable auto-renewal to never lose a domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Use DNSSEC for enhanced security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Set up domain locking to prevent unauthorized transfers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Configure Wizard Modal */}
      {aiWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setAiWizardOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Bot className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">AI Configure Wizard</h2>
              </div>
              <button 
                onClick={() => setAiWizardOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-neutral-300 text-sm">
                Let our AI configure your domain settings based on your needs. Just describe what you want, and we&apos;ll handle the rest.
              </p>
              
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Bot className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-300">
                    Try saying: &quot;Set up my domain for an e-commerce store&quot; or &quot;Configure email forwarding to my Gmail&quot;
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">What would you like to configure?</label>
                <textarea
                  value={aiWizardInput}
                  onChange={(e) => setAiWizardInput(e.target.value)}
                  placeholder="E.g., I want to set up my domain for a WordPress blog with email..."
                  className="w-full h-32 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setAiWizardOpen(false)}
                  className="btn-swipe flex-1 px-4 py-3 bg-neutral-800 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button className="btn-swipe-red flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  Configure Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Options Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setSecurityModalOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Security Options</h2>
                  <p className="text-xs text-neutral-400">Multi-Factor Authentication & Recovery</p>
                </div>
              </div>
              <button 
                onClick={() => setSecurityModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">Never get locked out with multiple recovery options</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Authentication Methods</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Email Codes</p>
                        <p className="text-xs text-neutral-500">Receive codes via email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Authenticator App</p>
                        <p className="text-xs text-neutral-500">Google, Authy, etc.</p>
                      </div>
                    </div>
                    <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Backup Codes</p>
                        <p className="text-xs text-neutral-500">One-time use recovery codes</p>
                      </div>
                    </div>
                    <button className="btn-swipe text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium">
                      Generate
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-white">Recovery Email</p>
                        <p className="text-xs text-neutral-500">backup@example.com</p>
                      </div>
                    </div>
                    <button className="btn-swipe text-xs text-neutral-400 bg-neutral-700 px-3 py-1.5 rounded-lg font-medium">
                      Change
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <button className="btn-swipe-red w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl">
                  <Download className="h-4 w-4" />
                  Download Backup Codes
                </button>
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Store these codes safely - they can be used to regain access
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setTeamModalOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Team Members</h2>
              </div>
              <button 
                onClick={() => setTeamModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{member.name}</p>
                        <p className="text-xs text-neutral-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 bg-neutral-700 px-2 py-1 rounded">{member.role}</span>
                      <button className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-300 mb-3">Invite Team Member</h3>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    >
                      <option value="View-only">View-only</option>
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button className="btn-swipe-red px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Invite
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">No password sharing needed - each member gets their own secure access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setExportModalOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Download className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Export Data</h2>
              </div>
              <button 
                onClick={() => setExportModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-neutral-400">Choose what you&apos;d like to export and the format.</p>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-neutral-400" />
                    <span className="text-sm text-white">Export All Domains</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">CSV</span>
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">JSON</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-neutral-400" />
                    <span className="text-sm text-white">Export DNS Records</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">BIND</span>
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">JSON</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-neutral-400" />
                    <span className="text-sm text-white">Export Account Info</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">PDF</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl action-hover-glow">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-neutral-400" />
                    <span className="text-sm text-white">Export Invoices</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">PDF</span>
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">CSV</span>
                  </div>
                </button>
              </div>
              
              <button className="btn-swipe-red w-full px-4 py-3 bg-red-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Status Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setStatusModalOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">System Status</h2>
              </div>
              <button 
                onClick={() => setStatusModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-300 font-medium">All Systems Operational</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">Service Status</h3>
                
                {[
                  { name: "Domain Registration", status: "Operational" },
                  { name: "DNS Services", status: "Operational" },
                  { name: "SSL Certificates", status: "Operational" },
                  { name: "Email Services", status: "Operational" },
                  { name: "API", status: "Operational" },
                  { name: "Dashboard", status: "Operational" },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                    <span className="text-sm text-neutral-300">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-emerald-400">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-300 mb-3">Recent Incidents</h3>
                <p className="text-sm text-neutral-500">No incidents in the past 30 days</p>
              </div>
              
              <a href="#" className="block text-center text-sm text-red-400 hover:text-red-300 transition-colors">
                View full status page →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Email Management Modal/Panel */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setEmailModalOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 shadow-2xl overflow-hidden"
            style={{ animation: "slideInRight 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Professional Email</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-400">Powered by</span>
                    <span className="text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Google Workspace</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">Official Partner</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setEmailModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 px-6">
              {emailTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEmailActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    emailActiveTab === tab.id
                      ? "text-red-400 border-red-500"
                      : "text-neutral-400 border-transparent hover:text-white"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
              {renderEmailModalContent()}
              
              {/* Google Workspace Upsell - Always visible at bottom */}
              <div className="mt-8 p-5 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 border border-blue-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="h-8 w-8">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white">Upgrade to Google Workspace Professional</h3>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      <li className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        Use the Gmail interface you love
                      </li>
                      <li className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        30GB storage per mailbox
                      </li>
                      <li className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        99.9% uptime guarantee
                      </li>
                      <li className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        24/7 Google support
                      </li>
                    </ul>
                    <div className="flex items-center gap-4">
                      <WorkspacePricingTooltip>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-white">$6</span>
                          <span className="text-sm text-neutral-400">/user/month</span>
                        </div>
                      </WorkspacePricingTooltip>
                      <button className="btn-swipe-red px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Upgrade Now
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">No hidden fees • Cancel anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
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

            {/* Enhanced Search with Settings */}
            <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchDropdownRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchDropdownOpen(true)}
                  placeholder={searchMode === "domains" ? "Search domains..." : "Search settings..."}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-colors"
                />
                
                {searchDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="flex border-b border-neutral-800">
                      <button
                        onClick={() => setSearchMode("domains")}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                          searchMode === "domains" 
                            ? "text-red-400 bg-red-500/10" 
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Search Domains
                      </button>
                      <button
                        onClick={() => setSearchMode("settings")}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                          searchMode === "settings" 
                            ? "text-red-400 bg-red-500/10" 
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Search Settings
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {searchMode === "settings" ? (
                        <div className="py-2">
                          {filteredSettings.map((setting, index) => (
                            <Link
                              key={index}
                              href={setting.path}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                              onClick={() => setSearchDropdownOpen(false)}
                            >
                              <setting.icon className="h-4 w-4 text-neutral-500" />
                              {setting.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2">
                          {domains
                            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((domain, index) => (
                              <button
                                key={index}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                                onClick={() => setSearchDropdownOpen(false)}
                              >
                                <Globe className="h-4 w-4 text-neutral-500" />
                                {domain.name}
                                {domain.emailCount > 0 && (
                                  <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded ml-auto">
                                    {domain.emailCount} email
                                  </span>
                                )}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* System Status Indicator */}
              <button 
                onClick={() => setStatusModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
              >
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-neutral-400">Operational</span>
              </button>
              
              <button className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              
              <div className="relative" ref={userDropdownRef}>
                <button 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    userDropdownOpen 
                      ? "text-white bg-neutral-800" 
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-200 origin-top-right ${
                  userDropdownOpen 
                    ? "opacity-100 scale-100 translate-y-0" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}>
                  <div className="p-3 border-b border-neutral-800">
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-neutral-400">john@example.com</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      <FileText className="h-4 w-4" />
                      Recent Invoices
                    </button>
                    <button 
                      onClick={() => {
                        setUserDropdownOpen(false)
                        setSecurityModalOpen(true)
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4" />
                        Security Options
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">2 Active</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-neutral-800 py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800 transition-colors">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileSearchOpen ? "max-h-16 pb-4" : "max-h-0"
          }`}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search domains, settings..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-30 transition-all duration-300 ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-neutral-950 border-r border-neutral-800 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">DomainPro</span>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Activity className="h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              href="/domains" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Globe className="h-5 w-5" />
              My Domains
            </Link>
            <button 
              onClick={() => {
                setMobileMenuOpen(false)
                setEmailModalOpen(true)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              Professional Email
            </button>
            <Link 
              href="/ssl" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="h-5 w-5" />
              SSL Certificates
            </Link>
            <Link 
              href="/dns" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              DNS Settings
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ExternalLink className="h-5 w-5" />
              Back to Home
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="relative mb-8 overflow-visible">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-neutral-400">Welcome back! Here&apos;s your domain overview</p>
          </div>
        </div>

        {/* Timeline Selector */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-neutral-400">Showing stats for:</span>
          <div className="relative" ref={timelineDropdownRef}>
            <button 
              className={`btn-swipe flex items-center gap-2 px-4 py-2 bg-neutral-900 border rounded-lg text-sm font-medium transition-colors ${
                timelineDropdownOpen 
                  ? "border-red-500 text-white" 
                  : "border-neutral-800 text-neutral-300 hover:border-neutral-700"
              }`}
              onClick={() => setTimelineDropdownOpen(!timelineDropdownOpen)}
            >
              {timelineOptions.find(t => t.value === selectedTimeline)?.label}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${timelineDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`absolute left-0 top-full mt-2 w-40 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-200 origin-top-left z-20 ${
              timelineDropdownOpen 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}>
              <div className="py-2">
                {timelineOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                      selectedTimeline === option.value
                        ? "bg-red-500/10 text-red-400"
                        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                    }`}
                    onClick={() => {
                      setSelectedTimeline(option.value)
                      setTimelineDropdownOpen(false)
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <stat.icon className="h-5 w-5 text-red-400" />
                  </div>
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  )}
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
                  <button 
                    onClick={() => setShowEmptyState(!showEmptyState)}
                    className="btn-swipe px-3 py-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-700 bg-neutral-800 rounded-lg transition-colors"
                  >
                    {showEmptyState ? "Show Data" : "Show Empty"}
                  </button>
                  <button 
                    onClick={() => setAiWizardOpen(true)}
                    className="btn-swipe flex items-center gap-2 px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg transition-colors"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    AI Configure
                  </button>
                  <button className="btn-swipe-red flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Domain</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
              
              {showEmptyState ? (
                <EmptyState />
              ) : isLoading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-neutral-800/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="text-left text-xs border-b border-neutral-800/50">
                        <th className="px-4 sm:px-6 py-3 font-medium sticky left-0 bg-neutral-900/80 backdrop-blur-sm">
                          <button 
                            onClick={() => handleSort("name")}
                            className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "name"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            Domain
                            {getSortIndicator("name")}
                          </button>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <div className="relative" ref={statusDropdownRef}>
                            <button 
                              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                              className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                                statusFilter !== "all"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                              }`}
                            >
                              Status
                              <Filter className="h-3 w-3 ml-1" />
                            </button>
                            
                            <div className={`absolute left-0 top-full mt-2 w-32 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-200 origin-top-left z-10 ${
                              statusDropdownOpen 
                                ? "opacity-100 scale-100 translate-y-0" 
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}>
                              <div className="py-1">
                                {(["all", "active", "pending"] as const).map((status) => (
                                  <button
                                    key={status}
                                    className={`w-full px-4 py-2 text-sm text-left capitalize transition-colors ${
                                      statusFilter === status
                                        ? "bg-red-500/10 text-red-400"
                                        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                    }`}
                                    onClick={() => {
                                      setStatusFilter(status)
                                      setStatusDropdownOpen(false)
                                    }}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <button 
                            onClick={() => handleSort("ssl")}
                            className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "ssl"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            SSL
                            {getSortIndicator("ssl")}
                          </button>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs">
                            Email
                          </span>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <button 
                            onClick={() => handleSort("expiry")}
                            className={`pill-hover-glow flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "expiry"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            Expiry
                            {getSortIndicator("expiry")}
                          </button>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDomains.map((domain) => (
                        <tr
                          key={domain.name}
                          className="border-b border-neutral-800/30 row-hover-glow"
                        >
                          <td className="px-4 sm:px-6 py-4 sticky left-0 bg-neutral-900/80 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-white truncate">{domain.name}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                domain.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                              }`}
                            >
                              {domain.status === "active" && <Check className="h-3 w-3" />}
                              {domain.status === "active" ? "Active" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            {domain.ssl ? (
                              <Shield className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Shield className="h-4 w-4 text-neutral-600" />
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            {domain.emailCount > 0 ? (
                              <button 
                                onClick={() => setEmailModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                              >
                                <Mail className="h-3 w-3" />
                                {domain.emailCount}
                              </button>
                            ) : (
                              <button 
                                onClick={() => setEmailModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white hover:border-neutral-600 transition-colors"
                              >
                                <MailPlus className="h-3 w-3" />
                                Setup
                              </button>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <PricingTooltip basePrice={domain.price}>
                              <span className="text-sm text-neutral-400">{domain.expiry}</span>
                            </PricingTooltip>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-neutral-400 hover:text-white transition-colors" title="View Invoice">
                                <FileText className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-neutral-400 hover:text-white transition-colors" title="Settings">
                                <Settings className="h-4 w-4" />
                              </button>
                            </div>
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
                <button className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Plus className="h-4 w-4 text-red-400" />
                  <span>Register Domain</span>
                </button>
                <button 
                  onClick={() => setEmailModalOpen(true)}
                  className="btn-swipe w-full flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-red-400" />
                    <div className="text-left">
                      <span className="block">Professional Email</span>
                      <span className="text-[10px] text-neutral-500">Powered by Google Workspace</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </button>
                <button className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span>Add SSL Certificate</span>
                </button>
                <button className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <Settings className="h-4 w-4 text-red-400" />
                  <span>DNS Settings</span>
                </button>
                <button 
                  onClick={() => setTeamModalOpen(true)}
                  className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow"
                >
                  <Users className="h-4 w-4 text-red-400" />
                  <span>Team Members</span>
                </button>
                <button className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow">
                  <FileText className="h-4 w-4 text-red-400" />
                  <span>Recent Invoices</span>
                </button>
                <button 
                  onClick={() => setExportModalOpen(true)}
                  className="btn-swipe w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white action-hover-glow"
                >
                  <Download className="h-4 w-4 text-red-400" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>

            {/* Professional Email Overview Card */}
            <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Mail className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Professional Email</h3>
                    <p className="text-xs text-neutral-500">Powered by Google Workspace</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Active Mailboxes</span>
                  <span className="text-sm font-medium text-white">{emailAccounts.length} Active</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-neutral-400">Storage Used</span>
                    <span className="text-xs text-neutral-500">{emailStats.storageUsed} / {emailStats.storageTotal}</span>
                  </div>
                  <StorageBar used={emailStats.storageUsedNum} total={emailStats.storageTotalNum} />
                </div>
              </div>
              
              <button 
                onClick={() => setEmailModalOpen(true)}
                className="btn-swipe-red w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg"
              >
                <Mail className="h-4 w-4" />
                Manage Email
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 card-hover-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3 action-hover-glow p-2 -m-2 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
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
                  <button
                    key={tab.id}
                    onClick={() => setActiveChart(tab.id)}
                    className={`pill-hover-glow px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeChart === tab.id
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 sm:p-6 min-h-[280px]">
              <div className="transition-all duration-300 ease-in-out">
                {renderChart()}
              </div>
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
              <Link href="/terms" className="text-sm text-neutral-400 hover:text-red-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-neutral-400 hover:text-red-400 transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-sm text-neutral-400 hover:text-red-400 transition-colors">
                Documentation
              </Link>
              <Link href="/api" className="text-sm text-neutral-400 hover:text-red-400 transition-colors">
                API
              </Link>
              <Link href="/support" className="text-sm text-neutral-400 hover:text-red-400 transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
