"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Globe, Mail, Lock, Eye, EyeOff, User, Building2, Check, X, AlertCircle, CheckCircle, Shield, Zap, Award, Users, ArrowRight, Loader2, Gift, Info, Fingerprint, Smartphone, ShieldCheck, LockKeyhole, Star, RefreshCw, HelpCircle, CircleDot, Clock, CreditCard, Server, ChevronDown, ChevronRight, Github, Chrome, Laptop, Sparkles
} from "lucide-react"

// ============================================
// DATA & CONSTANTS
// ============================================

const benefits = [
  { icon: Globe, title: "500+ Domain Extensions", description: "Access to .com, .io, .dev, .ai and hundreds more TLDs at competitive prices" },
  { icon: Shield, title: "Free WHOIS Privacy", description: "Protect your personal information from public WHOIS lookups at no extra cost" },
  { icon: Zap, title: "Instant DNS Propagation", description: "Lightning-fast DNS updates with our globally distributed nameserver network" },
  { icon: Award, title: "Free SSL Certificates", description: "Secure your domains with free Let's Encrypt SSL certificates, auto-renewed" },
  { icon: Clock, title: "24/7 Expert Support", description: "Get help anytime from our domain specialists via chat, email, or phone" },
  { icon: CreditCard, title: "Transparent Pricing", description: "What you see is what you pay. No hidden fees, no renewal surprises" },
]

const trustIndicators = [
  { icon: Users, value: "50,000+", label: "Domain Owners" },
  { icon: Globe, value: "2.5M+", label: "Domains Managed" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: Clock, value: "99.99%", label: "Uptime SLA" },
]

const securityFeatures = [
  { icon: LockKeyhole, label: "256-bit SSL Encryption" },
  { icon: ShieldCheck, label: "GDPR Compliant" },
  { icon: Fingerprint, label: "Biometric Ready" },
  { icon: Server, label: "SOC 2 Certified" },
]

const accountTypes = [
  { id: "personal", icon: User, title: "Personal", description: "For individuals managing personal domains and projects", features: ["Up to 10 domains", "Basic DNS management", "Email forwarding", "Community support"] },
  { id: "business", icon: Building2, title: "Business", description: "For companies and teams managing multiple domains", features: ["Unlimited domains", "Advanced DNS & DNSSEC", "Priority support", "Team collaboration", "API access", "Custom branding"] },
]

