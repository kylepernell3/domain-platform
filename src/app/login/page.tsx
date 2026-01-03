"use client"

import Link from "next/link"
import { Globe } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                DomainPro
              </h1>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-neutral-400 font-medium">
              Sign in to your DomainPro account
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center p-4 bg-neutral-800/50 rounded-xl">
              <p className="text-neutral-300 font-medium mb-4">
                Login functionality coming soon
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
              >
                Go to Dashboard
              </Link>
            </div>

            <div className="text-center text-sm text-neutral-500">
              New to DomainPro?{" "}
              <Link
                href="/signup"
                className="text-red-400 hover:text-red-300 transition-colors duration-300 font-medium"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

        <footer className="relative z-10 p-6 text-center">
          <p className="text-neutral-600 text-sm font-medium">
            © 2026 DomainPro. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
