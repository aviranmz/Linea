// SEO Utilities for Linea Platform
// Comprehensive SEO helpers for owner pages, events, and general content

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noIndex?: boolean
  structuredData?: Record<string, unknown>
}

export interface OwnerSEOData extends SEOData {
  ownerName: string
  businessName?: string
  location?: string
  industry?: string
  socialLinks?: {
    website?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    twitter?: string
  }
  events?: Array<{
    title: string
    slug: string
    startDate: string
    endDate?: string
    venue?: string
  }>
}

export interface EventSEOData extends SEOData {
  eventTitle: string
  startDate: string
  endDate?: string
  venue?: {
    name: string
    address: string
    city: string
    country: string
    latitude?: number
    longitude?: number
  }
  organizer?: {
    name: string
    email: string
    businessName?: string
  }
  capacity?: number
  price?: number
  currency?: string
  category?: string
  tags?: string[]
}

// Generate canonical URL
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://linea-production.up.railway.app'): string => {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

// Generate meta title
export const generateMetaTitle = (title: string, _siteName: string = 'Linea'): string => {
  const maxLength = 60
  if (title.length <= maxLength) {
    return title
  }
  return `${title.substring(0, maxLength - 3)}...`
}

// Generate meta description
export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) {
    return description
  }
  return `${description.substring(0, maxLength - 3)}...`
}

// Generate keywords from content
export const generateKeywords = (content: string, additionalKeywords: string[] = []): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const sortedWords = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
  
  return [...new Set([...sortedWords, ...additionalKeywords])].slice(0, 15)
}

// Generate owner page SEO data
export const generateOwnerSEOData = (owner: {
  name: string
  businessName?: string
  email: string
  location?: string
  industry?: string
  description?: string
  socialLinks?: Record<string, string>
  events?: Array<{
    title: string
    slug: string
    startDate: string
    endDate?: string
    venue?: string
  }>
}): OwnerSEOData => {
  const businessName = owner.businessName || owner.name
  const title = `${businessName} - Designer Profile | Linea`
  const description = owner.description || 
    `Discover ${businessName}'s design events and portfolio on Linea. Join exclusive design experiences in Milano and beyond.`
  
  const keywords = generateKeywords(
    `${owner.name} ${businessName} ${owner.industry || 'design'} ${owner.location || 'Milano'} design events portfolio`,
    ['designer', 'Milano', 'design events', 'portfolio', 'creative']
  )
  
  return {
    title: generateMetaTitle(title),
    description: generateMetaDescription(description),
    keywords,
    canonicalUrl: generateCanonicalUrl(`/designers/${owner.name.toLowerCase().replace(/\s+/g, '-')}`),
    ogImage: owner.socialLinks?.website ? `${owner.socialLinks.website}/og-image.jpg` : undefined,
    ogType: 'profile',
    twitterCard: 'summary_large_image',
    ownerName: owner.name,
    businessName,
    location: owner.location,
    industry: owner.industry,
    socialLinks: owner.socialLinks,
    events: owner.events
  }
}

// Generate event page SEO data
export const generateEventSEOData = (event: {
  title: string
  slug: string
  description?: string
  shortDescription?: string
  startDate: string
  endDate?: string
  venue?: {
    name: string
    address: string
    city: string
    country: string
    latitude?: number
    longitude?: number
  }
  organizer?: {
    name: string
    email: string
    businessName?: string
  }
  capacity?: number
  price?: number
  currency?: string
  category?: string
  tags?: string[]
}): EventSEOData => {
  const title = `${event.title} | Design Event | Linea`
  const description = event.shortDescription || event.description || 
    `Join us for ${event.title}, a design event in ${event.venue?.city || 'Milano'}. Discover innovative design and connect with the creative community.`
  
  const keywords = generateKeywords(
    `${event.title} ${event.venue?.city || ''} ${event.organizer?.name || ''} ${event.category || ''} design event`,
    ['design event', 'Milano', 'design', 'creative', 'workshop', 'exhibition']
  )
  
  return {
    title: generateMetaTitle(title),
    description: generateMetaDescription(description),
    keywords,
    canonicalUrl: generateCanonicalUrl(`/events/${event.slug}`),
    ogImage: `/images/events/${event.slug}-og.jpg`,
    ogType: 'event',
    twitterCard: 'summary_large_image',
    eventTitle: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    venue: event.venue,
    organizer: event.organizer,
    capacity: event.capacity,
    price: event.price,
    currency: event.currency,
    category: event.category,
    tags: event.tags
  }
}

