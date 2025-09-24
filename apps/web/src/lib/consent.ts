const STORAGE_KEY = 'cookie_consent'

type Consent = {
  necessary: boolean
  analytics: boolean
  timestamp: string
}

export function getAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const parsed: Consent = JSON.parse(raw)
    return !!parsed.analytics
  } catch {
    return false
  }
}


