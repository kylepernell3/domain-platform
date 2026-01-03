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
  FileText,
  Inbox
} from "lucide-react"

// Timeline options for stats comparison
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

// Stats data with timeline variations
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

// Domain data with SSL expiry dates
const initialDomains = [
  { 
    name: "example.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Mar 15, 2026", 
    visits: "8.2K",
    visitsNum: 8200,
    sslExpiry: "2025-01-18",
  },
  { 
    name: "mystore.io", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Jun 22, 2026", 
    visits: "5.1K",
    visitsNum: 5100,
    sslExpiry: "2025-03-15",
  },
  { 
    name: "portfolio.dev", 
    status: "active" as const, 
    ssl: false, 
    expiry: "Apr 30, 2026", 
    visits: "3.8K",
    visitsNum: 3800,
    sslExpiry: null,
  },
  { 
    name: "blog.net", 
    status: "pending" as const, 
    ssl: false, 
    expiry: "May 10, 2026", 
    visits: "2.4K",
    visitsNum: 2400,
    sslExpiry: null,
  },
  { 
    name: "acmecorp.com", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Aug 05, 2026", 
    visits: "12.3K",
    visitsNum: 12300,
    sslExpiry: "2025-02-28",
  },
  { 
    name: "zenith.tech", 
    status: "active" as const, 
    ssl: true, 
    expiry: "Dec 01, 2026", 
    visits: "1.9K",
    visitsNum: 1900,
    sslExpiry: "2025-04-20",
  },
]

// Chart data
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

// Helper function to calculate days until SSL expiry
const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Helper function to format date
const formatExpiryDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Skeleton Loader Component
const SkeletonCard = () => (
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

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-20 w-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4">
      <Inbox className="h-10 w-10 text-neutral-600" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">No domains yet</h3>
    <p className="text-neutral-400 text-sm text-center mb-6 max-w-sm">
      Get started by registering your first domain or transferring an existing one.
    </p>
    <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
      <Plus className="h-4 w-4" />
      Add Your First Domain
    </button>
  </div>
)

// Bar Chart Component
const BarChart = ({ data, maxValue, formatValue }: { 
  data: { month: string; value: number }[]; 
  maxValue: number;
  formatValue?: (val: number) => string;
}) => (
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
              className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-500 ease-out"
              style={{ height: `${height}%`, minHeight: item.value > 0 ? '8px' : '0' }}
            />
          </div>
          <span className="text-xs text-neutral-500">{item.month}</span>
        </div>
      )
    })}
  </div>
)

