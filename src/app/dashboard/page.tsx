"use client"

import Link from "next/link"
import { Globe, TrendingUp, Shield, Activity, Plus, Search, Settings, Bell, User, ChevronDown, ExternalLink, Clock, Check } from "lucide-react"

// Sample data for demonstration
const stats = [
  { label: "Total Domains", value: "12", change: "+2 this month", icon: Globe, trend: "up" },
  { label: "SSL Certificates", value: "8/10", change: "2 remaining", icon: Shield, trend: "neutral" },
  { label: "Total Visits", value: "24.5K", change: "+12% this week", icon: TrendingUp, trend: "up" },
  { label: "Uptime", value: "99.9%", change: "Last 30 days", icon: Activity, trend: "up" },
]

const domains = [
  { name: "example.com", status: "active", ssl: true, expiry: "Mar 15, 2026", visits: "8.2K" },
  { name: "mystore.io", status: "active", ssl: true, expiry: "Jun 22, 2026", visits: "5.1K" },
  { name: "portfolio.dev", status: "active", ssl: false, expiry: "Apr 30, 2026", visits: "3.8K" },
  { name: "blog.net", status: "pending", ssl: false, expiry: "May 10, 2026", visits: "2.4K" },
]

const activities = [
  { action: "SSL Certificate renewed", domain: "example.com", time: "2 hours ago" },
  { action: "Domain registered", domain: "newsite.io", time: "1 day ago" },
  { action: "DNS updated", domain: "mystore.io", time: "3 days ago" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Globe className="h-8 w-8 text-red-500" />
                <div className="absolute inset-0 bg-red-500/20 blur-lg" />
              </div>
              <span className="text-xl font-bold text-white">DomainPro</span>
            </Link>

            {/* Search Bar */}
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
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400">Welcome back! Here's your domain overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 hover:border-neutral-700 transition-colors"
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
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
              <div className="text-xs text-neutral-400">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain List */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Your Domains</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Domain
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-neutral-400 border-b border-neutral-800/50">
                      <th className="px-6 py-3 font-medium">Domain</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">SSL</th>
                      <th className="px-6 py-3 font-medium">Expiry</th>
                      <th className="px-6 py-3 font-medium">Visits</th>
                      <th className="px-6 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => (
                      <tr
                        key={domain.name}
                        className="border-b border-neutral-800/30 hover:bg-neutral-800/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-neutral-500" />
                            <span className="text-sm font-medium text-white">{domain.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          {domain.ssl ? (
                            <Shield className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Shield className="h-4 w-4 text-neutral-600" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-400">{domain.expiry}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-white">{domain.visits}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 text-neutral-400 hover:text-white transition-colors">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6">
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
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6">
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
      </main>
    </div>
  )
}
