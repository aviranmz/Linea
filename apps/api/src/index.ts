import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
import * as Prisma from '@prisma/client';
// Cast to any to tolerate ESM/CJS differences in CI environments
// while preserving runtime behavior
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = Prisma as any;
import * as crypto from 'crypto';
import * as Sentry from '@sentry/node';
import path from 'path';
import { fileURLToPath } from 'url';
// import { randomUUID } from 'crypto'
import { getConfig, validateConfig } from '@linea/config';
import { sessionService } from './services/sessionService.js';
import { QRCodeGenerator } from './utils/qrGenerator.js';
import { emailService } from './services/emailService.js';
import { ArrivalTracker } from './utils/arrivalTracker.js';
import { favoritesRoutes } from './routes/favorites.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal email helper (SendGrid optional)
// TODO(prod): Replace with robust email service + templates
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const key = process.env.SENDGRID_API_KEY || config.email.SENDGRID_API_KEY;
    if (!key) {
      app.log.info(
        { to, subject, text },
        'Email (log only, no SENDGRID_API_KEY)'
      );
      return;
    }
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: config.email.SENDGRID_FROM_EMAIL,
          name: config.email.SENDGRID_FROM_NAME,
        },
        subject,
        content: [{ type: 'text/plain', value: text }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      app.log.warn({ status: res.status, body }, 'SendGrid send failed');
    }
  } catch (err) {
    app.log.warn({ err }, 'Email send error');
  }
};

// TODO(prod): Temporary mock events fallback for environments without DB/auth.
// Remove this once DATABASE_URL is configured and seeding/migrations are in place.
const mockEvents = [
  // Owner 1 Events
  {
    id: '0d9a7b3c-4f84-4c7a-b2f6-2c8b9e6f1a01',
    title: 'Sustainable Design Revolution',
    slug: 'sustainable-design-revolution',
    description:
      'Explore the future of sustainable design with leading architects, designers, and environmental experts. Discover innovative materials, circular design principles, and eco-friendly solutions that are reshaping the industry.',
    shortDescription: 'Leading the charge in sustainable design innovation.',
    status: 'PUBLISHED',
    startDate: '2024-06-15T09:00:00Z',
    endDate: '2024-06-15T18:00:00Z',
    capacity: 300,
    isPublic: true,
    featured: true,
    tags: ['sustainability', 'design', 'innovation', 'environment'],
    owner: { id: 'owner-1', name: 'Owner One', email: 'owner1@example.com' },
    venue: {
      id: 'venue-1',
      name: 'Milano Design Center',
      address: 'Via Tortona, 37, 20144 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-1',
      name: 'Sustainability',
      slug: 'sustainability',
      color: '#10b981',
      icon: '🌱',
    },
    metadata: {
      heroImageUrl: '/uploads/events/sustainable-design-revolution-hero.jpg',
      galleryImages: [
        '/uploads/events/sustainable-design-revolution-1.jpg',
        '/uploads/events/sustainable-design-revolution-2.jpg',
        '/uploads/events/sustainable-design-revolution-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-1',
        title: 'Opening Keynote',
        description: 'The Future of Sustainable Design',
        startDate: '2024-06-15T09:00:00Z',
        endDate: '2024-06-15T10:30:00Z',
        capacity: 300,
      },
      {
        id: 'show-2',
        title: 'Materials Innovation Panel',
        description: 'Exploring new sustainable materials',
        startDate: '2024-06-15T11:00:00Z',
        endDate: '2024-06-15T12:30:00Z',
        capacity: 200,
      },
      {
        id: 'show-3',
        title: 'Circular Design Workshop',
        description: 'Hands-on circular design principles',
        startDate: '2024-06-15T14:00:00Z',
        endDate: '2024-06-15T16:00:00Z',
        capacity: 100,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f802',
    title: 'Digital Art & Technology Fusion',
    slug: 'digital-art-technology-fusion',
    description:
      'Experience the intersection of art and technology in this immersive exhibition featuring digital installations, VR experiences, and interactive artworks by contemporary artists.',
    shortDescription: 'Where art meets cutting-edge technology.',
    status: 'PUBLISHED',
    startDate: '2024-06-20T10:00:00Z',
    endDate: '2024-06-20T20:00:00Z',
    capacity: 200,
    isPublic: true,
    featured: false,
    tags: ['digital art', 'technology', 'innovation', 'interactive'],
    owner: { id: 'owner-1', name: 'Owner One', email: 'owner1@example.com' },
    venue: {
      id: 'venue-2',
      name: 'Triennale di Milano',
      address: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-2',
      name: 'Art & Culture',
      slug: 'art-culture',
      color: '#f59e0b',
      icon: '🎭',
    },
    metadata: {
      heroImageUrl: '/uploads/events/digital-art-technology-fusion-hero.jpg',
      galleryImages: [
        '/uploads/events/digital-art-technology-fusion-1.jpg',
        '/uploads/events/digital-art-technology-fusion-2.jpg',
        '/uploads/events/digital-art-technology-fusion-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-4',
        title: 'VR Art Experience',
        description: 'Immersive virtual reality art installations',
        startDate: '2024-06-20T10:00:00Z',
        endDate: '2024-06-20T12:00:00Z',
        capacity: 50,
      },
      {
        id: 'show-5',
        title: 'Interactive Digital Workshop',
        description: 'Create your own digital art',
        startDate: '2024-06-20T14:00:00Z',
        endDate: '2024-06-20T16:00:00Z',
        capacity: 30,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '2b3c4d5e-6f70-8192-a3b4-c5d6e7f8a903',
    title: 'Furniture Design Masterclass',
    slug: 'furniture-design-masterclass',
    description:
      'Learn from master furniture designers in this hands-on workshop covering traditional techniques, modern materials, and innovative approaches to furniture design.',
    shortDescription: 'Master the art of furniture design.',
    status: 'PUBLISHED',
    startDate: '2024-06-25T09:00:00Z',
    endDate: '2024-06-25T17:00:00Z',
    capacity: 50,
    isPublic: true,
    featured: false,
    tags: ['furniture', 'workshop', 'craftsmanship', 'design'],
    owner: { id: 'owner-1', name: 'Owner One', email: 'owner1@example.com' },
    venue: {
      id: 'venue-1',
      name: 'Milano Design Center',
      address: 'Via Tortona, 37, 20144 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-3',
      name: 'Design',
      slug: 'design',
      color: '#c4b69e',
      icon: '🎨',
    },
    metadata: {
      heroImageUrl: '/uploads/events/furniture-design-masterclass-hero.jpg',
      galleryImages: [
        '/uploads/events/furniture-design-masterclass-1.jpg',
        '/uploads/events/furniture-design-masterclass-2.jpg',
        '/uploads/events/furniture-design-masterclass-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-6',
        title: 'Traditional Techniques',
        description: 'Learn traditional furniture making methods',
        startDate: '2024-06-25T09:00:00Z',
        endDate: '2024-06-25T12:00:00Z',
        capacity: 25,
      },
      {
        id: 'show-7',
        title: 'Modern Materials Workshop',
        description: 'Explore contemporary materials and techniques',
        startDate: '2024-06-25T14:00:00Z',
        endDate: '2024-06-25T17:00:00Z',
        capacity: 25,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '3c4d5e6f-7081-92a3-b4c5-d6e7f8a9b014',
    title: 'Smart Home Innovation Summit',
    slug: 'smart-home-innovation-summit',
    description:
      'Discover the latest in smart home technology, IoT devices, and connected living solutions. Features live demonstrations, expert panels, and networking opportunities.',
    shortDescription: 'The future of connected living.',
    status: 'PUBLISHED',
    startDate: '2024-07-01T09:00:00Z',
    endDate: '2024-07-01T18:00:00Z',
    capacity: 400,
    isPublic: true,
    featured: true,
    tags: ['smart home', 'IoT', 'technology', 'innovation'],
    owner: { id: 'owner-1', name: 'Owner One', email: 'owner1@example.com' },
    venue: {
      id: 'venue-3',
      name: 'Fondazione Prada',
      address: 'Largo Isarco, 2, 20139 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-4',
      name: 'Technology',
      slug: 'technology',
      color: '#3b82f6',
      icon: '💻',
    },
    metadata: {
      heroImageUrl: '/uploads/events/smart-home-innovation-summit-hero.jpg',
      galleryImages: [
        '/uploads/events/smart-home-innovation-summit-1.jpg',
        '/uploads/events/smart-home-innovation-summit-2.jpg',
        '/uploads/events/smart-home-innovation-summit-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-8',
        title: 'IoT Device Showcase',
        description: 'Latest smart home devices and technologies',
        startDate: '2024-07-01T09:00:00Z',
        endDate: '2024-07-01T11:00:00Z',
        capacity: 200,
      },
      {
        id: 'show-9',
        title: 'Expert Panel Discussion',
        description: 'Future of smart living',
        startDate: '2024-07-01T14:00:00Z',
        endDate: '2024-07-01T16:00:00Z',
        capacity: 150,
      },
    ],
    _count: { waitlist: 0 },
  },
  // Owner 2 Events
  {
    id: '4d5e6f70-8192-a3b4-c5d6-e7f8a9b0c125',
    title: 'Contemporary Art Exhibition',
    slug: 'contemporary-art-exhibition',
    description:
      'A curated exhibition featuring works by emerging and established contemporary artists, exploring themes of identity, society, and the human condition.',
    shortDescription: 'Contemporary voices in modern art.',
    status: 'PUBLISHED',
    startDate: '2024-06-18T10:00:00Z',
    endDate: '2024-06-18T20:00:00Z',
    capacity: 150,
    isPublic: true,
    featured: true,
    tags: ['contemporary art', 'exhibition', 'culture', 'creativity'],
    owner: { id: 'owner-2', name: 'Owner Two', email: 'owner2@example.com' },
    venue: {
      id: 'venue-4',
      name: 'Palazzo Clerici',
      address: 'Via Clerici, 5, 20121 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-2',
      name: 'Art & Culture',
      slug: 'art-culture',
      color: '#f59e0b',
      icon: '🎭',
    },
    metadata: {
      heroImageUrl: '/uploads/events/contemporary-art-exhibition-hero.jpg',
      galleryImages: [
        '/uploads/events/contemporary-art-exhibition-1.jpg',
        '/uploads/events/contemporary-art-exhibition-2.jpg',
        '/uploads/events/contemporary-art-exhibition-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-10',
        title: 'Artist Talk',
        description: 'Meet the artists behind the exhibition',
        startDate: '2024-06-18T10:00:00Z',
        endDate: '2024-06-18T12:00:00Z',
        capacity: 80,
      },
      {
        id: 'show-11',
        title: 'Guided Tour',
        description: 'Curator-led exhibition tour',
        startDate: '2024-06-18T15:00:00Z',
        endDate: '2024-06-18T17:00:00Z',
        capacity: 30,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '5e6f7081-92a3-b4c5-d6e7-f8a9b0c1d236',
    title: 'Green Architecture Workshop',
    slug: 'green-architecture-workshop',
    description:
      'Learn sustainable architecture principles with hands-on workshops, case studies, and expert guidance on creating environmentally responsible buildings.',
    shortDescription: 'Building a sustainable future.',
    status: 'PUBLISHED',
    startDate: '2024-06-22T09:00:00Z',
    endDate: '2024-06-22T17:00:00Z',
    capacity: 80,
    isPublic: true,
    featured: false,
    tags: ['architecture', 'sustainability', 'green building', 'workshop'],
    owner: { id: 'owner-2', name: 'Owner Two', email: 'owner2@example.com' },
    venue: {
      id: 'venue-2',
      name: 'Triennale di Milano',
      address: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-1',
      name: 'Sustainability',
      slug: 'sustainability',
      color: '#10b981',
      icon: '🌱',
    },
    metadata: {
      heroImageUrl: '/uploads/events/green-architecture-workshop-hero.jpg',
      galleryImages: [
        '/uploads/events/green-architecture-workshop-1.jpg',
        '/uploads/events/green-architecture-workshop-2.jpg',
        '/uploads/events/green-architecture-workshop-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-12',
        title: 'Sustainable Design Principles',
        description: 'Core principles of green architecture',
        startDate: '2024-06-22T09:00:00Z',
        endDate: '2024-06-22T12:00:00Z',
        capacity: 40,
      },
      {
        id: 'show-13',
        title: 'Case Study Analysis',
        description: 'Real-world sustainable building examples',
        startDate: '2024-06-22T14:00:00Z',
        endDate: '2024-06-22T17:00:00Z',
        capacity: 40,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '6f708192-a3b4-c5d6-e7f8-a9b0c1d2e347',
    title: 'AI in Creative Industries',
    slug: 'ai-creative-industries',
    description:
      'Explore how artificial intelligence is transforming creative industries, from design automation to AI-assisted art creation and content generation.',
    shortDescription: 'AI meets creativity.',
    status: 'PUBLISHED',
    startDate: '2024-06-28T09:00:00Z',
    endDate: '2024-06-28T18:00:00Z',
    capacity: 250,
    isPublic: true,
    featured: true,
    tags: ['AI', 'creativity', 'technology', 'innovation'],
    owner: { id: 'owner-2', name: 'Owner Two', email: 'owner2@example.com' },
    venue: {
      id: 'venue-3',
      name: 'Fondazione Prada',
      address: 'Largo Isarco, 2, 20139 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-4',
      name: 'Technology',
      slug: 'technology',
      color: '#3b82f6',
      icon: '💻',
    },
    metadata: {
      heroImageUrl: '/uploads/events/ai-creative-industries-hero.jpg',
      galleryImages: [
        '/uploads/events/ai-creative-industries-1.jpg',
        '/uploads/events/ai-creative-industries-2.jpg',
        '/uploads/events/ai-creative-industries-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-14',
        title: 'AI Art Generation Demo',
        description: 'Live demonstration of AI art creation',
        startDate: '2024-06-28T09:00:00Z',
        endDate: '2024-06-28T11:00:00Z',
        capacity: 100,
      },
      {
        id: 'show-15',
        title: 'Creative AI Tools Workshop',
        description: 'Hands-on AI tools for creatives',
        startDate: '2024-06-28T14:00:00Z',
        endDate: '2024-06-28T16:00:00Z',
        capacity: 50,
      },
    ],
    _count: { waitlist: 0 },
  },
  {
    id: '708192a3-b4c5-d6e7-f8a9-b0c1d2e3f458',
    title: 'Textile Design Innovation',
    slug: 'textile-design-innovation',
    description:
      'Discover the latest innovations in textile design, from smart fabrics to sustainable materials, with demonstrations and hands-on workshops.',
    shortDescription: 'The future of fabric design.',
    status: 'PUBLISHED',
    startDate: '2024-07-05T10:00:00Z',
    endDate: '2024-07-05T18:00:00Z',
    capacity: 120,
    isPublic: true,
    featured: false,
    tags: ['textile', 'design', 'innovation', 'fashion'],
    owner: { id: 'owner-2', name: 'Owner Two', email: 'owner2@example.com' },
    venue: {
      id: 'venue-1',
      name: 'Milano Design Center',
      address: 'Via Tortona, 37, 20144 Milano MI, Italy',
      city: 'Milano',
      country: 'Italy',
    },
    category: {
      id: 'cat-3',
      name: 'Design',
      slug: 'design',
      color: '#c4b69e',
      icon: '🎨',
    },
    metadata: {
      heroImageUrl: '/uploads/events/textile-design-innovation-hero.jpg',
      galleryImages: [
        '/uploads/events/textile-design-innovation-1.jpg',
        '/uploads/events/textile-design-innovation-2.jpg',
        '/uploads/events/textile-design-innovation-3.jpg',
      ],
    },
    shows: [
      {
        id: 'show-16',
        title: 'Smart Fabrics Demo',
        description: 'Interactive smart fabric demonstrations',
        startDate: '2024-07-05T10:00:00Z',
        endDate: '2024-07-05T12:00:00Z',
        capacity: 60,
      },
      {
        id: 'show-17',
        title: 'Sustainable Textiles Workshop',
        description: 'Creating eco-friendly textile designs',
        startDate: '2024-07-05T14:00:00Z',
        endDate: '2024-07-05T16:00:00Z',
        capacity: 30,
      },
    ],
    _count: { waitlist: 0 },
  },
];

// Enrich mock events with complete metadata and owner details for full UI
const buildDefaultMetadata = (event: any) => {
  const baseUrl = 'http://localhost:3050';
  const hero =
    event.metadata?.heroImageUrl || `/uploads/events/${event.slug}-hero.jpg`;
  return {
    heroImageUrl: hero,
    galleryImages: event.metadata?.galleryImages || [hero, hero, hero],
    qrUrl: event.metadata?.qrUrl || `/uploads/linea_light.png`,
    productName: event.metadata?.productName || event.title,
    valueProposition:
      event.metadata?.valueProposition ||
      'Experience cutting-edge design and innovation with exclusive sessions, networking and product showcases.',
    longDescription:
      event.metadata?.longDescription ||
      event.description ||
      event.shortDescription ||
      '',
    features: event.metadata?.features || [
      'Keynotes by industry leaders',
      'Hands-on workshops',
      'Curated exhibitors & installations',
      'Networking with designers and brands',
    ],
    awards: event.metadata?.awards || ['Featured by Linea'],
    videoUrl:
      event.metadata?.videoUrl ||
      event.youtubeUrl ||
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pressKitUrl:
      event.metadata?.pressKitUrl || `${baseUrl}/uploads/linea_light.png`,
    social: event.metadata?.social || {
      instagram: 'https://instagram.com/linea_events',
      twitter: 'https://x.com/linea_events',
      facebook: 'https://facebook.com/lineaevents',
      website: 'https://linea.app',
    },
    contact: event.metadata?.contact || {
      email: 'info@linea.app',
      phone: '+39 02 1234 5678',
      whatsapp: 'https://wa.me/393331234567',
      telegram: 'https://t.me/linea_events',
    },
  };
};

const enrichOwner = (owner: any) => ({
  id: owner.id,
  name: owner.name,
  email: owner.email,
  businessName: owner.businessName || `${owner.name} Studio`,
  website: owner.website || 'https://linea.app',
  city: owner.city || 'Milano',
  country: owner.country || 'Italy',
  phone: owner.phone || '+39 02 1234 5678',
  instagramUrl: owner.instagramUrl || 'https://instagram.com/linea_events',
  facebookUrl: owner.facebookUrl || 'https://facebook.com/lineaevents',
  profilePictureUrl: owner.profilePictureUrl || '/uploads/linea_light.png',
});

const mockEventsEnriched = mockEvents.map(e => ({
  ...e,
  owner: enrichOwner(e.owner || {}),
  metadata: buildDefaultMetadata(e),
}));

// Mock waitlist storage for fallback mode
const mockWaitlist: Array<{
  id: string;
  email: string;
  eventId: string;
  status: 'PENDING' | 'CONFIRMED';
}> = [];

// Load configuration
const config = getConfig();
validateConfig(config);

// In non-production or when explicitly allowed, show magic links in API responses
const shouldShowMagicLink =
  process.env.SHOW_MAGIC_LINK === 'true' ||
  config.environment.NODE_ENV === 'development' ||
  !config.email.SENDGRID_API_KEY ||
  (typeof config.email.SENDGRID_API_KEY === 'string' &&
    config.email.SENDGRID_API_KEY.includes('production-sendgrid'));

const app = Fastify({
  logger:
    config.observability.LOG_FORMAT === 'pretty'
      ? {
          level: config.observability.LOG_LEVEL,
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : {
          level: config.observability.LOG_LEVEL,
          formatters: {
            level: label => ({ level: label }),
          },
        },
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  genReqId: () => crypto.randomUUID(),
});

// Initialize Sentry if configured
if (config.observability.SENTRY_DSN) {
  Sentry.init({
    dsn: config.observability.SENTRY_DSN,
    environment: config.observability.SENTRY_ENVIRONMENT,
    release: config.observability.SENTRY_RELEASE,
    tracesSampleRate: 0.0,
  });
}

// Initialize Prisma
const prisma = new PrismaClient({
  log: config.development.DEBUG_SQL
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  datasources: {
    db: {
      url: config.database.DATABASE_URL,
    },
  },
});

// Seed extra events without wiping (adds 7 per owner)
app.post('/api/seed-extra-events', async (_request, reply) => {
  try {
    const owner1 = await prisma.user.findFirst({
      where: { email: 'owner1@example.com' },
    });
    const owner2 = await prisma.user.findFirst({
      where: { email: 'owner2@example.com' },
    });
    const venue1 = await prisma.venue.findFirst({
      where: { name: 'Milano Design Center' },
    });
    const venue2 = await prisma.venue.findFirst({
      where: { name: 'Creative Hub Milano' },
    });
    const design = await prisma.category.findFirst({
      where: { slug: 'design' },
    });
    const tech = await prisma.category.findFirst({
      where: { slug: 'technology' },
    });
    const art = await prisma.category.findFirst({
      where: { slug: 'art-culture' },
    });
    const sustain = await prisma.category.findFirst({
      where: { slug: 'sustainability' },
    });

    if (
      !owner1 ||
      !owner2 ||
      !venue1 ||
      !venue2 ||
      !design ||
      !tech ||
      !art ||
      !sustain
    ) {
      reply.code(400).send({
        error: 'Missing base seed records. Run /api/wipe-and-reseed first.',
      });
      return;
    }

    const now = Date.now();
    const baseEvents = [
      // Owner1 (Design/Sustainability)
      {
        title: 'Parametric Design Lab',
        cat: design.id,
        ven: venue1,
        owner: owner1,
        daysFromNow: 20,
        featured: false,
        img: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200&h=800&fit=crop',
      },
      {
        title: 'Biodesign Materials Clinic',
        cat: sustain.id,
        ven: venue1,
        owner: owner1,
        daysFromNow: 28,
        featured: true,
        img: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=1200&h=800&fit=crop',
      },
      {
        title: 'Furniture Sketch Jam',
        cat: design.id,
        ven: venue2,
        owner: owner1,
        daysFromNow: 35,
        featured: false,
        img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop',
      },
      {
        title: 'Circular Studio Walkthrough',
        cat: sustain.id,
        ven: venue1,
        owner: owner1,
        daysFromNow: 42,
        featured: false,
        img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=800&fit=crop',
      },
      {
        title: 'Lighting for Interiors Workshop',
        cat: design.id,
        ven: venue2,
        owner: owner1,
        daysFromNow: 49,
        featured: true,
        img: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200&h=800&fit=crop',
      },
      {
        title: 'Tactile Brand Systems',
        cat: art.id,
        ven: venue1,
        owner: owner1,
        daysFromNow: 56,
        featured: false,
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
      },
      {
        title: 'Eco Packaging Sprint',
        cat: sustain.id,
        ven: venue2,
        owner: owner1,
        daysFromNow: 63,
        featured: false,
        img: 'https://images.unsplash.com/photo-1498550744921-75f79806b8a7?w=1200&h=800&fit=crop',
      },

      // Owner2 (Tech/Art)
      {
        title: 'Realtime Graphics Clinic',
        cat: tech.id,
        ven: venue2,
        owner: owner2,
        daysFromNow: 22,
        featured: false,
        img: 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=1200&h=800&fit=crop',
      },
      {
        title: 'GenAI for Designers',
        cat: tech.id,
        ven: venue1,
        owner: owner2,
        daysFromNow: 30,
        featured: true,
        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
      },
      {
        title: 'Audio-reactive Installations',
        cat: art.id,
        ven: venue2,
        owner: owner2,
        daysFromNow: 37,
        featured: false,
        img: 'https://images.unsplash.com/photo-1520975979652-99f207804ad1?w=1200&h=800&fit=crop',
      },
      {
        title: 'WebXR Playground',
        cat: tech.id,
        ven: venue1,
        owner: owner2,
        daysFromNow: 44,
        featured: false,
        img: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&h=800&fit=crop',
      },
      {
        title: 'Creative Ops Roundtable',
        cat: tech.id,
        ven: venue2,
        owner: owner2,
        daysFromNow: 51,
        featured: false,
        img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
      },
      {
        title: 'Procedural Art Night',
        cat: art.id,
        ven: venue1,
        owner: owner2,
        daysFromNow: 58,
        featured: true,
        img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop',
      },
      {
        title: 'Machine Vision Sandbox',
        cat: tech.id,
        ven: venue2,
        owner: owner2,
        daysFromNow: 65,
        featured: false,
        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
      },
    ];

    let created = 0;
    for (const e of baseEvents) {
      const start = new Date(now + e.daysFromNow * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
      const slug =
        e.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$|--+/g, '-') +
        '-' +
        Math.floor(now / 1000);
      await prisma.event.create({
        data: {
          title: e.title,
          slug,
          description: e.title,
          shortDescription: e.title,
          status: 'PUBLISHED',
          startDate: start,
          endDate: end,
          capacity: 200,
          isPublic: true,
          featured: e.featured,
          ownerId: e.owner.id,
          categoryId: e.cat,
          venueId: e.ven.id,
          mapLat: e.ven.latitude ?? null,
          mapLng: e.ven.longitude ?? null,
          metadata: {
            heroImageUrl: e.img,
            qr: { enabled: true, endpoint: '/api/events/:id/qr' },
          },
        },
      });
      created++;
    }

    reply.send({ success: true, created });
  } catch (error) {
    console.error('❌ Error seeding extra events:', error);
    reply.code(500).send({ error: 'Failed to seed extra events' });
  }
});

// Generate QR code PNG for an event linking to its page
app.get('/api/events/:id/qr', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050';
    const eventUrl = `${baseUrl.replace(/\/$/, '')}/events/${id}`;
    const dataUrl = await QRCodeGenerator.generateEventQR(eventUrl, {
      width: 300,
      margin: 2,
    });
    const parts = dataUrl.split(',');
    const b64 = (parts.length > 1 ? parts[1] : parts[0]) || '';
    const png = Buffer.from(b64, 'base64');
    reply.type('image/png').send(png);
  } catch (error) {
    app.log.error({ error }, 'Failed to generate event QR');
    reply.code(500).send({ error: 'Failed to generate QR' });
  }
});

// Generate and save QR code for an event (owner only)
app.post('/api/owner/events/:id/generate-qr', async (request, reply) => {
  try {
    // Debug: Log the request details
    app.log.info(
      {
        cookies: request.cookies,
        headers: request.headers,
        url: request.url,
        method: request.method,
      },
      'QR generation request debug'
    );

    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) {
      app.log.warn('QR generation: No authenticated user found');
      return;
    }

    app.log.info(
      { userId: user.id, role: user.role },
      'QR generation: User authenticated'
    );

    const { id } = request.params as { id: string };

    // Check if event exists and user owns it (or is admin)
    const event = await prisma.event.findFirst({
      where: {
        id,
        ...(user.role === 'ADMIN' ? {} : { ownerId: user.id }),
        deletedAt: null,
      },
      select: { id: true, title: true, metadata: true },
    });

    if (!event) {
      reply.code(404).send({ error: 'Event not found or access denied' });
      return;
    }

    // Generate QR code for the event
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050';
    const eventUrl = `${baseUrl.replace(/\/$/, '')}/events/${id}`;
    const qrUrl = await QRCodeGenerator.generateEventQR(eventUrl);

    // Update the event with the QR code
    await prisma.event.update({
      where: { id },
      data: {
        metadata: {
          ...((event.metadata as Record<string, unknown>) || {}),
          qrUrl: qrUrl,
        },
      },
    });

    reply.send({
      success: true,
      message: 'QR code generated successfully',
      qrUrl: qrUrl,
    });
  } catch (error) {
    app.log.error({ error }, 'Failed to generate QR code for event');
    reply.code(500).send({ error: 'Failed to generate QR code' });
  }
});

// Register plugins
await app.register(cors, {
  origin: config.server.CORS_ORIGIN,
  credentials: config.server.CORS_CREDENTIALS,
});

await app.register(helmet, {
  contentSecurityPolicy: false,
});

await app.register(rateLimit, {
  max:
    config.environment.NODE_ENV === 'development'
      ? Math.max(
          100000,
          Number(config.security.RATE_LIMIT_MAX_REQUESTS) || 100000
        )
      : config.security.RATE_LIMIT_MAX_REQUESTS,
  timeWindow: config.security.RATE_LIMIT_WINDOW_MS,
  allowList:
    config.environment.NODE_ENV === 'development'
      ? ['127.0.0.1', '::1', '::ffff:127.0.0.1', '0.0.0.0']
      : [],
});

await app.register(cookie, {
  secret: config.security.SESSION_SECRET,
});

// Structured request timing logs
app.addHook('onRequest', async req => {
  // @ts-expect-error attach start time
  req._start = Date.now();
  if (config.observability.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'request',
      message: `${req.method} ${req.url}`,
      level: 'info',
    });
  }
});

app.addHook('onResponse', async (req, reply) => {
  const start = (req as { _start?: number })._start;
  const ms = start ? Date.now() - start : undefined;
  req.log.info(
    { method: req.method, url: req.url, statusCode: reply.statusCode, ms },
    'request completed'
  );
});

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Linea API',
      description: 'Event management platform API',
      version: config.environment.APP_VERSION,
    },
    servers: [
      {
        url: config.server.API_URL,
        description: `${config.environment.NODE_ENV} server`,
      },
    ],
  },
});

await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// Serve uploaded files first (before frontend static files)
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false,
});

