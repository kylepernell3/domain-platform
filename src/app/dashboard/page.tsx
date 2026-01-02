"use client"

/**
 * DomainPro Dashboard Home Page
 * 
 * Features:
 * - Welcome message with user's name
 * - Quick stats cards (domains, SSL, storage)
 * - Recent activity section
 * - Quick action buttons
 * - Responsive design
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import {
  Globe2,
  Shield,
  HardDrive,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Search,
  Settings,
} from "lucide-react"

// Stats Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "red",
}: {
  title: string
  value: string | number
  subtitle: string
  icon: typeof Globe2
  trend?: { value: string; positive: boolean }
  color?: "red" | "emerald" | "blue" | "purple"
}) {
  const colorClasses = {
    red: "from-red-600/20 to-red-700/10 border-red-500/20 text-red-400",
    emerald: "from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-400",
    blue: "from-blue-600/20 to-blue-700/10 border-blue-500/20 text-blue-400",
    purple: "from-purple-600/20 to-purple-700/10 border-purple-500/20 text-purple-400",
  }

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-4 w-4 ${!trend.positive && 'rotate-180'}`} />
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-neutral-400">{subtitle}</div>
    </div>
  )
}

// Quick Action Card Component
function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color = "neutral",
}: {
  title: string
  description: string
  icon: typeof Plus
  href: string
  color?: "red" | "neutral"
}) {
  return (
    <Link
      href={href}
      className={`group p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
        color === "red"
          ? "bg-red-600/10 border-red-500/20 hover:border-red-500/40"
          : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color === "red" ? "bg-red-500/10" : "bg-neutral-800"}`}>
          <Icon className={`h-5 w-5 ${color === "red" ? "text-red-400" : "text-neutral-400"}`} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
      </div>
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-sm text-neutral-500">{description}</div>
    </Link>
  )
}

// Activity Item Component
function ActivityItem({
  type,
  title,
  description,
  time,
  status,
}: {
  type: "domain" | "ssl" | "settings" | "billing"
  title: string
  description: string
  time: string
  status: "success" | "pending" | "warning"
}) {
  const icons = {
    domain: Globe2,
    ssl: Shield,
    settings: Settings,
    billing: Clock,
  }
  const Icon = icons[type]

  const statusIcons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-400" />,
    pending: <Clock className="h-4 w-4 text-yellow-400" />,
    warning: <AlertCircle className="h-4 w-4 text-orange-400" />,
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-800/30 transition-colors">
      <div className="p-2 rounded-lg bg-neutral-800">
        <Icon className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white">{title}</span>
          {statusIcons[status]}
        </div>
        <p className="text-sm text-neutral-500 truncate">{description}</p>
      </div>
      <div className="text-xs text-neutral-600 whitespace-nowrap">{time}</div>
    </div>
  )
}

// Domain Card Component
function DomainCard({
  domain,
  status,
  expiresIn,
  ssl,
}: {
  domain: string
  status: "active" | "pending" | "expiring"
  expiresIn: string
  ssl: boolean
}) {
  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    expiring: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  }

  return (
    <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-800">
            <Globe2 className="h-4 w-4 text-neutral-400" />
          </div>
          <span className="font-medium text-white">{domain}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-neutral-500">Expires: {expiresIn}</span>
          {ssl && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="h-3 w-3" />
              SSL
            </span>
          )}
        </div>
        <Link href={`/dashboard/domains/${domain}`} className="text-red-400 hover:text-red-300 transition-colors">
          Manage
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<{ name?: string; email: string; plan: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // In a real app, fetch profile from database
        setUser({
          email: user.email || '',
          name: user.user_metadata?.full_name,
          plan: 'Free', // Would come from profiles table
        })
      }
      setIsLoading(false)
    }
    getUser()

    // Update time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [supabase.auth])

  // Mock data - in a real app, this would come from the database
  const stats = {
    domains: 3,
    ssl: 2,
    storage: "1.2 GB",
  }

  const recentActivity = [
    {
      type: "domain" as const,
      title: "Domain Registered",
      description: "example.com was successfully registered",
      time: "2 hours ago",
      status: "success" as const,
    },
    {
      type: "ssl" as const,
      title: "SSL Certificate Issued",
      description: "SSL certificate for example.com is now active",
      time: "3 hours ago",
      status: "success" as const,
    },
    {
      type: "domain" as const,
      title: "Domain Expiring Soon",
      description: "mysite.io expires in 30 days",
      time: "1 day ago",
      status: "warning" as const,
    },
  ]

  const domains = [
    { domain: "example.com", status: "active" as const, expiresIn: "11 months", ssl: true },
    { domain: "mysite.io", status: "expiring" as const, expiresIn: "30 days", ssl: true },
    { domain: "newproject.dev", status: "pending" as const, expiresIn: "12 months", ssl: false },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-neutral-400">
            {currentTime} • Here's what's happening with your domains
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/domains/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Domain
          </Link>
        </div>
      </div>

      {/* Plan Banner */}
      {user?.plan === 'Free' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-600/20 via-red-600/10 to-neutral-900 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10">
              <Sparkles className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <div className="font-semibold text-white">Upgrade to Professional</div>
              <div className="text-sm text-neutral-400">
                Get 20 domains, 10 SSL certificates, and priority support
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Upgrade Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Total Domains"
          value={stats.domains}
          subtitle="Active domains"
          icon={Globe2}
          trend={{ value: "+1 this month", positive: true }}
          color="red"
        />
        <StatCard
          title="SSL Certificates"
          value={stats.ssl}
          subtitle="Active certificates"
          icon={Shield}
          color="emerald"
        />
        <StatCard
          title="Storage Used"
          value={stats.storage}
          subtitle="of 10 GB available"
          icon={HardDrive}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Register Domain"
            description="Find and register a new domain"
            icon={Search}
            href="/dashboard/domains/new"
            color="red"
          />
          <QuickActionCard
            title="Request SSL"
            description="Get a free SSL certificate"
            icon={Shield}
            href="/dashboard/ssl/new"
          />
          <QuickActionCard
            title="Transfer Domain"
            description="Move domains to DomainPro"
            icon={RefreshCw}
            href="/dashboard/domains/transfer"
          />
          <QuickActionCard
            title="View DNS Records"
            description="Manage your DNS settings"
            icon={Zap}
            href="/dashboard/domains"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domains List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Domains</h2>
            <Link
              href="/dashboard/domains"
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {domains.map((domain) => (
              <DomainCard key={domain.domain} {...domain} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            {recentActivity.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Need Help?</h3>
            <p className="text-neutral-400">
              Check out our documentation or contact our support team
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-neutral-600 text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}