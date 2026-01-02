"use client"

/**
 * DomainPro Dashboard - Redesigned
 * 
 * A modern, professional dashboard matching the DomainPro dark futuristic theme.
 * Features: Personalized insights, data visualization, quick actions, and smooth animations.
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import {
  Globe2,
  Shield,
  Search,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Zap,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Settings,
  Bell,
  ChevronRight,
  DollarSign,
  BarChart3,
  Layers,
  Lock,
  MoreHorizontal,
  Activity,
  Eye,
  Calendar,
  Server,
  Wifi,
  Copy,
  Check,
} from "lucide-react"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UserData {
  name?: string
  email: string
  plan: "free" | "starter" | "professional" | "enterprise"
  avatarUrl?: string
}

interface DomainData {
  id: string
  name: string
  tld: string
  status: "active" | "expiring" | "pending" | "expired"
  expiresAt: string
  daysUntilExpiry: number
  ssl: boolean
  autoRenew: boolean
  monthlyVisits?: number
}

interface ActivityItem {
  id: string
  type: "domain_registered" | "dns_updated" | "ssl_issued" | "renewal" | "transfer" | "settings"
  title: string
  description: string
  timestamp: string
  icon: typeof Globe2
}

interface StatsData {
  activeDomains: number
  domainsTrend: number
  portfolioValue: number
  valueTrend: number
  expiringSoon: number
  monthlyTraffic: number
  trafficTrend: number
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getDaysUntilExpiry(dateStr: string): number {
  const now = new Date()
  const expiry = new Date(dateStr)
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

function AnimatedNumber({ 
  value, 
  duration = 1000,
  prefix = "",
  suffix = ""
}: { 
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{prefix}{formatNumber(displayValue)}{suffix}</span>
}

function FadeIn({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ============================================================================
// MINI CHART COMPONENT
// ============================================================================

function MiniSparkline({ 
  data, 
  color = "#EF4444",
  height = 40
}: { 
  data: number[]
  color?: string
  height?: number
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={`url(#gradient-${color.replace("#", "")})`}
        points={`0,${height} ${points} 100,${height}`}
      />
    </svg>
  )
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

function StatsCard({
  title,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendLabel,
  icon: Icon,
  iconColor = "text-red-500",
  iconBg = "bg-red-500/10",
  urgent = false,
  sparklineData,
  sparklineColor,
  delay = 0,
}: {
  title: string
  value: number
  prefix?: string
  suffix?: string
  trend?: number
  trendLabel?: string
  icon: typeof Globe2
  iconColor?: string
  iconBg?: string
  urgent?: boolean
  sparklineData?: number[]
  sparklineColor?: string
  delay?: number
}) {
  const isPositiveTrend = trend && trend > 0
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight

  return (
    <FadeIn delay={delay}>
      <div className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-6 hover:border-neutral-700/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
        {/* Urgent indicator */}
        {urgent && value > 0 && (
          <div className="absolute -top-2 -right-2 flex items-center justify-center">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[10px] font-bold text-white">
                {value}
              </span>
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositiveTrend 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "bg-red-500/10 text-red-400"
            }`}>
              <TrendIcon className="h-3 w-3" />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold text-white tracking-tight">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </span>
        </div>

        {/* Label */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">{title}</span>
          {trendLabel && (
            <span className="text-xs text-neutral-500">{trendLabel}</span>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData && (
          <div className="mt-4 -mx-2">
            <MiniSparkline data={sparklineData} color={sparklineColor || "#EF4444"} />
          </div>
        )}
      </div>
    </FadeIn>
  )
}

// ============================================================================
// QUICK ACTION BUTTON COMPONENT
// ============================================================================

function QuickActionButton({
  icon: Icon,
  label,
  href,
  primary = false,
}: {
  icon: typeof Search
  label: string
  href: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
        primary
          ? "bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105"
          : "bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50 text-neutral-300 hover:text-white"
      }`}
    >
      <Icon className={`h-5 w-5 ${primary ? "" : "group-hover:text-red-400"} transition-colors`} />
      <span className="text-xs font-medium text-center">{label}</span>
    </Link>
  )
}

// ============================================================================
// DOMAIN ROW COMPONENT
// ============================================================================