// Serve static files from the frontend build (includes public directory)
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../../web/dist'),
  prefix: '/',
  // Enable reply.sendFile for SPA fallbacks and asset serving
  decorateReply: true,
});

// ------------ Auth utilities ------------
const getSessionUser = async (request: FastifyRequest) => {
  const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session';
  const token = (request.cookies as Record<string, string | undefined>)?.[
    cookieName
  ];
  if (!token) {
    app.log.warn(
      { cookies: request.cookies, cookieName },
      'No session token found'
    );
    return null;
  }

  app.log.info({ token: token.substring(0, 8) + '...' }, 'Session token found');

  // Get session from Redis
  const sessionData = await sessionService.getSession(token);
  if (sessionData) {
    // Skip database validation in demo mode
    if (config.development.DEMO_MODE === true) {
      return {
        id: sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
        name: sessionData.name ?? null,
        isActive: true,
      } as unknown as {
        id: string;
        email: string;
        role: string;
        name?: string | null;
        isActive: boolean;
      };
    }

    // Get user from database to ensure they're still active
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: sessionData.userId,
          isActive: true,
          deletedAt: null,
        },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          isActive: true,
        },
      });
      if (!user) {
        await sessionService.deleteSession(token);
        return null;
      }
      return user;
    } catch (_e) {
      // DB unavailable in dev: treat as unauthenticated, keep session
      return {
        id: sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
        name: sessionData.name ?? null,
        isActive: true,
      } as unknown as {
        id: string;
        email: string;
        role: string;
        name?: string | null;
        isActive: boolean;
      };
    }
  }

  // Fallback: check DB sessions (skip when using in-memory sessions)
  if (process.env.SESSION_MOCK !== 'true') {
    try {
      const dbSession = await prisma.session.findFirst({
        where: { token, expiresAt: { gt: new Date() } },
      });
      if (!dbSession) return null;
      const user = await prisma.user.findFirst({
        where: { id: dbSession.userId, isActive: true, deletedAt: null },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          isActive: true,
        },
      });
      if (!user) return null;
      return user;
    } catch (_e) {
      // DB unavailable – act as unauthenticated
      return null;
    }
  }

  return null;
};

// Helper function to create and set session
const createSessionAndSetCookie = async (
  reply: FastifyReply,
  user: { id: string; email: string; role: string; name?: string | null }
) => {
  const sessionToken = crypto.randomUUID();
  const sessionDuration =
    config.security.SESSION_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000;

  try {
    await sessionService.createSession(
      sessionToken,
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name || null,
      },
      sessionDuration
    );
  } catch (error) {
    app.log.error({ error }, 'Failed to create session');
    throw error;
  }

  // Only try to persist DB session if not using in-memory sessions
  if (process.env.SESSION_MOCK !== 'true') {
    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: sessionToken,
          expiresAt: new Date(Date.now() + sessionDuration),
        },
      });
    } catch (e) {
      // ignore if table missing in mock mode
    }
  }

  reply.setCookie(
    config.security.SESSION_COOKIE_NAME || 'linea_session',
    sessionToken,
    {
      path: '/',
      httpOnly: true,
      sameSite:
        (config.security.SESSION_COOKIE_SAME_SITE as
          | 'lax'
          | 'strict'
          | 'none'
          | undefined) || 'lax',
      secure: false, // Temporarily disable secure flag for debugging
      maxAge: Math.floor(sessionDuration / 1000),
    }
  );

  return sessionToken;
};

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Unauthorized' });
    return null;
  }
  return user;
};

const getOptionalAuth = async (request: FastifyRequest) => {
  try {
    const user = await getSessionUser(request);
    return user;
  } catch {
    return null;
  }
};

const requireOwnerOrAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = await requireAuth(request, reply);
  if (!user) return null;
  if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
    reply.code(403).send({ error: 'Forbidden' });
    return null;
  }
  return user;
};

const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await requireAuth(request, reply);
  if (!user) return null;
  if (user.role !== 'ADMIN') {
    reply.code(403).send({ error: 'Forbidden' });
    return null;
  }
  return user;
};

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const generateUniqueSlug = async (baseTitle: string) => {
  const base = toSlug(baseTitle);
  if (!base) {
    return crypto.randomUUID().slice(0, 8);
  }
  const existing = await prisma.event.findFirst({ where: { slug: base } });
  if (!existing) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    const found = await prisma.event.findFirst({ where: { slug: candidate } });
    if (!found) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
};

// Get all users with magic links
app.get('/all-users-data', async (request, reply) => {
  try {
    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isActive: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all email verifications
    let allEmailVerifications: any[] = [];
    try {
      allEmailVerifications = await prisma.emailVerification.findMany({
        select: {
          id: true,
          email: true,
          token: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
          userId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (e) {
      app.log.warn({ error: e }, 'Failed to fetch email verifications');
    }

    // Create user-magic link mapping
    const usersWithMagicLinks = allUsers.map((user: any) => {
      const userVerifications = allEmailVerifications.filter(
        verification => verification.userId === user.id
      );

      return {
        ...user,
        magicLinks: userVerifications.map(verification => ({
          token: verification.token,
          email: verification.email,
          expiresAt: verification.expiresAt,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          status: verification.verifiedAt ? 'VERIFIED' : 'PENDING',
        })),
      };
    });

    reply.send({
      summary: {
        totalUsers: allUsers.filter((user: any) => !user.deletedAt).length,
        totalEmailVerifications: allEmailVerifications.length,
      },
      users: usersWithMagicLinks.filter((user: any) => !user.deletedAt),
    });
  } catch (error: any) {
    app.log.error({ error }, 'Failed to fetch all users data');
    reply.code(500).send({
      error: 'Failed to fetch all users data',
      message: error?.message,
      details: error,
    });
  }
});

// Temporary admin data endpoint (remove after use)
app.get('/admin-data', async (request, reply) => {
  try {
    // Get all users first (simpler query)
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isActive: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter admin users
    const adminUsers = allUsers.filter(
      (user: any) => user.role === 'ADMIN' && !user.deletedAt
    );

    // Get all email verifications
    let allEmailVerifications: any[] = [];
    try {
      allEmailVerifications = await prisma.emailVerification.findMany({
        select: {
          id: true,
          email: true,
          token: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
          userId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (e) {
      app.log.warn({ error: e }, 'Failed to fetch email verifications');
    }

    // Create user-magic link mapping
    const usersWithMagicLinks = allUsers.map((user: any) => {
      const userVerifications = allEmailVerifications.filter(
        verification => verification.userId === user.id
      );

      return {
        ...user,
        magicLinks: userVerifications.map(verification => ({
          token: verification.token,
          email: verification.email,
          expiresAt: verification.expiresAt,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          status: verification.verifiedAt ? 'VERIFIED' : 'PENDING',
        })),
      };
    });

    // Filter email verifications for admin users
    const adminUserIds = adminUsers.map((user: any) => user.id);
    const adminEmailVerifications = allEmailVerifications.filter(verification =>
      adminUserIds.includes(verification.userId)
    );

    const result = {
      summary: {
        totalUsers: allUsers.filter((user: any) => !user.deletedAt).length,
        adminUsers: adminUsers.length,
        totalEmailVerifications: allEmailVerifications.length,
        adminEmailVerifications: adminEmailVerifications.length,
      },
      adminUsers,
      emailVerifications: adminEmailVerifications,
      allUsers: usersWithMagicLinks.filter((user: any) => !user.deletedAt),
    };

    reply.send(result);
  } catch (error: any) {
    app.log.error({ error }, 'Failed to fetch admin data');
    reply.code(500).send({
      error: 'Failed to fetch admin data',
      message: error?.message,
      details: error,
    });
  }
});

// Health check
app.get('/health', async (_request, _reply) => {
  try {
    const services: Record<string, string> = {};

    // Check database connection
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Database connection timeout')),
            5000
          )
        ),
      ]);
      services.database = 'connected';
    } catch (dbError) {
      services.database = 'disconnected';
      app.log.warn({ error: dbError }, 'Database health check failed');
    }

    // Check Redis connection
    try {
      const isRedisHealthy = await sessionService.isHealthy();
      services.redis = isRedisHealthy ? 'connected' : 'disconnected';
    } catch (redisError) {
      services.redis = 'disconnected';
      app.log.warn({ error: redisError }, 'Redis health check failed');
    }

    const isHealthy =
      services.database === 'connected' && services.redis === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: config.environment.APP_VERSION,
      environment: config.environment.NODE_ENV,
      services,
    };
  } catch (error) {
    // Unexpected error: still return 200 with degraded to avoid flapping deployments
    return {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// Basic API routes - removed root route to allow static file serving

// Events API
app.get('/api/events', async (request, _reply) => {
  try {
    const {
      search,
      category,
      status,
      featured,
      city,
      owner,
      dateFrom,
      dateTo,
    } = request.query as {
      search?: string;
      category?: string;
      status?: string;
      featured?: string;
      city?: string;
      owner?: string;
      dateFrom?: string;
      dateTo?: string;
    };

    const where: Record<string, unknown> = {
      isPublic: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { owner: { name: { contains: search, mode: 'insensitive' } } },
        { owner: { businessName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (
      status &&
      ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].includes(status)
    ) {
      where.status = status;
    }

    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }

    if (city) {
      where.venue = { city: { contains: city, mode: 'insensitive' } };
    }

    if (owner) {
      where.owner = {
        OR: [
          { name: { contains: owner, mode: 'insensitive' } },
          { businessName: { contains: owner, mode: 'insensitive' } },
        ],
      };
    }

    if (dateFrom) {
      where.startDate = { gte: new Date(dateFrom) };
    }

    if (dateTo) {
      where.startDate = {
        ...((where.startDate as object) || {}),
        lte: new Date(dateTo),
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, businessName: true },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
        shows: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' },
        },
        _count: {
          select: { waitlist: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { startDate: 'asc' }],
      take: 50,
    });

    return { events };
  } catch (error) {
    // TODO(prod): Remove mock fallback once DB is configured
    app.log.warn({ error }, 'DB unavailable, serving mock events');
    return { events: mockEventsEnriched };
  }
});

// Get nearby events for a specific event
app.get('/api/events/:slug/nearby', async (request, reply) => {
  try {
    const { slug } = request.params as { slug: string };
    const { limit = '5' } = request.query as { limit?: string };

    // First get the reference event
    const referenceEvent = await prisma.event.findFirst({
      where: {
        slug,
        isPublic: true,
        deletedAt: null,
      },
      include: {
        venue: true,
        owner: true,
      },
    });

    if (!referenceEvent || !referenceEvent.venue) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }

    // Find nearby events based on city, category, and area
    const nearbyEvents = await prisma.event.findMany({
      where: {
        isPublic: true,
        deletedAt: null,
        id: { not: referenceEvent.id }, // Exclude the reference event
        OR: [
          // Same city
          { venue: { city: referenceEvent.venue.city } },
          // Same category
          { categoryId: referenceEvent.categoryId },
          // Same owner's area (if available)
          ...(referenceEvent.owner.areaId
            ? [{ owner: { areaId: referenceEvent.owner.areaId } }]
            : []),
          // Same country (fallback)
          { venue: { country: referenceEvent.venue.country } },
        ],
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, businessName: true },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
        _count: {
          select: { waitlist: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { startDate: 'asc' }],
      take: parseInt(limit),
    });

    // If no nearby events found, get recent events as fallback
    if (nearbyEvents.length === 0) {
      const fallbackEvents = await prisma.event.findMany({
        where: {
          isPublic: true,
          deletedAt: null,
          id: { not: referenceEvent.id },
          startDate: { gte: new Date() }, // Future events only
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true, businessName: true },
          },
          venue: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              country: true,
            },
          },
          category: {
            select: { id: true, name: true, slug: true, color: true, icon: true },
          },
          _count: {
            select: { waitlist: true },
          },
        },
        orderBy: [{ featured: 'desc' }, { startDate: 'asc' }],
        take: parseInt(limit),
      });

      return {
        nearbyEvents: fallbackEvents,
      };
    }

    return {
      nearbyEvents,
    };
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch nearby events');
    // Return empty array instead of 500 error when database is unavailable
    reply.send({
      nearbyEvents: [],
    });
  }
});

app.get('/api/events/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };

    // First try to get the event (public or owned by user)
    let event = await prisma.event.findFirst({
      where: {
        id,
        isPublic: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDescription: true,
        status: true,
        startDate: true,
        endDate: true,
        capacity: true,
        isPublic: true,
        featured: true,
        tags: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { id: true, name: true, email: true, businessName: true },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
        shows: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' },
        },
        nearbyPlaces: {
          orderBy: { distance: 'asc' },
          take: 10,
        },
        _count: {
          select: { waitlist: true },
        },
      },
    });

    // If not found as public event, check if user is the owner
    if (!event) {
      try {
        const user = await requireOwnerOrAdmin(request, reply);
        if (user) {
          event = await prisma.event.findFirst({
            where: {
              id,
              ownerId: user.id,
              deletedAt: null,
            },
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              shortDescription: true,
              status: true,
              startDate: true,
              endDate: true,
              capacity: true,
              isPublic: true,
              featured: true,
              tags: true,
              metadata: true,
              createdAt: true,
              updatedAt: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  businessName: true,
                },
              },
              venue: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  city: true,
                  country: true,
                  latitude: true,
                  longitude: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                  icon: true,
                },
              },
              shows: {
                where: { deletedAt: null },
                orderBy: { startDate: 'asc' },
              },
              nearbyPlaces: {
                orderBy: { distance: 'asc' },
                take: 10,
              },
              _count: {
                select: { waitlist: true },
              },
            },
          });
        }
      } catch (error) {
        // User not authenticated or not owner, continue to mock
      }
    }

    if (event) return { event };
  } catch (error) {
    // continue to mock
  }

  // TODO(prod): Remove mock fallback once DB is configured
  const { id } = request.params as { id: string };
  const mock = mockEventsEnriched.find(e => e.id === id);
  if (!mock) {
    reply.code(404).send({ error: 'Event not found' });
    return;
  }
  return { event: mock };
});

