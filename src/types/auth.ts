/**
 * DomainPro Authentication Types
 * 
 * Type definitions for the authentication system
 */

import { User as SupabaseUser } from '@supabase/supabase-js'

// Extended User type with profile data
export interface User extends SupabaseUser {
  profile?: UserProfile
}

// User profile stored in the profiles table
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: UserPlan
  created_at: string
  updated_at: string
}

// Available subscription plans
export type UserPlan = 'free' | 'starter' | 'professional' | 'enterprise'

// Plan features configuration
export interface PlanFeatures {
  maxDomains: number
  maxSSLCertificates: number
  maxStorage: string // e.g., "500MB", "10GB", "Unlimited"
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
  features: string[]
}

// Plan configuration
export const planConfig: Record<UserPlan, PlanFeatures> = {
  free: {
    maxDomains: 1,
    maxSSLCertificates: 1,
    maxStorage: '500MB',
    supportLevel: 'community',
    features: [
      'Free subdomain',
      '1 Page website',
      'Basic SSL Certificate',
      'Community support',
    ],
  },
  starter: {
    maxDomains: 1,
    maxSSLCertificates: 2,
    maxStorage: '10GB',
    supportLevel: 'email',
    features: [
      '1 Custom domain',
      '2 SSL Certificates',
      '10GB Storage',
      'Email support',
      'No branding',
    ],
  },
  professional: {
    maxDomains: 20,
    maxSSLCertificates: 10,
    maxStorage: '100GB',
    supportLevel: 'priority',
    features: [
      '20 Domains included',
      '10 FREE SSL Certificates',
      '100GB Storage',
      'Priority 24/7 Support',
      'Full Analytics Dashboard',
      'API Access',
    ],
  },
  enterprise: {
    maxDomains: Infinity,
    maxSSLCertificates: Infinity,
    maxStorage: 'Unlimited',
    supportLevel: 'dedicated',
    features: [
      'Unlimited Domains',
      'Unlimited SSL Certificates',
      'Unlimited Storage',
      'Dedicated Account Manager',
      'White-label Solutions',
      'SLA Guarantee',
    ],
  },
}

// Domain types
export interface Domain {
  id: string
  user_id: string
  domain_name: string
  status: DomainStatus
  expires_at: string
  created_at: string
}

export type DomainStatus = 'active' | 'pending' | 'expired'

// SSL Certificate types
export interface SSLCertificate {
  id: string
  user_id: string
  domain_id: string
  status: SSLStatus
  issued_at: string
  expires_at: string
}

export type SSLStatus = 'active' | 'pending' | 'expired'

// Activity log types
export interface ActivityLog {
  id: string
  user_id: string
  type: ActivityType
  title: string
  description: string
  status: ActivityStatus
  created_at: string
}

export type ActivityType = 'domain' | 'ssl' | 'settings' | 'billing' | 'auth'
export type ActivityStatus = 'success' | 'pending' | 'warning' | 'error'

// Auth state for context
export interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Auth context actions
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updatePassword: (password: string) => Promise<{ error?: string }>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error?: string }>
}

// Combined auth context type
export interface AuthContextType extends AuthState, AuthActions {}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}