const socialProviders = [
  { id: "google", name: "Google", icon: Chrome, color: "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300", iconColor: "text-red-500" },
  { id: "github", name: "GitHub", icon: Github, color: "bg-gray-900 hover:bg-gray-800 text-white border border-gray-700", iconColor: "text-white" },
  { id: "microsoft", name: "Microsoft", icon: Laptop, color: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500", iconColor: "text-white" },
]

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

const termsOfServiceContent = `DOMAINPRO TERMS OF SERVICE

Last Updated: January 1, 2026

1. ACCEPTANCE OF TERMS
By accessing or using DomainPro's services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.

2. DESCRIPTION OF SERVICES
DomainPro provides domain name registration, DNS management, SSL certificates, email services, and related web infrastructure services.

3. ACCOUNT REGISTRATION
3.1 Eligibility: You must be at least 18 years old to create an account.
3.2 Account Information: You agree to provide accurate, current, and complete information.
3.3 Account Security: You are responsible for maintaining the confidentiality of your credentials.

4. DOMAIN REGISTRATION
4.1 Registration Requirements: Subject to relevant registry and ICANN regulations.
4.2 WHOIS Information: You must provide accurate WHOIS contact information.
4.3 Renewal: Domains must be renewed before expiration.

5. ACCEPTABLE USE POLICY
You agree not to: violate laws, infringe IP rights, distribute malware, send spam, or disrupt services.

6. PAYMENT AND BILLING
6.1 Pricing: All prices in USD, subject to change with notice.
6.2 Payment Methods: Major credit cards, PayPal accepted.
6.3 Refunds: Domain fees non-refundable; other services per refund policy.

7. INTELLECTUAL PROPERTY
7.1 Our Property: DomainPro trademarks require written permission.
7.2 Your Content: You retain ownership; grant us hosting license.

8. LIMITATION OF LIABILITY
DomainPro not liable for indirect, incidental, special, or consequential damages.

9. TERMINATION
We may terminate accounts for Terms violations. You may terminate anytime.

10. GOVERNING LAW
Governed by Delaware law. Disputes resolved through binding arbitration.

By clicking "I agree" you accept these Terms of Service.`

const privacyPolicyContent = `DOMAINPRO PRIVACY POLICY

Last Updated: January 1, 2026

1. INTRODUCTION
DomainPro respects your privacy and protects your personal data.

2. INFORMATION WE COLLECT
2.1 Information You Provide: Account info, contact info, payment info, WHOIS data.
2.2 Automatically Collected: IP address, browser info, pages visited, cookies.
2.3 Third Parties: Social login providers, payment processors, registries.

3. HOW WE USE YOUR INFORMATION
Provide services, process registrations, process payments, communicate, improve services, prevent fraud, comply with laws.

4. LEGAL BASIS (GDPR)
Contract performance, legitimate interests, legal obligations, consent.

5. DATA SHARING
Registries, ICANN, payment processors, service providers, law enforcement. We do NOT sell personal information.

6. WHOIS DATA
Required for registration. WHOIS Privacy available to protect info.

7. DATA RETENTION
Active accounts: Duration plus 7 years. Domain data: Per ICANN. Financial: 7 years.

8. YOUR RIGHTS
Access, correct, delete, port, object, withdraw consent.

9. SECURITY
256-bit SSL, MFA, security audits, access controls.

10. CONTACT
privacy@domainpro.com

By using our services, you accept this Privacy Policy.`

const faqs = [
  { question: "Is my payment information secure?", answer: "Absolutely. We use 256-bit SSL encryption and never store your full credit card number. All payments are processed through PCI-DSS compliant processors." },
  { question: "Can I upgrade from Personal to Business later?", answer: "Yes! You can upgrade your account at any time from your dashboard. Your existing domains and settings will be preserved." },
  { question: "What happens after I sign up?", answer: "You'll receive a confirmation email to verify your address. Once verified, you'll have full access to your dashboard and can start managing domains immediately." },
  { question: "Is there a free trial?", answer: "While we don't offer a traditional free trial, we have a 30-day money-back guarantee on most services (excluding domain registrations due to registry policies)." },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password: string): { isValid: boolean; score: number; requirements: Record<string, boolean> } => {
  const requirements: Record<string, boolean> = {}
  let score = 0
  passwordRequirements.forEach((req) => {
    const passed = req.test(password)
    requirements[req.id] = passed
    if (passed) score++
  })
  return { isValid: score === passwordRequirements.length, score, requirements }
}

const getPasswordStrength = (score: number): { label: string; color: string; bgColor: string; width: string } => {
  if (score === 0) return { label: "Enter password", color: "text-gray-500", bgColor: "bg-gray-600", width: "0%" }
  if (score <= 2) return { label: "Weak", color: "text-red-400", bgColor: "bg-red-500", width: "33%" }
  if (score <= 4) return { label: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-500", width: "66%" }
  return { label: "Strong", color: "text-emerald-400", bgColor: "bg-emerald-500", width: "100%" }
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PasswordStrengthIndicator({ password }: { password: string }) {
  const { score, requirements } = validatePassword(password)
  const strength = getPasswordStrength(score)
  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Password strength</span>
          <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full ${strength.bgColor} transition-all duration-300`} style={{ width: strength.width }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {passwordRequirements.map((req) => (
          <div key={req.id} className={`flex items-center gap-2 text-xs transition-colors ${requirements[req.id] ? "text-emerald-400" : "text-slate-500"}`}>
            {requirements[req.id] ? <Check className="h-3 w-3 flex-shrink-0" /> : <CircleDot className="h-3 w-3 flex-shrink-0" />}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormInput({ id, label, type = "text", value, onChange, placeholder, icon: Icon, error, success, hint, required = false, disabled = false, autoComplete, showPasswordToggle = false, onTogglePassword, showPassword = false }: { id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; icon?: React.ComponentType<{ className?: string }>; error?: string; success?: string; hint?: string; required?: boolean; disabled?: boolean; autoComplete?: string; showPasswordToggle?: boolean; onTogglePassword?: () => void; showPassword?: boolean }) {
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Icon className={`h-5 w-5 ${error ? "text-red-400" : success ? "text-emerald-400" : "text-slate-500"}`} /></div>}
        <input id={id} name={id} type={inputType} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} autoComplete={autoComplete} className={`w-full ${Icon ? "pl-11" : "pl-4"} ${showPasswordToggle ? "pr-12" : "pr-4"} py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : success ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} />
        {showPasswordToggle && <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors" tabIndex={-1}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>}
        {success && !showPasswordToggle && <div className="absolute right-3 top-1/2 -translate-y-1/2"><CheckCircle className="h-5 w-5 text-emerald-400" /></div>}
      </div>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}</p>}
      {success && <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1"><CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />{success}</p>}
      {hint && !error && !success && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}

function SocialButton({ provider, onClick, loading, disabled }: { provider: typeof socialProviders[0]; onClick: () => void; loading: boolean; disabled: boolean }) {
  const Icon = provider.icon
  return (
    <button type="button" onClick={onClick} disabled={loading || disabled} className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${provider.color} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Icon className={`h-5 w-5 ${provider.iconColor}`} /><span>{provider.name}</span></>}
    </button>
  )
}

function AccountTypeCard({ type, selected, onSelect }: { type: typeof accountTypes[0]; selected: boolean; onSelect: () => void }) {
  const Icon = type.icon
  return (
    <button type="button" onClick={onSelect} className={`relative w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${selected ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"}`}>
      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${selected ? "border-emerald-500 bg-emerald-500" : "border-slate-600"}`}>{selected && <Check className="h-3 w-3 text-white" />}</div>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${selected ? "bg-emerald-500/20" : "bg-slate-700/50"}`}><Icon className={`h-6 w-6 ${selected ? "text-emerald-400" : "text-slate-400"}`} /></div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${selected ? "text-emerald-400" : "text-white"}`}>{type.title}</h3>
          <p className="text-sm text-slate-400 mt-0.5 mb-3">{type.description}</p>
          <ul className="space-y-1.5">{type.features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300"><Check className={`h-3.5 w-3.5 flex-shrink-0 ${selected ? "text-emerald-400" : "text-slate-500"}`} />{feature}</li>)}</ul>
        </div>
      </div>
    </button>
  )
}

function Checkbox({ id, checked, onChange, label, description, required = false, error }: { id: string; checked: boolean; onChange: (checked: boolean) => void; label: React.ReactNode; description?: string; required?: boolean; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-emerald-500 border-emerald-500" : error ? "border-red-500/50 group-hover:border-red-400" : "border-slate-600 group-hover:border-slate-500"}`}>{checked && <Check className="h-3.5 w-3.5 text-white" />}</div>
        </div>
        <div className="flex-1">
          <span className={`text-sm ${error ? "text-red-400" : "text-slate-300"}`}>{label}{required && <span className="text-red-400 ml-1">*</span>}</span>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </label>
      {error && <p className="flex items-center gap-1.5 text-xs text-red-400 ml-8"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}</p>}
    </div>
  )
}

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const Icon = benefit.icon
  return (
    <div className="group p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors"><Icon className="h-5 w-5 text-emerald-400" /></div>
        <div><h3 className="font-medium text-white text-sm">{benefit.title}</h3><p className="text-xs text-slate-400 mt-1">{benefit.description}</p></div>
      </div>
    </div>
  )
}

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-700/50 last:border-b-0">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-all duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}><p className="text-sm text-slate-400">{faq.answer}</p></div>
    </div>
  )
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">{children}</div>
      </div>
    </div>
  )
}