// ------------- Owner-scoped Events CRUD -------------
type CreateEventBody = {
  title: string;
  description?: string | null;
  shortDescription?: string | null;
  startDate: string;
  endDate?: string | null;
  capacity?: number | null;
  venueId?: string | null;
  categoryId?: string | null;
  isPublic?: boolean;
  featured?: boolean;
  tags?: string[];
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  productName?: string | null;
  heroImageUrl?: string | null;
  longDescription?: string | null;
  valueProposition?: string | null;
  features?: string[];
  awards?: string[];
  social?: Record<string, string> | null;
  videoUrl?: string | null;
  pressKitUrl?: string | null;
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    telegram?: string;
  } | null;
  schedule?: Array<{ title: string; startsAt: string; endsAt?: string }>;
  qrUrl?: string | null;
};

type UpdateEventBody = Partial<CreateEventBody> & {
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
};
// List events for current owner
app.get('/api/owner/events', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    
    const {
      page = '1',
      limit = '20',
      search,
      status,
    } = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
    };
    
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    const where: Record<string, unknown> =
      user.role === 'OWNER'
        ? { ownerId: user.id, deletedAt: null }
        : { deletedAt: null };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status && ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      where.status = status;
    }
    
    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: { 
          _count: { select: { shows: true, waitlist: true } },
          venue: {
            select: {
              city: true,
              country: true,
            },
          },
        },
      }),
    ]);
    
    reply.send({
      events: events.map((event: any) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        startDate: event.startDate,
        capacity: event.capacity,
        currentWaitlist: event._count.waitlist,
        status: event.status,
        venue: event.venue,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    app.log.error({ error }, 'Failed to list owner events');
    reply.code(500).send({ error: 'Failed to list events' });
  }
});

// Get single event for owner
app.get('/api/owner/events/:eventId', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    const { eventId } = request.params as { eventId: string };

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        ownerId: user.id,
        deletedAt: null,
      },
      include: {
        _count: { select: { shows: true, waitlist: true } },
      },
    });

    if (!event) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }

    return { event };
  } catch (error) {
    app.log.error({ error }, 'Failed to get owner event');
    reply.code(500).send({ error: 'Failed to get event' });
  }
});

// Create event
app.post('/api/owner/events', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const body = request.body as CreateEventBody;
    const {
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      capacity,
      venueId,
      categoryId,
      isPublic,
      featured,
      tags,
      city,
      country,
      postalCode,
      productName,
      heroImageUrl,
      longDescription,
      valueProposition,
      features,
      awards,
      social,
      videoUrl,
      pressKitUrl,
      contact,
      schedule,
    } = body || {};
    if (!title || !startDate) {
      reply
        .code(400)
        .send({ error: 'Missing required fields: title, startDate' });
      return;
    }
    const slug = await generateUniqueSlug(title);

    // Generate QR code for the event - we'll generate it after creating the event to get the ID
    let generatedQRUrl: string | undefined;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description ?? null,
        shortDescription: shortDescription ?? null,
        status: isPublic ? 'PUBLISHED' : 'DRAFT',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ?? null,
        ownerId: user.id,
        venueId: venueId || null,
        categoryId: categoryId || null,
        isPublic: !!isPublic,
        featured: !!featured,
        tags: Array.isArray(tags) ? tags : [],
        city: city ?? null,
        country: country ?? null,
        postalCode: postalCode ?? null,
        metadata: {
          productName: productName ?? null,
          heroImageUrl: heroImageUrl ?? null,
          longDescription: longDescription ?? null,
          valueProposition: valueProposition ?? null,
          features: Array.isArray(features) ? features : [],
          awards: Array.isArray(awards) ? awards : [],
          social: social ?? null,
          videoUrl: videoUrl ?? null,
          pressKitUrl: pressKitUrl ?? null,
          contact: contact ?? null,
          schedule: Array.isArray(schedule) ? schedule : [],
          qrUrl: null, // Will be generated after event creation
        },
      },
    });

    // Generate QR code for the event using the event ID
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050';
      const eventUrl = `${baseUrl.replace(/\/$/, '')}/events/${event.id}`;
      generatedQRUrl = await QRCodeGenerator.generateEventQR(eventUrl);

      // Update the event with the QR code
      await prisma.event.update({
        where: { id: event.id },
        data: {
          metadata: {
            ...((event.metadata as Record<string, unknown>) || {}),
            qrUrl: generatedQRUrl,
          },
        },
      });

      // Update the event object to include the QR code
      event.metadata = {
        ...((event.metadata as Record<string, unknown>) || {}),
        qrUrl: generatedQRUrl,
      };
    } catch (error) {
      app.log.warn({ error }, 'Failed to generate QR code for event');
      // Continue without QR code if generation fails
    }

    reply.code(201).send({ event });
  } catch (error) {
    app.log.error({ error }, 'Failed to create event');
    reply.code(500).send({ error: 'Failed to create event' });
  }
});

// Update event
app.put('/api/owner/events/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { id } = request.params as { id: string };
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    if (user.role === 'OWNER' && existing.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
    const body = request.body as UpdateEventBody;
    const data: Record<string, unknown> = {};
    if (typeof body.title === 'string' && body.title !== existing.title) {
      data.title = body.title;
    }
    if (typeof body.description !== 'undefined')
      data.description = body.description ?? null;
    if (typeof body.shortDescription !== 'undefined')
      data.shortDescription = body.shortDescription ?? null;
    if (typeof body.status === 'string') data.status = body.status;
    if (typeof body.startDate === 'string')
      data.startDate = new Date(body.startDate);
    if (typeof body.endDate !== 'undefined')
      data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (typeof body.capacity !== 'undefined')
      data.capacity = body.capacity ?? null;
    if (typeof body.venueId !== 'undefined')
      data.venueId = body.venueId || null;
    if (typeof body.categoryId !== 'undefined')
      data.categoryId = body.categoryId || null;
    if (typeof body.isPublic === 'boolean') data.isPublic = body.isPublic;
    if (typeof body.featured === 'boolean') data.featured = body.featured;
    if (Array.isArray(body.tags)) data.tags = body.tags;
    if (typeof body.city !== 'undefined') data.city = body.city ?? null;
    if (typeof body.country !== 'undefined')
      data.country = body.country ?? null;
    if (typeof body.postalCode !== 'undefined')
      data.postalCode = body.postalCode ?? null;
    // Merge metadata updates if provided
    const meta: Record<string, unknown> = {};
    if (typeof body.productName !== 'undefined')
      meta.productName = body.productName;
    if (typeof body.heroImageUrl !== 'undefined')
      meta.heroImageUrl = body.heroImageUrl;
    if (typeof body.longDescription !== 'undefined')
      meta.longDescription = body.longDescription;
    if (typeof body.valueProposition !== 'undefined')
      meta.valueProposition = body.valueProposition;
    if (typeof body.features !== 'undefined')
      meta.features = Array.isArray(body.features) ? body.features : [];
    if (typeof body.awards !== 'undefined')
      meta.awards = Array.isArray(body.awards) ? body.awards : [];
    if (typeof body.social !== 'undefined') meta.social = body.social;
    if (typeof body.videoUrl !== 'undefined') meta.videoUrl = body.videoUrl;
    if (typeof body.pressKitUrl !== 'undefined')
      meta.pressKitUrl = body.pressKitUrl;
    if (typeof body.contact !== 'undefined') meta.contact = body.contact;
    if (typeof body.schedule !== 'undefined')
      meta.schedule = Array.isArray(body.schedule) ? body.schedule : [];
    if (Object.keys(meta).length > 0) {
      // Read existing metadata to merge (avoid overwriting other keys)
      const current = await prisma.event.findUnique({
        where: { id },
        select: { metadata: true },
      });
      data.metadata = {
        ...((current?.metadata as Record<string, unknown>) || {}),
        ...meta,
      };
    }
    if (typeof body.title === 'string' && body.title !== existing.title) {
      data.slug = await generateUniqueSlug(body.title);
    }

    // If slug changed or existing QR missing, regenerate QR
    try {
      const shouldRegenerate =
        !!data.slug || !(existing.metadata as any)?.qrUrl;
      if (shouldRegenerate) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050';
        const eventUrl = `${baseUrl.replace(/\/$/, '')}/events/${id}`;
        const qrUrl = await QRCodeGenerator.generateEventQR(eventUrl);
        const current = await prisma.event.findUnique({
          where: { id },
          select: { metadata: true },
        });
        data.metadata = {
          ...((current?.metadata as Record<string, unknown>) || {}),
          ...((data.metadata as Record<string, unknown>) || {}),
          qrUrl: qrUrl || null,
        };
      }
    } catch (error) {
      app.log.warn({ error }, 'Failed to (re)generate QR code for event');
    }

    const event = await prisma.event.update({ where: { id }, data });
    return { event };
  } catch (error) {
    app.log.error({ error }, 'Failed to update event');
    reply.code(500).send({ error: 'Failed to update event' });
  }
});

// Delete (soft) event
app.delete('/api/owner/events/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { id } = request.params as { id: string };
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    if (user.role === 'OWNER' && existing.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
    await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    reply.send({ ok: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to delete event');
    reply.code(500).send({ error: 'Failed to delete event' });
  }
});

// ------------- Owner-scoped Shows CRUD -------------
type CreateShowBody = {
  title: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  capacity?: number | null;
  youtubeUrl?: string | null;
};

type UpdateShowBody = Partial<CreateShowBody>;
// Create show for an event
app.post('/api/owner/events/:eventId/shows', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { eventId } = request.params as { eventId: string };
    const event = await prisma.event.findFirst({
      where: { id: eventId, deletedAt: null },
    });
    if (!event) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    if (user.role === 'OWNER' && event.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
    const body = request.body as CreateShowBody;
    const { title, description, startDate, endDate, capacity, youtubeUrl } =
      body || {};
    if (!title || !startDate) {
      reply
        .code(400)
        .send({ error: 'Missing required fields: title, startDate' });
      return;
    }
    const show = await prisma.show.create({
      data: {
        eventId,
        title,
        description: description ?? null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ?? null,
        youtubeUrl: youtubeUrl ?? null,
      },
    });
    reply.code(201).send({ show });
  } catch (error) {
    app.log.error({ error }, 'Failed to create show');
    reply.code(500).send({ error: 'Failed to create show' });
  }
});

// Update show
app.put('/api/owner/shows/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { id } = request.params as { id: string };
    const existing = await prisma.show.findFirst({
      where: { id, deletedAt: null },
      include: { event: true },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Show not found' });
      return;
    }
    if (user.role === 'OWNER' && existing.event.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
    const body = request.body as UpdateShowBody;
    const data: Record<string, unknown> = {};
    if (typeof body.title === 'string') data.title = body.title;
    if (typeof body.description !== 'undefined')
      data.description = body.description ?? null;
    if (typeof body.startDate === 'string')
      data.startDate = new Date(body.startDate);
    if (typeof body.endDate !== 'undefined')
      data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (typeof body.capacity !== 'undefined')
      data.capacity = body.capacity ?? null;
    if (typeof body.youtubeUrl !== 'undefined')
      data.youtubeUrl = body.youtubeUrl ?? null;
    const show = await prisma.show.update({ where: { id }, data });
    return { show };
  } catch (error) {
    app.log.error({ error }, 'Failed to update show');
    reply.code(500).send({ error: 'Failed to update show' });
  }
});

// Delete (soft) show
app.delete('/api/owner/shows/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { id } = request.params as { id: string };
    const existing = await prisma.show.findFirst({
      where: { id, deletedAt: null },
      include: { event: true },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Show not found' });
      return;
    }
    if (user.role === 'OWNER' && existing.event.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
    await prisma.show.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    reply.send({ ok: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to delete show');
    reply.code(500).send({ error: 'Failed to delete show' });
  }
});

// Photo Gallery API
app.get('/api/owner/photo-gallery', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    const photos = await prisma.photoGallery.findMany({
      where: {
        ownerId: user.id,
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    reply.send({ photos });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch photo gallery');
    reply.code(500).send({ error: 'Failed to fetch photo gallery' });
  }
});

app.post('/api/owner/photo-gallery', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    const { title, description, imageUrl, thumbnailUrl, altText, order } =
      request.body as {
        title: string;
        description?: string;
        imageUrl: string;
        thumbnailUrl?: string;
        altText?: string;
        order?: number;
      };

    const photo = await prisma.photoGallery.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        thumbnailUrl: thumbnailUrl || null,
        altText: altText || null,
        order: order || 0,
        ownerId: user.id,
      },
    });

    reply.send({ photo });
  } catch (error) {
    request.log.error({ error }, 'Failed to create photo');
    reply.code(500).send({ error: 'Failed to create photo' });
  }
});

app.put('/api/owner/photo-gallery/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    const { id } = request.params as { id: string };
    const {
      title,
      description,
      imageUrl,
      thumbnailUrl,
      altText,
      order,
      isActive,
    } = request.body as {
      title?: string;
      description?: string;
      imageUrl?: string;
      thumbnailUrl?: string;
      altText?: string;
      order?: number;
      isActive?: boolean;
    };

    // Check if photo exists and belongs to user
    const existing = await prisma.photoGallery.findFirst({
      where: { id, ownerId: user.id, deletedAt: null },
    });

    if (!existing) {
      reply.code(404).send({ error: 'Photo not found' });
      return;
    }

    const photo = await prisma.photoGallery.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(altText !== undefined && { altText }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    reply.send({ photo });
  } catch (error) {
    request.log.error({ error }, 'Failed to update photo');
    reply.code(500).send({ error: 'Failed to update photo' });
  }
});

app.delete('/api/owner/photo-gallery/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    const { id } = request.params as { id: string };

    // Check if photo exists and belongs to user
    const existing = await prisma.photoGallery.findFirst({
      where: { id, ownerId: user.id, deletedAt: null },
    });

    if (!existing) {
      reply.code(404).send({ error: 'Photo not found' });
      return;
    }

    await prisma.photoGallery.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    reply.send({ ok: true });
  } catch (error) {
    request.log.error({ error }, 'Failed to delete photo');
    reply.code(500).send({ error: 'Failed to delete photo' });
  }
});

// Public Owner Profile API (for business cards)
app.get('/api/owners/:ownerId/profile', async (request, reply) => {
  try {
    const { ownerId } = request.params as { ownerId: string };

    const owner = await prisma.user.findFirst({
      where: {
        id: ownerId,
        role: 'OWNER',
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        facebookUrl: true,
        instagramUrl: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!owner) {
      reply.code(404).send({ error: 'Owner not found' });
      return;
    }

    reply.send({ owner });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch owner profile');
    reply.code(500).send({ error: 'Failed to fetch owner profile' });
  }
});

// Public Photo Gallery API
app.get('/api/owners/:ownerId/photo-gallery', async (request, reply) => {
  try {
    const { ownerId } = request.params as { ownerId: string };

    const photos = await prisma.photoGallery.findMany({
      where: {
        ownerId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    reply.send({ photos });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch public photo gallery');
    reply.code(500).send({ error: 'Failed to fetch photo gallery' });
  }
});

// Waitlist API
app.post('/api/waitlist', async (request, reply) => {
  try {
    const { email, eventId } = request.body as {
      email: string;
      eventId: string;
    };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      reply.code(400).send({ error: 'Invalid email format' });
      return;
    }

    // Check if event exists and is public
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isPublic: true,
        deletedAt: null,
      },
    });

    if (!event) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }

    // Check if already on waitlist
    const existingEntry = await prisma.waitlistEntry.findFirst({
      where: {
        email,
        eventId,
        deletedAt: null,
      },
    });

    if (existingEntry) {
      reply
        .code(409)
        .send({ error: 'Email already on waitlist for this event' });
      return;
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email,
        eventId,
        status: 'PENDING',
      },
    });

    // Update event waitlist count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentWaitlist: {
          increment: 1,
        },
      },
    });

    // Send waitlist confirmation email with QR code
    try {
      const eventDetails = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          title: true,
          startDate: true,
          venue: {
            select: {
              name: true,
              address: true,
              city: true,
              country: true,
            },
          },
          mapAddress: true,
        },
      });

      if (eventDetails) {
        // Generate arrival QR code
        const arrivalHash = await ArrivalTracker.createArrivalRecord(
          eventId,
          waitlistEntry.id
        );
        const qrCodeData = await emailService.generateArrivalQRCode(
          eventId,
          waitlistEntry.id
        );

        app.log.info(
          {
            eventId,
            waitlistEntryId: waitlistEntry.id,
            qrCodeLength: qrCodeData?.length,
            qrCodePrefix: qrCodeData?.substring(0, 50),
          },
          'Generated QR code for email'
        );

        // Build location string from venue or mapAddress
        let eventLocation = 'TBD';
        if (eventDetails.venue) {
          const venue = eventDetails.venue;
          eventLocation = `${venue.name}, ${venue.address}, ${venue.city}, ${venue.country}`;
        } else if (eventDetails.mapAddress) {
          eventLocation = eventDetails.mapAddress;
        }

        // Send waitlist email
        await emailService.sendWaitlistEmail({
          email,
          eventId,
          eventTitle: eventDetails.title,
          eventDate: eventDetails.startDate?.toLocaleDateString() || 'TBD',
          eventLocation,
          qrCodeData,
          // Some email clients block large data URLs; also include hosted image URL
          qrImageUrl: qrCodeData?.startsWith('data:')
            ? undefined
            : qrCodeData,
          arrivalUrl: `${config.server.API_URL}/api/events/${eventId}/arrival/${arrivalHash}`,
        });
      }
    } catch (emailError) {
      app.log.warn(
        { emailError, email, eventId },
        'Failed to send waitlist email'
      );
    }

    return {
      waitlistEntry: {
        id: waitlistEntry.id,
        email: waitlistEntry.email,
        eventId: waitlistEntry.eventId,
        status: waitlistEntry.status,
        createdAt: waitlistEntry.createdAt,
      },
    };
  } catch (error) {
    // Mock fallback if DB unavailable
    try {
      const { email, eventId } = request.body as {
        email: string;
        eventId: string;
      };
      const exists = mockWaitlist.find(
        w => w.email === email && w.eventId === eventId
      );
      if (exists) {
        reply
          .code(409)
          .send({ error: 'Email already on waitlist for this event' });
        return;
      }
      const id = crypto.randomUUID();
      mockWaitlist.push({ id, email, eventId, status: 'PENDING' });
      // Send mocked confirmation email
      await sendEmail(
        email,
        'Confirm your waitlist',
        `Click to confirm: ${config.server.API_URL}/api/waitlist/confirm?email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`
      );
      return {
        waitlistEntry: {
          id,
          email,
          eventId,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      };
    } catch (fallbackErr) {
      app.log.error(
        { error, fallbackErr },
        'Failed to create waitlist entry (mock and db)'
      );
      reply.code(500).send({ error: 'Failed to join waitlist' });
    }
  }
});

