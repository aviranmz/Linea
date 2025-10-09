import * as Prisma from '@prisma/client';
import QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = Prisma as any;
const prisma = new PrismaClient();

// Helper function to generate QR code and save it
async function generateQRCode(eventId: string, eventSlug: string): Promise<string> {
  try {
    const qrDir = path.join(process.cwd(), 'uploads', 'qr');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const url = `${process.env.FRONTEND_URL || 'https://linea.up.railway.app'}/events/${eventSlug}`;
    const qrPath = path.join(qrDir, `${eventId}.png`);
    
    await QRCode.toFile(qrPath, url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return `/uploads/qr/${eventId}.png`;
  } catch (error) {
    console.error(`Error generating QR code for event ${eventId}:`, error);
    return '';
  }
}

// Helper to generate realistic email
function generateEmail(firstName: string, lastName: string, domain: string): string {
  const random = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random > 500 ? random : ''}@${domain}`;
}

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // STEP 1: Clean all existing data
  console.log('🧹 Cleaning existing data...');
  
  await prisma.waitlistEntry.deleteMany({});
  console.log('✅ Deleted all waitlist entries');
  
  await prisma.event.deleteMany({});
  console.log('✅ Deleted all events');
  
  await prisma.user.deleteMany({ where: { role: { in: ['VISITOR', 'OWNER'] } } });
  console.log('✅ Deleted all visitors and owners');
  
  await prisma.venue.deleteMany({});
  console.log('✅ Deleted all venues');
  
  await prisma.area.deleteMany({});
  console.log('✅ Deleted all areas');
  
  await prisma.product.deleteMany({});
  console.log('✅ Deleted all products');
  
  await prisma.category.deleteMany({});
  console.log('✅ Deleted all categories');

  // STEP 2: Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@linea.app' },
    update: {},
    create: {
      email: 'admin@linea.app',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
      businessName: 'Linea Platform',
      businessIntro: 'Platform administration',
      phone: '+39 02 1234 5678',
      website: 'https://linea.app',
      address: 'Via Montenapoleone 1',
      city: 'Milano',
      country: 'Italy',
      latitude: 45.4692,
      longitude: 9.1903,
    },
  });
  console.log('✅ Created admin user');

  // STEP 3: Create categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Design & Architecture',
        slug: 'design-architecture',
        description: 'Contemporary design and architecture exhibitions',
        color: '#8B4513',
        icon: '🏛️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology & Innovation',
        slug: 'technology-innovation',
        description: 'Tech events and innovation showcases',
        color: '#2E8B57',
        icon: '💻',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion & Style',
        slug: 'fashion-style',
        description: 'Fashion shows and style events',
        color: '#FF1493',
        icon: '👗',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created categories');

  // STEP 4: Create areas
  console.log('📍 Creating areas...');
  const areas = await Promise.all([
    prisma.area.create({
      data: {
        name: 'Brera',
        slug: 'brera',
        description: 'Historic art district',
        latitude: 45.4722,
        longitude: 9.1881,
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Porta Nuova',
        slug: 'porta-nuova',
        description: 'Modern business district',
        latitude: 45.4808,
        longitude: 9.1881,
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Navigli',
        slug: 'navigli',
        description: 'Canal district with vibrant nightlife',
        latitude: 45.4444,
        longitude: 9.1734,
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created areas');

  // STEP 5: Create products
  console.log('🏷️ Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Designer lighting solutions',
        color: '#FFD700',
        icon: '💡',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Contemporary furniture',
        color: '#8B4513',
        icon: '🪑',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kitchen',
        slug: 'kitchen',
        description: 'Kitchen appliances and design',
        color: '#FF6347',
        icon: '🍳',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created products');

  // STEP 6: Create venues with complete addresses
  console.log('🏢 Creating venues...');
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Triennale di Milano',
        address: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4722,
        longitude: 9.1708,
        website: 'https://triennale.org',
        phone: '+39 02 7243 4200',
        email: 'info@triennale.org',
        capacity: 500,
        description: 'Premier design museum',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Fondazione Prada',
        address: 'Largo Isarco, 2, 20139 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4444,
        longitude: 9.2,
        website: 'https://fondazioneprada.org',
        phone: '+39 02 5666 2611',
        email: 'info@fondazioneprada.org',
        capacity: 300,
        description: 'Contemporary art foundation',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Spazio Rossana Orlandi',
        address: 'Via Matteo Bandello, 14/16, 20123 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4719,
        longitude: 9.1881,
        website: 'https://rossanaorlandi.com',
        phone: '+39 02 4674 4691',
        email: 'info@rossanaorlandi.com',
        capacity: 150,
        description: 'Iconic design gallery',
      },
    }),
  ]);
  console.log('✅ Created venues');

  // STEP 7: Create 5 owners with complete data
  console.log('👥 Creating owners...');
  const owners = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alessandro.rossi@studiorossi.it',
        name: 'Alessandro Rossi',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Studio Rossi Design',
        businessIntro: 'Leading design studio specializing in sustainable architecture and contemporary furniture. We create innovative spaces that blend functionality with aesthetic excellence.',
        phone: '+39 02 1234 5678',
        website: 'https://studiorossi.it',
        facebookUrl: 'https://facebook.com/studiorossi',
        instagramUrl: 'https://instagram.com/studiorossi',
        linkedinUrl: 'https://linkedin.com/company/studio-rossi',
        twitterUrl: 'https://twitter.com/studiorossi',
        address: 'Via Brera 10',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        latitude: 45.4722,
        longitude: 9.1881,
        areaId: areas[0].id,
        productId: products[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.bianchi@cucinemodernemilano.it',
        name: 'Maria Bianchi',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Cucine Moderne Milano',
        businessIntro: 'Premium kitchen design studio creating luxury culinary spaces. We combine Italian craftsmanship with cutting-edge technology to deliver exceptional kitchen solutions.',
        phone: '+39 02 8765 4321',
        website: 'https://cucinemodernemilano.it',
        facebookUrl: 'https://facebook.com/cucinemodernemilano',
        instagramUrl: 'https://instagram.com/cucinemodernemilano',
        linkedinUrl: 'https://linkedin.com/company/cucine-moderne-milano',
        twitterUrl: 'https://twitter.com/cucinemodernemilano',
        address: 'Via Tortona 37',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20144',
        latitude: 45.4444,
        longitude: 9.1734,
        areaId: areas[2].id,
        productId: products[2].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'luca.ferrari@lucedesign.it',
        name: 'Luca Ferrari',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Luce & Design',
        businessIntro: 'Innovative lighting design studio creating atmospheric and functional lighting solutions for residential and commercial spaces.',
        phone: '+39 02 9876 5432',
        website: 'https://lucedesign.it',
        facebookUrl: 'https://facebook.com/lucedesign',
        instagramUrl: 'https://instagram.com/lucedesign',
        linkedinUrl: 'https://linkedin.com/company/luce-design',
        twitterUrl: 'https://twitter.com/lucedesign',
        address: 'Via Porta Nuova 8',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        latitude: 45.4808,
        longitude: 9.1881,
        areaId: areas[1].id,
        productId: products[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'francesca.conti@atelierconti.it',
        name: 'Francesca Conti',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Atelier Conti',
        businessIntro: 'Bespoke furniture atelier creating unique pieces that blend traditional Italian craftsmanship with contemporary design.',
        phone: '+39 02 5555 1234',
        website: 'https://atelierconti.it',
        facebookUrl: 'https://facebook.com/atelierconti',
        instagramUrl: 'https://instagram.com/atelierconti',
        linkedinUrl: 'https://linkedin.com/company/atelier-conti',
        twitterUrl: 'https://twitter.com/atelierconti',
        address: 'Via Navigli 25',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20123',
        latitude: 45.4444,
        longitude: 9.1734,
        areaId: areas[2].id,
        productId: products[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'elena.ferrari@tessutiferrari.it',
        name: 'Elena Ferrari',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Tessuti Ferrari',
        businessIntro: 'Luxury textile house specializing in high-end fabrics for interior design and fashion.',
        phone: '+39 02 3333 9876',
        website: 'https://tessutiferrari.it',
        facebookUrl: 'https://facebook.com/tessutiferrari',
        instagramUrl: 'https://instagram.com/tessutiferrari',
        linkedinUrl: 'https://linkedin.com/company/tessuti-ferrari',
        twitterUrl: 'https://twitter.com/tessutiferrari',
        address: 'Via Garibaldi 12',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        latitude: 45.4681,
        longitude: 9.1903,
        areaId: areas[0].id,
        productId: products[1].id,
      },
    }),
  ]);
  console.log('✅ Created 5 owners');

  // STEP 8: Create 100 visitors with realistic emails
  console.log('👤 Creating 100 visitors...');
  const firstNames = ['Marco', 'Giulia', 'Andrea', 'Francesca', 'Luca', 'Sofia', 'Matteo', 'Chiara', 'Alessandro', 'Valentina', 'Davide', 'Sara', 'Lorenzo', 'Elena', 'Simone', 'Martina', 'Federico', 'Alessia', 'Riccardo', 'Beatrice'];
  const lastNames = ['Rossi', 'Bianchi', 'Ferrari', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.it', 'libero.it', 'hotmail.it', 'icloud.com', 'protonmail.com', 'fastmail.com'];

  const visitors = [];
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = generateEmail(firstName, lastName, domain);

    const visitor = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: 'VISITOR',
        isActive: true,
        lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      },
    });
    visitors.push(visitor);
  }
  console.log('✅ Created 100 visitors');

  // STEP 9: Create events with complete addresses and associate with owners
  console.log('🎉 Creating events...');
  const eventData = [
    {
      title: 'Milano Design Week 2024: Sustainable Futures',
      slug: 'milano-design-week-2024-sustainable-futures',
      description: 'Join us for the most anticipated design event of the year! Milano Design Week 2024 showcases cutting-edge sustainable design innovations.',
      shortDescription: 'Premier design exhibition exploring sustainable innovations',
      ownerId: owners[0].id,
      venueId: venues[0].id,
      categoryId: categories[0].id,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    },
    {
      title: 'Luxury Kitchen Design Masterclass',
      slug: 'luxury-kitchen-design-masterclass',
      description: 'An exclusive masterclass for interior designers focusing on luxury kitchen design principles and latest trends.',
      shortDescription: 'Exclusive masterclass on luxury kitchen design',
      ownerId: owners[1].id,
      venueId: venues[1].id,
      categoryId: categories[0].id,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    },
    {
      title: 'Lighting Design Symposium: Art & Technology',
      slug: 'lighting-design-symposium-art-technology',
      description: 'Explore the intersection of art and technology in contemporary lighting design with live demonstrations.',
      shortDescription: 'Symposium on art and technology in lighting',
      ownerId: owners[2].id,
      venueId: venues[2].id,
      categoryId: categories[1].id,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
    },
    {
      title: 'Bespoke Furniture Design Workshop',
      slug: 'bespoke-furniture-design-workshop',
      description: 'Hands-on workshop on creating bespoke furniture pieces using traditional Italian craftsmanship techniques.',
      shortDescription: 'Workshop on bespoke furniture craftsmanship',
      ownerId: owners[3].id,
      venueId: venues[0].id,
      categoryId: categories[0].id,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop',
    },
    {
      title: 'Luxury Textiles Exhibition',
      slug: 'luxury-textiles-exhibition',
      description: 'Exhibition showcasing luxury fabrics and textile innovations for interior design and fashion.',
      shortDescription: 'Exhibition of luxury textiles and fabrics',
      ownerId: owners[4].id,
      venueId: venues[1].id,
      categoryId: categories[2].id,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800&h=600&fit=crop',
    },
    {
      title: 'Contemporary Architecture Forum',
      slug: 'contemporary-architecture-forum',
      description: 'Forum discussing contemporary architecture trends and sustainable building practices.',
      shortDescription: 'Forum on contemporary architecture',
      ownerId: owners[0].id,
      venueId: venues[2].id,
      categoryId: categories[0].id,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
    },
    {
      title: 'Smart Home Technology Showcase',
      slug: 'smart-home-technology-showcase',
      description: 'Showcase of the latest smart home technologies and automation solutions for modern living.',
      shortDescription: 'Smart home technology showcase',
      ownerId: owners[1].id,
      venueId: venues[0].id,
      categoryId: categories[1].id,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop',
    },
    {
      title: 'Italian Design Heritage Tour',
      slug: 'italian-design-heritage-tour',
      description: 'Guided tour exploring Italian design heritage and its influence on contemporary design.',
      shortDescription: 'Tour of Italian design heritage',
      ownerId: owners[2].id,
      venueId: venues[1].id,
      categoryId: categories[0].id,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
    },
    {
      title: 'Sustainable Materials Workshop',
      slug: 'sustainable-materials-workshop',
      description: 'Workshop on sustainable materials and their applications in contemporary design projects.',
      shortDescription: 'Workshop on sustainable materials',
      ownerId: owners[3].id,
      venueId: venues[2].id,
      categoryId: categories[0].id,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    },
    {
      title: 'Fashion & Interior Design Crossover',
      slug: 'fashion-interior-design-crossover',
      description: 'Event exploring the crossover between fashion and interior design with industry experts.',
      shortDescription: 'Fashion and interior design event',
      ownerId: owners[4].id,
      venueId: venues[0].id,
      categoryId: categories[2].id,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    },
  ];

  const events = [];
  for (const data of eventData) {
    const venue = venues.find(v => v.id === data.venueId);
    const startDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Random date in next 60 days
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000); // 6 hours later

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        status: 'PUBLISHED',
        startDate,
        endDate,
        capacity: 100 + Math.floor(Math.random() * 400),
        currentWaitlist: 0,
        mapLat: venue?.latitude || null,
        mapLng: venue?.longitude || null,
        mapZoom: 15,
        mapAddress: venue?.address || null,
        streetAddress: venue?.address?.split(',')[0] || null,
        city: venue?.city || 'Milano',
        country: venue?.country || 'Italy',
        postalCode: '20121',
        ownerId: data.ownerId,
        venueId: data.venueId,
        categoryId: data.categoryId,
        isPublic: true,
        featured: data.featured,
        tags: ['design', 'milano', 'event'],
        metadata: {
          heroImageUrl: data.heroImage,
          organizer: owners.find(o => o.id === data.ownerId)?.businessName || 'Linea Events',
        },
      },
    });

    // Generate QR code for this event
    const qrCodeUrl = await generateQRCode(event.id, event.slug);
    
    // Update event with QR code URL (separate from hero image)
    await prisma.event.update({
      where: { id: event.id },
      data: {
        qrCodeUrl, // Store QR code in separate field
        metadata: {
          ...event.metadata,
          qrCodeUrl, // Also in metadata for backwards compatibility
        },
      },
    });

    events.push(event);
    console.log(`✅ Created event: ${event.title} with QR code`);
  }

  // STEP 10: Create waitlist entries (visitors registering for events)
  console.log('📝 Creating waitlist entries...');
  let waitlistCount = 0;
  for (const event of events) {
    // Random number of registrations per event (5-20)
    const numRegistrations = 5 + Math.floor(Math.random() * 16);
    const selectedVisitors = visitors
      .sort(() => 0.5 - Math.random())
      .slice(0, numRegistrations);

    for (const visitor of selectedVisitors) {
      await prisma.waitlistEntry.create({
        data: {
          email: visitor.email,
          eventId: event.id,
          userId: visitor.id,
          status: 'CONFIRMED',
        },
      });
      waitlistCount++;
    }
  }
  console.log(`✅ Created ${waitlistCount} waitlist entries`);

  console.log('🎉 Comprehensive seed completed successfully!');
  console.log(`
Summary:
- 1 Admin user
- 5 Owners with complete profiles
- 100 Visitors with realistic emails
- 10 Events with complete addresses and QR codes
- ${waitlistCount} Waitlist entries
- All events associated with owners
- All events have addresses and show on maps
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
