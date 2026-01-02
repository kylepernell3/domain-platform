"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, Check, X, Sparkles, ArrowRight, Loader2, TrendingUp } from 'lucide-react'
import { DomainSearchResponse, DomainSearchResult } from '@/types/domain'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q')
  
  const [searchResults, setSearchResults] = useState<DomainSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!query) {
      router.push('/')
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/domains/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Failed to search domains')
        }
        
        const data: DomainSearchResponse = await response.json()
        setSearchResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search domains')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, router])

  const toggleDomain = (domain: string) => {
    const newSelected = new Set(selectedDomains)
    if (newSelected.has(domain)) {
      newSelected.delete(domain)
    } else {
      newSelected.add(domain)
    }
    setSelectedDomains(newSelected)
  }

  const getTotalPrice = () => {
    if (!searchResults) return 0
    
    const allDomains = [...searchResults.results, ...searchResults.suggestions]
    return Array.from(selectedDomains).reduce((total, domainName) => {
      const domain = allDomains.find(d => d.domain === domainName)
      return total + (domain?.price || 0)
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Searching for &quot;{query}&quot;...</p>
        </div>
      </div>
    )
  }

  if (error || !searchResults) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Search Failed</h1>
          <p className="text-neutral-400 mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const available = searchResults.results.filter(r => r.available && !r.premium)
  const premium = searchResults.results.filter(r => r.premium)
  const taken = searchResults.results.filter(r => !r.available)

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">DomainPro</span>
            </Link>
            
            {selectedDomains.size > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-400">
                  {selectedDomains.size} domain{selectedDomains.size !== 1 ? 's' : ''} selected
                  <span className="text-white font-semibold ml-2">
                    ${getTotalPrice().toFixed(2)}/yr
                  </span>
                </div>
                <button className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Results for &quot;{searchResults.query}&quot;
          </h1>
          <p className="text-neutral-400">
            Found {available.length} available domain{available.length !== 1 ? 's' : ''}
          </p>
        </div>

        {available.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              Available Domains
            </h2>
            <div className="grid gap-3">
              {available.map((domain) => (
                <DomainCard
                  key={domain.domain}
                  domain={domain}
                  selected={selectedDomains.has(domain.domain)}
                  onToggle={() => toggleDomain(domain.domain)}
                />
              ))}
            </div>
          </div>
        )}

        {premium.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Premium Domains
            </h2>
            <div className="grid gap-3">
              {premium.map((domain) => (
                <DomainCard
                  key={domain.domain}
                  domain={domain}
                  selected={selectedDomains.has(domain.domain)}
                  onToggle={() => toggleDomain(domain.domain)}
                />
              ))}
            </div>
          </div>
        )}

        {searchResults.suggestions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Suggested Alternatives
            </h2>
            <div className="grid gap-3">
              {searchResults.suggestions.map((domain) => (
                <DomainCard
                  key={domain.domain}
                  domain={domain}
                  selected={selectedDomains.has(domain.domain)}
                  onToggle={() => toggleDomain(domain.domain)}
                />
              ))}
            </div>
          </div>
        )}

        {taken.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <X className="h-5 w-5 text-red-400" />
              Unavailable Domains
            </h2>
            <div className="grid gap-3">
              {taken.map((domain) => (
                <div
                  key={domain.domain}
                  className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <X className="h-5 w-5 text-red-400" />
                      <span className="text-lg font-semibold text-neutral-500">
                        {domain.domain}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-600">Taken</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DomainCard({
  domain,
  selected,
  onToggle,
}: {
  domain: DomainSearchResult
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? 'bg-red-500/10 border-red-500'
          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
              selected
                ? 'bg-red-500 border-red-500'
                : 'border-neutral-700'
            }`}
          >
            {selected && <Check className="h-4 w-4 text-white" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white">
                {domain.domain}
              </span>
              {domain.premium && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-xs font-medium text-yellow-400">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${domain.price.toFixed(2)}
            </div>
            <div className="text-sm text-neutral-500">/year</div>
          </div>
          
          {domain.available && (
            <div className="flex items-center gap-1 text-emerald-400">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Available</span>
            </div>
          )}
        </div>
      </div>

      {domain.premium && (
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-2 text-sm text-neutral-400">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Premium domain - Short, memorable, and highly sought after
        </div>
      )}
    </button>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