// Generate structured data for owner
export const generateOwnerStructuredData = (seoData: OwnerSEOData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seoData.ownerName,
    ...(seoData.businessName && {
      worksFor: {
        "@type": "Organization",
        name: seoData.businessName
      }
    }),
    ...(seoData.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: seoData.location
      }
    }),
    ...(seoData.socialLinks?.website && {
      url: seoData.socialLinks.website
    }),
    ...(seoData.socialLinks?.instagram && {
      sameAs: [
        seoData.socialLinks.instagram,
        ...Object.values(seoData.socialLinks).filter(link => link && link !== seoData.socialLinks?.instagram)
      ]
    }),
    ...(seoData.events && seoData.events.length > 0 && {
      event: seoData.events.map(event => ({
        "@type": "Event",
        name: event.title,
        url: generateCanonicalUrl(`/events/${event.slug}`),
        startDate: event.startDate,
        ...(event.endDate && { endDate: event.endDate }),
        ...(event.venue && {
          location: {
            "@type": "Place",
            name: event.venue
          }
        })
      }))
    })
  }
}

// Generate structured data for event
export const generateEventStructuredData = (seoData: EventSEOData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: seoData.eventTitle,
    description: seoData.description,
    startDate: seoData.startDate,
    ...(seoData.endDate && { endDate: seoData.endDate }),
    url: seoData.canonicalUrl,
    ...(seoData.venue && {
      location: {
        "@type": "Place",
        name: seoData.venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: seoData.venue.address,
          addressLocality: seoData.venue.city,
          addressCountry: seoData.venue.country
        },
        ...(seoData.venue.latitude && seoData.venue.longitude && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: seoData.venue.latitude,
            longitude: seoData.venue.longitude
          }
        })
      }
    }),
    ...(seoData.organizer && {
      organizer: {
        "@type": "Organization",
        name: seoData.organizer.businessName || seoData.organizer.name,
        email: seoData.organizer.email
      }
    }),
    ...(seoData.capacity && {
      maximumAttendeeCapacity: seoData.capacity
    }),
    ...(seoData.price && {
      offers: {
        "@type": "Offer",
        price: seoData.price,
        priceCurrency: seoData.currency || "EUR",
        availability: "https://schema.org/InStock"
      }
    }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode"
  }
}

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
}

// Generate organization structured data
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Linea",
    description: "Your gateway to Milano Design Week and exclusive design events. Discover extraordinary experiences, connect with designers, and explore the future of design.",
    url: "https://linea-production.up.railway.app",
    logo: "https://linea-production.up.railway.app/logo.png",
    sameAs: [
      "https://instagram.com/linea",
      "https://facebook.com/linea",
      "https://linkedin.com/company/linea"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@linea.dev"
    }
  }
}

// Generate sitemap entries
export const generateSitemapEntries = (baseUrl: string = 'https://linea-production.up.railway.app') => {
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/designers', priority: 0.8, changefreq: 'weekly' },
    { url: '/help', priority: 0.6, changefreq: 'monthly' },
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/terms', priority: 0.3, changefreq: 'yearly' }
  ]
  
  return staticPages.map(page => ({
    loc: `${baseUrl}${page.url}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: page.changefreq,
    priority: page.priority
  }))
}

// Performance optimization helpers
export const preloadCriticalResources = (resources: string[]) => {
  return resources.map(resource => ({
    rel: "preload",
    href: resource,
    as: "image",
    type: "image/jpeg"
  }))
}

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl: string = 'https://linea-production.up.railway.app') => {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /owner/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`
}

// Generate sitemap.xml content
export const generateSitemapXml = (entries: Array<{
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}>) => {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const footer = '</urlset>'
  
  const urlEntries = entries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')
  
  return `${header}\n${urlEntries}\n${footer}`
}
