import { Helmet } from 'react-helmet-async';
import {
  SEOData,
  generateOwnerSEOData,
  generateEventSEOData,
  generateOwnerStructuredData,
  generateEventStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateOrganizationStructuredData,
} from '../utils/seo';

interface SEOProps {
  data: SEOData;
  structuredData?: Record<string, unknown>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  preloadImages?: string[];
}

export function SEO({
  data,
  structuredData,
  breadcrumbs,
  faqs,
  preloadImages = [],
}: SEOProps) {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false,
  } = data;

  // Generate structured data
  const allStructuredData = [
    structuredData,
    breadcrumbs && generateBreadcrumbStructuredData(breadcrumbs),
    faqs && generateFAQStructuredData(faqs),
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords.length > 0 && (
        <meta name='keywords' content={keywords.join(', ')} />
      )}
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {noIndex && <meta name='robots' content='noindex, nofollow' />}

      {/* Open Graph Meta Tags */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={ogType} />
      {canonicalUrl && <meta property='og:url' content={canonicalUrl} />}
      {ogImage && <meta property='og:image' content={ogImage} />}
      {ogImage && <meta property='og:image:width' content='1200' />}
      {ogImage && <meta property='og:image:height' content='630' />}
      <meta property='og:site_name' content='Linea' />

      {/* Twitter Card Meta Tags */}
      <meta name='twitter:card' content={twitterCard} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {ogImage && <meta name='twitter:image' content={ogImage} />}

      {/* Additional Meta Tags */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta name='theme-color' content='#6366f1' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Linea' />

      {/* Preload Critical Resources */}
      {preloadImages.map((image, index) => (
        <link
          key={index}
          rel='preload'
          href={image}
          as='image'
          type='image/jpeg'
        />
      ))}

      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}
    </Helmet>
  );
}

// Specialized SEO components for different page types
interface OwnerSEOProps {
  owner: {
    name: string;
    businessName?: string;
    email: string;
    location?: string;
    industry?: string;
    description?: string;
    socialLinks?: Record<string, string>;
    events?: Array<{
      title: string;
      slug: string;
      startDate: string;
      endDate?: string;
      venue?: string;
    }>;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function OwnerSEO({ owner, breadcrumbs }: OwnerSEOProps) {
  const seoData = generateOwnerSEOData(owner);
  const structuredData = generateOwnerStructuredData(seoData);

  return (
    <SEO
      data={seoData}
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
    />
  );
}

interface EventSEOProps {
  event: {
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    startDate: string;
    endDate?: string;
    venue?: {
      name: string;
      address: string;
      city: string;
      country: string;
      latitude?: number;
      longitude?: number;
    };
    organizer?: {
      name: string;
      email: string;
      businessName?: string;
    };
    capacity?: number;
    price?: number;
    currency?: string;
    category?: string;
    tags?: string[];
    metadata?: {
      heroImageUrl?: string;
    };
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function EventSEO({ event, breadcrumbs }: EventSEOProps) {
  const seoData = generateEventSEOData(event);
  const structuredData = generateEventStructuredData(seoData);

  // Only preload the hero image if it exists and is likely to be used
  const preloadImages = event.metadata?.heroImageUrl
    ? [event.metadata.heroImageUrl]
    : [];

  return (
    <SEO
      data={seoData}
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
      preloadImages={preloadImages}
    />
  );
}

interface HomeSEOProps {
  featuredEvents?: Array<{
    title: string;
    slug: string;
    startDate: string;
    venue?: string;
  }>;
  stats?: {
    totalEvents: number;
    totalDesigners: number;
    totalAttendees: number;
  };
}

export function HomeSEO({
  featuredEvents: _featuredEvents = [],
  stats: _stats,
}: HomeSEOProps) {
  const seoData: SEOData = {
    title: 'Linea - Milano Design Week & Design Events Platform',
    description:
      'Your gateway to Milano Design Week and exclusive design events. Discover extraordinary experiences, connect with designers, and explore the future of design.',
    keywords: [
      'Milano Design Week',
      'design events',
      'designers',
      'creative',
      'Milano',
      'design platform',
    ],
    canonicalUrl: 'https://linea-production.up.railway.app/',
    ogImage: 'https://linea-production.up.railway.app/og-home.jpg',
    ogType: 'website',
  };

  const structuredData = generateOrganizationStructuredData();

  return (
    <SEO
      data={seoData}
      structuredData={structuredData}
      preloadImages={['/images/hero-milano.jpg', '/images/design-events.jpg']}
    />
  );
}

interface DesignersPageSEOProps {
  designers?: Array<{
    name: string;
    businessName?: string;
    location?: string;
    industry?: string;
  }>;
  totalDesigners?: number;
}

export function DesignersPageSEO({
  designers = [],
  totalDesigners = 0,
}: DesignersPageSEOProps) {
  const seoData: SEOData = {
    title: 'Designers & Creatives | Linea',
    description: `Discover ${totalDesigners} talented designers and creatives on Linea. Connect with the design community, explore portfolios, and join exclusive design events.`,
    keywords: [
      'designers',
      'creatives',
      'design community',
      'Milano',
      'portfolio',
      'design events',
    ],
    canonicalUrl: 'https://linea-production.up.railway.app/designers',
    ogImage: 'https://linea-production.up.railway.app/og-designers.jpg',
    ogType: 'website',
  };

  const breadcrumbs = [
    { name: 'Home', url: 'https://linea-production.up.railway.app/' },
    {
      name: 'Designers',
      url: 'https://linea-production.up.railway.app/designers',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Designers & Creatives',
    description: seoData.description,
    url: seoData.canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalDesigners,
      itemListElement: designers.map((designer, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          name: designer.name,
          ...(designer.businessName && {
            worksFor: {
              '@type': 'Organization',
              name: designer.businessName,
            },
          }),
          ...(designer.location && {
            address: {
              '@type': 'PostalAddress',
              addressLocality: designer.location,
            },
          }),
        },
      })),
    },
  };

  return (
    <SEO
      data={seoData}
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
    />
  );
}
