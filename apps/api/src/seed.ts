import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

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

// Helper function to generate realistic email addresses
function generateEmail(firstName: string, lastName: string, domain: string): string {
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@${domain}`,
  ];
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex] || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // STEP 1: Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.waitlistEntry.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.area.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Database cleaned');

  // STEP 2: Create categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Design', slug: 'design', description: 'Interior and product design' },
    }),
    prisma.category.create({
      data: { name: 'Fashion', slug: 'fashion', description: 'Fashion and textile design' },
    }),
    prisma.category.create({
      data: { name: 'Furniture', slug: 'furniture', description: 'Furniture and home decor' },
    }),
    prisma.category.create({
      data: { name: 'Textiles', slug: 'textiles', description: 'Textile and fabric design' },
    }),
    prisma.category.create({
      data: { name: 'Technology', slug: 'technology', description: 'Design technology and innovation' },
    }),
  ]);
  console.log('✅ Created categories');

  // STEP 3: Create products
  console.log('🛍️ Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: { name: 'Furniture', slug: 'furniture', description: 'Custom furniture pieces' },
    }),
    prisma.product.create({
      data: { name: 'Fashion', slug: 'fashion', description: 'Fashion and apparel' },
    }),
    prisma.product.create({
      data: { name: 'Textiles', slug: 'textiles', description: 'Textile products' },
    }),
    prisma.product.create({
      data: { name: 'Technology', slug: 'technology', description: 'Design technology solutions' },
    }),
    prisma.product.create({
      data: { name: 'Design', slug: 'design', description: 'Design services and consulting' },
    }),
  ]);
  console.log('✅ Created products');

  // STEP 4: Create areas
  console.log('📍 Creating areas...');
  const areas = await Promise.all([
    prisma.area.create({
      data: { name: 'Brera', slug: 'brera', description: 'Historic design district' },
    }),
    prisma.area.create({
      data: { name: 'Navigli', slug: 'navigli', description: 'Creative canal district' },
    }),
    prisma.area.create({
      data: { name: 'Garibaldi', slug: 'garibaldi', description: 'Modern business district' },
    }),
    prisma.area.create({
      data: { name: 'Porta Nuova', slug: 'porta-nuova', description: 'Contemporary design hub' },
    }),
    prisma.area.create({
      data: { name: 'Quadrilatero', slug: 'quadrilatero', description: 'Fashion and luxury district' },
    }),
  ]);
  console.log('✅ Created areas');

  // STEP 5: Create venues
  console.log('🏢 Creating venues...');
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Palazzo Brera',
        address: 'Via Brera, 28',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4722,
        longitude: 9.1881,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Spazio Navigli',
        address: 'Via Navigli, 15',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4444,
        longitude: 9.1734,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Centro Garibaldi',
        address: 'Via Garibaldi, 12',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4808,
        longitude: 9.1881,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Porta Nuova Hub',
        address: 'Via Porta Nuova, 8',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4722,
        longitude: 9.1708,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Quadrilatero Design',
        address: 'Via Quadrilatero, 15',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4681,
        longitude: 9.1903,
      },
    }),
  ]);
  console.log('✅ Created venues');

  // STEP 6: Create admin user
  console.log('👑 Creating admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@linea.app',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Created admin user');

  // STEP 7: Create 5 owners with comprehensive profiles
  console.log('👥 Creating 5 owners with comprehensive profiles...');
  const owners = await Promise.all([
    prisma.user.create({
      data: {
        email: 'marco.rossi@studiorossi.it',
        name: 'Marco Rossi',
        role: 'OWNER',
        isActive: true,
        businessName: 'Studio Rossi Design',
        phone: '+39 02 1234 5678',
        website: 'https://studiorossi.it',
        address: 'Via Brera, 28',
        city: 'Milano',
        country: 'Italy',
        instagramUrl: 'https://instagram.com/studiorossi',
        facebookUrl: 'https://facebook.com/studiorossi',
        areaId: areas[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'giulia.bianchi@atelierbianchi.it',
        name: 'Giulia Bianchi',
        role: 'OWNER',
        isActive: true,
        businessName: 'Atelier Bianchi',
        phone: '+39 02 2345 6789',
        website: 'https://atelierbianchi.it',
        address: 'Via Navigli, 15',
        city: 'Milano',
        country: 'Italy',
        instagramUrl: 'https://instagram.com/atelierbianchi',
        facebookUrl: 'https://facebook.com/atelierbianchi',
        areaId: areas[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'andrea.ferrari@lucemilano.it',
        name: 'Andrea Ferrari',
        role: 'OWNER',
        isActive: true,
        businessName: 'Luce Milano',
        phone: '+39 02 3456 7890',
        website: 'https://lucemilano.it',
        address: 'Via Garibaldi, 12',
        city: 'Milano',
        country: 'Italy',
        instagramUrl: 'https://instagram.com/lucemilano',
        facebookUrl: 'https://facebook.com/lucemilano',
        areaId: areas[2].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'francesca.conti@atelierconti.it',
        name: 'Francesca Conti',
        role: 'OWNER',
        isActive: true,
        businessName: 'Atelier Conti',
        phone: '+39 02 4567 8901',
        website: 'https://atelierconti.it',
        address: 'Via Porta Nuova, 8',
        city: 'Milano',
        country: 'Italy',
        instagramUrl: 'https://instagram.com/atelierconti',
        facebookUrl: 'https://facebook.com/atelierconti',
        areaId: areas[3].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'luca.ricci@tessutiferrari.it',
        name: 'Luca Ricci',
        role: 'OWNER',
        isActive: true,
        businessName: 'Tessuti Ferrari',
        phone: '+39 02 5678 9012',
        website: 'https://tessutiferrari.it',
        address: 'Via Quadrilatero, 15',
        city: 'Milano',
        country: 'Italy',
        instagramUrl: 'https://instagram.com/tessutiferrari',
        facebookUrl: 'https://facebook.com/tessutiferrari',
        areaId: areas[4].id,
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
        lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    visitors.push(visitor);
  }
  console.log('✅ Created 100 visitors');

  // STEP 9: Create 5 events per owner (25 total events)
  console.log('🎉 Creating 25 events (5 per owner)...');
  const events = [];
  
  for (let ownerIndex = 0; ownerIndex < owners.length; ownerIndex++) {
    const owner = owners[ownerIndex];
    console.log(`📅 Creating 5 events for owner: ${owner.name}`);
    
    for (let eventIndex = 0; eventIndex < 5; eventIndex++) {
      const eventTemplates = [
        {
          title: `${owner.businessName} Design Exhibition`,
          slug: `${owner.businessName?.toLowerCase().replace(/\s+/g, '-')}-design-exhibition-${eventIndex + 1}`,
          description: `Join us for an exclusive design exhibition showcasing the latest innovations from ${owner.businessName}. This comprehensive event features cutting-edge designs, interactive installations, and networking opportunities with industry leaders.`,
          shortDescription: `Premier design exhibition by ${owner.businessName}`,
          capacity: 200 + (eventIndex * 50),
          tags: ['design', 'exhibition', 'innovation', 'networking'],
          features: ['Interactive Installations', 'Expert Panels', 'Networking', 'Portfolio Reviews'],
          pricing: `€${75 + (eventIndex * 25)} for professionals`,
        },
        {
          title: `${owner.businessName} Masterclass Series`,
          slug: `${owner.businessName?.toLowerCase().replace(/\s+/g, '-')}-masterclass-${eventIndex + 1}`,
          description: `Master the art of professional design in this comprehensive masterclass by ${owner.businessName}. Learn from industry experts as they share their secrets to creating stunning, high-end projects.`,
          shortDescription: `Professional masterclass by ${owner.businessName}`,
          capacity: 50 + (eventIndex * 25),
          tags: ['masterclass', 'professional', 'workshop', 'education'],
          features: ['Hands-on Workshops', 'Expert Demonstrations', 'Networking', 'Portfolio Reviews'],
          pricing: `€${100 + (eventIndex * 50)} for professionals`,
        },
        {
          title: `${owner.businessName} Innovation Symposium`,
          slug: `${owner.businessName?.toLowerCase().replace(/\s+/g, '-')}-innovation-symposium-${eventIndex + 1}`,
          description: `Explore the latest innovations in design and technology at this cutting-edge symposium by ${owner.businessName}. Features presentations from leading researchers and hands-on demonstrations.`,
          shortDescription: `Innovation symposium by ${owner.businessName}`,
          capacity: 150 + (eventIndex * 30),
          tags: ['innovation', 'technology', 'symposium', 'research'],
          features: ['Technology Demos', 'Research Presentations', 'Networking', 'Future Trends'],
          pricing: `€${80 + (eventIndex * 20)} for professionals`,
        },
        {
          title: `${owner.businessName} Craft Workshop`,
          slug: `${owner.businessName?.toLowerCase().replace(/\s+/g, '-')}-craft-workshop-${eventIndex + 1}`,
          description: `Discover traditional and modern craft techniques in this hands-on workshop by ${owner.businessName}. Learn from master artisans and create your own projects.`,
          shortDescription: `Craft workshop by ${owner.businessName}`,
          capacity: 30 + (eventIndex * 10),
          tags: ['craft', 'workshop', 'traditional', 'hands-on'],
          features: ['Artisan Demonstrations', 'Hands-on Sessions', 'Tool Workshop', 'Take-home Projects'],
          pricing: `€${60 + (eventIndex * 15)} for adults`,
        },
        {
          title: `${owner.businessName} Future Conference`,
          slug: `${owner.businessName?.toLowerCase().replace(/\s+/g, '-')}-future-conference-${eventIndex + 1}`,
          description: `Explore the future of design and technology at this forward-thinking conference by ${owner.businessName}. Discover emerging trends and sustainable solutions.`,
          shortDescription: `Future-focused conference by ${owner.businessName}`,
          capacity: 250 + (eventIndex * 50),
          tags: ['future', 'sustainability', 'conference', 'trends'],
          features: ['Trend Presentations', 'Sustainability Panel', 'Innovation Showcase', 'Industry Networking'],
          pricing: `€${90 + (eventIndex * 30)} for professionals`,
        }
      ];
      
      const template = eventTemplates[eventIndex];
      if (!template) {
        console.error(`No template found for eventIndex ${eventIndex}`);
        continue;
      }
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (ownerIndex * 7) + (eventIndex * 2) + 15);
      startDate.setHours(9 + (eventIndex * 2), 0, 0, 0);
      
      const event = await prisma.event.create({
        data: {
          title: template.title,
          slug: template.slug,
          description: template.description,
          shortDescription: template.shortDescription,
          status: 'PUBLISHED',
          startDate: startDate,
          endDate: new Date(startDate.getTime() + (6 + eventIndex) * 60 * 60 * 1000),
          capacity: template.capacity,
          currentWaitlist: 0,
          mapLat: 45.4722 + (ownerIndex * 0.01) + (eventIndex * 0.002),
          mapLng: 9.1708 + (ownerIndex * 0.01) + (eventIndex * 0.002),
          mapZoom: 15,
          mapAddress: `${owner.address}, ${owner.city}, ${owner.country}`,
          streetAddress: owner.address,
          city: owner.city,
          country: owner.country,
          postalCode: '20121',
          ownerId: owner.id,
          venueId: venues[ownerIndex % venues.length].id,
          categoryId: categories[ownerIndex % categories.length].id,
          isPublic: true,
          featured: eventIndex === 0,
          tags: template.tags,
          metadata: {
            organizer: owner.businessName,
            contact: {
              email: owner.email,
              phone: owner.phone,
              website: owner.website,
            },
            social: {
              instagram: owner.instagramUrl,
              facebook: owner.facebookUrl,
            },
            features: template.features,
            requirements: 'Open to design professionals and enthusiasts',
            pricing: template.pricing,
            heroImageUrl: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&t=${ownerIndex}${eventIndex}`,
          },
        },
      });
      
      events.push(event);
    }
  }
  
  console.log('✅ Created 25 events (5 per owner)');

  // STEP 10: Generate QR codes for all events
  console.log('📱 Generating QR codes for events...');
  for (const event of events) {
    const qrCodeUrl = await generateQRCode(event.id, event.slug);
    
    await prisma.event.update({
      where: { id: event.id },
      data: {
        metadata: {
          ...(event.metadata as any),
          qrCodeUrl,
        },
      },
    });
    console.log(`✅ Generated QR code for: ${event.title}`);
  }

  // STEP 11: Create waitlist entries for visitors
  console.log('📝 Creating waitlist entries...');
  let waitlistCount = 0;
  for (const event of events) {
    // Each event gets 10-20 random visitors
    const numVisitors = 10 + Math.floor(Math.random() * 11);
    const eventVisitors = visitors.sort(() => 0.5 - Math.random()).slice(0, numVisitors);
    
    for (const visitor of eventVisitors) {
      await prisma.waitlistEntry.create({
        data: {
          eventId: event.id,
          userId: visitor.id,
          email: visitor.email,
          status: 'PENDING',
        },
      });
      waitlistCount++;
    }
  }
  console.log(`✅ Created ${waitlistCount} waitlist entries`);

  // Final summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   👑 Admin users: 1`);
  console.log(`   👥 Owner users: ${owners.length}`);
  console.log(`   👤 Visitor users: ${visitors.length}`);
  console.log(`   🎉 Events: ${events.length} (5 per owner)`);
  console.log(`   📝 Waitlist entries: ${waitlistCount}`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   🏢 Venues: ${venues.length}`);
  console.log(`   📍 Areas: ${areas.length}`);
  console.log(`   🛍️ Products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