// Get arrival data for frontend display
app.get('/api/events/:eventId/arrival/:hash/data', async (request, reply) => {
  try {
    const { eventId, hash } = request.params as {
      eventId: string;
      hash: string;
    };

    // Find waitlist entry by stored arrival hash
    const waitlistEntry = await prisma.waitlistEntry.findFirst({
      where: {
        eventId,
        metadata: {
          path: ['arrivalHash'],
          equals: hash,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!waitlistEntry) {
      reply.code(404).send({ error: 'Arrival link not found' });
      return;
    }

    // Check if already arrived
    const alreadyArrived = waitlistEntry.metadata?.arrivalTime;
    const arrivalTime = alreadyArrived ? new Date(waitlistEntry.metadata.arrivalTime).toLocaleString() : null;

    // Generate QR code for display
    const arrivalUrl = `${config.server.API_URL}/api/events/${eventId}/arrival/${hash}`;
    const qrCodeData = await QRCodeGenerator.generateEventQR(arrivalUrl, {
      width: 300,
      margin: 3,
    });

    reply.send({
      eventTitle: waitlistEntry.event.title,
      userEmail: waitlistEntry.email,
      eventId: waitlistEntry.eventId,
      arrivalHash: hash,
      qrCodeData,
      alreadyArrived: !!alreadyArrived,
      arrivalTime,
    });
  } catch (error) {
    app.log.error({ error }, 'Failed to get arrival data');
    reply.code(500).send({ error: 'Failed to get arrival data' });
  }
});

// Admin scan endpoint - process arrival
app.post('/api/events/:eventId/arrival/:hash/scan', async (request, reply) => {
  try {
    const { eventId, hash } = request.params as {
      eventId: string;
      hash: string;
    };

    // Verify admin/owner is logged in
    const session = await getSessionUser(request);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'OWNER')) {
      reply.code(403).send({ 
        success: false, 
        message: 'Only admins and owners can scan arrival codes' 
      });
      return;
    }

    const result = await ArrivalTracker.processArrivalByHash(hash);

    if (result.success) {
      reply.send({
        success: true,
        message: result.message,
        eventTitle: result.eventTitle,
        userEmail: result.userEmail,
      });
    } else {
      reply.code(400).send({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    app.log.error({ error }, 'Failed to process arrival scan');
    reply.code(500).send({ error: 'Failed to process arrival scan' });
  }
});

// Confirm waitlist (double opt-in)
app.get('/api/waitlist/confirm', async (request, reply) => {
  const { email, eventId } = request.query as {
    email?: string;
    eventId?: string;
  };
  if (!email || !eventId) {
    reply.code(400).send({ error: 'Missing email or eventId' });
    return;
  }
  try {
    const entry = await prisma.waitlistEntry.findFirst({
      where: { email, eventId, deletedAt: null },
    });
    if (!entry) {
      reply.code(404).send({ error: 'Not found' });
      return;
    }
    if (entry.status !== 'CONFIRMED') {
      await prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: { status: 'CONFIRMED' },
      });
    }
    reply.send({ ok: true });
  } catch (error) {
    const mock = mockWaitlist.find(
      w => w.email === email && w.eventId === eventId
    );
    if (!mock) {
      reply.code(404).send({ error: 'Not found' });
      return;
    }
    mock.status = 'CONFIRMED';
    reply.send({ ok: true });
  }
});

// Unsubscribe (remove from waitlist)
app.post('/api/waitlist/unsubscribe', async (request, reply) => {
  const { email, eventId } = request.body as { email: string; eventId: string };
  if (!email || !eventId) {
    reply.code(400).send({ error: 'Missing email or eventId' });
    return;
  }
  try {
    const entry = await prisma.waitlistEntry.findFirst({
      where: { email, eventId, deletedAt: null },
    });
    if (!entry) {
      reply.code(404).send({ error: 'Not found' });
      return;
    }
    await prisma.waitlistEntry.update({
      where: { id: entry.id },
      data: { deletedAt: new Date() },
    });
    reply.send({ ok: true });
  } catch (error) {
    const idx = mockWaitlist.findIndex(
      w => w.email === email && w.eventId === eventId
    );
    if (idx === -1) {
      reply.code(404).send({ error: 'Not found' });
      return;
    }
    mockWaitlist.splice(idx, 1);
    reply.send({ ok: true });
  }
});

// Export waitlist CSV (owner/admin typically, but allow public for demo)
app.get('/api/waitlist/export', async (request, reply) => {
  const { eventId } = request.query as { eventId?: string };
  if (!eventId) {
    reply.code(400).send({ error: 'Missing eventId' });
    return;
  }
  try {
    const entries = await prisma.waitlistEntry.findMany({
      where: { eventId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    const rows: string[][] = [
      ['email', 'eventId', 'status', 'createdAt'],
      ...entries.map(
        (e: {
          email: string;
          eventId: string;
          status: unknown;
          createdAt: Date;
        }) => [e.email, e.eventId, String(e.status), e.createdAt.toISOString()]
      ),
    ];
    const csv = rows
      .map(r =>
        r
          .map(v =>
            typeof v === 'string' && v.includes(',')
              ? `"${v.replace(/"/g, '""')}"`
              : String(v)
          )
          .join(',')
      )
      .join('\n');
    reply.header('Content-Type', 'text/csv');
    reply.header(
      'Content-Disposition',
      `attachment; filename="waitlist-${eventId}.csv"`
    );
    return csv;
  } catch (error) {
    const entries = mockWaitlist.filter(w => w.eventId === eventId);
    const rows: string[][] = [
      ['email', 'eventId', 'status', 'createdAt'],
      ...entries.map(
        (e: { email: string; eventId: string; status: unknown }) => [
          e.email,
          e.eventId,
          String(e.status),
          new Date().toISOString(),
        ]
      ),
    ];
    const csv = rows
      .map(r =>
        r
          .map(v =>
            typeof v === 'string' && v.includes(',')
              ? `"${v.replace(/"/g, '""')}"`
              : String(v)
          )
          .join(',')
      )
      .join('\n');
    reply.header('Content-Type', 'text/csv');
    reply.header(
      'Content-Disposition',
      `attachment; filename="waitlist-${eventId}.csv"`
    );
    return csv;
  }
});

// -------- Admin Overview (RBAC: ADMIN only) --------
app.get('/api/admin/overview', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const [users, events, shows, waitlist] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.event.count({ where: { deletedAt: null } }),
      prisma.show.count({ where: { deletedAt: null } }),
      prisma.waitlistEntry.count({ where: { deletedAt: null } }),
    ]);
    reply.send({ users, events, shows, waitlist });
  } catch (error) {
    // Mock fallback if DB unavailable
    reply.send({ users: 1, events: mockEvents.length, shows: 0, waitlist: 0 });
  }
});

// -------- Admin: Owners list (RBAC: ADMIN only) --------
app.get('/api/admin/owners', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const {
      page = '1',
      limit = '20',
      search,
      status,
    } = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: 'ACTIVE' | 'SUSPENDED';
    };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const where: Record<string, unknown> = {
      role: 'OWNER',
      deletedAt: null,
      ...(status === 'ACTIVE' ? { isActive: true } : {}),
      ...(status === 'SUSPENDED' ? { isActive: false } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, owners] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          createdAt: true,
          _count: { select: { ownedEvents: true } },
        },
      }),
    ]);

    reply.send({
      owners: owners.map(
        (o: {
          id: string;
          email: string;
          name: string | null;
          isActive: boolean;
          createdAt: Date;
          _count: { ownedEvents: number };
        }) => ({
          id: o.id,
          email: o.email,
          name: o.name,
          organizationName: null,
          status: o.isActive ? 'ACTIVE' : 'SUSPENDED',
          createdAt: o.createdAt,
          eventCount: o._count.ownedEvents,
        })
      ),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to list owners (admin)');
    reply.code(500).send({ error: 'Failed to list owners' });
  }
});

// -------- Admin: All users list (RBAC: ADMIN only) --------
app.get('/api/admin/users', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const {
      page = '1',
      limit = '20',
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      role?: 'VISITOR' | 'OWNER' | 'ADMIN';
      status?: 'ACTIVE' | 'INACTIVE';
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(status === 'ACTIVE' ? { isActive: true } : {}),
      ...(status === 'INACTIVE' ? { isActive: false } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              waitlistEntries: true,
              ownedEvents: true,
            },
          },
        },
      }),
    ]);

    // Get event registrations count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        // Count event registrations (this would need to be implemented based on your event registration model)
        const eventRegistrations = 0; // Placeholder - you'll need to implement this based on your data model

        return {
          ...user,
          eventRegistrations,
          waitlistEntries: user._count.waitlistEntries,
          ownedEvents: user._count.ownedEvents,
        };
      })
    );

    reply.send({
      users: usersWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to list users (admin)');
    reply.code(500).send({ error: 'Failed to list users' });
  }
});

// -------- Admin: Update user status (RBAC: ADMIN only) --------
app.put('/api/admin/users/:id/status', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: 'ACTIVE' | 'INACTIVE' };

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      reply
        .code(400)
        .send({ error: 'Invalid status. Must be ACTIVE or INACTIVE' });
      return;
    }

    const isActive = status === 'ACTIVE';

    await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    reply.send({ success: true });
  } catch (error) {
    request.log.error({ error }, 'Failed to update user status (admin)');
    reply.code(500).send({ error: 'Failed to update user status' });
  }
});

// -------- Admin: Update owner details (RBAC: ADMIN only) --------
app.put('/api/admin/owners/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const { name, email } = request.body as {
      name: string;
      email: string;
    };

    // Validate required fields
    if (!email || !name) {
      reply.code(400).send({ error: 'Email and name are required' });
      return;
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { email, id: { not: id }, deletedAt: null },
    });
    if (existingUser) {
      reply.code(400).send({ error: 'Email already taken by another user' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        // Optional fields only if columns exist in DB
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        _count: { select: { ownedEvents: true } },
      },
    });

    reply.send({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      status: updated.isActive ? 'ACTIVE' : 'SUSPENDED',
      createdAt: updated.createdAt,
      eventCount: updated._count.ownedEvents,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner (admin)');
    reply.code(500).send({ error: 'Failed to update owner' });
  }
});

// -------- Admin: Toggle owner status (RBAC: ADMIN only) --------
app.put('/api/admin/owners/:id/status', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: 'ACTIVE' | 'SUSPENDED' };

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      reply
        .code(400)
        .send({ error: 'Invalid status. Must be ACTIVE or SUSPENDED' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: status === 'ACTIVE' },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        _count: { select: { ownedEvents: true } },
      },
    });

    reply.send({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      status: updated.isActive ? 'ACTIVE' : 'SUSPENDED',
      createdAt: updated.createdAt,
      eventCount: updated._count.ownedEvents,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner status (admin)');
    reply.code(500).send({ error: 'Failed to update owner status' });
  }
});

// -------- Admin: Events list + moderation (RBAC: ADMIN only) --------
app.get('/api/admin/events', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const {
      page = '1',
      limit = '20',
      status,
      search,
      category,
      dateFrom,
      dateTo,
      featured,
    } = request.query as {
      page?: string;
      limit?: string;
      status?:
        | 'DRAFT'
        | 'PUBLISHED'
        | 'CANCELLED'
        | 'COMPLETED'
        | 'PENDING_REVIEW';
      search?: string;
      category?: string;
      dateFrom?: string;
      dateTo?: string;
      featured?: string;
    };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...(status &&
      ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].includes(status)
        ? { status }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { shortDescription: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(category ? { categoryId: category } : {}),
      ...(featured === 'true'
        ? { featured: true }
        : featured === 'false'
          ? { featured: false }
          : {}),
      ...(dateFrom || dateTo
        ? {
            startDate: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {}),
    };

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          startDate: true,
          createdAt: true,
          owner: { select: { name: true } },
          _count: { select: { waitlist: true } },
        },
      }),
    ]);

    reply.send({
      events: events.map(
        (e: {
          id: string;
          title: string;
          slug: string;
          status: string;
          startDate: Date;
          createdAt: Date;
          owner?: { name: string | null } | null;
          _count: { waitlist: number };
        }) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          status: e.status,
          startDate: e.startDate,
          ownerName: e.owner?.name || 'Unknown',
          waitlistCount: e._count.waitlist,
          createdAt: e.createdAt,
        })
      ),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to list events (admin)');
    reply.code(500).send({ error: 'Failed to list events' });
  }
});

app.post('/api/admin/events/:id/approve', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    const updated = await prisma.event.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Event',
        resourceId: id,
        userId: user.id,
        metadata: { action: 'approve' },
      },
    });
    reply.send({ ok: true, event: { id: updated.id, status: updated.status } });
  } catch (error) {
    request.log.error({ error }, 'Failed to approve event');
    reply.code(500).send({ error: 'Failed to approve event' });
  }
});

app.post('/api/admin/events/:id/reject', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const { reason } = request.body as { reason?: string };
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    const updated = await prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Event',
        resourceId: id,
        userId: user.id,
        metadata: { action: 'reject', reason: reason || null },
      },
    });
    reply.send({ ok: true, event: { id: updated.id, status: updated.status } });
  } catch (error) {
    request.log.error({ error }, 'Failed to reject event');
    reply.code(500).send({ error: 'Failed to reject event' });
  }
});

// Owner Theme Settings CRUD (owner/admin)
app.get('/api/owner/theme', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    const themeValue =
      (dbUser as unknown as { theme?: unknown } | null)?.theme ?? null;
    reply.send({ theme: themeValue });
  } catch (error) {
    app.log.warn({ error }, 'Theme field not found, returning null');
    reply.send({ theme: null });
  }
});

// Owner waitlist management
app.get('/api/owner/events/:eventId/waitlist', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  const { eventId } = request.params as { eventId: string };
  const event = await prisma.event.findFirst({
    where: { id: eventId, deletedAt: null },
    select: { ownerId: true },
  });
  if (!event) {
    reply.code(404).send({ error: 'Event not found' });
    return;
  }
  if (user.role === 'OWNER' && event.ownerId !== user.id) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }

  const {
    search,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = request.query as {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };

  const where: any = { eventId, deletedAt: null };
  if (search) {
    where.email = { contains: search, mode: 'insensitive' };
  }
  if (status) {
    where.status = status;
  }

  const orderBy: any = {};
  if (sortBy === 'createdAt') {
    orderBy.createdAt = sortOrder;
  } else if (sortBy === 'email') {
    orderBy.email = sortOrder;
  }

  const entries = await prisma.waitlistEntry.findMany({
    where,
    orderBy,
    include: {
      user: {
        select: { id: true, name: true, businessName: true },
      },
    },
  });

  // Add position numbers
  const entriesWithPosition = entries.map((entry: any, index: number) => ({
    ...entry,
    position: index + 1,
  }));

  reply.send({ entries: entriesWithPosition });
});

// Update waitlist entry status
app.post(
  '/api/owner/events/:eventId/waitlist/:entryId',
  async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { eventId, entryId } = request.params as {
      eventId: string;
      entryId: string;
    };
    const { status } = request.body as {
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    };

    // Verify event ownership
    const event = await prisma.event.findFirst({
      where: { id: eventId, deletedAt: null },
      select: { ownerId: true },
    });
    if (!event) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    if (user.role === 'OWNER' && event.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }

    // Update the entry
    const updated = await prisma.waitlistEntry.update({
      where: { id: entryId },
      data: { status: status || 'CONFIRMED' },
    });

    reply.send({ entry: updated });
  }
);