function DomainRow({ domain, index }: { domain: DomainData; index: number }) {
  const [copied, setCopied] = useState(false)

  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle,
    },
    expiring: {
      label: "Expiring",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      icon: AlertTriangle,
    },
    pending: {
      label: "Pending",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: Clock,
    },
    expired: {
      label: "Expired",
      color: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: AlertCircle,
    },
  }

  const status = statusConfig[domain.status]
  const StatusIcon = status.icon

  const handleCopy = () => {
    navigator.clipboard.writeText(domain.name + domain.tld)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <FadeIn delay={100 + index * 50}>
      <div className="group flex items-center gap-4 p-4 bg-neutral-900/30 hover:bg-neutral-900/60 border border-neutral-800/50 hover:border-neutral-700/50 rounded-xl transition-all duration-300">
        {/* Domain Icon */}
        <div className="flex-shrink-0 p-2.5 rounded-lg bg-neutral-800/50 group-hover:bg-red-500/10 transition-colors">
          <Globe2 className="h-5 w-5 text-neutral-400 group-hover:text-red-400 transition-colors" />
        </div>

        {/* Domain Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white truncate">{domain.name}</span>
            <span className="px-1.5 py-0.5 text-xs font-medium bg-neutral-800 text-neutral-400 rounded">
              {domain.tld}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
              title="Copy domain"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-neutral-500" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${status.color}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
            {domain.ssl && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <Lock className="h-3 w-3" />
                SSL
              </span>
            )}
            {domain.autoRenew && (
              <span className="flex items-center gap-1 text-blue-400 text-xs">
                <RefreshCw className="h-3 w-3" />
                Auto
              </span>
            )}
          </div>
        </div>

        {/* Expiry Info */}
        <div className="hidden sm:block text-right">
          <div className={`text-sm font-medium ${
            domain.daysUntilExpiry <= 30 ? "text-orange-400" : "text-neutral-300"
          }`}>
            {domain.daysUntilExpiry > 0 ? `${domain.daysUntilExpiry} days` : "Expired"}
          </div>
          <div className="text-xs text-neutral-500">
            {new Date(domain.expiresAt).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric", 
              year: "numeric" 
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/domains/${domain.id}`}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Manage domain"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            href={`/dashboard/domains/${domain.id}/renew`}
            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
            title="Renew domain"
          >
            <RefreshCw className="h-4 w-4" />
          </Link>
          <button className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </FadeIn>
  )
}

// ============================================================================
// ACTIVITY ITEM COMPONENT
// ============================================================================

function ActivityItemRow({ item, index }: { item: ActivityItem; index: number }) {
  const iconConfig: Record<string, { color: string; bg: string }> = {
    domain_registered: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
    dns_updated: { color: "text-blue-400", bg: "bg-blue-500/10" },
    ssl_issued: { color: "text-green-400", bg: "bg-green-500/10" },
    renewal: { color: "text-yellow-400", bg: "bg-yellow-500/10" },
    transfer: { color: "text-purple-400", bg: "bg-purple-500/10" },
    settings: { color: "text-neutral-400", bg: "bg-neutral-500/10" },
  }

  const config = iconConfig[item.type] || iconConfig.settings
  const Icon = item.icon

  return (
    <FadeIn delay={200 + index * 50}>
      <div className="flex items-start gap-3 p-3 hover:bg-neutral-900/30 rounded-lg transition-colors">
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{item.title}</p>
          <p className="text-xs text-neutral-500 truncate">{item.description}</p>
        </div>
        <span className="text-xs text-neutral-600 whitespace-nowrap">
          {getRelativeTime(item.timestamp)}
        </span>
      </div>
    </FadeIn>
  )
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

function EmptyState() {
  return (
    <FadeIn delay={100}>
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800">
            <Globe2 className="h-16 w-16 text-red-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No domains yet</h3>
        <p className="text-neutral-400 mb-8 max-w-md">
          Your digital empire awaits! Start by searching for the perfect domain name for your project.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/dashboard/domains/search"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
            Search Domains
          </Link>
          <Link
            href="/dashboard/domains/transfer"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white font-medium rounded-xl transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
            Transfer Domain
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

// ============================================================================
// NOTIFICATION BADGE COMPONENT
// ============================================================================

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null
  
  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
      {count > 99 ? "99+" : count}
    </span>
  )
}

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

function InsightCard({
  type,
  message,
  action,
  actionHref,
}: {
  type: "warning" | "success" | "info"
  message: string
  action?: string
  actionHref?: string
}) {
  const config = {
    warning: {
      bg: "bg-orange-500/10 border-orange-500/20",
      icon: AlertTriangle,
      iconColor: "text-orange-400",
    },
    success: {
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icon: CheckCircle,
      iconColor: "text-emerald-400",
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/20",
      icon: Activity,
      iconColor: "text-blue-400",
    },
  }

  const { bg, icon: Icon, iconColor } = config[type]

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <span className="flex-1 text-sm text-neutral-300">{message}</span>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="text-sm font-medium text-red-400 hover:text-red-300 whitespace-nowrap transition-colors"
        >
          {action} →
        </Link>
      )}
    </div>
  )
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [greeting, setGreeting] = useState("")

  // Mock data - in production, fetch from database
  const [stats] = useState<StatsData>({
    activeDomains: 12,
    domainsTrend: 8,
    portfolioValue: 4850,
    valueTrend: 12,
    expiringSoon: 3,
    monthlyTraffic: 48500,
    trafficTrend: -5,
  })

  const [domains] = useState<DomainData[]>([
    {
      id: "1",
      name: "myawesomesite",
      tld: ".com",
      status: "active",
      expiresAt: "2025-11-15",
      daysUntilExpiry: 318,
      ssl: true,
      autoRenew: true,
      monthlyVisits: 12500,
    },
    {
      id: "2",
      name: "brandname",
      tld: ".io",
      status: "expiring",
      expiresAt: "2025-02-28",
      daysUntilExpiry: 27,
      ssl: true,
      autoRenew: false,
      monthlyVisits: 8200,
    },
    {
      id: "3",
      name: "startup-project",
      tld: ".dev",
      status: "active",
      expiresAt: "2026-03-10",
      daysUntilExpiry: 433,
      ssl: true,
      autoRenew: true,
      monthlyVisits: 3400,
    },
    {
      id: "4",
      name: "newventure",
      tld: ".co",
      status: "pending",
      expiresAt: "2026-01-02",
      daysUntilExpiry: 365,
      ssl: false,
      autoRenew: false,
      monthlyVisits: 0,
    },
  ])

  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "domain_registered",
      title: "Domain Registered",
      description: "newventure.co was successfully registered",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      icon: Globe2,
    },
    {
      id: "2",
      type: "ssl_issued",
      title: "SSL Certificate Issued",
      description: "SSL activated for startup-project.dev",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      icon: Shield,
    },
    {
      id: "3",
      type: "dns_updated",
      title: "DNS Records Updated",
      description: "A record changed for myawesomesite.com",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      icon: Server,
    },
    {
      id: "4",
      type: "renewal",
      title: "Auto-Renewal Reminder",
      description: "brandname.io expires in 27 days",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      icon: RefreshCw,
    },
  ])

  // Sparkline data for charts
  const trafficSparkline = [32, 45, 38, 52, 48, 55, 42, 58, 52, 48, 55, 50]
  const valueSparkline = [3200, 3500, 3800, 4100, 4300, 4500, 4600, 4700, 4800, 4850]

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name,
          plan: "professional",
        })
      }
      setIsLoading(false)
    }
    fetchUser()

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [supabase.auth])

  // Calculate insights
  const expiringDomains = domains.filter(d => d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0)
  const domainsWithoutSSL = domains.filter(d => !d.ssl)
  const domainsWithoutAutoRenew = domains.filter(d => !d.autoRenew && d.status === "active")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-neutral-400 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* ================================================================== */}
      {/* WELCOME HERO SECTION */}
      {/* ================================================================== */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/50 p-6 lg:p-8">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-700/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {greeting}, {user?.name?.split(" ")[0] || "there"}!
                </h1>
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-neutral-400 mb-4">{currentTime}</p>
              
              {/* Insights */}
              <div className="space-y-2">
                {expiringDomains.length > 0 && (
                  <InsightCard
                    type="warning"
                    message={`You have ${expiringDomains.length} domain${expiringDomains.length > 1 ? "s" : ""} expiring in the next 30 days`}
                    action="View"
                    actionHref="/dashboard/domains?filter=expiring"
                  />
                )}
                {domainsWithoutSSL.length > 0 && (
                  <InsightCard
                    type="info"
                    message={`${domainsWithoutSSL.length} domain${domainsWithoutSSL.length > 1 ? "s" : ""} without SSL protection`}
                    action="Secure"
                    actionHref="/dashboard/ssl"
                  />
                )}
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/domains/search"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105 transition-all duration-300"
              >
                <Search className="h-5 w-5" />
                Search Domains
              </Link>
              <Link
                href="/dashboard/domains/new"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-white font-medium rounded-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                Add Domain
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================== */}
      {/* STATS GRID */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Active Domains"
          value={stats.activeDomains}
          trend={stats.domainsTrend}
          trendLabel="vs last month"
          icon={Globe2}
          iconColor="text-red-500"
          iconBg="bg-red-500/10"
          delay={0}
        />
        <StatsCard
          title="Portfolio Value"
          value={stats.portfolioValue}
          prefix="$"
          trend={stats.valueTrend}
          trendLabel="estimated"
          icon={DollarSign}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          sparklineData={valueSparkline}
          sparklineColor="#10B981"
          delay={50}
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          suffix=" domains"
          icon={AlertTriangle}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
          urgent={true}
          delay={100}
        />
        <StatsCard
          title="Monthly Traffic"
          value={stats.monthlyTraffic}
          trend={stats.trafficTrend}
          trendLabel="vs last month"
          icon={BarChart3}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          sparklineData={trafficSparkline}
          sparklineColor="#3B82F6"
          delay={150}
        />
      </div>

      {/* ================================================================== */}
      {/* QUICK ACTIONS */}
      {/* ================================================================== */}
      <FadeIn delay={200}>
        <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3">
            <QuickActionButton
              icon={Search}
              label="Search Domain"
              href="/dashboard/domains/search"
              primary
            />
            <QuickActionButton
              icon={ArrowRight}
              label="Transfer Domain"
              href="/dashboard/domains/transfer"
            />
            <QuickActionButton
              icon={Layers}
              label="Bulk Operations"
              href="/dashboard/domains/bulk"
            />
            <QuickActionButton
              icon={Server}
              label="DNS Management"
              href="/dashboard/dns"
            />
            <QuickActionButton
              icon={RefreshCw}
              label="Auto-Renew"
              href="/dashboard/settings/auto-renew"
            />
          </div>
        </div>
      </FadeIn>

      {/* ================================================================== */}
      {/* MAIN CONTENT GRID */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain List */}
        <div className="lg:col-span-2">
          <FadeIn delay={250}>
            <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-neutral-800/50">
                <div>
                  <h2 className="text-lg font-semibold text-white">Your Domains</h2>
                  <p className="text-sm text-neutral-500">{domains.length} total domains</p>
                </div>
                <Link
                  href="/dashboard/domains"
                  className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-4 lg:p-6 space-y-3">
                {domains.length > 0 ? (
                  domains.slice(0, 4).map((domain, index) => (
                    <DomainRow key={domain.id} domain={domain} index={index} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Recent Activity */}
        <div>
          <FadeIn delay={300}>
            <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden h-full">
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-neutral-800/50">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <Link
                  href="/dashboard/activity"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  See all
                </Link>
              </div>

              <div className="p-2">
                {activities.map((activity, index) => (
                  <ActivityItemRow key={activity.id} item={activity} index={index} />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ================================================================== */}
      {/* UPGRADE BANNER */}
      {/* ================================================================== */}
      {user?.plan !== "enterprise" && (
        <FadeIn delay={350}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/50 via-red-900/30 to-neutral-950 border border-red-500/20 p-6 lg:p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <Sparkles className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Unlock Premium Features
                  </h3>
                  <p className="text-neutral-400 max-w-xl">
                    Upgrade to Enterprise for unlimited domains, priority support, white-label solutions, and dedicated account management.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/billing/upgrade"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 whitespace-nowrap"
              >
                Upgrade Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ================================================================== */}
      {/* HELP SECTION */}
      {/* ================================================================== */}
      <FadeIn delay={400}>
        <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Need Help?</h3>
              <p className="text-neutral-400">
                Check our documentation or reach out to our support team
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Documentation
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-neutral-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
