"use client"

/**
 * DomainPro Login Page
 * 
 * Features:
 * - Email/password login
 * - Form validation with Zod
 * - "Forgot password?" functionality
 * - Remember me checkbox
 * - Error handling with user-friendly messages
 * - Loading states
 * - Redirect to dashboard after login
 * - Link to signup page
 * - Matches DomainPro dark theme design
 */

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Globe, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase"

// Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

type FormErrors = {
  email?: string
  password?: string
  general?: string
}

// Loading fallback component
function LoginLoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
        <p className="text-neutral-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}

// Main login form component
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("domainpro_remembered_email")
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormErrors] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      
      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes("Invalid login credentials")) {
          setErrors({ general: "Invalid email or password. Please try again." })
        } else if (error.message.includes("Email not confirmed")) {
          setErrors({ general: "Please verify your email address before logging in." })
        } else if (error.message.includes("Too many requests")) {
          setErrors({ general: "Too many login attempts. Please try again later." })
        } else {
          setErrors({ general: error.message })
        }
        return
      }
      
      if (data.user) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("domainpro_remembered_email", formData.email)
        } else {
          localStorage.removeItem("domainpro_remembered_email")
        }
        
        // Redirect to dashboard or intended destination
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        
        body { font-family: var(--font-body); }
        .font-display { font-family: var(--font-display); }
        
        .text-gradient-red {
          background: linear-gradient(135deg, #dc2626 0%, #f87171 50%, #dc2626 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        
        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #dc2626;
          outline-offset: 2px;
        }
      `}</style>
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-700/8 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group" aria-label="DomainPro Home">
          <div className="relative">
            <Globe className="h-9 w-9 text-red-500/90 group-hover:rotate-180 transition-transform duration-700" aria-hidden="true" />
            <div className="absolute inset-0 bg-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            DomainPro
          </span>
        </Link>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-neutral-400 font-medium">
                Sign in to your DomainPro account
              </p>
            </div>
            
            {/* Error Alert */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3" role="alert">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-red-400 text-sm font-medium">{errors.general}</p>
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" aria-hidden="true" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-800/50 border ${
                      errors.email ? 'border-red-500/50' : 'border-neutral-700/50'
                    } focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/30 text-white placeholder:text-neutral-500 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-neutral-300">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors duration-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-neutral-800/50 border ${
                      errors.password ? 'border-red-500/50' : 'border-neutral-700/50'
                    } focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/30 text-white placeholder:text-neutral-500 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-300 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-red-600 focus:ring-red-500 focus:ring-offset-neutral-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="remember-me" className="text-sm text-neutral-400 font-medium cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-900/50 text-neutral-500 font-medium">
                  New to DomainPro?
                </span>
              </div>
            </div>
            
            {/* Sign Up Link */}
            <Link
              href="/signup"
              className="w-full py-3.5 px-6 border border-neutral-700/50 hover:border-neutral-600 bg-neutral-800/30 hover:bg-neutral-800/50 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              Create an account
              <Sparkles className="h-4 w-4 animate-sparkle" aria-hidden="true" />
            </Link>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-sm text-neutral-500 mt-8 font-medium">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-red-400 hover:text-red-300 transition-colors duration-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-red-400 hover:text-red-300 transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-neutral-600 text-sm font-medium">
          © 2026 DomainPro. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginForm />
    </Suspense>
  )
}
