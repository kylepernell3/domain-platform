// ============================================================================
// DOMAIN AVAILABILITY CHECK API ROUTE
// Real domain checking via WhoisXMLAPI + RDAP fallback
// Path: /src/app/api/domain-check/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server"

interface DomainCheckResult {
  domain: string
  available: boolean
  premium: boolean
  price: number | null
  renewalPrice: number | null
  currency: string
  registrar?: string
  expirationDate?: string
  createdDate?: string
  error?: string
}

interface BulkCheckResult {
  results: DomainCheckResult[]
  timestamp: string
}

interface WhoisXMLResponse {
  DomainInfo?: { domainAvailability?: string; domainName?: string }
  ErrorMessage?: { msg?: string }
}

interface RDAPResponse {
  objectClassName?: string
  ldhName?: string
  status?: string[]
  events?: Array<{ eventAction: string; eventDate: string }>
  entities?: Array<{ roles: string[]; vcardArray?: any[] }>
}

const TLD_PRICING: Record<string, { register: number; renew: number; premium_multiplier: number }> = {
  "com": { register: 12.99, renew: 17.99, premium_multiplier: 1.5 },
  "net": { register: 14.99, renew: 19.99, premium_multiplier: 1.4 },
  "org": { register: 12.99, renew: 18.99, premium_multiplier: 1.3 },
  "io": { register: 39.99, renew: 49.99, premium_multiplier: 2.0 },
  "co": { register: 29.99, renew: 34.99, premium_multiplier: 1.8 },
  "ai": { register: 79.99, renew: 89.99, premium_multiplier: 3.0 },
  "app": { register: 19.99, renew: 24.99, premium_multiplier: 1.5 },
  "dev": { register: 16.99, renew: 21.99, premium_multiplier: 1.5 },
  "tech": { register: 9.99, renew: 49.99, premium_multiplier: 2.0 },
  "online": { register: 4.99, renew: 39.99, premium_multiplier: 2.5 },
  "store": { register: 4.99, renew: 54.99, premium_multiplier: 2.5 },
  "shop": { register: 4.99, renew: 39.99, premium_multiplier: 2.0 },
  "site": { register: 3.99, renew: 34.99, premium_multiplier: 2.0 },
  "xyz": { register: 2.99, renew: 14.99, premium_multiplier: 1.5 },
  "info": { register: 4.99, renew: 24.99, premium_multiplier: 1.5 },
  "biz": { register: 9.99, renew: 19.99, premium_multiplier: 1.4 },
  "me": { register: 9.99, renew: 24.99, premium_multiplier: 1.6 },
  "us": { register: 9.99, renew: 14.99, premium_multiplier: 1.3 },
  "uk": { register: 8.99, renew: 12.99, premium_multiplier: 1.3 },
  "ca": { register: 14.99, renew: 19.99, premium_multiplier: 1.4 },
  "de": { register: 9.99, renew: 14.99, premium_multiplier: 1.3 },
  "cloud": { register: 12.99, renew: 24.99, premium_multiplier: 1.8 },
  "agency": { register: 24.99, renew: 29.99, premium_multiplier: 1.5 },
  "studio": { register: 29.99, renew: 34.99, premium_multiplier: 1.6 },
  "design": { register: 39.99, renew: 49.99, premium_multiplier: 2.0 },
  "digital": { register: 9.99, renew: 39.99, premium_multiplier: 2.0 },
  "media": { register: 14.99, renew: 39.99, premium_multiplier: 1.8 },
  "marketing": { register: 14.99, renew: 39.99, premium_multiplier: 1.8 },
  "solutions": { register: 12.99, renew: 29.99, premium_multiplier: 1.6 },
  "services": { register: 14.99, renew: 39.99, premium_multiplier: 1.7 },
  "group": { register: 19.99, renew: 24.99, premium_multiplier: 1.5 },
  "team": { register: 19.99, renew: 34.99, premium_multiplier: 1.6 },
  "world": { register: 4.99, renew: 34.99, premium_multiplier: 2.0 },
  "life": { register: 4.99, renew: 34.99, premium_multiplier: 2.0 },
  "live": { register: 9.99, renew: 29.99, premium_multiplier: 1.8 },
  "blog": { register: 4.99, renew: 34.99, premium_multiplier: 2.0 },
  "space": { register: 2.99, renew: 24.99, premium_multiplier: 2.0 },
}

const RDAP_SERVERS: Record<string, string> = {
  "com": "https://rdap.verisign.com/com/v1/domain/",
  "net": "https://rdap.verisign.com/net/v1/domain/",
  "org": "https://rdap.publicinterestregistry.org/rdap/domain/",
  "io": "https://rdap.nic.io/domain/",
  "co": "https://rdap.nic.co/domain/",
  "app": "https://rdap.nic.google/domain/",
  "dev": "https://rdap.nic.google/domain/",
  "me": "https://rdap.nic.me/domain/",
  "info": "https://rdap.afilias.net/rdap/info/domain/",
}