// Horizontal Bar Chart Component
const HorizontalBarChart = ({ data }: { 
  data: { label: string; value: number; color: string }[] 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div className="space-y-4 px-4">
      {data.map((item, index) => {
        const width = total > 0 ? (item.value / total) * 100 : 0
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-300">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
            <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [selectedTimeline, setSelectedTimeline] = useState("30d")
  const [timelineDropdownOpen, setTimelineDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [activeChart, setActiveChart] = useState("domainGrowth")
  const [sslAlertDismissed, setSslAlertDismissed] = useState(false)
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  
  // Domains state
  const [domains, setDomains] = useState(initialDomains)
  
  // Refs for click outside handling
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const timelineDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])
  
  // Click outside handlers
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
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  // Get stats based on timeline
  const stats = getStatsForTimeline(selectedTimeline)
  
  // Find domain with SSL expiring soonest (within 30 days)
  const sslExpiringDomain = domains
    .filter(d => d.ssl && d.sslExpiry)
    .map(d => ({
      ...d,
      daysUntilExpiry: getDaysUntilExpiry(d.sslExpiry)
    }))
    .filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0)
    .sort((a, b) => (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999))[0]
  
  // Sorting function
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
    
    const sorted = [...domains].sort((a, b) => {
      let aVal: string | number | boolean = ""
      let bVal: string | number | boolean = ""
      
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
  
  // Filter domains by status
  const filteredDomains = domains.filter(d => {
    if (statusFilter === "all") return true
    return d.status === statusFilter
  })
  
  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    }
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-3 w-3 ml-1" />
      : <ChevronDown className="h-3 w-3 ml-1" />
  }
  
  // Chart tabs
  const chartTabs = [
    { id: "domainGrowth", label: "Domain Growth" },
    { id: "sslStatus", label: "SSL Status" },
    { id: "trafficTrends", label: "Traffic Trends" },
    { id: "uptimeHistory", label: "Uptime History" },
  ]
  
  // Render active chart
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
      {/* SSL Expiration Alert Banner */}
      {sslExpiringDomain && !sslAlertDismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-t border-red-500/50 shadow-lg shadow-red-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-full animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      SSL Certificate Expiring Soon!
                    </p>
                    <p className="text-red-100 text-sm">
                      <span className="font-medium">{sslExpiringDomain.name}</span> expires in{" "}
                      <span className="font-bold">{sslExpiringDomain.daysUntilExpiry} days</span>{" "}
                      ({formatExpiryDate(sslExpiringDomain.sslExpiry!)})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors">
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

      {/* Header */}
      <header className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Globe className="h-8 w-8 text-red-500" />
                <div className="absolute inset-0 bg-red-500/20 blur-lg" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">DomainPro</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search domains, settings..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Toggle */}
              <button 
                className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              
              {/* User Dropdown */}
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
                
                {/* User Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-200 origin-top-right ${
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
          
          {/* Mobile Search Bar */}
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

      {/* Mobile Navigation Menu */}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400">Welcome back! Here&apos;s your domain overview</p>
        </div>

        {/* Timeline Dropdown */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-neutral-400">Showing stats for:</span>
          <div className="relative" ref={timelineDropdownRef}>
            <button 
              className={`flex items-center gap-2 px-4 py-2 bg-neutral-900 border rounded-lg text-sm font-medium transition-colors ${
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

        {/* Stats Grid */}
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
                className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6 hover:border-neutral-700 transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Domain List */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-neutral-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">Your Domains</h2>
                <div className="flex items-center gap-2">
                  {/* Toggle empty state for demo */}
                  <button 
                    onClick={() => setShowEmptyState(!showEmptyState)}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-lg transition-colors"
                  >
                    {showEmptyState ? "Show Data" : "Show Empty"}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
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
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="text-left text-xs border-b border-neutral-800/50">
                        {/* Domain Header Pill */}
                        <th className="px-4 sm:px-6 py-3 font-medium sticky left-0 bg-neutral-900/80 backdrop-blur-sm">
                          <button 
                            onClick={() => handleSort("name")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "name"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            Domain
                            {getSortIndicator("name")}
                          </button>
                        </th>
                        
                        {/* Status Header Pill with Dropdown */}
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <div className="relative" ref={statusDropdownRef}>
                            <button 
                              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
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
                        
                        {/* SSL Header Pill */}
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <button 
                            onClick={() => handleSort("ssl")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "ssl"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            SSL
                            {getSortIndicator("ssl")}
                          </button>
                        </th>
                        
                        {/* Expiry Header Pill */}
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <button 
                            onClick={() => handleSort("expiry")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "expiry"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            Expiry
                            {getSortIndicator("expiry")}
                          </button>
                        </th>
                        
                        {/* Visits Header Pill */}
                        <th className="px-4 sm:px-6 py-3 font-medium">
                          <button 
                            onClick={() => handleSort("visits")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                              sortConfig?.key === "visits"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600 hover:text-white"
                            }`}
                          >
                            Visits
                            {getSortIndicator("visits")}
                          </button>
                        </th>
                        
                        <th className="px-4 sm:px-6 py-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDomains.map((domain) => (
                        <tr
                          key={domain.name}
                          className="border-b border-neutral-800/30 hover:bg-neutral-800/20 transition-colors"
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
                            <span className="text-sm text-neutral-400">{domain.expiry}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span className="text-sm font-medium text-white">{domain.visits}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <button className="p-1 text-neutral-400 hover:text-white transition-colors">
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
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-sm text-white transition-colors">
                  <Plus className="h-4 w-4 text-red-400" />
                  <span>Register Domain</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-sm text-white transition-colors">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span>Add SSL Certificate</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-sm text-white transition-colors">
                  <Settings className="h-4 w-4 text-red-400" />
                  <span>DNS Settings</span>
                </button>
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-sm text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-red-400" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
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

        {/* Charts Section */}
        <div className="mt-8">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-800/50">
              <h2 className="text-lg font-semibold text-white mb-4">Analytics</h2>
              
              {/* Chart Tabs - Pill Style */}
              <div className="flex flex-wrap gap-2">
                {chartTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChart(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
            
            {/* Chart Content */}
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
            {/* Copyright */}
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Globe className="h-4 w-4 text-red-500" />
              <span>© 2026 DomainPro. All rights reserved.</span>
            </div>
            
            {/* Footer Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link 
                href="/terms" 
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/docs" 
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                Documentation
              </Link>
              <Link 
                href="/api" 
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                API
              </Link>
              <Link 
                href="/support" 
                className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
              >
                Support
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
