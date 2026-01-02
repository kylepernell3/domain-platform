/**
 * Domain Types
 * Type definitions for domain-related data structures
 */

export interface DomainSearchResult {
  domain: string
  available: boolean
  price: number
  tld: string
  premium: boolean
  registrar?: string
}

export interface DomainTLD {
  extension: string
  price: number
  popular: boolean
  description?: string
}

export interface DomainSearchRequest {
  query: string
  tlds?: string[]
}

export interface DomainSearchResponse {
  query: string
  results: DomainSearchResult[]
  suggestions: DomainSearchResult[]
  timestamp: number
}
