import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample business information for different owners
const ownerProfiles = [
  {
    email: 'owner@linea.app',
    name: 'Marco Rossi',
    businessName: 'Rossi Design Studio',
    businessIntro:
      "Award-winning interior design studio specializing in contemporary Italian design. We create beautiful, functional spaces that reflect our clients' personalities and lifestyles.",
    phone: '+39 02 1234 5678',
    website: 'https://www.rossidesignstudio.com',
    address: 'Via Brera 15',
    city: 'Milano',
    country: 'Italy',
    latitude: 45.4719,
    longitude: 9.1881,
    facebookUrl: 'https://facebook.com/rossidesignstudio',
    instagramUrl: 'https://instagram.com/rossidesignstudio',
    logoUrl:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
    profilePictureUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    email: 'owner1@linea.dev',
    name: 'Sofia Bianchi',
    businessName: 'Bianchi Architecture',
    businessIntro:
      'Sustainable architecture firm focused on innovative design solutions. We believe in creating spaces that harmonize with nature while meeting modern living needs.',
    phone: '+39 02 9876 5432',
    website: 'https://www.bianchiarchitecture.com',
    address: 'Corso di Porta Nuova 8',
    city: 'Milano',
    country: 'Italy',
    latitude: 45.4728,
    longitude: 9.1895,
    facebookUrl: 'https://facebook.com/bianchiarchitecture',
    instagramUrl: 'https://instagram.com/bianchiarchitecture',
    logoUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
    profilePictureUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  },
];

// Sample photo galleries for each owner
const photoGalleries = [
  {
    email: 'owner@linea.app',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        caption: 'Modern living room with minimalist design',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        caption: 'Contemporary kitchen with marble countertops',
        order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
        caption: 'Elegant bedroom with custom furniture',
        order: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        caption: 'Luxury bathroom with natural stone',
        order: 4,
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        caption: 'Outdoor terrace with designer furniture',
        order: 5,
      },
    ],
  },
  {
    email: 'owner1@linea.dev',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        caption: 'Sustainable office building design',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        caption: 'Green building with solar panels',
        order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
        caption: 'Modern residential complex',
        order: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        caption: 'Innovative facade design',
        order: 4,
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        caption: 'Sustainable materials showcase',
        order: 5,
      },
    ],
  },
];

async function populateOwnerProfiles() {
  console.log('🌱 Starting owner profile population...');

  try {
    // Get areas and products for assignment
    const areas = await prisma.area.findMany();
    const products = await prisma.product.findMany();

    if (areas.length === 0 || products.length === 0) {
      console.log(
        '❌ No areas or products found. Please run the seed script first.'
      );
      return;
    }

    for (const profileData of ownerProfiles) {
      console.log(`📝 Updating profile for ${profileData.email}...`);

      // Find the user
      const user = await prisma.user.findUnique({
        where: { email: profileData.email },
      });

      if (!user) {
        console.log(`❌ User ${profileData.email} not found`);
        continue;
      }

      // Assign random area and product
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];

      // Update user profile
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: profileData.name,
          businessName: profileData.businessName,
          businessIntro: profileData.businessIntro,
          phone: profileData.phone,
          website: profileData.website,
          address: profileData.address,
          city: profileData.city,
          country: profileData.country,
          latitude: profileData.latitude,
          longitude: profileData.longitude,
          facebookUrl: profileData.facebookUrl,
          instagramUrl: profileData.instagramUrl,
          logoUrl: profileData.logoUrl,
          profilePictureUrl: profileData.profilePictureUrl,
          areaId: randomArea.id,
          productId: randomProduct.id,
        },
      });

      console.log(`✅ Updated profile for ${profileData.email}`);

      // Add photo gallery
      const photoGallery = photoGalleries.find(
        pg => pg.email === profileData.email
      );
      if (photoGallery) {
        console.log(`📸 Adding photo gallery for ${profileData.email}...`);

        // Delete existing photos
        await prisma.photoGallery.deleteMany({
          where: { ownerId: user.id },
        });

        // Add new photos
        for (const photo of photoGallery.photos) {
          await prisma.photoGallery.create({
            data: {
              ownerId: user.id,
              title: photo.caption,
              description: photo.caption,
              imageUrl: photo.url,
              altText: photo.caption,
              order: photo.order,
              isActive: true,
            },
          });
        }

        console.log(
          `✅ Added ${photoGallery.photos.length} photos for ${profileData.email}`
        );
      }
    }

    console.log('🎉 Owner profile population completed successfully!');

    // Show summary
    const updatedUsers = await prisma.user.findMany({
      where: { role: 'OWNER' },
      include: {
        photoGallery: true,
        area: true,
        product: true,
      },
    });

    console.log('\n📊 Summary:');
    for (const user of updatedUsers) {
      console.log(`👤 ${user.email} (${user.name})`);
      console.log(`   Business: ${user.businessName}`);
      console.log(`   Location: ${user.city}, ${user.country}`);
      console.log(`   Area: ${user.area?.name || 'N/A'}`);
      console.log(`   Product: ${user.product?.name || 'N/A'}`);
      console.log(`   Photos: ${user.photoGallery.length}`);
      console.log(`   Coordinates: ${user.latitude}, ${user.longitude}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error populating owner profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateOwnerProfiles();
