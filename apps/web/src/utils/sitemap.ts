// API route handler for sitemap.xml
export function generateSitemapResponse(
  events: Array<{ slug: string; updatedAt: string }> = [],
  designers: Array<{ name: string; slug: string; updatedAt: string }> = []
) {
  const staticEntries = generateSitemapEntries();

  const eventEntries = events.map(event => ({
    loc: `https://linea-production.up.railway.app/events/${event.slug}`,
    lastmod: new Date(event.updatedAt).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7,
  }));

  const designerEntries = designers.map(designer => ({
    loc: `https://linea-production.up.railway.app/designers/${designer.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastmod: new Date(designer.updatedAt).toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6,
  }));

  const allEntries = [...staticEntries, ...eventEntries, ...designerEntries];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function generateSitemapEntries() {
  return [
    {
      loc: 'https://linea-production.up.railway.app/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: 'https://linea-production.up.railway.app/designers',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    },
  ];
}
