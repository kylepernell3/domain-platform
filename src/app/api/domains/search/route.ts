import { NextRequest, NextResponse } from 'next/server'
import { sanitizeDomainName, isValidDomainName, generateDomainSuggestions } from '@/lib/domains/validation'
import { searchDomains, POPULAR_TLDS } from '@/lib/domains/api'
import { DomainSearchResponse } from '@/types/domain'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }
    
    // Sanitize the domain name
    const sanitized = sanitizeDomainName(query)
    
    if (!isValidDomainName(sanitized)) {
      return NextResponse.json(
        { error: 'Invalid domain name. Use only letters, numbers, and hyphens.' },
        { status: 400 }
      )
    }
    
    // Get TLDs from query or use popular ones
    const tldParam = searchParams.get('tlds')
    const tlds = tldParam 
      ? tldParam.split(',').map(t => t.startsWith('.') ? t : `.${t}`)
      : POPULAR_TLDS.filter(t => t.popular).map(t => t.extension)
    
    // Search for the main domain
    const results = await searchDomains(sanitized, tlds)
    
    // Generate suggestions
    const suggestionNames = generateDomainSuggestions(sanitized)
    const suggestionResults = await Promise.all(
      suggestionNames.slice(0, 5).map(name => 
        searchDomains(name, ['.com', '.io'])
      )
    )
    const suggestions = suggestionResults.flat().filter(r => r.available)
    
    const response: DomainSearchResponse = {
      query: sanitized,
      results,
      suggestions: suggestions.slice(0, 10),
      timestamp: Date.now(),
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: 'Failed to search domains' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, tlds } = body
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    const sanitized = sanitizeDomainName(query)
    
    if (!isValidDomainName(sanitized)) {
      return NextResponse.json(
        { error: 'Invalid domain name' },
        { status: 400 }
      )
    }
    
    const searchTlds = tlds || POPULAR_TLDS.filter(t => t.popular).map(t => t.extension)
    const results = await searchDomains(sanitized, searchTlds)
    
    const suggestionNames = generateDomainSuggestions(sanitized)
    const suggestionResults = await Promise.all(
      suggestionNames.slice(0, 5).map(name => 
        searchDomains(name, ['.com', '.io'])
      )
    )
    const suggestions = suggestionResults.flat().filter(r => r.available)
    
    const response: DomainSearchResponse = {
      query: sanitized,
      results,
      suggestions: suggestions.slice(0, 10),
      timestamp: Date.now(),
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: 'Failed to search domains' },
      { status: 500 }
    )
  }
}
