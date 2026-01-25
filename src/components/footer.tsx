'use client'

import Link from 'next/link'
import { Globe, Shield, Lock, CreditCard } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold text-white">DomainPro</span>
            </div>
            <p className="text-sm text-zinc-400">
              The modern domain platform built for businesses that demand more.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Trusted & Secure</h4>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Lock className="h-4 w-4 text-green-500" />
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>

          {/* Domains */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Domains</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-zinc-400 hover:text-white transition-colors">
                  Domain Search
                </Link>
              </li>
              <li>
                <Link href="/transfer" className="text-zinc-400 hover:text-white transition-colors">
                  Domain Transfer
                </Link>
              </li>
              <li>
                <Link href="/backorder" className="text-zinc-400 hover:text-white transition-colors">
                  Domain Backorder
                </Link>
              </li>
              <li>
                <Link href="/bulk-search" className="text-zinc-400 hover:text-white transition-colors">
                  Bulk Domain Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Hosting</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hosting/web" className="text-zinc-400 hover:text-white transition-colors">
                  Web Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting/wordpress" className="text-zinc-400 hover:text-white transition-colors">
                  WordPress Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting/vps" className="text-zinc-400 hover:text-white transition-colors">
                  VPS Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting/dedicated" className="text-zinc-400 hover:text-white transition-colors">
                  Dedicated Servers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-zinc-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-zinc-400 hover:text-white transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-zinc-400 hover:text-white transition-colors">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Payment Methods</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="h-4 w-4" />
                <span>Visa</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="h-4 w-4" />
                <span>Mastercard</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="h-4 w-4" />
                <span>American Express</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="h-4 w-4" />
                <span>PayPal</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="h-4 w-4" />
                <span>Apple Pay</span>
              </li>
            </ul>
            <p className="text-xs text-zinc-500 mt-4">
              Payments processed securely through Stripe
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-400">
              © {new Date().getFullYear()} DomainPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-zinc-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