function SuccessMessage({ email, onResend }: { email: string; onResend: () => void }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/10 rounded-full flex items-center justify-center"><Mail className="h-10 w-10 text-emerald-400" /></div>
      <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
      <p className="text-slate-400 mb-6">We have sent a verification link to <span className="text-emerald-400 font-medium">{email}</span></p>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm text-slate-300 mb-2">Click the link in the email to verify your account and get started.</p>
            <p className="text-xs text-slate-500">Did not receive the email? Check your spam folder or click below to resend.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onResend} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"><RefreshCw className="h-4 w-4" />Resend Email</button>
        <Link href="/login" className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors">Go to Login<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  )
}

function ErrorAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1"><p className="text-sm text-red-400">{message}</p></div>
      <button onClick={onDismiss} className="p-1 text-red-400 hover:text-red-300 transition-colors"><X className="h-4 w-4" /></button>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formStep, setFormStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [referralCode, setReferralCode] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!email.trim()) newErrors.email = "Email is required"
      else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address"
      if (!password) newErrors.password = "Password is required"
      else { const { isValid } = validatePassword(password); if (!isValid) newErrors.password = "Password does not meet requirements" }
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }
    if (step === 2) {
      if (!firstName.trim()) newErrors.firstName = "First name is required"
      if (!lastName.trim()) newErrors.lastName = "Last name is required"
      if (accountType === "business" && !companyName.trim()) newErrors.companyName = "Company name is required for business accounts"
    }
    if (step === 3) {
      if (!agreeToTerms) newErrors.terms = "You must agree to the Terms of Service"
      if (!agreeToPrivacy) newErrors.privacy = "You must agree to the Privacy Policy"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => { if (validateStep(formStep)) setFormStep((prev) => Math.min(prev + 1, 3)) }
  const prevStep = () => { setFormStep((prev) => Math.max(prev - 1, 1)) }

  const handleSocialSignup = async (provider: string) => {
    setSocialLoading(provider)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: provider as "google" | "github" | "azure", options: { redirectTo: `${window.location.origin}/auth/callback` } })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign up with provider")
      setSocialLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateStep(formStep)) return
    if (formStep < 3) { nextStep(); return }
    setIsLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`, account_type: accountType, company_name: accountType === "business" ? companyName : null, referral_code: referralCode || null, newsletter_subscribed: subscribeNewsletter, two_factor_enabled: enableTwoFactor }
        }
      })
      if (signUpError) { setError(signUpError.message.includes("already registered") ? "This email is already registered. Please log in instead." : signUpError.message); return }
      if (data?.user) setSuccess(true)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "An unexpected error occurred") }
    finally { setIsLoading(false) }
  }

  const handleResendVerification = async () => {
    try { const { error } = await supabase.auth.resend({ type: "signup", email }); if (error) throw error }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to resend verification email") }
  }

  const clearError = (field: string) => { if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n }) }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => { if (e.key === "Escape") { setTermsModalOpen(false); setPrivacyModalOpen(false) } }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [])

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <style jsx global>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scale-in { animation: scaleIn 0.3s ease-out; }`}</style>
        <div className="w-full max-w-md"><div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl animate-scale-in"><SuccessMessage email={email} onResend={handleResendVerification} /></div></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <style jsx global>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .gradient-text { background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glass-effect { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="relative min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-8 xl:p-12">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors"><Globe className="h-7 w-7 text-emerald-400" /></div>
              <span className="text-2xl font-bold text-white">Domain<span className="text-emerald-400">Pro</span></span>
            </Link>
          </div>
          <div className="py-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">Take control of your<br /><span className="gradient-text">digital identity</span></h1>
            <p className="text-lg text-slate-400 mb-8 max-w-md">Join thousands of businesses and individuals who trust DomainPro for their domain management needs.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {trustIndicators.map((indicator, index) => { const Icon = indicator.icon; return (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Icon className="h-5 w-5 text-emerald-400" /></div>
                  <div><div className="text-xl font-bold text-white">{indicator.value}</div><div className="text-xs text-slate-400">{indicator.label}</div></div>
                </div>
              )})}
            </div>
            <div className="space-y-3">{benefits.slice(0, 4).map((benefit, index) => <BenefitCard key={index} benefit={benefit} index={index} />)}</div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {securityFeatures.map((feature, index) => { const Icon = feature.icon; return <div key={index} className="flex items-center gap-2 text-slate-400 text-xs"><Icon className="h-4 w-4" /><span>{feature.label}</span></div> })}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30"><Globe className="h-7 w-7 text-emerald-400" /></div>
                <span className="text-2xl font-bold text-white">Domain<span className="text-emerald-400">Pro</span></span>
              </Link>
            </div>

            <div className="glass-effect border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
                <p className="text-slate-400">Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign in</Link></p>
                <div className="flex items-center gap-2 mt-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${formStep === step ? "bg-emerald-500 text-white" : formStep > step ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>{formStep > step ? <Check className="h-4 w-4" /> : step}</div>
                      {step < 3 && <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${formStep > step ? "bg-emerald-500" : "bg-slate-700"}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500"><span>Credentials</span><span>Details</span><span>Confirm</span></div>
              </div>

              {error && <div className="px-6 sm:px-8 pt-6"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

              <form ref={formRef} onSubmit={handleSubmit} className="p-6 sm:p-8">
                {formStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400 text-center">Sign up with</p>
                      <div className="grid grid-cols-3 gap-3">{socialProviders.map((provider) => <SocialButton key={provider.id} provider={provider} onClick={() => handleSocialSignup(provider.id)} loading={socialLoading === provider.id} disabled={!!socialLoading} />)}</div>
                    </div>
                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-900 text-slate-500">or continue with email</span></div></div>
                    <FormInput id="email" label="Email address" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email") }} placeholder="you@example.com" icon={Mail} error={errors.email} success={email && validateEmail(email) ? "Valid email" : undefined} required autoComplete="email" />
                    <div>
                      <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearError("password") }} placeholder="Create a strong password" icon={Lock} error={errors.password} required autoComplete="new-password" showPasswordToggle showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />
                      {password && <PasswordStrengthIndicator password={password} />}
                    </div>
                    <FormInput id="confirmPassword" label="Confirm password" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword") }} placeholder="Confirm your password" icon={Lock} error={errors.confirmPassword} success={confirmPassword && password === confirmPassword ? "Passwords match" : undefined} required autoComplete="new-password" showPasswordToggle showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput id="firstName" label="First name" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearError("firstName") }} placeholder="John" icon={User} error={errors.firstName} required autoComplete="given-name" />
                      <FormInput id="lastName" label="Last name" value={lastName} onChange={(e) => { setLastName(e.target.value); clearError("lastName") }} placeholder="Doe" error={errors.lastName} required autoComplete="family-name" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">Account type <span className="text-red-400">*</span></label>
                      <div className="grid grid-cols-1 gap-3">{accountTypes.map((type) => <AccountTypeCard key={type.id} type={type} selected={accountType === type.id} onSelect={() => setAccountType(type.id as "personal" | "business")} />)}</div>
                    </div>
                    {accountType === "business" && <FormInput id="companyName" label="Company name" value={companyName} onChange={(e) => { setCompanyName(e.target.value); clearError("companyName") }} placeholder="Acme Inc." icon={Building2} error={errors.companyName} required autoComplete="organization" />}
                    <FormInput id="referralCode" label="Referral code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="Enter code (optional)" icon={Gift} hint="Have a referral code? Enter it for exclusive perks!" />
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
                      <h3 className="text-sm font-medium text-white">Account Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white">{email}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white">{firstName} {lastName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Account Type</span><span className="text-white capitalize">{accountType}</span></div>
                        {accountType === "business" && companyName && <div className="flex justify-between"><span className="text-slate-400">Company</span><span className="text-white">{companyName}</span></div>}
                        {referralCode && <div className="flex justify-between"><span className="text-slate-400">Referral Code</span><span className="text-emerald-400">{referralCode}</span></div>}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Checkbox id="twoFactor" checked={enableTwoFactor} onChange={setEnableTwoFactor} label={<span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-emerald-400" />Enable Two-Factor Authentication</span>} description="Add an extra layer of security to your account" />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-700">
                      <Checkbox id="terms" checked={agreeToTerms} onChange={(checked) => { setAgreeToTerms(checked); clearError("terms") }} label={<>I agree to the <button type="button" onClick={() => setTermsModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 underline">Terms of Service</button></>} required error={errors.terms} />
                      <Checkbox id="privacy" checked={agreeToPrivacy} onChange={(checked) => { setAgreeToPrivacy(checked); clearError("privacy") }} label={<>I agree to the <button type="button" onClick={() => setPrivacyModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 underline">Privacy Policy</button></>} required error={errors.privacy} />
                      <Checkbox id="newsletter" checked={subscribeNewsletter} onChange={setSubscribeNewsletter} label="Send me product updates, tips, and exclusive offers" description="You can unsubscribe at any time" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
                  {formStep > 1 ? <button type="button" onClick={prevStep} className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white transition-colors"><ChevronRight className="h-4 w-4 rotate-180" />Back</button> : <div />}
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                    {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Creating account...</> : formStep < 3 ? <>Continue<ArrowRight className="h-5 w-5" /></> : <><Sparkles className="h-5 w-5" />Create Account</>}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-2 gap-3">
                {trustIndicators.slice(0, 2).map((indicator, index) => { const Icon = indicator.icon; return (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                    <Icon className="h-5 w-5 text-emerald-400" />
                    <div><div className="text-lg font-bold text-white">{indicator.value}</div><div className="text-xs text-slate-400">{indicator.label}</div></div>
                  </div>
                )})}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500">
                {securityFeatures.slice(0, 2).map((feature, index) => { const Icon = feature.icon; return <div key={index} className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /><span>{feature.label}</span></div> })}
              </div>
            </div>

            <div className="mt-8 lg:hidden">
              <div className="glass-effect border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-emerald-400" />Frequently Asked Questions</h3>
                <div className="space-y-1">{faqs.map((faq, index) => <FAQItem key={index} faq={faq} isOpen={openFAQ === index} onToggle={() => setOpenFAQ(openFAQ === index ? null : index)} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} title="Terms of Service">
        <div className="prose prose-invert prose-sm max-w-none"><pre className="whitespace-pre-wrap text-slate-300 text-sm font-sans leading-relaxed">{termsOfServiceContent}</pre></div>
      </Modal>

      <Modal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="prose prose-invert prose-sm max-w-none"><pre className="whitespace-pre-wrap text-slate-300 text-sm font-sans leading-relaxed">{privacyPolicyContent}</pre></div>
      </Modal>
    </div>
  )
}
