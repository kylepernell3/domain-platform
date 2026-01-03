"use client"

import Link from "next/link"
import { Globe } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                DomainPro
              </h1>
            </div>
            <Link
              href="/"
              className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-4">
            Dashboard
          </h2>
          <p className="text-xl text-neutral-400 font-medium">
            Welcome to your DomainPro Dashboard
          </p>
        </div>

        {/* Dashboard Content Coming Soon */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-xl rounded-2xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Dashboard Features Coming Soon
            </h3>
            <p className="text-neutral-400 mb-8">
              We're building an amazing dashboard experience for you. Check back soon for:
            </p>
            <ul className="text-left text-neutral-300 space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Domain management and search</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Analytics and insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Quick actions and shortcuts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Real-time notifications</span>
              </li>
            </ul>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
            >
              Explore DomainPro
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-600 text-sm font-medium">
            © 2026 DomainPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
