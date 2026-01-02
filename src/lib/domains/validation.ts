/**
 * Domain Validation Utilities
 * Functions to validate and sanitize domain names
 */

export function sanitizeDomainName(domain: string): string {
  // Remove whitespace and convert to lowercase
  let clean = domain.trim().toLowerCase()
  
  // Remove protocol if present
  clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '')
  
  // Remove trailing slash
  clean = clean.replace(/\/$/, '')
  
  // Remove existing TLD if present
  clean = clean.replace(/\.(com|net|org|io|co|dev|app|ai|xyz)$/i, '')
  
  // Replace spaces and underscores with hyphens
  clean = clean.replace(/[\s_]+/g, '-')
  
  // Remove invalid characters
  clean = clean.replace(/[^a-z0-9-]/g, '')
  
  // Remove consecutive hyphens
  clean = clean.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  clean = clean.replace(/^-+|-+$/g, '')
  
  return clean
}

export function isValidDomainName(domain: string): boolean {
  // Domain must be 1-63 characters
  if (domain.length < 1 || domain.length > 63) {
    return false
  }
  
  // Must start and end with alphanumeric
  if (!/^[a-z0-9]/.test(domain) || !/[a-z0-9]$/.test(domain)) {
    return false
  }
  
  // Can only contain alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(domain)) {
    return false
  }
  
  // Cannot have consecutive hyphens
  if (/--/.test(domain)) {
    return false
  }
  
  return true
}

export function generateDomainSuggestions(baseDomain: string): string[] {
  const suggestions = [
    baseDomain,
    `get${baseDomain}`,
    `my${baseDomain}`,
    `${baseDomain}app`,
    `${baseDomain}hq`,
    `${baseDomain}pro`,
    `${baseDomain}hub`,
    `${baseDomain}io`,
    `try${baseDomain}`,
    `${baseDomain}site`,
  ]
  
  return suggestions.filter(s => isValidDomainName(s))
}
