"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Globe,
  Menu,
  X,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Mail,
  Lock,
  ChevronRight,
  Shield,
  CreditCard,
  FileText,
  HelpCircle,
  Server,
  Headphones,
  DollarSign,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light")
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDarkMode, mounted])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const themeClasses = {
    bg: isDarkMode ? "bg-neutral-950" : "bg-gray-50",
    navBg: isDarkMode ? "bg-neutral-950/95" : "bg-white/95",
    navBorder: isDarkMode ? "border-neutral-800/50" : "border-gray-200",
    cardBg: isDarkMode ? "bg-neutral-900/50" : "bg-white",
    cardBorder: isDarkMode ? "border-neutral-800/50" : "border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textMuted: isDarkMode ? "text-neutral-400" : "text-gray-600",
    textSubtle: isDarkMode ? "text-neutral-500" : "text-gray-500",
    inputBg: isDarkMode ? "bg-neutral-800/50" : "bg-gray-100",
    inputBorder: isDarkMode ? "border-neutral-700" : "border-gray-300",
    inputText: isDarkMode ? "text-white" : "text-gray-900",
    inputPlaceholder: isDarkMode ? "placeholder-neutral-500" : "placeholder-gray-400",
    footerBg: isDarkMode ? "bg-neutral-900" : "bg-gray-100",
    footerBorder: isDarkMode ? "border-neutral-800" : "border-gray-200",
    hoverBg: isDarkMode ? "hover:bg-neutral-800" : "hover:bg-gray-100",
    socialBg: isDarkMode ? "bg-neutral-800" : "bg-gray-100",
    socialBorder: isDarkMode ? "border-neutral-700" : "border-gray-300",
    socialHover: isDarkMode ? "hover:bg-neutral-700" : "hover:bg-gray-200",
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} font-sans transition-colors duration-300`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700;900&display=swap');
        
        body {
          font-family: 'Lato', sans-serif;
        }
        
        .font-sans {
          font-family: 'Lato', sans-serif;
        }
        
        .font-display {
          font-family: 'Lato', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.navBg} backdrop-blur-xl border-b ${themeClasses.navBorder} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Globe className="h-7 w-7 text-red-500" />
              <span className={`text-xl font-bold ${themeClasses.text} tracking-tight`}>
                DomainPro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/domains" className={`${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300 font-medium text-sm`}>
                Domains
              </Link>
              <Link href="/hosting" className={`${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300 font-medium text-sm`}>
                Hosting
              </Link>
              <Link href="/pricing" className={`${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300 font-medium text-sm`}>
                Pricing
              </Link>
              <Link href="/support" className={`${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300 font-medium text-sm`}>
                Support
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeClasses.hoverBg} transition-colors duration-300`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className={`h-5 w-5 ${themeClasses.textMuted}`} />
                ) : (
                  <Moon className={`h-5 w-5 ${themeClasses.textMuted}`} />
                )}
              </button>

              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeClasses.hoverBg} transition-colors duration-300`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className={`h-5 w-5 ${themeClasses.textMuted}`} />
                ) : (
                  <Moon className={`h-5 w-5 ${themeClasses.textMuted}`} />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${themeClasses.hoverBg} transition-colors duration-300`}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className={`h-6 w-6 ${themeClasses.text}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${themeClasses.text}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${themeClasses.navBorder}`}>
              <div className="flex flex-col gap-2">
                <Link
                  href="/domains"
                  className={`px-4 py-3 rounded-lg ${themeClasses.textMuted} ${themeClasses.hoverBg} transition-colors duration-300 font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Domains
                </Link>
                <Link
                  href="/hosting"
                  className={`px-4 py-3 rounded-lg ${themeClasses.textMuted} ${themeClasses.hoverBg} transition-colors duration-300 font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hosting
                </Link>
                <Link
                  href="/pricing"
                  className={`px-4 py-3 rounded-lg ${themeClasses.textMuted} ${themeClasses.hoverBg} transition-colors duration-300 font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  className={`px-4 py-3 rounded-lg ${themeClasses.textMuted} ${themeClasses.hoverBg} transition-colors duration-300 font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <Link
                  href="/signup"
                  className="mx-4 mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-center transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className={`${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-colors duration-300`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="h-8 w-8 text-red-500" />
                <h1 className={`text-3xl font-bold ${themeClasses.text} tracking-tight`}>
                  DomainPro
                </h1>
              </div>
              <h2 className={`text-2xl font-bold ${themeClasses.text} tracking-tight mb-2`}>
                Welcome back
              </h2>
              <p className={`${themeClasses.textMuted} font-medium`}>
                Sign in to your DomainPro account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${themeClasses.textSubtle}`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 font-medium`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${themeClasses.textSubtle}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.textSubtle} hover:text-red-500 transition-colors duration-300`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-600 text-red-500 focus:ring-red-500 focus:ring-offset-0 bg-neutral-800 cursor-pointer"
                  />
                  <span className={`text-sm ${themeClasses.textMuted} font-medium`}>
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-500 hover:text-teal-400 transition-colors duration-300 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className={`absolute inset-0 flex items-center`}>
                <div className={`w-full border-t ${themeClasses.cardBorder}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDarkMode ? 'bg-neutral-900/50' : 'bg-white'} ${themeClasses.textSubtle} font-medium`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl ${themeClasses.socialBg} border ${themeClasses.socialBorder} ${themeClasses.socialHover} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className={`font-semibold ${themeClasses.text} text-sm`}>Google</span>
              </button>

              {/* GitHub Login */}
              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl ${themeClasses.socialBg} border ${themeClasses.socialBorder} ${themeClasses.socialHover} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className={`h-5 w-5 ${themeClasses.text}`} fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className={`font-semibold ${themeClasses.text} text-sm`}>GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className={`mt-8 text-center text-sm ${themeClasses.textSubtle}`}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-red-500 hover:text-red-400 transition-colors duration-300 font-semibold"
              >
                Create an account
              </Link>
            </div>
          </div>

          {/* Trust Badges Below Card */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-500" />
              <span className={`text-xs ${themeClasses.textSubtle} font-medium`}>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-500" />
              <span className={`text-xs ${themeClasses.textSubtle} font-medium`}>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-teal-500" />
              <span className={`text-xs ${themeClasses.textSubtle} font-medium`}>PCI Compliant</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${themeClasses.footerBg} border-t ${themeClasses.footerBorder} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Domains Column */}
            <div>
              <h3 className={`text-sm font-bold ${themeClasses.text} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                <Globe className="h-4 w-4 text-red-500" />
                Domains
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/domains/search" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Domain Search
                  </Link>
                </li>
                <li>
                  <Link href="/domains/transfer" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Domain Transfer
                  </Link>
                </li>
                <li>
                  <Link href="/domains/extensions" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Domain Extensions
                  </Link>
                </li>
                <li>
                  <Link href="/domains/whois" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    WHOIS Lookup
                  </Link>
                </li>
                <li>
                  <Link href="/domains/privacy" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Domain Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Hosting Column */}
            <div>
              <h3 className={`text-sm font-bold ${themeClasses.text} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                <Server className="h-4 w-4 text-red-500" />
                Hosting
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/hosting/web" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Web Hosting
                  </Link>
                </li>
                <li>
                  <Link href="/hosting/wordpress" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    WordPress Hosting
                  </Link>
                </li>
                <li>
                  <Link href="/hosting/vps" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    VPS Hosting
                  </Link>
                </li>
                <li>
                  <Link href="/hosting/dedicated" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Dedicated Servers
                  </Link>
                </li>
                <li>
                  <Link href="/hosting/email" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Email Hosting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className={`text-sm font-bold ${themeClasses.text} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                <Headphones className="h-4 w-4 text-red-500" />
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/support/help" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/support/contact" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/support/status" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="/support/docs" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/support/community" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                    Community Forum
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payment Methods Column */}
            <div>
              <h3 className={`text-sm font-bold ${themeClasses.text} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                <DollarSign className="h-4 w-4 text-red-500" />
                Payment Methods
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Visa */}
                <div className={`px-3 py-2 rounded-lg ${themeClasses.socialBg} border ${themeClasses.socialBorder}`}>
                  <svg className="h-5 w-8" viewBox="0 0 48 16" fill="none">
                    <path d="M17.5 1.5L15 14.5H12L14.5 1.5H17.5Z" fill="#1434CB"/>
                    <path d="M27.5 1.8C26.8 1.5 25.7 1.2 24.3 1.2C21 1.2 18.7 3 18.7 5.5C18.7 7.4 20.4 8.4 21.7 9C23 9.7 23.5 10.1 23.5 10.7C23.5 11.6 22.4 12 21.4 12C20 12 19.2 11.8 18 11.3L17.5 11.1L17 14.2C17.9 14.6 19.5 15 21.2 15C24.7 15 27 13.2 27 10.5C27 9 26 7.8 24 6.8C22.8 6.2 22.1 5.8 22.1 5.2C22.1 4.6 22.8 4 24.2 4C25.4 4 26.3 4.2 27 4.5L27.3 4.6L27.5 1.8Z" fill="#1434CB"/>
                    <path d="M32.5 1.5C33.5 1.5 34.2 1.8 34.7 3L39 14.5H35.5L34.8 12.5H30.5L30 14.5H26.5L30.5 2.3C30.8 1.7 31.5 1.5 32.5 1.5ZM32 6L31 10H33.5L32 6Z" fill="#1434CB"/>
                    <path d="M11 1.5L7.5 10.5L7 8C6.3 5.8 4.2 3.5 2 2.5L5 14.5H8.5L14.5 1.5H11Z" fill="#1434CB"/>
                    <path d="M5 1.5H0L0 1.8C4 2.8 6.5 5.3 7 8L6 3C5.8 2 5.5 1.6 5 1.5Z" fill="#F9A533"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className={`px-3 py-2 rounded-lg ${themeClasses.socialBg} border ${themeClasses.socialBorder}`}>
                  <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none">
                    <circle cx="11" cy="10" r="8" fill="#EB001B"/>
                    <circle cx="21" cy="10" r="8" fill="#F79E1B"/>
                    <path d="M16 4C17.8 5.5 19 7.6 19 10C19 12.4 17.8 14.5 16 16C14.2 14.5 13 12.4 13 10C13 7.6 14.2 5.5 16 4Z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* Amex */}
                <div className={`px-3 py-2 rounded-lg ${themeClasses.socialBg} border ${themeClasses.socialBorder}`}>
                  <svg className="h-5 w-8" viewBox="0 0 40 24" fill="none">
                    <rect width="40" height="24" rx="4" fill="#006FCF"/>
                    <path d="M7 12L10 6H12L15 12H13L12.5 11H9.5L9 12H7ZM10 9.5H12L11 7.5L10 9.5Z" fill="white"/>
                    <path d="M15 6H17L18.5 9L20 6H22V12H20V8L18.5 11H18L16.5 8V12H15V6Z" fill="white"/>
                    <path d="M23 6H28V7.5H25V8.5H28V10H25V10.5H28V12H23V6Z" fill="white"/>
                    <path d="M29 6H31L33 9V6H35V12H33L31 9V12H29V6Z" fill="white"/>
                  </svg>
                </div>
                {/* PayPal */}
                <div className={`px-3 py-2 rounded-lg ${themeClasses.socialBg} border ${themeClasses.socialBorder}`}>
                  <svg className="h-5 w-8" viewBox="0 0 40 24" fill="none">
                    <path d="M15 5C18 5 20 6 20 9C20 12 18 14 15 14H13L12 19H9L12 5H15Z" fill="#003087"/>
                    <path d="M20 7C23 7 25 8 25 11C25 14 23 16 20 16H18L17 21H14L17 7H20Z" fill="#009CDE"/>
                  </svg>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-500" />
                  <span className={`text-xs ${themeClasses.textMuted} font-medium`}>256-bit SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-500" />
                  <span className={`text-xs ${themeClasses.textMuted} font-medium`}>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-teal-500" />
                  <span className={`text-xs ${themeClasses.textMuted} font-medium`}>PCI DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className={`pt-8 border-t ${themeClasses.footerBorder}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-red-500" />
                <span className={`text-sm ${themeClasses.textSubtle} font-medium`}>
                  © 2026 DomainPro. All rights reserved.
                </span>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                <Link href="/privacy" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                  Privacy Policy
                </Link>
                <Link href="/terms" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                  Terms of Service
                </Link>
                <Link href="/cookies" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                  Cookie Policy
                </Link>
                <Link href="/sitemap" className={`text-sm ${themeClasses.textMuted} hover:text-red-500 transition-colors duration-300`}>
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
