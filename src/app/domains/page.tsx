import { redirect } from 'next/navigation'

export default function DomainsPage({
  searchParams,
  }: {
    searchParams: { q?: string }
  }) {
  // Redirect /domains to /search with query params
  const query = searchParams.q || ''
  redirect(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
}
