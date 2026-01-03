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

import { Suspense } from "react"
import { LoginPageContent } from "./LoginPageContent"

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