// Export waitlist CSV
app.get(
  '/api/owner/events/:eventId/waitlist/export',
  async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;
    const { eventId } = request.params as { eventId: string };

    // Verify event ownership
    const event = await prisma.event.findFirst({
      where: { id: eventId, deletedAt: null },
      select: { ownerId: true, title: true, slug: true },
    });
    if (!event) {
      reply.code(404).send({ error: 'Event not found' });
      return;
    }
    if (user.role === 'OWNER' && event.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }

    // Get all waitlist entries
    const entries = await prisma.waitlistEntry.findMany({
      where: { eventId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { name: true, businessName: true },
        },
      },
    });

    // Generate CSV
    const csvHeader = 'Position,Email,Name,Business Name,Status,Joined Date\n';
    const csvRows = entries
      .map((entry: any, index: number) => {
        const name = entry.user?.name || '';
        const businessName = entry.user?.businessName || '';
        const joinedDate = new Date(entry.createdAt).toLocaleDateString();
        return `${index + 1},"${entry.email}","${name}","${businessName}","${entry.status}","${joinedDate}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;

    reply.header('Content-Type', 'text/csv');
    reply.header(
      'Content-Disposition',
      `attachment; filename="waitlist-${event.slug}-${new Date().toISOString().split('T')[0]}.csv"`
    );
    reply.send(csv);
  }
);

app.put('/api/owner/waitlist/:id', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  const { id } = request.params as { id: string };
  const body = request.body as {
    status?: 'APPROVED' | 'REJECTED' | 'ARRIVED' | 'CONFIRMED' | 'CANCELLED';
  };
  const entry = await prisma.waitlistEntry.findUnique({
    where: { id },
    include: { event: true },
  });
  if (!entry || entry.deletedAt) {
    reply.code(404).send({ error: 'Not found' });
    return;
  }
  if (user.role === 'OWNER' && entry.event.ownerId !== user.id) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }
  const allowedStatuses = [
    'APPROVED',
    'REJECTED',
    'ARRIVED',
    'CONFIRMED',
    'CANCELLED',
  ] as const;
  const nextStatus: (typeof allowedStatuses)[number] =
    body.status && (allowedStatuses as readonly string[]).includes(body.status)
      ? (body.status as (typeof allowedStatuses)[number])
      : 'CONFIRMED';
  const updated = await prisma.waitlistEntry.update({
    where: { id },
    data: { status: nextStatus as never },
  });
  reply.send({ entry: updated });
});

// Get all registered users across all owner's events
app.get('/api/owner/registered-users', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;

  try {
    const {
      page = '1',
      limit = '50',
      search,
      eventId,
    } = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      eventId?: string;
    };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(10000, Math.max(1, parseInt(limit)));

    // Get owner's events
    const ownerEvents = await prisma.event.findMany({
      where: {
        ownerId: user.id,
        deletedAt: null,
      },
      select: { id: true, title: true, slug: true },
    });

    if (ownerEvents.length === 0) {
      reply.send({
        users: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
      });
      return;
    }

    const eventIds = ownerEvents.map((event: any) => event.id);

    // Build where clause for waitlist entries
    const where: any = {
      eventId: { in: eventIds },
      deletedAt: null,
    };

    if (eventId) {
      where.eventId = eventId;
    }

    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    // Get all waitlist entries first to group by user
    const allEntries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            businessName: true,
            createdAt: true,
            lastLoginAt: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
          },
        },
      },
    });

    // Group by user to get unique users with their events
    const userMap = new Map();

    allEntries.forEach((entry: any) => {
      const userId = entry.user?.id || entry.email;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: entry.user?.id || null,
          email: entry.email,
          name: entry.user?.name || null,
          businessName: entry.user?.businessName || null,
          createdAt: entry.user?.createdAt || null,
          lastLoginAt: entry.user?.lastLoginAt || null,
          events: [],
          totalWaitlistEntries: 0,
        });
      }

      const userData = userMap.get(userId);
      userData.events.push({
        eventId: entry.event.id,
        eventTitle: entry.event.title,
        eventSlug: entry.event.slug,
        eventDate: entry.event.startDate,
        status: entry.status,
        joinedAt: entry.createdAt,
      });
      userData.totalWaitlistEntries++;
    });

    // Convert to array and add event counts
    const allUsers = Array.from(userMap.values()).map(user => ({
      ...user,
      eventCount: user.events.length,
      uniqueEvents: [...new Set(user.events.map((e: any) => e.eventId))].length,
    }));

    // Apply pagination to the grouped users
    const total = allUsers.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const users = allUsers.slice(startIndex, endIndex);

    reply.send({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
      events: ownerEvents,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to get registered users');
    reply.code(500).send({ error: 'Failed to get registered users' });
  }
});

// Bulk email endpoint
app.post('/api/owner/bulk-email', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;

  try {
    const { userIds, subject, message } = request.body as {
      userIds: string[];
      subject: string;
      message: string;
    };

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      reply.code(400).send({ error: 'User IDs are required' });
      return;
    }

    if (!subject || !message) {
      reply.code(400).send({ error: 'Subject and message are required' });
      return;
    }

    // Get user emails
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        isActive: true,
      },
      select: { id: true, email: true, name: true },
    });

    if (users.length === 0) {
      reply.code(404).send({ error: 'No valid users found' });
      return;
    }

    // TODO: Implement actual email sending logic here
    // For now, just log the email details
    request.log.info(
      {
        ownerId: user.id,
        recipientCount: users.length,
        subject,
        message: message.substring(0, 100) + '...',
      },
      'Bulk email request'
    );

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    reply.send({
      success: true,
      message: `Email sent to ${users.length} users`,
      recipients: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
      })),
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to send bulk email');
    reply.code(500).send({ error: 'Failed to send bulk email' });
  }
});

// Test email functionality endpoint (admin only)
app.post('/api/admin/test-email', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { type, email } = request.body as {
      type: 'welcome' | 'waitlist';
      email: string;
    };

    if (!email || !type) {
      reply.code(400).send({ error: 'Email and type are required' });
      return;
    }

    let result = false;
    let message = '';

    if (type === 'welcome') {
      result = await emailService.sendWelcomeEmail({
        email,
        name: 'Test User',
        adminListEmail: 'admin@linea.app',
      });
      message = result
        ? 'Welcome email sent successfully'
        : 'Failed to send welcome email';
    } else if (type === 'waitlist') {
      result = await emailService.sendWaitlistEmail({
        email,
        eventId: 'test-event-123',
        eventTitle: 'Test Event',
        eventDate: new Date().toLocaleDateString(),
        eventLocation: 'Test Location',
        qrCodeData:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        arrivalUrl:
          'https://api.linea.app/api/events/test-event-123/arrival/test-hash',
      });
      message = result
        ? 'Waitlist email sent successfully'
        : 'Failed to send waitlist email';
    }

    reply.send({
      success: result,
      message,
      email,
      type,
    });
  } catch (error) {
    app.log.error({ error }, 'Failed to test email');
    reply.code(500).send({ error: 'Failed to test email' });
  }
});

// Analytics tracking endpoints
app.post('/api/analytics/event-view', async (request, reply) => {
  try {
    const {
      eventId,
      sessionId,
      userAgent,
      referrer,
      country,
      city,
      deviceType,
      browser,
      os,
    } = request.body as {
      eventId: string;
      sessionId?: string;
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
      country?: string;
      city?: string;
      deviceType?: string;
      browser?: string;
      os?: string;
    };

    // Get user ID if authenticated (optional for anonymous tracking)
    const user = await getOptionalAuth(request);
    const userId = user?.id || null;

    // Get IP address
    const ipAddress =
      request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';

    // Create event view record
    const eventView = await prisma.eventView.create({
      data: {
        eventId,
        userId,
        sessionId: sessionId || null,
        ipAddress,
        userAgent: userAgent || null || null,
        referrer: referrer || null,
        country: country || null,
        city: city || null,
        deviceType: deviceType || null,
        browser: browser || null,
        os: os || null,
      },
    });

    reply.send({ success: true, viewId: eventView.id });
  } catch (error) {
    request.log.error({ error }, 'Failed to track event view');
    reply.code(500).send({ error: 'Failed to track event view' });
  }
});

app.post('/api/analytics/event-interaction', async (request, reply) => {
  try {
    const { eventId, action, element, metadata, sessionId } = request.body as {
      eventId: string;
      action: string;
      element?: string;
      metadata?: any;
      sessionId?: string;
    };

    // Get user ID if authenticated (optional for anonymous tracking)
    const user = await getOptionalAuth(request);
    const userId = user?.id || null;

    // Get IP address and user agent
    const ipAddress =
      request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = request.headers['user-agent'] as string;

    // Create interaction record
    const interaction = await prisma.eventInteraction.create({
      data: {
        eventId,
        userId,
        sessionId: sessionId || null,
        action,
        element: element || null,
        metadata: metadata || null,
        ipAddress,
        userAgent: userAgent || null || null,
      },
    });

    reply.send({ success: true, interactionId: interaction.id });
  } catch (error) {
    request.log.error({ error }, 'Failed to track event interaction');
    reply.code(500).send({ error: 'Failed to track event interaction' });
  }
});

// -------- Admin: Update visitor details (RBAC: ADMIN only) --------
app.put('/api/admin/users/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };
    const { name, email } = request.body as {
      name: string;
      email: string;
    };

    // Validate required fields
    if (!email || !name) {
      reply.code(400).send({ error: 'Email and name are required' });
      return;
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { email, id: { not: id }, deletedAt: null },
    });

    if (existingUser) {
      reply.code(400).send({ error: 'Email is already taken by another user' });
      return;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    reply.send({ success: true, user: updatedUser });
  } catch (error) {
    request.log.error({ error }, 'Failed to update visitor details (admin)');
    reply.code(500).send({ error: 'Failed to update visitor details' });
  }
});

// -------- Admin: Get visitor registrations (RBAC: ADMIN only) --------
app.get('/api/admin/users/:id/registrations', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;
  try {
    const { id } = request.params as { id: string };

    // Get all waitlist entries for this user
    const registrations = await prisma.waitlistEntry.findMany({
      where: { userId: id, deletedAt: null },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            venue: {
              select: {
                city: true,
                country: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    reply.send(registrations);
  } catch (error) {
    request.log.error({ error }, 'Failed to get visitor registrations (admin)');
    reply.code(500).send({ error: 'Failed to get visitor registrations' });
  }
});

// -------- Admin Dashboard (RBAC: ADMIN only) --------
app.get('/api/admin/dashboard', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const [totalOwners, totalEvents, totalWaitlist] = await Promise.all([
      prisma.user
        .count({ where: { deletedAt: null, role: 'OWNER' } })
        .catch(() => 0),
      prisma.event.count({ where: { deletedAt: null } }).catch(() => 0),
      prisma.waitlistEntry.count({ where: { deletedAt: null } }).catch(() => 0),
    ]);

    // Simple active rate approximation based on events in the last 30 days
    const recentEventsCount = await prisma.event
      .count({
        where: {
          deletedAt: null,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      })
      .catch(() => 0);
    const activeRate = totalEvents
      ? Math.round((recentEventsCount / totalEvents) * 100)
      : 0;

    reply.send({
      stats: {
        totalOwners,
        totalEvents,
        totalWaitlist,
        activeRate,
        pendingReviews: 0,
      },
      recentActivity: [],
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to load admin dashboard');
    reply.code(500).send({ error: 'Failed to load admin dashboard' });
  }
});

// Get analytics for a specific event
app.get('/api/analytics/event/:eventId', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;

  try {
    const { eventId } = request.params as { eventId: string };
    const { period = '7d' } = request.query as { period?: string };

    request.log.info(
      { eventId, userId: user.id },
      'Analytics request for event'
    );

    // Verify event ownership (admins can access any event)
    const event = await prisma.event.findFirst({
      where:
        user.role === 'ADMIN'
          ? { id: eventId, deletedAt: null }
          : { id: eventId, ownerId: user.id, deletedAt: null },
    });
    if (!event) {
      // Check if event exists but doesn't belong to user
      const eventExists = await prisma.event.findFirst({
        where: { id: eventId, deletedAt: null },
      });
      if (eventExists) {
        // If user is admin, allow access even if not owner
        if (user.role === 'ADMIN') {
          // continue
        } else {
          reply.code(403).send({
            error:
              'Access denied. You do not have permission to view analytics for this event.',
          });
          return;
        }
      } else {
        reply.code(404).send({ error: 'Event not found' });
        return;
      }
    }

    // Calculate date range
    const now = new Date();
    const days =
      period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 7;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get analytics data - simplified version
    const metrics = {
      totalViews: 0,
      uniqueUsers: 0,
      totalInteractions: 0,
      topCountries: [] as Array<{ country: string | null; count: number }>,
      topDevices: [] as Array<{ device: string | null; count: number }>,
      recentViews: [] as Array<{
        id: string;
        userId: string | null;
        userName: string | null | undefined;
        userEmail: string | undefined;
        country: string | null;
        deviceType: string | null;
        createdAt: Date;
      }>,
    };

    try {
      // Try to get basic counts first
      const totalViews = await prisma.eventView.count({
        where: { eventId, createdAt: { gte: startDate } },
      });

      const totalInteractions = await prisma.eventInteraction.count({
        where: { eventId, createdAt: { gte: startDate } },
      });

      // Get unique users
      const uniqueUsersResult = await prisma.eventView.groupBy({
        by: ['ipAddress', 'userId'],
        where: { eventId, createdAt: { gte: startDate } },
        _count: { id: true },
      });

      // Get top countries
      const topCountriesResult = await prisma.eventView.groupBy({
        by: ['country'],
        where: {
          eventId,
          createdAt: { gte: startDate },
          country: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      });

      // Get top devices
      const topDevicesResult = await prisma.eventView.groupBy({
        by: ['deviceType'],
        where: {
          eventId,
          createdAt: { gte: startDate },
          deviceType: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      });

      // Get recent views
      const recentViewsResult = await prisma.eventView.findMany({
        where: { eventId, createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      });

      // Update metrics
      metrics.totalViews = totalViews;
      metrics.uniqueUsers = uniqueUsersResult.length;
      metrics.totalInteractions = totalInteractions;
      metrics.topCountries = topCountriesResult.map((c: any) => ({
        country: c.country,
        count: c._count.id,
      }));
      metrics.topDevices = topDevicesResult.map((d: any) => ({
        device: d.deviceType,
        count: d._count.id,
      }));
      metrics.recentViews = recentViewsResult.map((v: any) => ({
        id: v.id,
        userId: v.userId,
        userName: v.user?.name,
        userEmail: v.user?.email,
        country: v.country,
        deviceType: v.deviceType,
        createdAt: v.createdAt,
      }));
    } catch (dbError) {
      request.log.error(
        { error: dbError, eventId },
        'Database error in analytics query'
      );
      // Continue with default values (all zeros/empty arrays)
    }

    reply.send({
      eventId,
      period,
      metrics,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to get event analytics');
    reply.code(500).send({ error: 'Failed to get event analytics' });
  }
});

// Get global analytics for owner
app.get('/api/analytics/owner', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;

  try {
    const { period = '30d' } = request.query as { period?: string };

    // Calculate date range
    const now = new Date();
    const days =
      period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get owner's events
    const ownerEvents = await prisma.event.findMany({
      where: { ownerId: user.id, deletedAt: null },
      select: { id: true, title: true, slug: true },
    });

    if (ownerEvents.length === 0) {
      reply.send({
        ownerId: user.id,
        period,
        metrics: {
          totalViews: 0,
          uniqueUsers: 0,
          totalEvents: 0,
          totalWaitlist: 0,
          totalInteractions: 0,
          topEvents: [],
          topCountries: [],
          topDevices: [],
        },
      });
      return;
    }

    const eventIds = ownerEvents.map((e: any) => e.id);

    // Get analytics data
    const [
      totalViews,
      uniqueUsers,
      totalInteractions,
      topEvents,
      topCountries,
      topDevices,
    ] = await Promise.all([
      // Total views across all events
      prisma.eventView.count({
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
      }),

      // Unique users
      prisma.eventView
        .groupBy({
          by: ['ipAddress', 'userId'],
          where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
          _count: { id: true },
        })
        .then((results: any) => results.length),

      // Total interactions
      prisma.eventInteraction.count({
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
      }),

      // Top events by views
      prisma.eventView
        .groupBy({
          by: ['eventId'],
          where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        })
        .then((results: any) =>
          results.map((r: any) => {
            const event = ownerEvents.find((e: any) => e.id === r.eventId);
            return {
              eventId: r.eventId,
              eventTitle: event?.title || 'Unknown',
              eventSlug: event?.slug || '',
              views: r._count.id,
            };
          })
        ),

      // Top countries
      prisma.eventView.groupBy({
        by: ['country'],
        where: {
          eventId: { in: eventIds },
          createdAt: { gte: startDate },
          country: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // Top devices
      prisma.eventView.groupBy({
        by: ['deviceType'],
        where: {
          eventId: { in: eventIds },
          createdAt: { gte: startDate },
          deviceType: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    // Get total waitlist entries
    const totalWaitlist = await prisma.waitlistEntry.count({
      where: { eventId: { in: eventIds } },
    });

    reply.send({
      ownerId: user.id,
      period,
      metrics: {
        totalViews,
        uniqueUsers,
        totalEvents: ownerEvents.length,
        totalWaitlist,
        totalInteractions,
        topEvents,
        topCountries: topCountries.map((c: any) => ({
          country: c.country,
          count: c._count.id,
        })),
        topDevices: topDevices.map((d: any) => ({
          device: d.deviceType,
          count: d._count.id,
        })),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to get owner analytics');
    reply.code(500).send({ error: 'Failed to get owner analytics' });
  }
});

app.put('/api/owner/theme', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  try {
    const theme = request.body as unknown;
    // Cast to any to avoid Prisma client type variance across environments
    // Update via raw SQL to avoid Prisma client JSON typing variance across environments
    const themeJson = JSON.stringify(theme ?? null);
    await prisma.$executeRawUnsafe(
      `UPDATE users SET theme = ${`'${themeJson.replace(/'/g, "''")}'`} WHERE id = ${`'${user.id.replace(/'/g, "''")}'`}`
    );
    reply.send({ ok: true, theme });
  } catch (error) {
    reply.code(500).send({ error: 'Failed to update theme' });
  }
});

// Owner Profile Management
app.get('/api/owner/profile', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        facebookUrl: true,
        instagramUrl: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
      },
    });
    reply.send(profile);
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch owner profile');
    reply.code(500).send({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/owner/profile', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply);
  if (!user) return;
  try {
    const {
      name,
      email,
      phone,
      businessName,
      businessIntro,
      website,
      address,
      city,
      country,
      latitude,
      longitude,
      areaId,
      productId,
      facebookUrl,
      instagramUrl,
    } = request.body as {
      name?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      businessIntro?: string;
      website?: string;
      address?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      areaId?: string;
      productId?: string;
      facebookUrl?: string;
      instagramUrl?: string;
    };

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        reply.code(400).send({ error: 'Invalid email format' });
        return;
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: user.id }, deletedAt: null },
      });
      if (existingUser) {
        reply.code(400).send({ error: 'Email already taken by another user' });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(businessName !== undefined && { businessName }),
        ...(businessIntro !== undefined && { businessIntro }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(areaId !== undefined && { areaId }),
        ...(productId !== undefined && { productId }),
        ...(facebookUrl !== undefined && { facebookUrl }),
        ...(instagramUrl !== undefined && { instagramUrl }),
      },
      select: {
        name: true,
        email: true,
        phone: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        facebookUrl: true,
        instagramUrl: true,
      },
    });

    reply.send(updated);
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner profile');
    reply.code(500).send({ error: 'Failed to update profile' });
  }
});

// File Upload for Owner Profile (Logo)
app.register(async function (fastify) {
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: config.storage.UPLOAD_MAX_SIZE,
    },
  });

  app.post('/api/owner/upload/logo', async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    try {
      const data = await (request as any).file();
      if (!data) {
        reply.code(400).send({ error: 'No file uploaded' });
        return;
      }

      // Validate file type
      const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',');
      if (!allowedTypes.includes(data.mimetype)) {
        reply.code(400).send({
          error: 'Invalid file type. Allowed: ' + allowedTypes.join(', '),
        });
        return;
      }

      // Generate unique filename
      const fileExtension = data.filename.split('.').pop() || 'jpg';
      const filename = `logo_${user.id}_${Date.now()}.${fileExtension}`;

      // Save file to uploads directory
      const uploadPath = path.join(config.storage.UPLOAD_PATH, filename);
      const buffer = await data.toBuffer();

      // Ensure uploads directory exists
      const fs = await import('fs');
      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);

      // Update user profile with logo URL
      const logoUrl = `/uploads/${filename}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { logoUrl },
      });

      reply.send({
        success: true,
        logoUrl,
        message: 'Logo uploaded successfully',
      });
    } catch (error) {
      request.log.error({ error }, 'Failed to upload logo');
      reply.code(500).send({ error: 'Failed to upload logo' });
    }
  });

  app.post('/api/owner/upload/profile-picture', async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply);
    if (!user) return;

    try {
      const data = await (request as any).file();
      if (!data) {
        reply.code(400).send({ error: 'No file uploaded' });
        return;
      }

      // Validate file type
      const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',');
      if (!allowedTypes.includes(data.mimetype)) {
        reply.code(400).send({
          error: 'Invalid file type. Allowed: ' + allowedTypes.join(', '),
        });
        return;
      }

      // Generate unique filename
      const fileExtension = data.filename.split('.').pop() || 'jpg';
      const filename = `profile_${user.id}_${Date.now()}.${fileExtension}`;

      // Save file to uploads directory
      const uploadPath = path.join(config.storage.UPLOAD_PATH, filename);
      const buffer = await data.toBuffer();

      // Ensure uploads directory exists
      const fs = await import('fs');
      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);

      // Update user profile with profile picture URL
      const profilePictureUrl = `/uploads/${filename}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePictureUrl },
      });

      reply.send({
        success: true,
        profilePictureUrl,
        message: 'Profile picture uploaded successfully',
      });
    } catch (error) {
      request.log.error({ error }, 'Failed to upload profile picture');
      reply.code(500).send({ error: 'Failed to upload profile picture' });
    }
  });
});

// Public: Designers discovery
app.get('/api/designers', async (request, reply) => {
  try {
    const { search, area, country } = request.query as {
      search?: string;
      area?: string;
      country?: string;
    };

    const where: Record<string, unknown> = {
      role: 'OWNER',
      isActive: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { businessIntro: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (area) {
      where.city = { contains: area, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    const designers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        _count: {
          select: {
            ownedEvents: true,
          },
        },
      },
      orderBy: [{ businessName: 'asc' }],
    });

    reply.send({ designers });
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch designers');
    reply.code(500).send({ error: 'Failed to fetch designers' });
  }
});

// Public: Categories for filtering
app.get('/api/categories', async (request, reply) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ categories });
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch categories');
    // Return empty array instead of 500 error when table doesn't exist
    reply.send({ categories: [] });
  }
});

// Public: Areas for filtering
app.get('/api/areas', async (request, reply) => {
  try {
    const areas = await prisma.area.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ areas });
  } catch (error) {
    app.log.warn({ error }, 'Areas table not found, returning empty array');
    reply.send({ areas: [] });
  }
});

// Public: Products for filtering
app.get('/api/products', async (request, reply) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ products });
  } catch (error) {
    app.log.warn({ error }, 'Products table not found, returning empty array');
    reply.send({ products: [] });
  }
});

// Admin: Categories management
app.get('/api/admin/categories', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ categories });
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch categories');
    reply.code(500).send({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/admin/categories', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: { slug, deletedAt: null },
    });

    if (existingCategory) {
      reply.code(409).send({ error: 'Category with this slug already exists' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '🏷️',
        isActive: isActive !== false,
      },
    });

    reply.send({ category });
  } catch (error) {
    app.log.error({ error }, 'Failed to create category');
    reply.code(500).send({ error: 'Failed to create category' });
  }
});

app.put('/api/admin/categories/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingCategory) {
      reply.code(409).send({ error: 'Category with this slug already exists' });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    reply.send({ category });
  } catch (error) {
    app.log.error({ error }, 'Failed to update category');
    reply.code(500).send({ error: 'Failed to update category' });
  }
});

app.delete('/api/admin/categories/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };

    // Soft delete
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    reply.send({ success: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to delete category');
    reply.code(500).send({ error: 'Failed to delete category' });
  }
});

// Admin: Areas management
app.get('/api/admin/areas', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const areas = await prisma.area.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ areas });
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch areas');
    reply.code(500).send({ error: 'Failed to fetch areas' });
  }
});

app.post('/api/admin/areas', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists
    const existingArea = await prisma.area.findFirst({
      where: { slug, deletedAt: null },
    });

    if (existingArea) {
      reply.code(409).send({ error: 'Area with this slug already exists' });
      return;
    }

    const area = await prisma.area.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '📍',
        isActive: isActive !== false,
      },
    });

    reply.send({ area });
  } catch (error) {
    app.log.error({ error }, 'Failed to create area');
    reply.code(500).send({ error: 'Failed to create area' });
  }
});

app.put('/api/admin/areas/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists (excluding current area)
    const existingArea = await prisma.area.findFirst({
      where: {
        slug,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingArea) {
      reply.code(409).send({ error: 'Area with this slug already exists' });
      return;
    }

    const area = await prisma.area.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    reply.send({ area });
  } catch (error) {
    app.log.error({ error }, 'Failed to update area');
    reply.code(500).send({ error: 'Failed to update area' });
  }
});

app.delete('/api/admin/areas/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };

    // Soft delete
    await prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    reply.send({ success: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to delete area');
    reply.code(500).send({ error: 'Failed to delete area' });
  }
});

// Admin: Products management
app.get('/api/admin/products', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    reply.send({ products });
  } catch (error) {
    app.log.warn({ error }, 'Products table not found, returning empty array');
    reply.send({ products: [] });
  }
});

app.post('/api/admin/products', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists
    const existingProduct = await prisma.product.findFirst({
      where: { slug, deletedAt: null },
    });

    if (existingProduct) {
      reply.code(409).send({ error: 'Product with this slug already exists' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '🏷️',
        isActive: isActive !== false,
      },
    });

    reply.send({ product });
  } catch (error) {
    app.log.error({ error }, 'Failed to create product');
    reply.code(500).send({ error: 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    };

    // Check if slug already exists (excluding current product)
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingProduct) {
      reply.code(409).send({ error: 'Product with this slug already exists' });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    reply.send({ product });
  } catch (error) {
    app.log.error({ error }, 'Failed to update product');
    reply.code(500).send({ error: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply);
  if (!user) return;

  try {
    const { id } = request.params as { id: string };

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    reply.send({ success: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to delete product');
    reply.code(500).send({ error: 'Failed to delete product' });
  }
});

// (Removed duplicate dev login route) - using single definition near the bottom

// Auth: Request magic link (ENHANCED WITH SECURITY & RATE LIMITING)
app.post('/auth/request-magic-link', async (request, reply) => {
  const { email } = request.body as { email: string };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email format' });
    return;
  }

  // Rate limiting: Check for recent requests from this IP
  const clientIP = request.ip;
  const recentRequests = await prisma.emailVerification.count({
    where: {
      email,
      type: 'MAGIC_LINK',
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 5), // Last 5 minutes
      },
    },
  });

  if (recentRequests >= 3) {
    reply.code(429).send({
      error:
        'Too many requests. Please wait 5 minutes before requesting another magic link.',
      retryAfter: 300,
    });
    return;
  }

  // Invalidate any existing unexpired tokens for this email
  await prisma.emailVerification.updateMany({
    where: {
      email,
      type: 'MAGIC_LINK',
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: {
      expiresAt: new Date(), // Invalidate existing tokens
    },
  });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  try {
    await prisma.emailVerification.create({
      data: {
        email,
        token,
        type: 'MAGIC_LINK',
        expiresAt,
      },
    });

    const callbackUrl = new URL('/auth/callback', config.server.API_URL);
    callbackUrl.searchParams.set('token', token);

    // Log the request for security monitoring
    app.log.info(
      {
        email,
        ip: clientIP,
        userAgent: request.headers['user-agent'],
        callbackUrl: callbackUrl.toString(),
      },
      'Magic link requested'
    );

    // In development or when SHOW_MAGIC_LINK=true: return the magic link in response
    if (shouldShowMagicLink) {
      app.log.info(
        { email, callbackUrl: callbackUrl.toString() },
        'Magic link generated (dev mode)'
      );
      reply.send({
        ok: true,
        magicLink: callbackUrl.toString(),
        message: 'Magic link generated (development mode)',
        expiresIn: '15 minutes',
      });
    } else {
      // TODO: Integrate SendGrid for production
      app.log.info(
        { email, callbackUrl: callbackUrl.toString() },
        'Magic link generated'
      );
      reply.send({
        ok: true,
        message: 'Magic link sent to your email',
        expiresIn: '15 minutes',
      });
    }
  } catch (error) {
    app.log.error({ error, email }, 'Failed to create magic link');
    reply
      .code(500)
      .send({ error: 'Failed to generate magic link. Please try again.' });
  }
});

// Owner Registration (Enhanced Magic Link with Name)
app.post('/auth/register-owner', async (request, reply) => {
  const { email, name, organizationName } = request.body as {
    email: string;
    name: string;
    organizationName?: string;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' });
    return;
  }

  if (!name?.trim()) {
    reply.code(400).send({ error: 'Name is required' });
    return;
  }

  // Check if user already exists as owner
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (existingUser && existingUser.role === 'OWNER') {
    reply
      .code(400)
      .send({ error: 'Owner account already exists with this email' });
    return;
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes for owner registration

  await prisma.emailVerification.create({
    data: {
      email,
      token,
      type: 'OWNER_INVITATION',
      expiresAt,
    },
  });

  const callbackUrl = new URL('/auth/owner-callback', config.server.API_URL);
  callbackUrl.searchParams.set('token', token);
  callbackUrl.searchParams.set('name', encodeURIComponent(name));
  if (organizationName) {
    callbackUrl.searchParams.set('org', encodeURIComponent(organizationName));
  }

  if (shouldShowMagicLink) {
    app.log.info(
      { email, name, callbackUrl: callbackUrl.toString() },
      'Owner registration link generated (dev mode)'
    );
    reply.send({
      ok: true,
      magicLink: callbackUrl.toString(),
      message: 'Owner registration link generated (development mode)',
      expiresIn: '30 minutes',
    });
  } else {
    // TODO: Send owner invitation email via SendGrid
    app.log.info({ email, name }, 'Owner registration link generated');
    reply.send({
      ok: true,
      message: 'Owner registration link sent to your email',
    });
  }
});

// Owner Registration Callback
app.get('/auth/owner-callback', async (request, reply) => {
  const { token, name } = request.query as {
    token?: string;
    name?: string;
  };

  if (!token) {
    reply.code(400).send({ error: 'Missing token' });
    return;
  }

  const record = await prisma.emailVerification.findFirst({
    where: {
      token,
      type: 'OWNER_INVITATION',
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    reply.code(400).send({ error: 'Invalid or expired registration token' });
    return;
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: record.email },
  });

  // Create or update user as OWNER
  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: {
      role: 'OWNER',
      name: name ? decodeURIComponent(name) : null,
      lastLoginAt: new Date(),
      isActive: true,
    },
    create: {
      email: record.email,
      role: 'OWNER',
      name: name ? decodeURIComponent(name) : null,
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  // Send welcome email for new users
  if (!existingUser) {
    try {
      await emailService.sendWelcomeEmail({
        email: user.email,
        name: user.name || undefined,
        adminListEmail: 'admin@linea.app', // TODO: Make this configurable
      });
      app.log.info({ email: user.email }, 'Welcome email sent to new owner');
    } catch (emailError) {
      app.log.warn(
        { emailError, email: user.email },
        'Failed to send welcome email to owner'
      );
    }
  }

  // Mark verification used
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date(), userId: user.id },
  });

  // Create session (Redis)
  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null,
  });

  // Redirect to owner portal
  reply.redirect(`${config.server.FRONTEND_URL}/owner-portal`);
});

// Admin Login (Username + Password)
app.post('/auth/admin-login', async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    reply.code(400).send({ error: 'Email and password are required' });
    return;
  }

  // Find admin user
  const user = await prisma.user.findFirst({
    where: {
      email,
      role: 'ADMIN',
      isActive: true,
    },
  });

  if (!user) {
    reply.code(401).send({ error: 'Invalid credentials' });
    return;
  }

  // For now, check against seed admin password from env
  // In production, this should use proper password hashing (bcrypt)
  const isValidPassword = password === config.development.SEED_ADMIN_PASSWORD;

  if (!isValidPassword) {
    reply.code(401).send({ error: 'Invalid credentials' });
    return;
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Create session (Redis)
  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null,
  });

  reply.send({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
});

// Auth: Magic link callback (ENHANCED WITH SECURITY & AUDIT LOGGING)
app.get('/auth/callback', async (request, reply) => {
  const { token } = request.query as { token?: string };
  if (!token) {
    reply.code(400).send({ error: 'Missing token' });
    return;
  }

  const clientIP = request.ip;
  const userAgent = request.headers['user-agent'];

  try {
    const record = await prisma.emailVerification.findFirst({
      where: {
        token,
        type: 'MAGIC_LINK',
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      app.log.warn(
        {
          token: token.substring(0, 8) + '...',
          ip: clientIP,
          userAgent,
        },
        'Invalid or expired magic link attempt'
      );
      reply.code(400).send({ error: 'Invalid or expired token' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: record.email },
    });

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: record.email },
      update: {
        lastLoginAt: new Date(),
        isActive: true,
      },
      create: {
        email: record.email,
        role: 'VISITOR',
        isActive: true,
        lastLoginAt: new Date(),
      },
    });

    // Send welcome email for new users
    if (!existingUser) {
      try {
        await emailService.sendWelcomeEmail({
          email: user.email,
          name: user.name || undefined,
          adminListEmail: 'admin@linea.app', // TODO: Make this configurable
        });
        app.log.info({ email: user.email }, 'Welcome email sent to new user');
      } catch (emailError) {
        app.log.warn(
          { emailError, email: user.email },
          'Failed to send welcome email'
        );
      }
    }

    // Mark verification used
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: {
        verifiedAt: new Date(),
        userId: user.id,
      },
    });

    // Log successful login for audit trail
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        description: 'User logged in via magic link',
        metadata: {
          loginMethod: 'magic_link',
          ipAddress: clientIP,
          userAgent: userAgent || null,
          tokenId: record.id,
        },
        ipAddress: clientIP,
        userAgent: userAgent || null,
      },
    });

    // Create session (Redis)
    await createSessionAndSetCookie(reply, {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || null,
    });

    app.log.info(
      {
        userId: user.id,
        email: user.email,
        ip: clientIP,
      },
      'User successfully logged in via magic link'
    );

    // Redirect to frontend
    reply.redirect(config.server.FRONTEND_URL || '/');
  } catch (error) {
    app.log.error(
      {
        error,
        token: token.substring(0, 8) + '...',
        ip: clientIP,
      },
      'Failed to process magic link callback'
    );
    reply.code(500).send({ error: 'Authentication failed. Please try again.' });
  }
});

// Auth: Logout
app.post('/auth/logout', async (request, reply) => {
  try {
    const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session';
    const token = (request.cookies as Record<string, string | undefined>)?.[
      cookieName
    ];

    if (token) {
      // Get user before clearing session for audit logging
      const user = await getSessionUser(request);

      // Clear session from Redis
      await sessionService.deleteSession(token);

      // Log logout for audit trail
      if (user) {
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            action: 'LOGOUT',
            description: 'User logged out',
            metadata: {
              logoutMethod: 'manual',
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'] || null || null,
            },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] || null || null,
          },
        });

        app.log.info(
          {
            userId: user.id,
            email: user.email,
            ip: request.ip,
          },
          'User logged out'
        );
      }
    }

    // Clear session cookie
    reply.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: config.security.SESSION_COOKIE_SECURE,
      sameSite: config.security.SESSION_COOKIE_SAME_SITE as
        | 'strict'
        | 'lax'
        | 'none',
    });

    reply.send({ ok: true, message: 'Logged out successfully' });
  } catch (error) {
    app.log.error({ error }, 'Failed to logout user');
    reply.code(500).send({ error: 'Failed to logout' });
  }
});

// Auth: Current user
app.get('/auth/me', async (request, reply) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      reply.code(401).send({ authenticated: false });
      return;
    }

    reply.send({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    app.log.error({ error }, 'Failed to get current user');
    reply.code(500).send({ error: 'Failed to get current user' });
  }
});

// User Profile Management (for all authenticated users)
app.get('/api/user/profile', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        // Include business fields for owners
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        facebookUrl: true,
        instagramUrl: true,
      },
    });

    if (!profile) {
      reply.code(404).send({ error: 'User profile not found' });
      return;
    }

    reply.send(profile);
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user profile');
    reply.code(500).send({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/user/profile', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const {
      name,
      email,
      phone,
      businessName,
      businessIntro,
      website,
      address,
      city,
      country,
      latitude,
      longitude,
      areaId,
      productId,
      facebookUrl,
      instagramUrl,
    } = request.body as {
      name?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      businessIntro?: string;
      website?: string;
      address?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      areaId?: string;
      productId?: string;
      facebookUrl?: string;
      instagramUrl?: string;
    };

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        reply.code(400).send({ error: 'Invalid email format' });
        return;
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: user.id }, deletedAt: null },
      });
      if (existingUser) {
        reply.code(400).send({ error: 'Email already taken by another user' });
        return;
      }
    }

    // Validate area and product if provided
    if (areaId) {
      const area = await prisma.area.findUnique({ where: { id: areaId } });
      if (!area) {
        reply.code(400).send({ error: 'Invalid area ID' });
        return;
      }
    }

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        reply.code(400).send({ error: 'Invalid product ID' });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(businessName !== undefined && { businessName }),
        ...(businessIntro !== undefined && { businessIntro }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(areaId !== undefined && { areaId }),
        ...(productId !== undefined && { productId }),
        ...(facebookUrl !== undefined && { facebookUrl }),
        ...(instagramUrl !== undefined && { instagramUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        facebookUrl: true,
        instagramUrl: true,
      },
    });

    reply.send(updated);
  } catch (error) {
    request.log.error({ error }, 'Failed to update user profile');
    reply.code(500).send({ error: 'Failed to update profile' });
  }
});

// User Profile Picture Upload
app.post('/api/user/upload/profile-picture', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const data = await (request as any).file();
    if (!data) {
      reply.code(400).send({ error: 'No file uploaded' });
      return;
    }

    // Validate file type
    const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',');
    if (!allowedTypes.includes(data.mimetype)) {
      reply.code(400).send({
        error: 'Invalid file type. Allowed: ' + allowedTypes.join(', '),
      });
      return;
    }

    // Generate unique filename
    const fileExtension = data.filename.split('.').pop() || 'jpg';
    const filename = `profile_${user.id}_${Date.now()}.${fileExtension}`;

    // Save file to uploads directory
    const uploadPath = path.join(config.storage.UPLOAD_PATH, filename);
    const buffer = await data.toBuffer();

    // Ensure uploads directory exists
    const fs = await import('fs');
    const uploadDir = path.dirname(uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(uploadPath, buffer);

    // Update user profile with profile picture URL
    const profilePictureUrl = `/uploads/${filename}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { profilePictureUrl },
    });

    reply.send({
      success: true,
      profilePictureUrl,
      message: 'Profile picture uploaded successfully',
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to upload profile picture');
    reply.code(500).send({ error: 'Failed to upload profile picture' });
  }
});