function extractTLD(domain: string): string {
  const parts = domain.toLowerCase().split(".")
  return parts.length >= 2 ? parts[parts.length - 1] : "com"
}

function normalizeDomain(input: string): string {
  return input.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/i, "").split("/")[0].replace(/\s/g, "")
}

function isPremiumDomain(domain: string): boolean {
  const name = domain.split(".")[0]
  if (name.length <= 3) return true
  const premiumWords = ["buy", "sell", "shop", "store", "online", "web", "app", "cloud", "tech", "digital", "best", "top", "pro", "premium", "gold", "luxury", "vip", "car", "home", "health", "money", "bank", "finance", "game", "travel"]
  if (premiumWords.includes(name)) return true
  if (/^\d+$/.test(name) && name.length <= 5) return true
  return false
}

function getPrice(tld: string, isPremium: boolean): { register: number; renew: number } {
  const pricing = TLD_PRICING[tld] || { register: 14.99, renew: 19.99, premium_multiplier: 1.5 }
  if (isPremium) return { register: Math.round(pricing.register * pricing.premium_multiplier * 100) / 100, renew: Math.round(pricing.renew * pricing.premium_multiplier * 100) / 100 }
  return { register: pricing.register, renew: pricing.renew }
}

async function checkViaWhoisXML(domain: string, apiKey: string): Promise<DomainCheckResult | null> {
  try {
    const response = await fetch(`https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}&credits=DA`, { headers: { "Accept": "application/json" }, next: { revalidate: 60 } })
    if (!response.ok) return null
    const data: WhoisXMLResponse = await response.json()
    if (data.ErrorMessage?.msg) return null
    const isAvailable = data.DomainInfo?.domainAvailability === "AVAILABLE"
    const tld = extractTLD(domain)
    const premium = isPremiumDomain(domain)
    const pricing = getPrice(tld, premium)
    return { domain, available: isAvailable, premium: premium && isAvailable, price: isAvailable ? pricing.register : null, renewalPrice: isAvailable ? pricing.renew : null, currency: "USD" }
  } catch { return null }
}

async function checkViaRDAP(domain: string): Promise<DomainCheckResult | null> {
  const tld = extractTLD(domain)
  const rdapServer = RDAP_SERVERS[tld]
  if (!rdapServer) return null
  try {
    const response = await fetch(`${rdapServer}${domain}`, { headers: { "Accept": "application/rdap+json" }, next: { revalidate: 60 } })
    const premium = isPremiumDomain(domain)
    const pricing = getPrice(tld, premium)
    if (response.status === 404) return { domain, available: true, premium, price: pricing.register, renewalPrice: pricing.renew, currency: "USD" }
    if (!response.ok) return null
    const data: RDAPResponse = await response.json()
    let expirationDate: string | undefined, createdDate: string | undefined
    data.events?.forEach(e => { if (e.eventAction === "expiration") expirationDate = e.eventDate; if (e.eventAction === "registration") createdDate = e.eventDate })
    return { domain, available: false, premium: false, price: null, renewalPrice: null, currency: "USD", expirationDate, createdDate }
  } catch { return null }
}


async function checkDomainAvailability(domain: string): Promise<DomainCheckResult> {
  const normalizedDomain = normalizeDomain(domain)
  const tld = extractTLD(normalizedDomain)
  const whoisApiKey = process.env.WHOISXML_API_KEY
  if (whoisApiKey) { const result = await checkViaWhoisXML(normalizedDomain, whoisApiKey); if (result) return result }
  const rdapResult = await checkViaRDAP(normalizedDomain)
  if (rdapResult) return rdapResult
    // DNS fallback removed - it was unreliable and gave false "available" results
  return { domain: normalizedDomain, available: false, premium: false, price: null, renewalPrice: null, currency: "USD", error: "Unable to verify availability - please try again or add WhoisXML API key" }}

export async function GET(request: NextRequest) {
  const domain = new URL(request.url).searchParams.get("domain")
  if (!domain) return NextResponse.json({ error: "Domain parameter required" }, { status: 400 })
  try {
    const result = await checkDomainAvailability(domain)
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=60" } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to check domain" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json() as { domains: string[] }
    if (!domains?.length) return NextResponse.json({ error: "Domains array required" }, { status: 400 })
    if (domains.length > 20) return NextResponse.json({ error: "Max 20 domains" }, { status: 400 })
    const results = await Promise.all(domains.map(checkDomainAvailability))
    return NextResponse.json({ results, timestamp: new Date().toISOString() } as BulkCheckResult)
  } catch { return NextResponse.json({ error: "Failed to check domains" }, { status: 500 }) }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST", "Access-Control-Allow-Headers": "Content-Type" } })
}
