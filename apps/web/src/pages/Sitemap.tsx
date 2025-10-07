import { Helmet } from 'react-helmet-async';
import { generateSitemapXml, generateSitemapEntries } from '../utils/seo';

interface SitemapProps {
  events?: Array<{
    slug: string;
    updatedAt: string;
  }>;
  designers?: Array<{
    name: string;
    updatedAt: string;
  }>;
}

export function Sitemap({ events = [], designers = [] }: SitemapProps) {
  // Generate static sitemap entries
  const staticEntries = generateSitemapEntries();

  // Generate dynamic event entries
  const eventEntries = events.map(event => ({
    loc: `https://linea-production.up.railway.app/events/${event.slug}`,
    lastmod: new Date(event.updatedAt).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7,
  }));

  // Generate dynamic designer entries
  const designerEntries = designers.map(designer => ({
    loc: `https://linea-production.up.railway.app/designers/${designer.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastmod: new Date(designer.updatedAt).toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6,
  }));

  // Combine all entries
  const allEntries = [...staticEntries, ...eventEntries, ...designerEntries];

  // Generate XML sitemap
  const sitemapXml = generateSitemapXml(allEntries);

  return (
    <>
      <Helmet>
        <title>Sitemap | Linea</title>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          fontSize: '12px',
          fontFamily: 'monospace',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          margin: 0,
        }}
      >
        {sitemapXml}
      </pre>
    </>
  );
}
