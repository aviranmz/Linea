import * as Prisma from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = Prisma as any;

const prisma = new PrismaClient();

// Comprehensive seed data with all fields populated
async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // STEP 1: Clean all existing data (owners and their related events)
  console.log('🧹 Cleaning existing data...');
  
  // Delete all events first (due to foreign key constraints)
  await prisma.event.deleteMany({});
  console.log('✅ Deleted all existing events');
  
  // Delete all waitlist entries
  await prisma.waitlistEntry.deleteMany({});
  console.log('✅ Deleted all waitlist entries');
  
  // Delete all owners (users with role 'OWNER')
  await prisma.user.deleteMany({
    where: { role: 'OWNER' }
  });
  console.log('✅ Deleted all existing owners');
  
  // Delete all venues
  await prisma.venue.deleteMany({});
  console.log('✅ Deleted all existing venues');
  
  // Delete all areas
  await prisma.area.deleteMany({});
  console.log('✅ Deleted all existing areas');
  
  // Delete all products
  await prisma.product.deleteMany({});
  console.log('✅ Deleted all existing products');
  
  // Delete all categories
  await prisma.category.deleteMany({});
  console.log('✅ Deleted all existing categories');

  // STEP 2: Create comprehensive admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@linea.app' },
    update: {},
    create: {
      email: 'admin@linea.app',
      name: 'Marco Rossi',
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
      businessName: 'Linea Platform Administration',
      businessIntro: 'Leading the Linea platform administration team, ensuring smooth operations and user experience across all design and technology events in Milano.',
      phone: '+39 02 1234 5678',
      website: 'https://linea.app',
      facebookUrl: 'https://facebook.com/lineaapp',
      instagramUrl: 'https://instagram.com/lineaapp',
      address: 'Via Montenapoleone 1',
      city: 'Milano',
      country: 'Italy',
      latitude: 45.4692,
      longitude: 9.1903,
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // STEP 3: Create comprehensive categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Design & Architecture',
        slug: 'design-architecture',
        description: 'Contemporary design, architecture exhibitions, and innovative spatial solutions',
        color: '#8B4513',
        icon: '🏛️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology & Innovation',
        slug: 'technology-innovation',
        description: 'Cutting-edge technology, AI, blockchain, and digital transformation',
        color: '#2E8B57',
        icon: '💻',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion & Style',
        slug: 'fashion-style',
        description: 'Fashion shows, style workshops, and trend presentations',
        color: '#FF69B4',
        icon: '👗',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Art & Culture',
        slug: 'art-culture',
        description: 'Contemporary art, cultural events, and creative expressions',
        color: '#9370DB',
        icon: '🎨',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Food & Lifestyle',
        slug: 'food-lifestyle',
        description: 'Culinary experiences, lifestyle workshops, and wellness events',
        color: '#FF6347',
        icon: '🍽️',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created categories:', categories.map(c => c.name).join(', '));

  // STEP 4: Create comprehensive areas
  console.log('📍 Creating areas...');
  const areas = await Promise.all([
    prisma.area.create({
      data: {
        name: 'Brera',
        slug: 'brera',
        description: 'Historic artistic district with galleries, design studios, and cultural venues',
        color: '#8B4513',
        icon: '🎨',
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Tortona',
        slug: 'tortona',
        description: 'Design district with showrooms, studios, and creative spaces',
        color: '#2E8B57',
        icon: '🏗️',
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Porta Nuova',
        slug: 'porta-nuova',
        description: 'Modern business district with contemporary architecture and tech companies',
        color: '#4169E1',
        icon: '🏢',
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Navigli',
        slug: 'navigli',
        description: 'Historic canal district with restaurants, bars, and cultural venues',
        color: '#9370DB',
        icon: '🚤',
        isActive: true,
      },
    }),
    prisma.area.create({
      data: {
        name: 'Garibaldi',
        slug: 'garibaldi',
        description: 'Fashion and shopping district with luxury boutiques and showrooms',
        color: '#FF69B4',
        icon: '🛍️',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created areas:', areas.map(a => a.name).join(', '));

  // STEP 5: Create comprehensive products
  console.log('🏷️ Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Recessed Lighting',
        slug: 'recessed-lighting',
        description: 'Modern recessed lighting solutions for contemporary spaces',
        color: '#FFD700',
        icon: '💡',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        description: 'High-end kitchen appliances and cooking equipment',
        color: '#FF6347',
        icon: '🍳',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pendant Lights',
        slug: 'pendant-lights',
        description: 'Designer pendant lighting for residential and commercial spaces',
        color: '#32CD32',
        icon: '🔮',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Contemporary furniture and seating solutions',
        color: '#8B4513',
        icon: '🪑',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Textiles',
        slug: 'textiles',
        description: 'Luxury fabrics, upholstery, and textile solutions',
        color: '#9370DB',
        icon: '🧵',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created products:', products.map(p => p.name).join(', '));

  // STEP 6: Create comprehensive venues
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
        description: 'Premier design museum and exhibition space in the heart of Milano',
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
        description: 'Contemporary art foundation with cutting-edge exhibitions',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Palazzo Clerici',
        address: 'Via Clerici, 5, 20121 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4681,
        longitude: 9.1903,
        website: 'https://palazzoclerici.it',
        phone: '+39 02 7200 1234',
        email: 'events@palazzoclerici.it',
        capacity: 200,
        description: 'Historic palace with elegant event spaces',
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
        description: 'Iconic design gallery and showroom',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Museo del Novecento',
        address: 'Piazza del Duomo, 8, 20122 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4642,
        longitude: 9.1903,
        website: 'https://museodelnovecento.org',
        phone: '+39 02 8844 4061',
        email: 'info@museodelnovecento.org',
        capacity: 400,
        description: 'Modern art museum with contemporary exhibitions',
      },
    }),
  ]);
  console.log('✅ Created venues:', venues.map(v => v.name).join(', '));

  // STEP 7: Create comprehensive owner users with all fields
  console.log('👥 Creating comprehensive owner users...');
  const owners = await Promise.all([
    // Owner 1 - Design Studio
    prisma.user.create({
      data: {
        email: 'alessandro.rossi@studiorossi.it',
        name: 'Alessandro Rossi',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Studio Rossi Design',
        businessIntro: 'Leading design studio specializing in sustainable architecture and contemporary furniture. We create innovative spaces that blend functionality with aesthetic excellence, focusing on eco-friendly materials and cutting-edge design solutions. Our team of architects and designers works closely with clients to deliver bespoke solutions that reflect their vision while maintaining the highest standards of sustainability and craftsmanship.',
        phone: '+39 02 1234 5678',
        website: 'https://studiorossi.it',
        facebookUrl: 'https://facebook.com/studiorossi',
        instagramUrl: 'https://instagram.com/studiorossi',
        linkedinUrl: 'https://linkedin.com/company/studio-rossi-design',
        twitterUrl: 'https://twitter.com/studiorossi',
        address: 'Via Brera 15',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        latitude: 45.4719,
        longitude: 9.1881,
        areaId: areas.find(a => a.slug === 'brera')?.id,
        productId: products.find(p => p.slug === 'recessed-lighting')?.id,
      },
    }),
    
    // Owner 2 - Kitchen Specialist
    prisma.user.create({
      data: {
        email: 'maria.bianchi@cucinemodernemilano.it',
        name: 'Maria Bianchi',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Cucine Moderne Milano',
        businessIntro: 'Premier kitchen design studio offering bespoke culinary spaces that combine Italian craftsmanship with modern functionality. We specialize in luxury kitchen solutions, from concept to completion, using the finest materials and state-of-the-art appliances. Our team of expert designers creates personalized kitchens that reflect each client\'s lifestyle and culinary aspirations.',
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
        areaId: areas.find(a => a.slug === 'tortona')?.id,
        productId: products.find(p => p.slug === 'kitchen-appliances')?.id,
      },
    }),
    
    // Owner 3 - Lighting Design
    prisma.user.create({
      data: {
        email: 'giuseppe.verdi@lucedesign.it',
        name: 'Giuseppe Verdi',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Luce & Design',
        businessIntro: 'Innovative lighting design studio creating atmospheric and functional lighting solutions for residential and commercial spaces. We combine artistic vision with technical expertise to deliver lighting designs that enhance architecture and create memorable experiences. Our portfolio includes luxury hotels, restaurants, private residences, and corporate headquarters.',
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
        areaId: areas.find(a => a.slug === 'porta-nuova')?.id,
        productId: products.find(p => p.slug === 'pendant-lights')?.id,
      },
    }),
    
    // Owner 4 - Furniture Design
    prisma.user.create({
      data: {
        email: 'francesca.conti@atelierconti.it',
        name: 'Francesca Conti',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Atelier Conti',
        businessIntro: 'Bespoke furniture atelier creating unique pieces that blend traditional Italian craftsmanship with contemporary design. Each piece is handcrafted using sustainable materials and traditional techniques, resulting in furniture that tells a story. We work with interior designers, architects, and private clients to create custom solutions that reflect their vision and lifestyle.',
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
        areaId: areas.find(a => a.slug === 'navigli')?.id,
        productId: products.find(p => p.slug === 'furniture')?.id,
      },
    }),
    
    // Owner 5 - Textile Design
    prisma.user.create({
      data: {
        email: 'elena.ferrari@tessutiferrari.it',
        name: 'Elena Ferrari',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Tessuti Ferrari',
        businessIntro: 'Luxury textile house specializing in high-end fabrics for interior design and fashion. We create exclusive textile collections using traditional Italian weaving techniques combined with innovative materials and contemporary patterns. Our fabrics grace the most prestigious homes, hotels, and fashion houses worldwide, representing the pinnacle of Italian textile excellence.',
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
        areaId: areas.find(a => a.slug === 'garibaldi')?.id,
        productId: products.find(p => p.slug === 'textiles')?.id,
      },
    }),
  ]);
  console.log('✅ Created owners:', owners.map(o => o.name).join(', '));

  // STEP 8: Create comprehensive events with all fields
  console.log('🎉 Creating comprehensive events...');
  const events = await Promise.all([
    // Event 1 - Design Exhibition
    prisma.event.create({
      data: {
        title: 'Milano Design Week 2024: Sustainable Futures',
        slug: 'milano-design-week-2024-sustainable-futures',
        description: 'Join us for the most anticipated design event of the year! Milano Design Week 2024: Sustainable Futures brings together leading designers, architects, and innovators to explore the future of sustainable design. This comprehensive exhibition showcases cutting-edge materials, innovative technologies, and visionary projects that are shaping tomorrow\'s built environment. Featuring interactive installations, expert panels, and networking opportunities with industry leaders.',
        shortDescription: 'Premier design exhibition exploring sustainable design innovations',
        status: 'PUBLISHED',
        startDate: new Date('2024-12-15T09:00:00.000Z'),
        endDate: new Date('2024-12-15T18:00:00.000Z'),
        capacity: 500,
        currentWaitlist: 0,
        youtubeUrl: 'https://youtube.com/watch?v=milanodesign2024',
        mapLat: 45.4722,
        mapLng: 9.1708,
        mapZoom: 15,
        mapAddress: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
        streetAddress: 'Viale Emilio Alemagna, 6',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        ownerId: owners[0].id,
        venueId: venues[0].id,
        categoryId: categories[0].id,
        isPublic: true,
        featured: true,
        tags: ['design', 'sustainability', 'architecture', 'innovation', 'materials'],
        metadata: {
          organizer: 'Studio Rossi Design',
          contact: {
            email: 'info@studiorossi.it',
            phone: '+39 02 1234 5678',
            website: 'https://studiorossi.it'
          },
          social: {
            instagram: '@studiorossi',
            twitter: '@studiorossi',
            facebook: 'Studio Rossi Design',
            linkedin: 'Studio Rossi Design'
          },
          features: [
            'Interactive Design Installations',
            'Expert Panel Discussions',
            'Sustainable Materials Showcase',
            'Networking Reception',
            'Design Awards Ceremony',
            'Innovation Workshops'
          ],
          requirements: 'Professional design background or interest in sustainable design',
          pricing: 'Free for professionals, €50 for general public',
          heroImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
        },
      },
    }),

    // Event 2 - Kitchen Design Workshop
    prisma.event.create({
      data: {
        title: 'Luxury Kitchen Design Masterclass',
        slug: 'luxury-kitchen-design-masterclass',
        description: 'An exclusive masterclass for interior designers and architects focusing on luxury kitchen design principles. Learn from industry experts about space planning, material selection, and the latest trends in high-end kitchen design. This hands-on workshop includes case studies, design exercises, and access to premium kitchen showrooms.',
        shortDescription: 'Exclusive masterclass on luxury kitchen design principles',
        status: 'PUBLISHED',
        startDate: new Date('2024-12-20T10:00:00.000Z'),
        endDate: new Date('2024-12-20T16:00:00.000Z'),
        capacity: 50,
        currentWaitlist: 0,
        mapLat: 45.4444,
        mapLng: 9.1734,
        mapZoom: 15,
        mapAddress: 'Via Tortona, 37, 20144 Milano MI, Italy',
        streetAddress: 'Via Tortona, 37',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20144',
        ownerId: owners[1].id,
        venueId: venues[1].id,
        categoryId: categories[0].id,
        isPublic: true,
        featured: false,
        tags: ['kitchen', 'design', 'luxury', 'workshop', 'interior'],
        metadata: {
          organizer: 'Cucine Moderne Milano',
          contact: {
            email: 'info@cucinemodernemilano.it',
            phone: '+39 02 8765 4321',
            website: 'https://cucinemodernemilano.it'
          },
          social: {
            instagram: '@cucinemodernemilano',
            twitter: '@cucinemodernemilano',
            facebook: 'Cucine Moderne Milano'
          },
          features: [
            'Expert-led Design Sessions',
            'Premium Showroom Tours',
            'Material Selection Workshop',
            'Networking Lunch',
            'Design Portfolio Review',
            'Industry Trends Presentation'
          ],
          requirements: 'Professional interior designer or architect',
          pricing: '€150 for professionals',
          heroImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
        },
      },
    }),

    // Event 3 - Lighting Design Symposium
    prisma.event.create({
      data: {
        title: 'Lighting Design Symposium: Art & Technology',
        slug: 'lighting-design-symposium-art-technology',
        description: 'Explore the intersection of art and technology in contemporary lighting design. This symposium brings together lighting designers, artists, and technologists to discuss innovative approaches to illumination. Features live demonstrations, interactive installations, and presentations on the latest lighting technologies and their creative applications.',
        shortDescription: 'Symposium exploring art and technology in lighting design',
        status: 'PUBLISHED',
        startDate: new Date('2024-12-25T14:00:00.000Z'),
        endDate: new Date('2024-12-25T20:00:00.000Z'),
        capacity: 200,
        currentWaitlist: 0,
        mapLat: 45.4808,
        mapLng: 9.1881,
        mapZoom: 15,
        mapAddress: 'Via Porta Nuova, 8, 20121 Milano MI, Italy',
        streetAddress: 'Via Porta Nuova, 8',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        ownerId: owners[2].id,
        venueId: venues[2].id,
        categoryId: categories[1].id,
        isPublic: true,
        featured: true,
        tags: ['lighting', 'technology', 'art', 'innovation', 'design'],
        metadata: {
          organizer: 'Luce & Design',
          contact: {
            email: 'info@lucedesign.it',
            phone: '+39 02 9876 5432',
            website: 'https://lucedesign.it'
          },
          social: {
            instagram: '@lucedesign',
            twitter: '@lucedesign',
            facebook: 'Luce & Design'
          },
          features: [
            'Interactive Light Installations',
            'Technology Demonstrations',
            'Expert Panel Discussions',
            'Networking Reception',
            'Design Competition',
            'Product Launches'
          ],
          requirements: 'Open to all design professionals and enthusiasts',
          pricing: '€75 for professionals, €25 for students',
          heroImageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
        },
      },
    }),

    // Event 4 - Furniture Design Workshop
    prisma.event.create({
      data: {
        title: 'Bespoke Furniture Design Workshop',
        slug: 'bespoke-furniture-design-workshop',
        description: 'Hands-on workshop on creating bespoke furniture pieces. Learn traditional Italian craftsmanship techniques while exploring contemporary design approaches. Participants will work on their own furniture project under the guidance of master craftsmen. Includes materials, tools, and a take-home piece.',
        shortDescription: 'Hands-on workshop on bespoke furniture design and craftsmanship',
        status: 'PUBLISHED',
        startDate: new Date('2024-12-30T09:00:00.000Z'),
        endDate: new Date('2024-12-30T17:00:00.000Z'),
        capacity: 20,
        currentWaitlist: 0,
        mapLat: 45.4444,
        mapLng: 9.1734,
        mapZoom: 15,
        mapAddress: 'Via Navigli, 25, 20123 Milano MI, Italy',
        streetAddress: 'Via Navigli, 25',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20123',
        ownerId: owners[3].id,
        venueId: venues[3].id,
        categoryId: categories[0].id,
        isPublic: true,
        featured: false,
        tags: ['furniture', 'craftsmanship', 'workshop', 'design', 'traditional'],
        metadata: {
          organizer: 'Atelier Conti',
          contact: {
            email: 'info@atelierconti.it',
            phone: '+39 02 5555 1234',
            website: 'https://atelierconti.it'
          },
          social: {
            instagram: '@atelierconti',
            twitter: '@atelierconti',
            facebook: 'Atelier Conti'
          },
          features: [
            'Master Craftsman Instruction',
            'Hands-on Woodworking',
            'Design Consultation',
            'Materials Included',
            'Take-home Project',
            'Traditional Techniques'
          ],
          requirements: 'No experience necessary, all skill levels welcome',
          pricing: '€200 including materials and tools',
          heroImageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
        },
      },
    }),

    // Event 5 - Textile Innovation Conference
    prisma.event.create({
      data: {
        title: 'Textile Innovation Conference: Future Fabrics',
        slug: 'textile-innovation-conference-future-fabrics',
        description: 'Explore the future of textiles at this comprehensive conference featuring sustainable materials, smart fabrics, and innovative manufacturing processes. Industry leaders will present cutting-edge research and showcase revolutionary textile technologies that are transforming fashion, interior design, and industrial applications.',
        shortDescription: 'Conference on sustainable and smart textile innovations',
        status: 'PUBLISHED',
        startDate: new Date('2025-01-05T10:00:00.000Z'),
        endDate: new Date('2025-01-05T18:00:00.000Z'),
        capacity: 300,
        currentWaitlist: 0,
        mapLat: 45.4681,
        mapLng: 9.1903,
        mapZoom: 15,
        mapAddress: 'Via Garibaldi, 12, 20121 Milano MI, Italy',
        streetAddress: 'Via Garibaldi, 12',
        city: 'Milano',
        country: 'Italy',
        postalCode: '20121',
        ownerId: owners[4].id,
        venueId: venues[4].id,
        categoryId: categories[1].id,
        isPublic: true,
        featured: true,
        tags: ['textiles', 'innovation', 'sustainability', 'technology', 'fashion'],
        metadata: {
          organizer: 'Tessuti Ferrari',
          contact: {
            email: 'info@tessutiferrari.it',
            phone: '+39 02 3333 9876',
            website: 'https://tessutiferrari.it'
          },
          social: {
            instagram: '@tessutiferrari',
            twitter: '@tessutiferrari',
            facebook: 'Tessuti Ferrari'
          },
          features: [
            'Industry Expert Presentations',
            'Sustainable Materials Showcase',
            'Smart Fabric Demonstrations',
            'Networking Opportunities',
            'Innovation Awards',
            'Future Trends Panel'
          ],
          requirements: 'Textile professionals, designers, or industry enthusiasts',
          pricing: '€100 for professionals, €50 for students',
          heroImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
        },
      },
    }),
  ]);
  console.log('✅ Created events:', events.map(e => e.title).join(', '));

  console.log('🎉 Comprehensive seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   👤 Admin: 1 user`);
  console.log(`   👥 Owners: ${owners.length} users`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   📍 Areas: ${areas.length}`);
  console.log(`   🏷️ Products: ${products.length}`);
  console.log(`   🏢 Venues: ${venues.length}`);
  console.log(`   🎉 Events: ${events.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });