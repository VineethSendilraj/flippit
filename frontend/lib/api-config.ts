/**
 * Get the appropriate backend API URL based on the current environment
 * Uses localhost for development, Vercel backend for production
 */
export function getApiUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering - default to localhost for development
    return 'http://localhost:3001'
  }

  // Client-side - detect based on hostname
  const hostname = window.location.hostname
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    // Development environment
    return 'http://localhost:3001'
  } else {
    // Production environment - UPDATE THIS with your actual Vercel backend URL after deployment
    // Example: 'https://arbi-ai-backend.vercel.app'
    return 'https://arbi-ai-backend2.vercel.app'
  }
}

/**
 * Make an API call to the backend with the correct URL
 */
export async function apiCall(endpoint: string, options?: RequestInit) {
  const baseUrl = getApiUrl()
  const url = `${baseUrl}${endpoint}`
  
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
} 