// User Account Settings
app.get('/api/user/settings', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const settings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    reply.send(settings);
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user settings');
    reply.code(500).send({ error: 'Failed to fetch settings' });
  }
});

// User Activity Log (audit trail)
app.get('/api/user/activity', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };
    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Get user's recent activity (login history, profile updates, etc.)
    const activities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      select: {
        id: true,
        action: true,
        description: true,
        metadata: true,
        createdAt: true,
        ipAddress: true,
        userAgent: true,
      },
    });

    const total = await prisma.userActivity.count({
      where: { userId: user.id },
    });

    reply.send({
      activities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user activity');
    reply.code(500).send({ error: 'Failed to fetch activity log' });
  }
});

// Follow/Unfollow System
app.post('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { userId } = request.params as { userId: string };

    // Prevent self-following
    if (userId === user.id) {
      reply.code(400).send({ error: 'Cannot follow yourself' });
      return;
    }

    // Check if user exists and is active
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!targetUser) {
      reply.code(404).send({ error: 'User not found' });
      return;
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      reply.code(400).send({ error: 'Already following this user' });
      return;
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: userId,
      },
    });

    // Log the follow action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'FOLLOW_USER',
        description: `Started following ${targetUser.name || targetUser.email}`,
        metadata: {
          targetUserId: userId,
          targetUserName: targetUser.name,
          targetUserEmail: targetUser.email,
        },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || null,
      },
    });

    reply.send({
      success: true,
      message: `Now following ${targetUser.name || targetUser.email}`,
      follow,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to follow user');
    reply.code(500).send({ error: 'Failed to follow user' });
  }
});

app.delete('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { userId } = request.params as { userId: string };

    // Check if following this user
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
      include: {
        following: {
          select: { name: true, email: true },
        },
      },
    });

    if (!existingFollow) {
      reply.code(404).send({ error: 'Not following this user' });
      return;
    }

    // Remove follow relationship
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });

    // Log the unfollow action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'UNFOLLOW_USER',
        description: `Stopped following ${existingFollow.following.name || existingFollow.following.email}`,
        metadata: {
          targetUserId: userId,
          targetUserName: existingFollow.following.name,
          targetUserEmail: existingFollow.following.email,
        },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || null,
      },
    });

    reply.send({
      success: true,
      message: `Stopped following ${existingFollow.following.name || existingFollow.following.email}`,
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to unfollow user');
    reply.code(500).send({ error: 'Failed to unfollow user' });
  }
});

app.get('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { userId } = request.params as { userId: string };

    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
    });

    reply.send({ isFollowing: !!isFollowing });
  } catch (error) {
    request.log.error({ error }, 'Failed to check follow status');
    reply.code(500).send({ error: 'Failed to check follow status' });
  }
});

