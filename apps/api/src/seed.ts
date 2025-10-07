import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcryptjs'

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@linea.app' },
    update: {},
    create: {
      email: 'admin@linea.app',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create sample owner
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@linea.app' },
    update: {},
    create: {
      email: 'owner@linea.app',
      name: 'Event Owner',
      role: 'OWNER',
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  console.log('✅ Created owner user:', ownerUser.email);

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
        icon: 'Design',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech meetups, conferences, and hackathons',
        color: '#b8a78b',
        icon: 'Tech',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'art' },
      update: {},
      create: {
        name: 'Art & Culture',
        slug: 'art',
        description: 'Art exhibitions, cultural events, and performances',
        color: '#a08965',
        icon: 'Art',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Networking events, conferences, and workshops',
        color: '#947a52',
        icon: 'Business',
        isActive: true,
      },
    }),
    // Kitchen Design Categories
    prisma.category.upsert({
      where: { slug: 'kitchens' },
      update: {},
      create: {
        name: 'Kitchens',
        slug: 'kitchens',
        description: 'Kitchen design, appliances, and cabinetry',
        color: '#886b3f',
        icon: 'Kitchen',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kitchen-appliances' },
      update: {},
      create: {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        description:
          'Kitchen appliances, cooking equipment, and smart home solutions',
        color: '#d0c5b1',
        icon: 'Appliances',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kitchen-cabinetry' },
      update: {},
      create: {
        name: 'Kitchen Cabinetry',
        slug: 'kitchen-cabinetry',
        description:
          'Kitchen cabinets, storage solutions, and organization systems',
        color: '#ddd4c4',
        icon: 'Storage',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kitchen-countertops' },
      update: {},
      create: {
        name: 'Kitchen Countertops',
        slug: 'kitchen-countertops',
        description: 'Countertop materials, surfaces, and finishes',
        color: '#eae3d7',
        icon: 'Build',
        isActive: true,
      },
    }),
    // Furniture Categories
    prisma.category.upsert({
      where: { slug: 'furniture' },
      update: {},
      create: {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Furniture design, seating, and home decor',
        color: '#0891b2',
        icon: '🪑',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'seating' },
      update: {},
      create: {
        name: 'Seating',
        slug: 'seating',
        description: 'Chairs, sofas, and seating solutions',
        color: '#be185d',
        icon: '🛋️',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tables' },
      update: {},
      create: {
        name: 'Tables',
        slug: 'tables',
        description: 'Dining tables, coffee tables, and work surfaces',
        color: '#7c2d12',
        icon: '🪵',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'storage' },
      update: {},
      create: {
        name: 'Storage',
        slug: 'storage',
        description: 'Storage solutions, wardrobes, and organization systems',
        color: '#4338ca',
        icon: '📦',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lighting' },
      update: {},
      create: {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Lighting fixtures, lamps, and illumination systems',
        color: '#fbbf24',
        icon: '💡',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'textiles' },
      update: {},
      create: {
        name: 'Textiles',
        slug: 'textiles',
        description: 'Fabrics, upholstery, and textile design',
        color: '#ec4899',
        icon: '🧵',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'flooring' },
      update: {},
      create: {
        name: 'Flooring',
        slug: 'flooring',
        description: 'Flooring materials, tiles, and surface treatments',
        color: '#6b7280',
        icon: '🏠',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bathroom' },
      update: {},
      create: {
        name: 'Bathroom',
        slug: 'bathroom',
        description: 'Bathroom fixtures, fittings, and design solutions',
        color: '#0ea5e9',
        icon: '🛁',
        isActive: true,
      },
    }),
  ]);

  console.log(
    '✅ Created categories:',
    categories.map((c: any) => c.name).join(', ')
  );

  // Create areas
  const areas = await Promise.all([
    prisma.area.upsert({
      where: { slug: 'brera' },
      update: {},
      create: {
        name: 'Brera',
        slug: 'brera',
        description:
          'Historic artistic district with galleries, boutiques, and design studios',
        color: '#8b5cf6',
        icon: 'Design',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: '5vie' },
      update: {},
      create: {
        name: '5vie',
        slug: '5vie',
        description:
          'Design district with contemporary furniture showrooms and design studios',
        color: '#06b6d4',
        icon: '🏛️',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'porta-nuova' },
      update: {},
      create: {
        name: 'Porta Nuova',
        slug: 'porta-nuova',
        description:
          'Modern business district with contemporary architecture and design',
        color: '#10b981',
        icon: '🏢',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'navigli' },
      update: {},
      create: {
        name: 'Navigli',
        slug: 'navigli',
        description:
          'Historic canal district with trendy bars, restaurants, and creative spaces',
        color: '#f59e0b',
        icon: '🚤',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'quadrilatero-della-moda' },
      update: {},
      create: {
        name: 'Quadrilatero della Moda',
        slug: 'quadrilatero-della-moda',
        description:
          'Fashion district with luxury boutiques and high-end design',
        color: '#ec4899',
        icon: '👗',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'garibaldi' },
      update: {},
      create: {
        name: 'Garibaldi',
        slug: 'garibaldi',
        description:
          'Modern district with contemporary design and architecture',
        color: '#3b82f6',
        icon: 'Build',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'tortona' },
      update: {},
      create: {
        name: 'Tortona',
        slug: 'tortona',
        description:
          'Design district with showrooms, studios, and creative spaces',
        color: '#ef4444',
        icon: 'Art',
        isActive: true,
      },
    }),
    prisma.area.upsert({
      where: { slug: 'isola' },
      update: {},
      create: {
        name: 'Isola',
        slug: 'isola',
        description:
          'Emerging design district with contemporary architecture and creative spaces',
        color: '#84cc16',
        icon: '🏝️',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created areas:', areas.map((a: any) => a.name).join(', '));

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'recessed-lights' },
      update: {},
      create: {
        name: 'Recessed Lights',
        slug: 'recessed-lights',
        description: 'Built-in ceiling and wall lighting solutions',
        color: '#fbbf24',
        icon: '💡',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'spotlights' },
      update: {},
      create: {
        name: 'Spotlights',
        slug: 'spotlights',
        description:
          'Directional lighting fixtures for accent and task lighting',
        color: '#3b82f6',
        icon: '🔦',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pendant-lights' },
      update: {},
      create: {
        name: 'Pendant Lights',
        slug: 'pendant-lights',
        description:
          'Hanging light fixtures for ambient and decorative lighting',
        color: '#8b5cf6',
        icon: '🕯️',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'chandeliers' },
      update: {},
      create: {
        name: 'Chandeliers',
        slug: 'chandeliers',
        description: 'Decorative multi-light fixtures for grand spaces',
        color: '#ec4899',
        icon: '✨',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wall-sconces' },
      update: {},
      create: {
        name: 'Wall Sconces',
        slug: 'wall-sconces',
        description:
          'Wall-mounted lighting fixtures for ambient and accent lighting',
        color: '#10b981',
        icon: '🕯️',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'table-lamps' },
      update: {},
      create: {
        name: 'Table Lamps',
        slug: 'table-lamps',
        description: 'Portable lighting solutions for desks and side tables',
        color: '#f59e0b',
        icon: '🪔',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'floor-lamps' },
      update: {},
      create: {
        name: 'Floor Lamps',
        slug: 'floor-lamps',
        description: 'Standing lighting fixtures for ambient and task lighting',
        color: '#ef4444',
        icon: '🏮',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'track-lighting' },
      update: {},
      create: {
        name: 'Track Lighting',
        slug: 'track-lighting',
        description: 'Flexible lighting systems with adjustable fixtures',
        color: '#06b6d4',
        icon: '⚡',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'led-strips' },
      update: {},
      create: {
        name: 'LED Strips',
        slug: 'led-strips',
        description:
          'Flexible LED lighting strips for accent and decorative lighting',
        color: '#84cc16',
        icon: '🌈',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'outdoor-lighting' },
      update: {},
      create: {
        name: 'Outdoor Lighting',
        slug: 'outdoor-lighting',
        description: 'Weather-resistant lighting for exterior spaces',
        color: '#6b7280',
        icon: '🌙',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'smart-lighting' },
      update: {},
      create: {
        name: 'Smart Lighting',
        slug: 'smart-lighting',
        description:
          'Connected lighting systems with app control and automation',
        color: '#8b5cf6',
        icon: '🤖',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'emergency-lighting' },
      update: {},
      create: {
        name: 'Emergency Lighting',
        slug: 'emergency-lighting',
        description: 'Safety lighting systems for emergency situations',
        color: '#dc2626',
        icon: '🚨',
        isActive: true,
      },
    }),
  ]);

  console.log(
    '✅ Created products:',
    products.map((p: any) => p.name).join(', ')
  );

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
  ]);

  console.log('✅ Created venues:', venues.map((v: any) => v.name).join(', '));

  // Check if events already exist - if so, skip event creation entirely
  const existingEvents = await prisma.event.findMany({
    select: { slug: true },
  });

  if (existingEvents.length > 0) {
    console.log(
      '✅ Events already exist, skipping event creation to prevent duplicates'
    );
  } else {
    console.log('🌱 No events found, creating sample events...');
    const existingSlugs = new Set(existingEvents.map((e: any) => e.slug));
    const events = [];

    if (!existingSlugs.has('milano-design-week-2024')) {
      const event = await prisma.event.create({
        data: {
          title: 'Milano Design Week 2024',
          slug: 'milano-design-week-2024',
          description:
            'The most important design event in the world, showcasing the latest trends in furniture, lighting, and home accessories.',
          shortDescription:
            "Discover the future of design at the world's premier design event.",
          status: 'PUBLISHED',
          startDate: new Date('2024-04-15T10:00:00Z'),
          endDate: new Date('2024-04-21T18:00:00Z'),
          capacity: 1000,
          currentWaitlist: 0,
          youtubeUrl: 'https://www.youtube.com/watch?v=example1',
          mapLat: 45.4508,
          mapLng: 9.1734,
          mapZoom: 15,
          mapAddress: 'Via Tortona, 37, 20144 Milano MI, Italy',
          ownerId: ownerUser.id,
          venueId: venues[0].id,
          categoryId: categories[0].id,
          isPublic: true,
          featured: true,
          tags: ['design', 'furniture', 'innovation', 'sustainability'],
          metadata: {
            organizer: 'Milano Design Center',
            contact: 'info@milanodesigncenter.com',
            social: {
              instagram: '@milanodesigncenter',
              twitter: '@milanodesign',
            },
          },
        },
      });
      events.push(event);
    }

    if (!existingSlugs.has('tech-innovation-summit')) {
      const event = await prisma.event.create({
        data: {
          title: 'Tech Innovation Summit 2024',
          slug: 'tech-innovation-summit',
          description:
            'A gathering of tech leaders, entrepreneurs, and innovators to discuss the future of technology and its impact on society.',
          shortDescription:
            'Join the conversation about the future of technology.',
          status: 'PUBLISHED',
          startDate: new Date('2024-05-20T09:00:00Z'),
          endDate: new Date('2024-05-22T17:00:00Z'),
          capacity: 500,
          currentWaitlist: 0,
          youtubeUrl: 'https://www.youtube.com/watch?v=example2',
          mapLat: 45.4722,
          mapLng: 9.1708,
          mapZoom: 15,
          mapAddress: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
          ownerId: ownerUser.id,
          venueId: venues[1].id,
          categoryId: categories[1].id,
          isPublic: true,
          featured: false,
          tags: ['technology', 'innovation', 'startups', 'AI'],
          metadata: {
            organizer: 'Tech Milano',
            contact: 'hello@techmilano.it',
            social: {
              linkedin: 'Tech Milano',
              twitter: '@techmilano',
            },
          },
        },
      });
      events.push(event);
    }

    if (!existingSlugs.has('contemporary-art-exhibition')) {
      const event = await prisma.event.create({
        data: {
          title: 'Contemporary Art Exhibition',
          slug: 'contemporary-art-exhibition',
          description:
            'An immersive exhibition featuring works by emerging and established contemporary artists from around the world.',
          shortDescription:
            'Experience cutting-edge contemporary art in the heart of Milano.',
          status: 'DRAFT',
          startDate: new Date('2024-06-10T11:00:00Z'),
          endDate: new Date('2024-08-10T19:00:00Z'),
          capacity: 200,
          currentWaitlist: 0,
          mapLat: 45.4444,
          mapLng: 9.2,
          mapZoom: 15,
          mapAddress: 'Largo Isarco, 2, 20139 Milano MI, Italy',
          ownerId: ownerUser.id,
          venueId: venues[2].id,
          categoryId: categories[2].id,
          isPublic: false,
          featured: false,
          tags: ['art', 'contemporary', 'exhibition', 'culture'],
          metadata: {
            organizer: 'Fondazione Prada',
            contact: 'info@fondazioneprada.org',
            social: {
              instagram: '@fondazioneprada',
              facebook: 'Fondazione Prada',
            },
          },
        },
      });
      events.push(event);
    }

    console.log('✅ Created events:', events.map(e => e.title).join(', '));

    // Create sample shows for the first event (only if events were created)
    const shows = [];
    if (events.length > 0) {
      const newShows = await Promise.all([
        prisma.show.create({
          data: {
            title: 'Opening Ceremony',
            description: 'Official opening of Milano Design Week 2024',
            startDate: new Date('2024-04-15T10:00:00Z'),
            endDate: new Date('2024-04-15T12:00:00Z'),
            capacity: 200,
            currentWaitlist: 0,
            youtubeUrl: 'https://www.youtube.com/watch?v=opening',
            eventId: events[0]?.id || '',
          },
        }),
        prisma.show.create({
          data: {
            title: 'Design Innovation Panel',
            description: 'Panel discussion on the future of design innovation',
            startDate: new Date('2024-04-16T14:00:00Z'),
            endDate: new Date('2024-04-16T16:00:00Z'),
            capacity: 150,
            currentWaitlist: 0,
            eventId: events[0]?.id || '',
          },
        }),
      ]);
      shows.push(...newShows);
    }

    console.log('✅ Created shows:', shows.map(s => s.title).join(', '));

    // Create sample waitlist entries (only if events were created)
    const waitlistEntries = [];
    if (events.length > 0) {
      const newWaitlistEntries = await Promise.all([
        prisma.waitlistEntry.create({
          data: {
            email: 'visitor1@example.com',
            eventId: events[0]?.id || '',
            status: 'PENDING',
          },
        }),
        prisma.waitlistEntry.create({
          data: {
            email: 'visitor2@example.com',
            eventId: events[0]?.id || '',
            status: 'CONFIRMED',
          },
        }),
        events[1]
          ? prisma.waitlistEntry.create({
              data: {
                email: 'visitor3@example.com',
                eventId: events[1].id,
                status: 'PENDING',
              },
            })
          : null,
      ]);
      waitlistEntries.push(...newWaitlistEntries.filter(Boolean));
    }

    console.log('✅ Created waitlist entries:', waitlistEntries.length);

    // Add 20-30 random waitlist emails per event
    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      const event = events[eventIndex];
      if (!event) continue;
      const count = 20 + Math.floor(Math.random() * 11); // 20..30
      const statuses = [
        'PENDING',
        'CONFIRMED',
        'APPROVED',
        'REJECTED',
        'ARRIVED',
        'CANCELLED',
      ] as const;
      const emails: {
        email: string;
        eventId: string;
        status: (typeof statuses)[number];
      }[] = [];
      for (let i = 0; i < count; i++) {
        const email = `seed-user-${eventIndex}-${i}@example.com`;
        const status = statuses[
          Math.floor(Math.random() * statuses.length)
        ] as (typeof statuses)[number];
        emails.push({ email, eventId: event.id, status });
      }
      // Use createMany for efficiency; skipDuplicates to avoid clashes with prior seeds
      await prisma.waitlistEntry.createMany({
        data: emails,
        skipDuplicates: true,
      });
      console.log(`✅ Added ${count} waitlist entries for event:`, event.title);
    }

    // Create sample nearby places (only if events were created)
    const nearbyPlaces = [];
    if (events.length > 0) {
      const newNearbyPlaces = await Promise.all([
        prisma.nearbyPlace.create({
          data: {
            name: 'Ristorante Da Giacomo',
            address: 'Via Pasquale Sottocorno, 6, 20129 Milano MI, Italy',
            latitude: 45.451,
            longitude: 9.173,
            category: 'restaurant',
            rating: 4.5,
            website: 'https://ristorantedagiacomo.it',
            phone: '+39 02 5810 2812',
            distance: 150,
            eventId: events[0]?.id || '',
          },
        }),
        prisma.nearbyPlace.create({
          data: {
            name: 'Museo della Scienza e della Tecnologia',
            address: 'Via San Vittore, 21, 20123 Milano MI, Italy',
            latitude: 45.472,
            longitude: 9.17,
            category: 'museum',
            rating: 4.3,
            website: 'https://museoscienza.org',
            phone: '+39 02 485 551',
            distance: 300,
            eventId: events[0]?.id || '',
          },
        }),
      ]);
      nearbyPlaces.push(...newNearbyPlaces);
    }

    console.log(
      '✅ Created nearby places:',
      nearbyPlaces.map(p => p.name).join(', ')
    );

    // ------------------------------------------------------------------
    // Bulk: Create 200 real-looking users and register each to 2 events
    // ------------------------------------------------------------------
    try {
      // Fetch a few events to register users to (fallback-safe)
      const eventsForRegistration = (await prisma.event.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
        orderBy: { createdAt: 'asc' },
        take: 5,
      })) as Array<{ id: string; title: string }>;

      if (eventsForRegistration.length >= 2) {
        const firstNames = [
          'Liam',
          'Noah',
          'Oliver',
          'Elijah',
          'James',
          'William',
          'Benjamin',
          'Lucas',
          'Henry',
          'Theodore',
          'Olivia',
          'Emma',
          'Charlotte',
          'Amelia',
          'Ava',
          'Sophia',
          'Isabella',
          'Mia',
          'Evelyn',
          'Harper',
          'Ethan',
          'Michael',
          'Daniel',
          'Jacob',
          'Logan',
          'Jackson',
          'Levi',
          'Sebastian',
          'Mateo',
          'Jack',
          'Aiden',
          'Owen',
          'Samuel',
          'Matthew',
          'Joseph',
          'John',
          'David',
          'Wyatt',
          'Carter',
          'Julian',
          'Emily',
          'Abigail',
          'Ella',
          'Elizabeth',
          'Sofia',
          'Avery',
          'Scarlett',
          'Eleanor',
          'Madison',
          'Luna',
        ];
        const lastNames = [
          'Smith',
          'Johnson',
          'Williams',
          'Brown',
          'Jones',
          'Garcia',
          'Miller',
          'Davis',
          'Rodriguez',
          'Martinez',
          'Hernandez',
          'Lopez',
          'Gonzalez',
          'Wilson',
          'Anderson',
          'Thomas',
          'Taylor',
          'Moore',
          'Jackson',
          'Martin',
          'Lee',
          'Perez',
          'Thompson',
          'White',
          'Harris',
          'Sanchez',
          'Clark',
          'Ramirez',
          'Lewis',
          'Robinson',
          'Walker',
          'Young',
          'Allen',
          'King',
          'Wright',
          'Scott',
          'Torres',
          'Nguyen',
          'Hill',
          'Flores',
          'Green',
          'Adams',
          'Nelson',
          'Baker',
          'Hall',
          'Rivera',
          'Campbell',
          'Mitchell',
          'Carter',
          'Roberts',
        ];

        const userCount = 200;
        const usersToCreate: Array<{
          email: string;
          name: string;
          role: 'VISITOR';
          isActive: boolean;
          lastLoginAt: Date;
        }> = [];

        for (let i = 0; i < userCount; i++) {
          const fn: string = firstNames[i % firstNames.length] ?? 'User';
          const ln: string =
            lastNames[
              (Math.floor(i / firstNames.length) + i) % lastNames.length
            ] ?? 'Demo';
          const name = `${fn} ${ln}`;
          // Use a stable but unique email scheme
          const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@example.com`;
          usersToCreate.push({
            email,
            name,
            role: 'VISITOR',
            isActive: true,
            lastLoginAt: new Date(),
          });
        }

        // Create users in bulk; skipDuplicates avoids collisions on re-seed
        await prisma.user.createMany({
          data: usersToCreate,
          skipDuplicates: true,
        });
        console.log(`✅ Ensured ${userCount} users exist`);

        // Register each user to 2 events (round-robin across available events)
        const userEmails = usersToCreate.map(u => u.email);
        const regs: {
          email: string;
          eventId: string;
          status: 'PENDING' | 'CONFIRMED';
        }[] = [];
        const eventIds: string[] = eventsForRegistration
          .map(e => e.id as string)
          .filter(
            (id): id is string => typeof id === 'string' && id.length > 0
          );

        if (eventIds.length >= 2) {
          for (let i = 0; i < userEmails.length; i++) {
            const email = userEmails[i]!;
            const id1 = eventIds[i % eventIds.length]!;
            const id2 = eventIds[(i + 1) % eventIds.length]!;
            if (id1) regs.push({ email, eventId: id1, status: 'CONFIRMED' });
            if (id2) regs.push({ email, eventId: id2, status: 'PENDING' });
          }
        } else {
          console.log(
            'ℹ️  Skipping user registrations: insufficient valid event IDs'
          );
        }

        // Use createMany with skipDuplicates to be idempotent
        await prisma.waitlistEntry.createMany({
          data: regs,
          skipDuplicates: true,
        });
        console.log(
          `✅ Registered ${userEmails.length} users to 2 events each (total entries: ${regs.length})`
        );
      } else {
        console.log(
          'ℹ️  Skipping user registrations: fewer than 2 events available'
        );
      }
    } catch (err) {
      console.log(
        '⚠️  Skipped bulk user+registration seeding due to an error:',
        err
      );
    }

    // Create sample consents
    const consents = await Promise.all([
      prisma.consent.create({
        data: {
          userId: adminUser.id,
          type: 'NECESSARY',
          granted: true,
          grantedAt: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (compatible; Seed Script)',
        },
      }),
      prisma.consent.create({
        data: {
          userId: adminUser.id,
          type: 'ANALYTICS',
          granted: true,
          grantedAt: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (compatible; Seed Script)',
        },
      }),
    ]);

    console.log('✅ Created consents:', consents.length);

    console.log('🎉 Database seed completed successfully!');
  }

  main()
    .catch(e => {
      console.error('❌ Error during seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
