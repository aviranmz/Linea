// API route handler for robots.txt
export function generateRobotsResponse() {
  return generateRobotsTxt()
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: https://linea-production.up.railway.app/sitemap.xml`
}