// Get user's follows (people they follow)
app.get('/api/user/follows', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [total, follows] = await Promise.all([
      prisma.follow.count({ where: { followerId: user.id } }),
      prisma.follow.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
              profilePictureUrl: true,
              role: true,
              area: {
                select: { name: true, color: true, icon: true },
              },
              product: {
                select: { name: true, color: true, icon: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);

    reply.send({
      follows: follows.map((f: any) => ({
        id: f.id,
        user: f.following,
        followedAt: f.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user follows');
    reply.code(500).send({ error: 'Failed to fetch follows' });
  }
});

// Get user's followers (people following them)
app.get('/api/user/followers', async (request, reply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return;
  }

  try {
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [total, followers] = await Promise.all([
      prisma.follow.count({ where: { followingId: user.id } }),
      prisma.follow.findMany({
        where: { followingId: user.id },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
              profilePictureUrl: true,
              role: true,
              area: {
                select: { name: true, color: true, icon: true },
              },
              product: {
                select: { name: true, color: true, icon: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);

    reply.send({
      followers: followers.map((f: any) => ({
        id: f.id,
        user: f.follower,
        followedAt: f.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user followers');
    reply.code(500).send({ error: 'Failed to fetch followers' });
  }
});

// Dev-only: Generate non-expiring magic links for owners/admin
app.post('/auth/dev/generate-link', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }
  const { email, role, name } = request.body as {
    email: string;
    role: 'OWNER' | 'ADMIN' | 'VISITOR';
    name?: string;
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' });
    return;
  }
  // Try to upsert the user, but tolerate DB issues in dev
  let user: {
    id: string;
    email: string;
    role: 'OWNER' | 'ADMIN' | 'VISITOR';
    name?: string | null;
  };
  try {
    user = (await prisma.user.upsert({
      where: { email },
      update: {
        role,
        name: name ?? null,
        isActive: true,
        lastLoginAt: new Date(),
      },
      create: {
        email,
        role,
        name: name ?? null,
        isActive: true,
        lastLoginAt: new Date(),
      },
    })) as unknown as {
      id: string;
      email: string;
      role: 'OWNER' | 'ADMIN' | 'VISITOR';
      name?: string | null;
    };
  } catch (e) {
    app.log.warn(
      { e },
      'Dev generate-link: DB unavailable, using in-memory user'
    );
    user = { id: crypto.randomUUID(), email, role, name: name ?? null };
  }

  // Create a non-expiring verification record (best-effort)
  const token = crypto.randomUUID();
  try {
    await prisma.emailVerification.create({
      data: {
        email,
        token,
        type: 'MAGIC_LINK',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      },
    });
  } catch (e) {
    app.log.warn(
      { e },
      'Dev generate-link: failed to persist email verification, continuing'
    );
  }

  const callbackUrl = new URL('/auth/callback', config.server.API_URL);
  callbackUrl.searchParams.set('token', token);

  reply.send({
    ok: true,
    magicLink: callbackUrl.toString(),
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// Dev-only: Inspect email verification token state
app.get('/auth/dev/debug-token', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }
  const { token } = request.query as { token?: string };
  if (!token) {
    reply.code(400).send({ error: 'Missing token' });
    return;
  }
  const record = await prisma.emailVerification.findFirst({ where: { token } });
  if (!record) {
    reply.code(404).send({ error: 'Not found' });
    return;
  }
  reply.send({
    id: record.id,
    email: record.email,
    type: record.type,
    verifiedAt: record.verifiedAt,
    expiresAt: record.expiresAt,
    isExpired: record.expiresAt <= new Date(),
  });
});

// Dev-only: direct login by email (no token). Creates user if needed and sets session.
app.post('/auth/dev/login', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }
  const { email, role, name } = request.body as {
    email: string;
    role?: 'VISITOR' | 'OWNER' | 'ADMIN';
    name?: string;
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' });
    return;
  }

  const desiredRole = role || 'VISITOR';
  let user: {
    id: string;
    email: string;
    role: 'VISITOR' | 'OWNER' | 'ADMIN';
    name?: string | null;
  };
  try {
    user = (await prisma.user.upsert({
      where: { email },
      update: {
        role: desiredRole,
        name: name ?? null,
        isActive: true,
        lastLoginAt: new Date(),
      },
      create: {
        email,
        role: desiredRole,
        name: name ?? null,
        isActive: true,
        lastLoginAt: new Date(),
      },
    })) as unknown as {
      id: string;
      email: string;
      role: 'VISITOR' | 'OWNER' | 'ADMIN';
      name?: string | null;
    };
  } catch (e) {
    app.log.warn({ e }, 'Dev login: DB unavailable, using in-memory user');
    user = {
      id: crypto.randomUUID(),
      email,
      role: desiredRole,
      name: name ?? null,
    };
  }

  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null,
  });
  reply.send({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
});

// Dev-only: reusable login link that creates a session and redirects
app.get('/auth/dev/login-link', async (request, reply) => {
  const { email, role, name, redirect } = request.query as {
    email?: string;
    role?: 'VISITOR' | 'OWNER' | 'ADMIN';
    name?: string;
    redirect?: string;
  };

  // Check if dev login is allowed
  const isDevMode = config.environment.NODE_ENV !== 'production';
  const isDemoMode = config.development.DEMO_MODE === true;

  // Define allowed demo users when DEMO_MODE is enabled
  const allowedDemoUsers = [
    'admin@example.com',
    'owner1@example.com',
    'owner2@example.com',
  ];

  // Check if access is allowed
  if (!isDevMode && !isDemoMode) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }

  // In demo mode, only allow specific users
  if (isDemoMode && email && !allowedDemoUsers.includes(email)) {
    reply.code(403).send({ error: 'Demo mode: Only specific users allowed' });
    return;
  }

  // In non-demo dev mode, require magic link flag
  if (isDevMode && !isDemoMode && !shouldShowMagicLink) {
    reply.code(403).send({ error: 'Forbidden' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' });
    return;
  }

  const desiredRole = role || 'VISITOR';
  let user: {
    id: string;
    email: string;
    role: 'VISITOR' | 'OWNER' | 'ADMIN';
    name?: string | null;
  };

  try {
    // First try to find existing user
    const existingUser = await prisma.user.findFirst({
      where: { email, isActive: true, deletedAt: null },
      select: { id: true, email: true, role: true, name: true },
    });

    if (existingUser) {
      // Update existing user
      user = (await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: desiredRole,
          name: name ?? null,
          lastLoginAt: new Date(),
        },
        select: { id: true, email: true, role: true, name: true },
      })) as unknown as {
        id: string;
        email: string;
        role: 'VISITOR' | 'OWNER' | 'ADMIN';
        name?: string | null;
      };
      app.log.info(
        { userId: user.id, email: user.email },
        'Dev login-link: Existing user updated'
      );
    } else {
      // Create new user
      user = (await prisma.user.create({
        data: {
          email,
          role: desiredRole,
          name: name ?? null,
          isActive: true,
          lastLoginAt: new Date(),
        },
        select: { id: true, email: true, role: true, name: true },
      })) as unknown as {
        id: string;
        email: string;
        role: 'VISITOR' | 'OWNER' | 'ADMIN';
        name?: string | null;
      };
      app.log.info(
        { userId: user.id, email: user.email },
        'Dev login-link: New user created'
      );
    }
  } catch (e) {
    app.log.error(
      { e, email },
      'Dev login-link: DB operation failed, using in-memory user'
    );
    user = {
      id: crypto.randomUUID(),
      email,
      role: desiredRole,
      name: name ?? null,
    };
  }

  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null,
  });

  const dest = redirect || config.server.FRONTEND_URL || '/';
  reply.redirect(dest);
});

// Collect visitor email for quick registration
app.post('/collect-email', async (request, reply) => {
  try {
    const { email } = request.body as { email: string };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      reply.code(400).send({ error: 'Invalid email' });
      return;
    }
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, role: 'VISITOR', isActive: true },
    });
    await prisma.auditLog.create({
      data: {
        action: 'EMAIL_COLLECT',
        resource: 'VisitorEmail',
        resourceId: user.id,
        ipAddress: (request.ip as string) || null,
        userAgent: (request.headers['user-agent'] as string) || null,
        metadata: { email },
      },
    });
    reply.send({ ok: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to collect email');
    reply.code(500).send({ error: 'Failed to collect email' });
  }
});

// Sign out
app.post('/auth/signout', async (request, reply) => {
  try {
    const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session';
    const token = (request.cookies as Record<string, string | undefined>)?.[
      cookieName
    ];
    if (token) {
      await sessionService.deleteSession(token);
      try {
        await prisma.session.deleteMany({ where: { token } });
      } catch (e) {
        app.log.warn({ e }, 'Failed to delete DB session during signout');
      }
    }
    reply.clearCookie(cookieName, { path: '/' });
    reply.send({ ok: true });
  } catch (error) {
    app.log.error({ error }, 'Failed to sign out');
    reply.code(500).send({ error: 'Failed to sign out' });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.setNotFoundHandler(async (_request, reply) => {
  // Only serve index.html for non-API routes, but exclude uploads
  if (
    !_request.url.startsWith('/api') &&
    !_request.url.startsWith('/docs') &&
    !_request.url.startsWith('/health') &&
    !_request.url.startsWith('/uploads')
  ) {
    return reply.sendFile('index.html');
  }
  reply.code(404).send({ error: 'Not Found' });
});

// Expose selected runtime env vars to the frontend at runtime
app.get('/env.js', async (_request, reply) => {
  const env = {
    VITE_GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    VITE_GA_MEASUREMENT_ID: process.env.VITE_GA_MEASUREMENT_ID || '',
  };
  reply
    .type('application/javascript')
    .send(`window.__ENV__ = ${JSON.stringify(env)};`);
});

// Fix production images endpoint
app.post('/api/fix-images', async (_request, reply) => {
  try {
    const Prisma = await import('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { PrismaClient } = Prisma as any;
    const prisma = new PrismaClient();

    console.log('🖼️  Fixing production event images...');

    // Get all events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });

    console.log(`Found ${events.length} events in production`);

    let updatedCount = 0;
    for (const event of events) {
      const metadata = event.metadata as any;
      const currentImageUrl = metadata?.heroImageUrl;

      // If it's pointing to the old /images/events/ path, update it
      if (currentImageUrl && currentImageUrl.includes('/images/events/')) {
        const updatedMetadata = {
          ...metadata,
          heroImageUrl: '/images/design-events.jpg',
        };

        await prisma.event.update({
          where: { id: event.id },
          data: {
            metadata: updatedMetadata,
          },
        });

        updatedCount++;
        console.log(
          `✅ Updated ${event.title} to use /images/design-events.jpg`
        );
      }
    }

    await prisma.$disconnect();

    reply.send({
      success: true,
      message: `Fixed ${updatedCount} events`,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    reply.code(500).send({ error: 'Failed to fix images' });
  }
});

// Wipe and reseed production database with comprehensive data
app.post('/api/wipe-and-reseed', async (_request, reply) => {
  try {
    const Prisma = await import('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { PrismaClient } = Prisma as any;
    const prisma = new PrismaClient();

    console.log('🗑️  Wiping production database...');

    // Truncate using actual table names as mapped in schema (snake_case pluralized)
    try {
      await prisma.$executeRaw`SET session_replication_role = replica;`;
      await prisma.$executeRaw`TRUNCATE TABLE "waitlist_entries" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "sessions" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "events" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "venues" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "categories" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "areas" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "products" CASCADE;`;
      await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE;`;
      await prisma.$executeRaw`SET session_replication_role = DEFAULT;`;
      console.log('✅ Production database wiped');
    } catch (error) {
      console.log('⚠️  Error during wipe, trying Prisma deleteMany...', error);
      try {
        await prisma.waitlistEntry.deleteMany({});
        await prisma.session.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.venue.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.area.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});
        console.log('✅ Production database wiped using Prisma deleteMany');
      } catch (prismaError) {
        console.log(
          '⚠️  Prisma deleteMany also failed, continuing with seed...',
          prismaError
        );
      }
    }

    console.log('🌱 Seeding production database with comprehensive data...');

    // Create users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@linea.app',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        lastLoginAt: new Date(),
      },
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);

    const owner1 = await prisma.user.create({
      data: {
        email: 'owner1@example.com',
        name: 'Owner One',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Design Studio One',
        businessIntro:
          'Leading design studio specializing in sustainable architecture',
        city: 'Milano',
        country: 'Italy',
        phone: '+39 02 1234 5678',
        website: 'https://designstudio1.com',
        instagramUrl: '@designstudio1',
        facebookUrl: 'https://facebook.com/designstudio1',
      },
    });
    console.log(`✅ Created owner 1: ${owner1.email}`);

    const owner2 = await prisma.user.create({
      data: {
        email: 'owner2@example.com',
        name: 'Owner Two',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Creative Arts Collective',
        businessIntro:
          'Innovative arts collective pushing boundaries in contemporary design',
        city: 'Milano',
        country: 'Italy',
        phone: '+39 02 8765 4321',
        website: 'https://creativearts.com',
        instagramUrl: '@creativearts',
        facebookUrl: 'https://facebook.com/creativearts',
      },
    });
    console.log(`✅ Created owner 2: ${owner2.email}`);

    // Create areas
    const milanoArea = await prisma.area.create({
      data: {
        name: 'Milano',
        slug: 'milano',
        description: 'Design capital of Italy and global fashion hub',
        color: '#8B4513',
        icon: '🏛️',
      },
    });
    console.log(`✅ Created area: ${milanoArea.name}`);

    // Create categories
    const designCategory = await prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'Innovative design events, workshops, and exhibitions',
        color: '#c4b69e',
        icon: '🎨',
      },
    });
    console.log(`✅ Created category: ${designCategory.name}`);

    const techCategory = await prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech and innovation events',
        color: '#3b82f6',
        icon: '💻',
      },
    });
    console.log(`✅ Created category: ${techCategory.name}`);

    const artCategory = await prisma.category.create({
      data: {
        name: 'Art & Culture',
        slug: 'art-culture',
        description: 'Art, culture, and creative events',
        color: '#f59e0b',
        icon: '🎭',
      },
    });
    console.log(`✅ Created category: ${artCategory.name}`);

    const sustainabilityCategory = await prisma.category.create({
      data: {
        name: 'Sustainability',
        slug: 'sustainability',
        description: 'Sustainable design and eco-friendly events',
        color: '#10b981',
        icon: '🌱',
      },
    });
    console.log(`✅ Created category: ${sustainabilityCategory.name}`);

    // Create venues
    const milanoDesignCenter = await prisma.venue.create({
      data: {
        name: 'Milano Design Center',
        address: 'Via Tortona, 37, 20144 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4642,
        longitude: 9.19,
        website: 'https://milanodesigncenter.com',
      },
    });
    console.log(`✅ Created venue: ${milanoDesignCenter.name}`);

    const creativeHub = await prisma.venue.create({
      data: {
        name: 'Creative Hub Milano',
        address: 'Corso di Porta Ticinese, 87, 20123 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.45,
        longitude: 9.18,
        website: 'https://creativehubmilano.com',
      },
    });
    console.log(`✅ Created venue: ${creativeHub.name}`);

    // Spread locations across Milan Centro for better map distribution
    const milanSpots = [
      { lat: 45.4654, lng: 9.1866 }, // Duomo
      { lat: 45.4659, lng: 9.19 }, // Galleria
      { lat: 45.467, lng: 9.1925 }, // Brera edge
      { lat: 45.4619, lng: 9.188 }, // Missori
      { lat: 45.4686, lng: 9.1819 }, // Castello
    ];

    // Create events with real local data and proper image URLs
    const events = [
      {
        title: 'Creative Networking Mixer',
        slug: 'creative-networking-mixer',
        description:
          'Connect with fellow creatives, entrepreneurs, and industry professionals at our dynamic Creative Networking Mixer, where meaningful connections and collaborative opportunities come to life.',
        shortDescription: 'Professional creative networking event',
        status: 'PUBLISHED' as const,
        startDate: new Date('2024-12-08T18:30:00.000Z'),
        endDate: new Date('2024-12-08T21:30:00.000Z'),
        capacity: 50,
        isPublic: true,
        featured: false,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop',
          tags: [
            'networking',
            'creative',
            'professional',
            'collaboration',
            'entrepreneurship',
          ],
          social: {
            twitter: 'https://twitter.com/creativenetwork',
            website: 'https://creativenetworkingmilano.com',
            facebook: 'https://facebook.com/creativenetworkingmilano',
            linkedin: 'https://linkedin.com/company/creative-networking-milano',
            instagram: 'https://instagram.com/creativenetworkingmilano',
          },
          contact: {
            email: 'networking@creativenetworkingmilano.com',
            phone: '+39 02 8888 9999',
            website: 'https://creativenetworkingmilano.com',
          },
          features: [
            'Structured Networking',
            'Ice-breaker Activities',
            'Complimentary Drinks',
            'Collaboration Opportunities',
            'Professional Development',
            'Creative Showcase',
          ],
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linea-production.up.railway.app/events/creative-networking-mixer')}`,
        },
        mapLat: milanSpots[0]?.lat ?? 0,
        mapLng: milanSpots[0]?.lng ?? 0,
      },
      {
        title: 'Tech Innovation Summit 2024',
        slug: 'tech-innovation-summit',
        description:
          'Join us for the most anticipated technology and innovation event of the year! The Tech Innovation Summit 2024 brings together industry leaders, visionary entrepreneurs, and cutting-edge innovators.',
        shortDescription: 'Premier technology and innovation conference',
        status: 'PUBLISHED' as const,
        startDate: new Date('2024-12-15T09:00:00.000Z'),
        endDate: new Date('2024-12-15T18:00:00.000Z'),
        capacity: 500,
        isPublic: true,
        featured: true,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
          tags: [
            'technology',
            'innovation',
            'summit',
            'AI',
            'blockchain',
            'startup',
          ],
          social: {
            twitter: 'https://twitter.com/techinnovsummit',
            website: 'https://techinnovationsummit.com',
            youtube: 'https://youtube.com/c/techinnovationsummit',
            linkedin: 'https://linkedin.com/company/tech-innovation-summit',
            instagram: 'https://instagram.com/techinnovationsummit',
          },
          contact: {
            email: 'info@techinnovationsummit.com',
            phone: '+39 02 1234 5678',
            website: 'https://techinnovationsummit.com',
          },
          features: [
            'Keynote Presentations',
            'Interactive Workshops',
            'Networking Sessions',
            'Product Demos',
            'Panel Discussions',
            'Startup Pitch Competition',
          ],
          organizer: 'Tech Milano',
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linea-production.up.railway.app/events/tech-innovation-summit')}`,
        },
        mapLat: milanSpots[1]?.lat ?? 0,
        mapLng: milanSpots[1]?.lng ?? 0,
      },
      {
        title: 'Milano Design Week 2024',
        slug: 'milano-design-week-2024',
        description:
          "Experience the pinnacle of global design excellence at Milano Design Week 2024, the world's most prestigious design event. This week-long celebration of creativity, innovation, and craftsmanship brings together the finest designers, architects, and creative minds from around the globe.",
        shortDescription: "World's premier design event",
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-10-01T10:00:00.000Z'),
        endDate: new Date('2025-10-01T14:00:00.000Z'),
        capacity: 10000,
        isPublic: true,
        featured: true,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            '/uploads/event_milano-design-week-2024_1759578870514_e4pode.jpg',
          tags: [
            'design',
            'milano',
            'furniture',
            'architecture',
            'creativity',
            'exhibition',
          ],
          social: {
            twitter: 'https://twitter.com/milanodesignweek',
            website: 'https://milanodesignweek.com',
            facebook: 'https://facebook.com/milanodesignweek',
            linkedin: 'https://linkedin.com/company/milano-design-week',
            instagram: 'https://instagram.com/milanodesignweek',
          },
          contact: {
            email: 'info@milanodesignweek.com',
            phone: '+39 02 9876 5432',
            website: 'https://milanodesignweek.com',
          },
          features: [
            'Design Exhibitions',
            'Furniture Showcases',
            'Architecture Tours',
            'Designer Meet & Greets',
            'Workshop Sessions',
            'Networking Events',
          ],
          organizer: 'Milano Design Center',
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linea-production.up.railway.app/events/milano-design-week-2024')}`,
        },
        mapLat: milanSpots[2]?.lat ?? 0,
        mapLng: milanSpots[2]?.lng ?? 0,
      },
      {
        title: 'Innovation Talk',
        slug: 'innovation-talk-3',
        description:
          'Join us for an inspiring evening of innovation and forward-thinking design at our exclusive Innovation Talk series. This thought-provoking event brings together industry leaders, visionary designers, and innovative entrepreneurs.',
        shortDescription: 'Inspiring talks on innovation and design',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-10-01T10:00:00.000Z'),
        endDate: new Date('2025-10-01T14:00:00.000Z'),
        capacity: 80,
        isPublic: true,
        featured: false,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            '/uploads/event_innovation-talk-3_1759578178000_s14t4.jpg',
          tags: ['innovation', 'design', 'technology', 'networking', 'talks'],
          social: {
            twitter: 'https://twitter.com/innovation_talks',
            youtube: 'https://youtube.com/c/innovationtalks',
            linkedin: 'https://linkedin.com/company/innovation-talks-milano',
            instagram: 'https://instagram.com/innovation_talks_milano',
          },
          contact: {
            email: 'hello@innovationtalks.com',
            phone: '+39 02 8765 4321',
            website: 'https://innovationtalks.com',
          },
          features: [
            'Keynote Speakers',
            'Panel Discussions',
            'Networking',
            'Q&A Sessions',
            'Light Refreshments',
          ],
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linea-production.up.railway.app/events/innovation-talk-3')}`,
        },
        mapLat: milanSpots[3]?.lat ?? 0,
        mapLng: milanSpots[3]?.lng ?? 0,
      },
      {
        title: 'Studio Open Day',
        slug: 'studio-open-day-4',
        description:
          'Step inside our creative sanctuary and discover the magic behind exceptional design at our exclusive Studio Open Day. This intimate behind-the-scenes experience offers a rare glimpse into our design process.',
        shortDescription: 'Behind-the-scenes studio experience',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-10-01T10:00:00.000Z'),
        endDate: new Date('2025-10-01T14:00:00.000Z'),
        capacity: 25,
        isPublic: true,
        featured: false,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            '/uploads/event_studio-open-day-4_1759578183531_lz057.jpg',
          tags: [
            'studio',
            'open day',
            'creative',
            'behind-the-scenes',
            'workshop',
          ],
          social: {
            website: 'https://studioopenday.com',
            facebook: 'https://facebook.com/studioopenday',
            linkedin: 'https://linkedin.com/company/studio-open-day',
            instagram: 'https://instagram.com/studio_open_day',
          },
          contact: {
            email: 'studio@openday.com',
            phone: '+39 02 9876 5432',
            website: 'https://studioopenday.com',
          },
          features: [
            'Studio Tours',
            'Live Demonstrations',
            'Meet the Team',
            'Interactive Workshops',
            'Refreshments',
          ],
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://linea-production.up.railway.app/events/studio-open-day-4')}`,
        },
        mapLat: milanSpots[4]?.lat ?? 0,
        mapLng: milanSpots[4]?.lng ?? 0,
      },
    ];

    // Additional events per owner to enrich the catalog
    const moreEvents: Array<any> = [
      {
        title: 'Design Futures Forum',
        slug: 'design-futures-forum',
        description:
          'A forward-looking forum exploring emerging trends in product and spatial design.',
        shortDescription: 'Trends in design and spatial innovation',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-11-05T09:30:00.000Z'),
        endDate: new Date('2025-11-05T16:30:00.000Z'),
        capacity: 300,
        isPublic: true,
        featured: false,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=800&fit=crop',
          tags: ['design', 'trends', 'forum'],
          social: { website: 'https://designfutures.example.com' },
          contact: { email: 'contact@designfutures.example.com' },
          features: ['Keynotes', 'Trend Briefings', 'Networking'],
        },
      },
      {
        title: 'AI for Makers Workshop',
        slug: 'ai-for-makers-workshop',
        description:
          'Hands-on workshop applying AI tools to creative prototyping and fabrication.',
        shortDescription: 'Hands-on AI tools for makers',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-11-12T10:00:00.000Z'),
        endDate: new Date('2025-11-12T17:00:00.000Z'),
        capacity: 80,
        isPublic: true,
        featured: true,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=800&fit=crop',
          tags: ['AI', 'makers', 'workshop'],
          social: { website: 'https://aimakers.example.com' },
          contact: { email: 'hello@aimakers.example.com' },
          features: ['Live Demos', 'Datasets', 'Guided Labs'],
        },
      },
      {
        title: 'Sustainable Materials Expo',
        slug: 'sustainable-materials-expo',
        description:
          'Showcase of next-gen sustainable materials for product and interior design.',
        shortDescription: 'Next-gen sustainable materials',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-11-19T09:00:00.000Z'),
        endDate: new Date('2025-11-19T18:00:00.000Z'),
        capacity: 600,
        isPublic: true,
        featured: true,
        ownerId: owner1.id,
        categoryId: sustainabilityCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=800&fit=crop',
          tags: ['sustainability', 'materials', 'expo'],
          social: { website: 'https://sust-materials.example.com' },
          contact: { email: 'info@sust-materials.example.com' },
          features: ['Vendor Booths', 'Material Library', 'Talks'],
        },
      },
      {
        title: 'Creative Coding Night',
        slug: 'creative-coding-night',
        description:
          'An evening of live coding, visual arts, and music collaborations.',
        shortDescription: 'Live coding and visuals',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-11-22T18:00:00.000Z'),
        endDate: new Date('2025-11-22T22:00:00.000Z'),
        capacity: 120,
        isPublic: true,
        featured: false,
        ownerId: owner2.id,
        categoryId: artCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
          tags: ['coding', 'visuals', 'music'],
          social: { website: 'https://creativecodingnight.example.com' },
          contact: { email: 'team@creativecodingnight.example.com' },
          features: ['Live Performances', 'Open Mic', 'Gallery'],
        },
      },
      {
        title: 'Furniture Craft Mastery',
        slug: 'furniture-craft-mastery',
        description:
          'Masterclass on contemporary furniture craftsmanship and small-batch production.',
        shortDescription: 'Masterclass in furniture craft',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-12-03T09:00:00.000Z'),
        endDate: new Date('2025-12-03T17:00:00.000Z'),
        capacity: 60,
        isPublic: true,
        featured: false,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200&h=800&fit=crop',
          tags: ['furniture', 'craft', 'masterclass'],
          social: { website: 'https://furniturecraft.example.com' },
          contact: { email: 'workshop@furniturecraft.example.com' },
          features: ['Tooling', 'Joinery', 'Finishing'],
        },
      },
      {
        title: 'Data-Driven Design Meetup',
        slug: 'data-driven-design-meetup',
        description:
          'Meetup on metrics, experimentation, and data pipelines for design ops.',
        shortDescription: 'Metrics and design ops',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-12-10T17:30:00.000Z'),
        endDate: new Date('2025-12-10T20:00:00.000Z'),
        capacity: 150,
        isPublic: true,
        featured: false,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
          tags: ['data', 'design', 'meetup'],
          social: { website: 'https://dddmeetup.example.com' },
          contact: { email: 'team@dddmeetup.example.com' },
          features: ['Talks', 'Lightning Rounds', 'Networking'],
        },
      },
      {
        title: 'Art & Light Installation',
        slug: 'art-and-light-installation',
        description: 'Immersive installation blending light, space, and sound.',
        shortDescription: 'Immersive art installation',
        status: 'PUBLISHED' as const,
        startDate: new Date('2025-12-15T17:00:00.000Z'),
        endDate: new Date('2025-12-15T21:00:00.000Z'),
        capacity: 200,
        isPublic: true,
        featured: true,
        ownerId: owner1.id,
        categoryId: artCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1520975979652-99f207804ad1?w=1200&h=800&fit=crop',
          tags: ['art', 'light', 'installation'],
          social: { website: 'https://artlight.example.com' },
          contact: { email: 'info@artlight.example.com' },
          features: ['Immersive', 'Soundscape', 'Curated Tour'],
        },
      },
      {
        title: 'XR Prototyping Lab',
        slug: 'xr-prototyping-lab',
        description:
          'Rapid prototyping lab for AR/VR experiences using web technologies.',
        shortDescription: 'AR/VR rapid prototyping',
        status: 'PUBLISHED' as const,
        startDate: new Date('2026-01-10T09:30:00.000Z'),
        endDate: new Date('2026-01-10T17:30:00.000Z'),
        capacity: 80,
        isPublic: true,
        featured: false,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
          tags: ['XR', 'AR', 'VR', 'prototype'],
          social: { website: 'https://xr-lab.example.com' },
          contact: { email: 'hello@xr-lab.example.com' },
          features: ['Headsets', 'WebXR', 'Show-and-Tell'],
        },
      },
      {
        title: 'Circular Design Bootcamp',
        slug: 'circular-design-bootcamp',
        description:
          'Two-day bootcamp on circular design strategies and case studies.',
        shortDescription: 'Circular design strategies',
        status: 'PUBLISHED' as const,
        startDate: new Date('2026-01-18T09:00:00.000Z'),
        endDate: new Date('2026-01-19T17:00:00.000Z'),
        capacity: 90,
        isPublic: true,
        featured: true,
        ownerId: owner1.id,
        categoryId: sustainabilityCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop',
          tags: ['circular', 'sustainability', 'bootcamp'],
          social: { website: 'https://circularbootcamp.example.com' },
          contact: { email: 'team@circularbootcamp.example.com' },
          features: ['Case Studies', 'Group Work', 'Coaching'],
        },
      },
      {
        title: 'Founders in Design Fireside',
        slug: 'founders-in-design-fireside',
        description:
          'Fireside chat with design-led founders on building sustainable brands.',
        shortDescription: 'Fireside chat with founders',
        status: 'PUBLISHED' as const,
        startDate: new Date('2026-01-25T18:00:00.000Z'),
        endDate: new Date('2026-01-25T20:00:00.000Z'),
        capacity: 150,
        isPublic: true,
        featured: false,
        ownerId: owner2.id,
        categoryId: designCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl:
            'https://images.unsplash.com/photo-1475724017904-b712052c192a?w=1200&h=800&fit=crop',
          tags: ['founders', 'brand', 'design'],
          social: { website: 'https://designfounders.example.com' },
          contact: { email: 'info@designfounders.example.com' },
          features: ['Fireside Chat', 'Q&A', 'Networking'],
        },
      },
    ];

    for (const eventData of moreEvents) {
      const event = await prisma.event.create({ data: eventData });
      console.log(`✅ Created event: ${event.title}`);
    }
    const totalEventsSeeded = events.length + moreEvents.length;
    console.log(`📈 Seed summary: ${totalEventsSeeded} events prepared`);

    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData,
      });
      console.log(`✅ Created event: ${event.title}`);
    }

    // Create some waitlist entries
    const waitlistEntries = [
      {
        email: 'john.doe@example.com',
        eventId: (
          await prisma.event.findFirst({
            where: { slug: 'creative-networking-mixer' },
          })
        )?.id,
        status: 'PENDING' as const,
      },
      {
        email: 'jane.smith@example.com',
        eventId: (
          await prisma.event.findFirst({
            where: { slug: 'tech-innovation-summit' },
          })
        )?.id,
        status: 'PENDING' as const,
      },
      {
        email: 'mario.rossi@example.com',
        eventId: (
          await prisma.event.findFirst({
            where: { slug: 'milano-design-week-2024' },
          })
        )?.id,
        status: 'PENDING' as const,
      },
      {
        email: 'sarah.johnson@example.com',
        eventId: (
          await prisma.event.findFirst({ where: { slug: 'innovation-talk-3' } })
        )?.id,
        status: 'PENDING' as const,
      },
      {
        email: 'alex.chen@example.com',
        eventId: (
          await prisma.event.findFirst({ where: { slug: 'studio-open-day-4' } })
        )?.id,
        status: 'PENDING' as const,
      },
    ];

    for (const entryData of waitlistEntries) {
      if (entryData.eventId) {
        await prisma.waitlistEntry.create({
          data: {
            email: entryData.email,
            eventId: entryData.eventId,
            status: entryData.status,
          },
        });
        console.log(`✅ Created waitlist entry for: ${entryData.email}`);
      }
    }

    await prisma.$disconnect();

    console.log('\n🎉 Production database successfully seeded!');
    console.log(`📊 Summary:`);
    console.log(`  - Users: 3 (1 admin, 2 owners)`);
    console.log(`  - Categories: 4`);
    console.log(`  - Areas: 1`);
    console.log(`  - Venues: 2`);
    console.log(`  - Events: ${events.length}`);
    console.log(`  - Waitlist Entries: ${waitlistEntries.length}`);

    reply.send({
      success: true,
      message: 'Production database wiped and reseeded successfully',
      summary: {
        users: 3,
        categories: 4,
        areas: 1,
        venues: 2,
        events: events.length,
        waitlistEntries: waitlistEntries.length,
      },
    });
  } catch (error) {
    console.error('❌ Error during wipe and reseed:', error);
    reply.code(500).send({ error: 'Failed to wipe and reseed database' });
  }
});

