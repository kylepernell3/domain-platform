'use client'

/**
 * Checkout Page
 * 
 * A secure, professional checkout experience for domain purchases.
 * Features: authentication protection, order summary, payment processing,
 * billing information, and trust/security indicators.
 * 
 * Tech Stack: Next.js 14+, TypeScript, Tailwind CSS, Supabase, Lucide React
 */

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  Shield,
  Lock,
  CreditCard,
  Globe,
  Check,
  ChevronRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  RefreshCw,
  X,
  Trash2,
  Tag,
  Receipt,
  Building2,
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Info,
} from 'lucide-react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Cart item representing a domain to purchase */
interface CartItem {
  id: string
  domain_name: string
  price: number
  period: number // years
  type: 'registration' | 'renewal' | 'transfer'
}

/** Billing information form data */
interface BillingInfo {
  firstName: string
  lastName: string
  email: string
  company: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

/** Payment information form data */
interface PaymentInfo {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

/** Form validation errors */
interface FormErrors {
  billing: Partial<Record<keyof BillingInfo, string>>
  payment: Partial<Record<keyof PaymentInfo, string>>
}

// ============================================================================
// SUPABASE CLIENT INITIALIZATION
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format price for display
 */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format card number with spaces
 */
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ').substring(0, 19) : ''
}

/**
 * Format expiry date as MM/YY
 */
function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
  }
  return cleaned
}

/**
 * Get card type icon based on number
 */
function getCardType(number: string): string {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.startsWith('4')) return 'visa'
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard'
  if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'amex'
  if (cleaned.startsWith('6')) return 'discover'
  return 'generic'
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate card number using Luhn algorithm
 */
