import { Helmet } from 'react-helmet-async';
import { generateRobotsTxt } from '../utils/seo';

export function Robots() {
  const robotsContent = generateRobotsTxt();

  return (
    <>
      <Helmet>
        <title>Robots.txt | Linea</title>
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
        {robotsContent}
      </pre>
    </>
  );
}
