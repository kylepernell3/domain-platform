/**
 * Domain API Utilities
 * Functions to interact with domain availability APIs
 */

import { DomainSearchResult, DomainTLD } from '@/types/domain'

// Popular TLDs with pricing
export const POPULAR_TLDS: DomainTLD[] = [
  { extension: '.com', price: 8.99, popular: true, description: 'Most popular' },
  { extension: '.io', price: 29.99, popular: true, description: 'Tech startups' },
  { extension: '.co', price: 14.99, popular: true, description: 'Company' },
  { extension: '.dev', price: 12.99, popular: true, description: 'Developers' },
  { extension: '.net', price: 10.99, popular: false, description: 'Network' },
  { extension: '.org', price: 9.99, popular: false, description: 'Organization' },
  { extension: '.app', price: 12.99, popular: true, description: 'Applications' },
  { extension: '.ai', price: 49.99, popular: true, description: 'Artificial Intelligence' },
  { extension: '.xyz', price: 6.99, popular: false, description: 'General purpose' },
  { extension: '.tech', price: 14.99, popular: false, description: 'Technology' },
]

/**
 * Mock domain availability check
 * In production, this would call GoDaddy API, Namecheap API, or similar
 */
export async function checkDomainAvailability(
  domain: string,
  tld: string
): Promise<DomainSearchResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
  
  const fullDomain = `${domain}${tld}`
  
  // Mock logic: shorter domains are more likely to be taken
  const isShort = domain.length <= 6
  const isCommon = ['app', 'web', 'site', 'online', 'store', 'shop'].includes(domain)
  
  // Calculate availability (mock)
  let available = true
  if (tld === '.com' && (isShort || isCommon)) {
    available = Math.random() > 0.7
  } else if (isShort) {
    available = Math.random() > 0.5
  } else {
    available = Math.random() > 0.3
  }
  
  // Determine if premium
  const isPremium = !available && Math.random() > 0.7
  
  // Get price
  const tldData = POPULAR_TLDS.find(t => t.extension === tld)
  const basePrice = tldData?.price || 9.99
  const price = isPremium ? basePrice * 10 : basePrice
  
  return {
    domain: fullDomain,
    available: available || isPremium,
    price,
    tld,
    premium: isPremium,
    registrar: 'DomainPro',
  }
}

/**
 * Search for domain availability across multiple TLDs
 */
export async function searchDomains(
  domainName: string,
  tlds: string[] = POPULAR_TLDS.map(t => t.extension)
): Promise<DomainSearchResult[]> {
  const results = await Promise.all(
    tlds.map(tld => checkDomainAvailability(domainName, tld))
  )
  
  return results
}