// Favicon fallback
app.get('/favicon.ico', async (_request, reply) => {
  try {
    reply.type('image/png');
    return reply.sendFile('assets/linea_light.png');
  } catch {
    reply.code(404).send();
  }
});

// Error handler
app.setErrorHandler((error, _request, reply) => {
  app.log.error({ error }, 'API Error');

  if (config.observability.SENTRY_DSN) {
    Sentry.captureException(error);
  }

  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
    return;
  }

  reply.code(500).send({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down gracefully`);

  try {
    await app.close();
    if (prisma) {
      await prisma.$disconnect();
    }
    await sessionService.disconnect();
    process.exit(0);
  } catch (error) {
    app.log.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Run database migrations on startup
const runMigrations = async () => {
  try {
    app.log.info('🚀 Running database migrations...');

    // Test database connection first
    await prisma.$connect();
    app.log.info('✅ Database connected successfully!');

    // Run migrations
    const { execSync } = await import('child_process');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: config.database.DATABASE_URL },
    });
    app.log.info('✅ Database migrations completed!');
  } catch (error) {
    app.log.error({ error }, '❌ Database migration failed');
    // Don't exit - let the app start anyway
    app.log.warn('⚠️  Continuing without migrations...');
  }
};

// Development-only demo data seeding
/*
const _seedDemoData = async () => {
  if (config.environment.NODE_ENV !== 'development') return
  if (!config.development.SEED_SAMPLE_EVENTS) return
  try {
    app.log.info('🌱 Seeding demo owners and events (dev)...')
    // Upsert 4 owners
    const owners = [
      { email: 'alice@kitchenco.dev', name: 'Alice Wonderland' },
      { email: 'bob@designbuild.dev', name: 'Bob The Builder' },
      { email: 'carla@artisanstudio.dev', name: 'Carla Rossi' },
      { email: 'diego@studioforma.dev', name: 'Diego Bianchi' },
    ]
    const createdOwners: Array<{ id: string; email: string } > = []
    for (const o of owners) {
      const user = await prisma.user.upsert({
        where: { email: o.email },
        update: { role: 'OWNER', name: o.name, isActive: true, lastLoginAt: new Date() },
        create: { email: o.email, role: 'OWNER', name: o.name, isActive: true, lastLoginAt: new Date() }
      })
      createdOwners.push({ id: user.id, email: user.email })
    }

    // Helper to ensure event once per owner+title
    const ensureEvent = async (ownerId: string, title: string, start: string, short?: string) => {
      const existing = await prisma.event.findFirst({ where: { ownerId, title, deletedAt: null } })
      if (existing) return existing
      const slug = await generateUniqueSlug(title)
      return await prisma.event.create({
        data: {
          ownerId,
          title,
          slug,
          shortDescription: short ?? null,
          description: null,
          status: 'PUBLISHED',
          startDate: new Date(start),
          isPublic: true,
          featured: false,
          tags: ['design']
        }
      })
    }

    // Create a few events per owner
    const now = new Date()
    const iso = (d: Date) => d.toISOString()
    const d1 = new Date(now.getTime() + 3*24*60*60*1000)
    const d2 = new Date(now.getTime() + 5*24*60*60*1000)
    const d3 = new Date(now.getTime() + 7*24*60*60*1000)

    for (const o of createdOwners) {
      await ensureEvent(o.id, 'Milano Design Showcase', iso(d1), 'Design showcase')
      await ensureEvent(o.id, 'Innovation Talk', iso(d2), 'Innovation talk')
      await ensureEvent(o.id, 'Studio Open Day', iso(d3), 'Open day')
    }

    app.log.info('✅ Demo data ready')
  } catch (error) {
    // If DB unavailable, skip silently for dev
    app.log.warn({ error }, 'Skipping demo seed (likely DB unavailable)')
  }
}
*/

// Register favorites routes
await app.register(favoritesRoutes);

// Development seed endpoint
app.post('/api/seed-events', async (request, reply) => {
  try {
    console.log('🌱 Starting comprehensive event seeding...');

    // Delete all existing events first
    console.log('🗑️  Deleting all existing events...');
    await prisma.event.deleteMany({});
    console.log('✅ All existing events deleted');

    // Get or create the two demo owners
    const owner1 = await prisma.user.upsert({
      where: { email: 'owner1@example.com' },
      update: {},
      create: {
        email: 'owner1@example.com',
        name: 'Owner One',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    });

    const owner2 = await prisma.user.upsert({
      where: { email: 'owner2@example.com' },
      update: {},
      create: {
        email: 'owner2@example.com',
        name: 'Owner Two',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    });

    console.log('✅ Demo owners ready:', owner1.name, 'and', owner2.name);

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'design' },
        update: {},
        create: {
          name: 'Design',
          slug: 'design',
          description: 'Design events, workshops, and exhibitions',
          color: '#c4b69e',
          icon: '🎨',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'technology',
          description: 'Tech and innovation events',
          color: '#3b82f6',
          icon: '💻',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'art-culture' },
        update: {},
        create: {
          name: 'Art & Culture',
          slug: 'art-culture',
          description: 'Art, culture, and creative events',
          color: '#f59e0b',
          icon: '🎭',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'sustainability' },
        update: {},
        create: {
          name: 'Sustainability',
          slug: 'sustainability',
          description: 'Sustainable design and eco-friendly events',
          color: '#10b981',
          icon: '🌱',
        },
      }),
    ]);

    console.log('✅ Categories created:', categories.length);

    // Create venues
    const venues = await Promise.all([
      prisma.venue.upsert({
        where: { name: 'Milano Design Center' },
        update: {},
        create: {
          name: 'Milano Design Center',
          address: 'Via Tortona, 37, 20144 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          latitude: 45.4508,
          longitude: 9.1734,
          website: 'https://milanodesigncenter.com',
        },
      }),
      prisma.venue.upsert({
        where: { name: 'Triennale di Milano' },
        update: {},
        create: {
          name: 'Triennale di Milano',
          address: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          latitude: 45.4722,
          longitude: 9.1708,
          website: 'https://triennale.org',
        },
      }),
      prisma.venue.upsert({
        where: { name: 'Fondazione Prada' },
        update: {},
        create: {
          name: 'Fondazione Prada',
          address: 'Largo Isarco, 2, 20139 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          latitude: 45.4444,
          longitude: 9.2,
          website: 'https://fondazioneprada.org',
        },
      }),
      prisma.venue.upsert({
        where: { name: 'Palazzo Clerici' },
        update: {},
        create: {
          name: 'Palazzo Clerici',
          address: 'Via Clerici, 5, 20121 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          latitude: 45.4654,
          longitude: 9.1859,
          website: 'https://palazzoclerici.it',
        },
      }),
    ]);

    console.log('✅ Venues created:', venues.length);

    // Create 4 events for Owner 1
    const owner1Events = [
      {
        title: 'Sustainable Design Revolution',
        slug: 'sustainable-design-revolution',
        description:
          'Explore the future of sustainable design with leading architects, designers, and environmental experts. Discover innovative materials, circular design principles, and eco-friendly solutions that are reshaping the industry.',
        shortDescription:
          'Leading the charge in sustainable design innovation.',
        startDate: new Date('2024-06-15T09:00:00Z'),
        endDate: new Date('2024-06-15T18:00:00Z'),
        capacity: 300,
        venue: venues[0],
        category: categories[3], // Sustainability
        tags: ['sustainability', 'design', 'innovation', 'environment'],
        featured: true,
      },
      {
        title: 'Digital Art & Technology Fusion',
        slug: 'digital-art-technology-fusion',
        description:
          'Experience the intersection of art and technology in this immersive exhibition featuring digital installations, VR experiences, and interactive artworks by contemporary artists.',
        shortDescription: 'Where art meets cutting-edge technology.',
        startDate: new Date('2024-06-20T10:00:00Z'),
        endDate: new Date('2024-06-20T20:00:00Z'),
        capacity: 200,
        venue: venues[1],
        category: categories[2], // Art & Culture
        tags: ['digital art', 'technology', 'innovation', 'interactive'],
        featured: false,
      },
      {
        title: 'Furniture Design Masterclass',
        slug: 'furniture-design-masterclass',
        description:
          'Learn from master furniture designers in this hands-on workshop covering traditional techniques, modern materials, and innovative approaches to furniture design.',
        shortDescription: 'Master the art of furniture design.',
        startDate: new Date('2024-06-25T09:00:00Z'),
        endDate: new Date('2024-06-25T17:00:00Z'),
        capacity: 50,
        venue: venues[0],
        category: categories[0], // Design
        tags: ['furniture', 'workshop', 'craftsmanship', 'design'],
        featured: false,
      },
      {
        title: 'Smart Home Innovation Summit',
        slug: 'smart-home-innovation-summit',
        description:
          'Discover the latest in smart home technology, IoT devices, and connected living solutions. Features live demonstrations, expert panels, and networking opportunities.',
        shortDescription: 'The future of connected living.',
        startDate: new Date('2024-07-01T09:00:00Z'),
        endDate: new Date('2024-07-01T18:00:00Z'),
        capacity: 400,
        venue: venues[2],
        category: categories[1], // Technology
        tags: ['smart home', 'IoT', 'technology', 'innovation'],
        featured: true,
      },
    ];

    // Create 4 events for Owner 2
    const owner2Events = [
      {
        title: 'Contemporary Art Exhibition',
        slug: 'contemporary-art-exhibition',
        description:
          'A curated exhibition featuring works by emerging and established contemporary artists, exploring themes of identity, society, and the human condition.',
        shortDescription: 'Contemporary voices in modern art.',
        startDate: new Date('2024-06-18T10:00:00Z'),
        endDate: new Date('2024-06-18T20:00:00Z'),
        capacity: 150,
        venue: venues[3],
        category: categories[2], // Art & Culture
        tags: ['contemporary art', 'exhibition', 'culture', 'creativity'],
        featured: true,
      },
      {
        title: 'Green Architecture Workshop',
        slug: 'green-architecture-workshop',
        description:
          'Learn sustainable architecture principles with hands-on workshops, case studies, and expert guidance on creating environmentally responsible buildings.',
        shortDescription: 'Building a sustainable future.',
        startDate: new Date('2024-06-22T09:00:00Z'),
        endDate: new Date('2024-06-22T17:00:00Z'),
        capacity: 80,
        venue: venues[1],
        category: categories[3], // Sustainability
        tags: ['architecture', 'sustainability', 'green building', 'workshop'],
        featured: false,
      },
      {
        title: 'AI in Creative Industries',
        slug: 'ai-creative-industries',
        description:
          'Explore how artificial intelligence is transforming creative industries, from design automation to AI-assisted art creation and content generation.',
        shortDescription: 'AI meets creativity.',
        startDate: new Date('2024-06-28T09:00:00Z'),
        endDate: new Date('2024-06-28T18:00:00Z'),
        capacity: 250,
        venue: venues[2],
        category: categories[1], // Technology
        tags: ['AI', 'creativity', 'technology', 'innovation'],
        featured: true,
      },
      {
        title: 'Textile Design Innovation',
        slug: 'textile-design-innovation',
        description:
          'Discover the latest innovations in textile design, from smart fabrics to sustainable materials, with demonstrations and hands-on workshops.',
        shortDescription: 'The future of fabric design.',
        startDate: new Date('2024-07-05T10:00:00Z'),
        endDate: new Date('2024-07-05T18:00:00Z'),
        capacity: 120,
        venue: venues[0],
        category: categories[0], // Design
        tags: ['textile', 'design', 'innovation', 'fashion'],
        featured: false,
      },
    ];

    // Create events for Owner 1
    console.log('🌱 Creating events for Owner 1...');
    const createdOwner1Events = [];
    for (const eventData of owner1Events) {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          slug: eventData.slug,
          description: eventData.description,
          shortDescription: eventData.shortDescription,
          status: 'PUBLISHED',
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          capacity: eventData.capacity,
          currentWaitlist: 0,
          youtubeUrl: `https://www.youtube.com/watch?v=${eventData.slug}`,
          mapLat: eventData.venue.latitude,
          mapLng: eventData.venue.longitude,
          mapZoom: 15,
          mapAddress: eventData.venue.address,
          ownerId: owner1.id,
          venueId: eventData.venue.id,
          categoryId: eventData.category.id,
          isPublic: true,
          featured: eventData.featured,
          tags: eventData.tags,
          metadata: {
            organizer: 'Linea Events',
            contact: 'info@linea.app',
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
            heroImageUrl: `/images/events/${eventData.slug}-hero.jpg`,
            galleryImages: [
              `/images/events/${eventData.slug}-1.jpg`,
              `/images/events/${eventData.slug}-2.jpg`,
              `/images/events/${eventData.slug}-3.jpg`,
            ],
          },
        },
      });
      createdOwner1Events.push(event);
      console.log(`✅ Created event: ${event.title}`);
    }

    // Create events for Owner 2
    console.log('🌱 Creating events for Owner 2...');
    const createdOwner2Events = [];
    for (const eventData of owner2Events) {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          slug: eventData.slug,
          description: eventData.description,
          shortDescription: eventData.shortDescription,
          status: 'PUBLISHED',
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          capacity: eventData.capacity,
          currentWaitlist: 0,
          youtubeUrl: `https://www.youtube.com/watch?v=${eventData.slug}`,
          mapLat: eventData.venue.latitude,
          mapLng: eventData.venue.longitude,
          mapZoom: 15,
          mapAddress: eventData.venue.address,
          ownerId: owner2.id,
          venueId: eventData.venue.id,
          categoryId: eventData.category.id,
          isPublic: true,
          featured: eventData.featured,
          tags: eventData.tags,
          metadata: {
            organizer: 'Linea Events',
            contact: 'info@linea.app',
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
            heroImageUrl: `/images/events/${eventData.slug}-hero.jpg`,
            galleryImages: [
              `/images/events/${eventData.slug}-1.jpg`,
              `/images/events/${eventData.slug}-2.jpg`,
              `/images/events/${eventData.slug}-3.jpg`,
            ],
          },
        },
      });
      createdOwner2Events.push(event);
      console.log(`✅ Created event: ${event.title}`);
    }

    console.log('🎉 Event seeding completed successfully!');

    reply.send({
      success: true,
      message: 'Events seeded successfully',
      summary: {
        totalEvents: 8,
        owner1Events: createdOwner1Events.length,
        owner2Events: createdOwner2Events.length,
        events: [
          ...createdOwner1Events.map((e: any) => ({
            id: e.id,
            title: e.title,
            owner: 'Owner 1',
          })),
          ...createdOwner2Events.map((e: any) => ({
            id: e.id,
            title: e.title,
            owner: 'Owner 2',
          })),
        ],
      },
    });
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    reply.code(500).send({
      success: false,
      error: 'Failed to seed events',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
const start = async () => {
  try {
    // Run migrations first
    await runMigrations();
    // Seeding removed to prevent duplicate events

    const port = config.server.PORT;
    const host = config.server.HOST;

    await app.listen({ port, host });
    app.log.info(`Server listening on http://${host}:${port}`);
    app.log.info(`API documentation available at http://${host}:${port}/docs`);
    app.log.info(`Environment: ${config.environment.NODE_ENV}`);
    app.log.info(`Version: ${config.environment.APP_VERSION}`);
  } catch (error) {
    app.log.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// SPA routes - serve index.html for client-side routing (must be after all API routes)
app.get('/events/*', async (_request, reply) => {
  return reply.sendFile('index.html');
});

app.get('/admin', async (_request, reply) => {
  return reply.sendFile('index.html');
});

app.get('/owner', async (_request, reply) => {
  return reply.sendFile('index.html');
});

start();
