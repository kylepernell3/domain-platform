// ============================================================================
// DOMAIN SEARCH API ROUTE
// Generates domain suggestions based on search query
// Path: /src/app/api/domains/search/route.ts
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'

interface DomainResult {
  name: string
  tld: string
  fullDomain: string
  available: boolean
  price: number
  renewalPrice: number
  premium: boolean
  category?: string
}

const TLD_PRICING: Record<string, { register: number; renew: number; premium_multiplier: number }> = {
  'com': { register: 12.99, renew: 17.99, premium_multiplier: 1.5 },
  'net': { register: 14.99, renew: 19.99, premium_multiplier: 1.4 },
  'org': { register: 12.99, renew: 18.99, premium_multiplier: 1.3 },
  'io': { register: 39.99, renew: 49.99, premium_multiplier: 2.0 },
  'co': { register: 29.99, renew: 34.99, premium_multiplier: 1.8 },
  'ai': { register: 79.99, renew: 89.99, premium_multiplier: 3.0 },
  'app': { register: 19.99, renew: 24.99, premium_multiplier: 1.5 },
  'dev': { register: 16.99, renew: 21.99, premium_multiplier: 1.5 },
  'tech': { register: 9.99, renew: 49.99, premium_multiplier: 2.0 },
  'online': { register: 4.99, renew: 39.99, premium_multiplier: 2.5 },
  'store': { register: 4.99, renew: 54.99, premium_multiplier: 2.5 },
  'shop': { register: 4.99, renew: 39.99, premium_multiplier: 2.0 },
  'site': { register: 3.99, renew: 34.99, premium_multiplier: 2.0 },
  'xyz': { register: 2.99, renew: 14.99, premium_multiplier: 1.5 },
}

const POPULAR_TLDS = ['com', 'net', 'org', 'io', 'co', 'ai', 'app', 'dev', 'tech', 'online', 'store', 'shop', 'site', 'xyz']

function isPremiumDomain(domain: string): boolean {
  const name = domain.split('.')[0]
  if (name.length <= 3) return true
  const premiumWords = ['buy', 'sell', 'shop', 'store', 'online', 'web', 'app', 'cloud', 'tech', 'digital']
  if (premiumWords.includes(name)) return true
  if (/^\d+$/.test(name) && name.length <= 5) return true
  return false
}

function generateDomainSuggestions(query: string): DomainResult[] {
  const normalizedQuery = query.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (!normalizedQuery) return []

  const domains: DomainResult[] = []

  // Generate exact match domains for each TLD
  POPULAR_TLDS.forEach(tld => {
    const fullDomain = `${normalizedQuery}.${tld}`
    const isPremium = isPremiumDomain(fullDomain)
    const pricing = TLD_PRICING[tld] || { register: 14.99, renew: 19.99, premium_multiplier: 1.5 }
    
    domains.push({
      name: normalizedQuery,
      tld: tld,
      fullDomain: fullDomain,
      available: true, // Actual availability check would be done separately
      price: isPremium ? Math.round(pricing.register * pricing.premium_multiplier * 100) / 100 : pricing.register,
      renewalPrice: isPremium ? Math.round(pricing.renew * pricing.premium_multiplier * 100) / 100 : pricing.renew,
      premium: isPremium,
      category: 'exact'
    })
  })

  return domains
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const domains = generateDomainSuggestions(query)
    
    return NextResponse.json({
      query,
      domains,
      count: domains.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