function isValidCardNumber(number: string): boolean {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length < 13 || cleaned.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Loading skeleton for checkout page
 */
function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-32 bg-zinc-800 rounded mb-4" />
          <div className="h-10 w-64 bg-zinc-800 rounded" />
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse" />
            <div className="h-96 bg-zinc-800/50 rounded-xl animate-pulse" />
          </div>
          <div className="lg:col-span-2">
            <div className="h-80 bg-zinc-800/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Security badge component
 */
function SecurityBadge({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType
  title: string
  description: string 
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30">
      <div className="p-2 rounded-lg bg-emerald-500/10">
        <Icon className="w-4 h-4 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  )
}

/**
 * Form input component with validation
 */
function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  maxLength,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  icon?: React.ElementType
  required?: boolean
  maxLength?: number
  autoComplete?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-zinc-800/50 border
            text-white placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500/50 focus:ring-red-500/50' 
              : 'border-zinc-700/50 hover:border-zinc-600'
            }
          `}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Form select component
 */
function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-zinc-800/50 border
          text-white
          focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent
          transition-all duration-200
          ${error 
            ? 'border-red-500/50' 
            : 'border-zinc-700/50 hover:border-zinc-600'
          }
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-zinc-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

/**
 * Cart item component
 */
function CartItemRow({ 
  item, 
  onRemove 
}: { 
  item: CartItem
  onRemove: () => void 
}) {
  const typeLabels = {
    registration: 'New Registration',
    renewal: 'Renewal',
    transfer: 'Transfer',
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/10">
          <Globe className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <p className="font-medium text-white">{item.domain_name}</p>
          <p className="text-sm text-zinc-500">
            {typeLabels[item.type]} • {item.period} year{item.period > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium text-white">{formatPrice(item.price)}</span>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          aria-label={`Remove ${item.domain_name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/**
 * Card brand logos
 */
function CardBrandLogos() {
  return (
    <div className="flex items-center gap-2">
      {/* Visa */}
      <div className="w-10 h-6 rounded bg-white flex items-center justify-center">
        <span className="text-[10px] font-bold text-blue-900 italic">VISA</span>
      </div>
      {/* Mastercard */}
      <div className="w-10 h-6 rounded bg-zinc-800 flex items-center justify-center">
        <div className="flex -space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
        </div>
      </div>
      {/* Amex */}
      <div className="w-10 h-6 rounded bg-blue-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">AMEX</span>
      </div>
      {/* Discover */}
      <div className="w-10 h-6 rounded bg-orange-500 flex items-center justify-center">
        <span className="text-[7px] font-bold text-white">DISCOVER</span>
      </div>
    </div>
  )
}

/**
 * Promo code input component
 */
function PromoCodeInput({
  value,
  onChange,
  onApply,
  isApplied,
  isLoading,
  discount,
}: {
  value: string
  onChange: (value: string) => void
  onApply: () => void
  isApplied: boolean
  isLoading: boolean
  discount: number
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Promo Code
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="Enter code"
            disabled={isApplied}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg
              bg-zinc-800/50 border border-zinc-700/50
              text-white placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent
              transition-all duration-200
              disabled:opacity-50
            `}
          />
          {isApplied && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          )}
        </div>
        <button
          onClick={onApply}
          disabled={!value || isApplied || isLoading}
          className={`
            px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isApplied 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isApplied ? (
            'Applied'
          ) : (
            'Apply'
          )}
        </button>
      </div>
      {isApplied && discount > 0 && (
        <p className="text-sm text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          You saved {formatPrice(discount)}!
        </p>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------
  
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  // Promo code state
  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  
  // Billing information
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  })
  
  // Payment information
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })
  
  // Form errors
  const [errors, setErrors] = useState<FormErrors>({
    billing: {},
    payment: {},
  })
  
  // Accept terms
  const [acceptTerms, setAcceptTerms] = useState(false)

  // -------------------------------------------------------------------------
  // COMPUTED VALUES
  // -------------------------------------------------------------------------

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.0 // No tax for domains typically
  const total = subtotal - promoDiscount + tax

  // -------------------------------------------------------------------------
  // DATA FETCHING
  // -------------------------------------------------------------------------

  /**
   * Check authentication and load cart
   */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check authentication status
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        throw new Error('Authentication failed. Please try again.')
      }

      if (!session) {
        router.push('/login?redirect=/checkout')
        return
      }

      setIsAuthenticated(true)
      setUserEmail(session.user.email || '')
      setBillingInfo(prev => ({
        ...prev,
        email: session.user.email || '',
      }))

      // Parse domains from URL params or fetch from cart
      const domainsParam = searchParams.get('domains')
      
      if (domainsParam) {
        // Parse domains from URL (format: domain1.com,domain2.com)
        const domainNames = domainsParam.split(',').filter(Boolean)
        const items: CartItem[] = domainNames.map((name, index) => ({
          id: `cart-${index}`,
          domain_name: name.trim(),
          price: 12.99, // Default price, would fetch from API
          period: 1,
          type: 'registration' as const,
        }))
        setCartItems(items)
      } else {
        // Fetch cart from database/session
        const { data: cartData, error: cartError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', session.user.id)

        if (cartError) {
          console.error('Failed to fetch cart:', cartError)
        }

        if (cartData && cartData.length > 0) {
          setCartItems(cartData as CartItem[])
        } else {
          // Demo items if no cart
          setCartItems([
            {
              id: 'demo-1',
              domain_name: 'example-domain.com',
              price: 12.99,
              period: 1,
              type: 'registration',
            },
          ])
        }
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [router, searchParams])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------

  /**
   * Handle billing info change
   */
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBillingInfo(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors.billing[name as keyof BillingInfo]) {
      setErrors(prev => ({
        ...prev,
        billing: { ...prev.billing, [name]: undefined },
      }))
    }
  }

  /**
   * Handle payment info change with formatting
   */
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4)
    }

    setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }))
    // Clear error when user types
    if (errors.payment[name as keyof PaymentInfo]) {
      setErrors(prev => ({
        ...prev,
        payment: { ...prev.payment, [name]: undefined },
      }))
    }
  }

  /**
   * Remove item from cart
   */
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  /**
   * Apply promo code
   */
  const handleApplyPromo = async () => {
    if (!promoCode || isPromoApplied) return

    setIsApplyingPromo(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo: SAVE10 gives 10% off
    if (promoCode === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1)
      setIsPromoApplied(true)
    } else if (promoCode === 'WELCOME') {
      setPromoDiscount(5)
      setIsPromoApplied(true)
    }
    
    setIsApplyingPromo(false)
  }

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = { billing: {}, payment: {} }
    let isValid = true

    // Billing validation
    if (!billingInfo.firstName.trim()) {
      newErrors.billing.firstName = 'First name is required'
      isValid = false
    }
    if (!billingInfo.lastName.trim()) {
      newErrors.billing.lastName = 'Last name is required'
      isValid = false
    }
    if (!billingInfo.email.trim()) {
      newErrors.billing.email = 'Email is required'
      isValid = false
    } else if (!isValidEmail(billingInfo.email)) {
      newErrors.billing.email = 'Invalid email format'
      isValid = false
    }
    if (!billingInfo.address.trim()) {
      newErrors.billing.address = 'Address is required'
      isValid = false
    }
    if (!billingInfo.city.trim()) {
      newErrors.billing.city = 'City is required'
      isValid = false
    }
    if (!billingInfo.zipCode.trim()) {
      newErrors.billing.zipCode = 'ZIP code is required'
      isValid = false
    }

    // Payment validation
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.payment.cardNumber = 'Card number is required'
      isValid = false
    } else if (!isValidCardNumber(paymentInfo.cardNumber)) {
      newErrors.payment.cardNumber = 'Invalid card number'
      isValid = false
    }
    if (!paymentInfo.cardHolder.trim()) {
      newErrors.payment.cardHolder = 'Cardholder name is required'
      isValid = false
    }
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.payment.expiryDate = 'Expiry date is required'
      isValid = false
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.payment.expiryDate = 'Use MM/YY format'
      isValid = false
    }
    if (!paymentInfo.cvv.trim()) {
      newErrors.payment.cvv = 'CVV is required'
      isValid = false
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.payment.cvv = 'Invalid CVV'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    if (!validateForm()) {
      setError('Please correct the errors above')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In production, you would:
      // 1. Create Stripe payment intent
      // 2. Confirm payment
      // 3. Create order in database
      // 4. Register domains
      // 5. Send confirmation email

      // Redirect to success page
      router.push('/checkout/success?order=' + Date.now())

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  // Loading state
  if (isLoading) {
    return <CheckoutSkeleton />
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full mb-6 bg-zinc-800/50 border border-zinc-700 flex items-center justify-center">
              <Receipt className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-zinc-400 mb-6 max-w-md">
              Search for your perfect domain name and add it to your cart to get started.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
            >
              <Globe className="w-4 h-4" />
              Search Domains
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'OTHER', label: 'Other' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      {/* Decorative pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/domains"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Domains
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
              <p className="text-zinc-400">Complete your domain purchase</p>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Billing Information */}
              <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Building2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Billing Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    name="firstName"
                    value={billingInfo.firstName}
                    onChange={handleBillingChange}
                    placeholder="John"
                    error={errors.billing.firstName}
                    icon={User}
                    required
                    autoComplete="given-name"
                  />
                  <FormInput
                    label="Last Name"
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={handleBillingChange}
                    placeholder="Doe"
                    error={errors.billing.lastName}
                    icon={User}
                    required
                    autoComplete="family-name"
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={handleBillingChange}
                    placeholder="john@example.com"
                    error={errors.billing.email}
                    icon={Mail}
                    required
                    autoComplete="email"
                  />
                  <FormInput
                    label="Company (Optional)"
                    name="company"
                    value={billingInfo.company}
                    onChange={handleBillingChange}
                    placeholder="Company name"
                    icon={Building2}
                    autoComplete="organization"
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Address"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingChange}
                      placeholder="123 Main Street"
                      error={errors.billing.address}
                      icon={MapPin}
                      required
                      autoComplete="street-address"
                    />
                  </div>
                  <FormInput
                    label="City"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleBillingChange}
                    placeholder="New York"
                    error={errors.billing.city}
                    required
                    autoComplete="address-level2"
                  />
                  <FormInput
                    label="State / Province"
                    name="state"
                    value={billingInfo.state}
                    onChange={handleBillingChange}
                    placeholder="NY"
                    autoComplete="address-level1"
                  />
                  <FormInput
                    label="ZIP / Postal Code"
                    name="zipCode"
                    value={billingInfo.zipCode}
                    onChange={handleBillingChange}
                    placeholder="10001"
                    error={errors.billing.zipCode}
                    required
                    autoComplete="postal-code"
                  />
                  <FormSelect
                    label="Country"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingChange}
                    options={countryOptions}
                    required
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Phone (Optional)"
                      name="phone"
                      type="tel"
                      value={billingInfo.phone}
                      onChange={handleBillingChange}
                      placeholder="+1 (555) 000-0000"
                      icon={Phone}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      <CreditCard className="w-5 h-5 text-zinc-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Payment Method</h2>
                  </div>
                  <CardBrandLogos />
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="Card Number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    error={errors.payment.cardNumber}
                    icon={CreditCard}
                    required
                    maxLength={19}
                    autoComplete="cc-number"
                  />
                  <FormInput
                    label="Cardholder Name"
                    name="cardHolder"
                    value={paymentInfo.cardHolder}
                    onChange={handlePaymentChange}
                    placeholder="JOHN DOE"
                    error={errors.payment.cardHolder}
                    icon={User}
                    required
                    autoComplete="cc-name"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      error={errors.payment.expiryDate}
                      icon={Calendar}
                      required
                      maxLength={5}
                      autoComplete="cc-exp"
                    />
                    <FormInput
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="•••"
                      error={errors.payment.cvv}
                      icon={Lock}
                      required
                      maxLength={4}
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>

                {/* SSL/Security Notice */}
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-emerald-400">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </section>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    transition-all duration-200
                    ${acceptTerms 
                      ? 'bg-red-500 border-red-500' 
                      : 'border-zinc-600 hover:border-zinc-500 bg-zinc-800/50'
                    }
                  `}
                >
                  {acceptTerms && <Check className="w-3 h-3 text-white" />}
                </button>
                <label className="text-sm text-zinc-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-red-400 hover:text-red-300 underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">
                    Privacy Policy
                  </Link>
                  . I understand that domain registrations are non-refundable.
                </label>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-6">
                {/* Order Summary Card */}
                <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-zinc-400" />
                      Order Summary
                    </h2>
                  </div>

                  {/* Cart Items */}
                  <div className="p-6 border-b border-zinc-800">
                    {cartItems.map(item => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="p-6 border-b border-zinc-800">
                    <PromoCodeInput
                      value={promoCode}
                      onChange={setPromoCode}
                      onApply={handleApplyPromo}
                      isApplied={isPromoApplied}
                      isLoading={isApplyingPromo}
                      discount={promoDiscount}
                    />
                  </div>

                  {/* Totals */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400">Discount</span>
                        <span className="text-emerald-400">-{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Tax</span>
                      <span className="text-white">{formatPrice(tax)}</span>
                    </div>
                    <div className="pt-3 border-t border-zinc-800 flex justify-between">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-white">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="p-6 pt-0">
                    <button
                      type="submit"
                      disabled={isProcessing || cartItems.length === 0}
                      className="
                        w-full flex items-center justify-center gap-2 px-6 py-4
                        rounded-lg font-semibold text-lg
                        bg-red-500 text-white
                        hover:bg-red-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        shadow-lg shadow-red-500/20
                      "
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay {formatPrice(total)}
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Security Badges */}
                <section className="space-y-3">
                  <SecurityBadge
                    icon={ShieldCheck}
                    title="SSL Encrypted"
                    description="256-bit SSL encryption"
                  />
                  <SecurityBadge
                    icon={BadgeCheck}
                    title="PCI Compliant"
                    description="Secure payment processing"
                  />
                  <SecurityBadge
                    icon={Shield}
                    title="Money-Back Guarantee"
                    description="30-day satisfaction guarantee"
                  />
                </section>

                {/* Support Info */}
                <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-zinc-400">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@example.com" className="text-red-400 hover:text-red-300">
                          support@example.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
            <p className="text-zinc-400">Please wait while we securely process your payment...</p>
          </div>
        </div>
      )}
    </div>
  )
}
export default function CheckoutPage() { return <Suspense fallback={null}><CheckoutContent /></Suspense>; }
tail -n 1 src/app/checkout/page.tsx

git add src/app/checkout/page.tsx && git commit -m "Fix syntax error in Suspense wrapper" && git push

git log -n 3


vercel list

