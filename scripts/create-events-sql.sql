-- Create events for owner 2 and owner 3
-- This script creates 6 events (3 for each owner) for next week

-- Create owner 2
INSERT INTO users (id, email, name, role, "isActive", "lastLoginAt", "createdAt", "updatedAt")
VALUES (
  'owner2-id',
  'owner2@linea.app',
  'Sarah Johnson',
  'OWNER',
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  "isActive" = EXCLUDED."isActive",
  "lastLoginAt" = EXCLUDED."lastLoginAt",
  "updatedAt" = NOW();

-- Create owner 3
INSERT INTO users (id, email, name, role, "isActive", "lastLoginAt", "createdAt", "updatedAt")
VALUES (
  'owner3-id',
  'owner3@linea.app',
  'Michael Chen',
  'OWNER',
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  "isActive" = EXCLUDED."isActive",
  "lastLoginAt" = EXCLUDED."lastLoginAt",
  "updatedAt" = NOW();

-- Create venues
INSERT INTO venues (id, name, address, city, country, latitude, longitude, website, "createdAt", "updatedAt")
VALUES 
  ('venue-owner2-1', 'Grand Ballroom NYC', '123 Broadway, New York, NY 10001', 'New York', 'USA', 40.7589, -73.9851, 'https://grandballroomnyc.com', NOW(), NOW()),
  ('venue-owner2-2', 'Creative Studio Space', '456 Art District, New York, NY 10002', 'New York', 'USA', 40.7505, -73.9934, 'https://creativestudiospace.com', NOW(), NOW()),
  ('venue-owner3-1', 'Silicon Valley Convention Center', '789 Innovation Drive, San Francisco, CA 94105', 'San Francisco', 'USA', 37.7749, -122.4194, 'https://svconvention.com', NOW(), NOW()),
  ('venue-owner3-2', 'Tech Hub Auditorium', '321 Startup Blvd, San Francisco, CA 94107', 'San Francisco', 'USA', 37.7849, -122.4094, 'https://techhubauditorium.com', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  website = EXCLUDED.website,
  "updatedAt" = NOW();

-- Get next week's dates
-- Next Monday (8 days from now)
-- Next Tuesday (9 days from now)
-- Next Wednesday (10 days from now)
-- Next Thursday (11 days from now)
-- Next Friday (12 days from now)
-- Next Saturday (13 days from now)

-- Owner 2 Events (3 events for next week)
INSERT INTO events (id, title, slug, description, status, "startDate", "endDate", capacity, "mapLat", "mapLng", "mapZoom", "ownerId", "venueId", "createdAt", "updatedAt")
VALUES 
  -- Creative Design Workshop (Monday)
  (
    'event-owner2-1',
    'Creative Design Workshop',
    'creative-design-workshop',
    'Join us for an immersive design workshop where creativity meets innovation. Learn from industry experts and create stunning visual experiences.',
    'PUBLISHED',
    NOW() + INTERVAL '8 days' + INTERVAL '10 hours',
    NOW() + INTERVAL '8 days' + INTERVAL '13 hours',
    50,
    40.7589,
    -73.9851,
    15,
    'owner2-id',
    'venue-owner2-1',
    NOW(),
    NOW()
  ),
  -- Art Gallery Opening Night (Wednesday)
  (
    'event-owner2-2',
    'Art Gallery Opening Night',
    'art-gallery-opening-night',
    'Experience the latest contemporary art exhibition featuring emerging and established artists. Network with art enthusiasts and collectors.',
    'PUBLISHED',
    NOW() + INTERVAL '10 days' + INTERVAL '18 hours',
    NOW() + INTERVAL '10 days' + INTERVAL '22 hours',
    100,
    40.7505,
    -73.9934,
    15,
    'owner2-id',
    'venue-owner2-2',
    NOW(),
    NOW()
  ),
  -- Creative Networking Mixer (Friday)
  (
    'event-owner2-3',
    'Creative Networking Mixer',
    'creative-networking-mixer',
    'Connect with fellow creatives, entrepreneurs, and industry professionals in a relaxed and inspiring atmosphere.',
    'PUBLISHED',
    NOW() + INTERVAL '12 days' + INTERVAL '18 hours',
    NOW() + INTERVAL '12 days' + INTERVAL '21 hours',
    75,
    40.7589,
    -73.9851,
    15,
    'owner2-id',
    'venue-owner2-1',
    NOW(),
    NOW()
  );

-- Owner 3 Events (3 events for next week)
INSERT INTO events (id, title, slug, description, status, "startDate", "endDate", capacity, "mapLat", "mapLng", "mapZoom", "ownerId", "venueId", "createdAt", "updatedAt")
VALUES 
  -- AI Innovation Summit (Tuesday)
  (
    'event-owner3-1',
    'AI Innovation Summit',
    'ai-innovation-summit',
    'Explore the latest developments in artificial intelligence and machine learning. Hear from leading researchers and industry pioneers.',
    'PUBLISHED',
    NOW() + INTERVAL '9 days' + INTERVAL '9 hours',
    NOW() + INTERVAL '9 days' + INTERVAL '15 hours',
    200,
    37.7749,
    -122.4194,
    15,
    'owner3-id',
    'venue-owner3-1',
    NOW(),
    NOW()
  ),
  -- Startup Pitch Competition (Thursday)
  (
    'event-owner3-2',
    'Startup Pitch Competition',
    'startup-pitch-competition',
    'Watch innovative startups pitch their ideas to a panel of investors and industry experts. Great opportunity for networking and learning.',
    'PUBLISHED',
    NOW() + INTERVAL '11 days' + INTERVAL '14 hours',
    NOW() + INTERVAL '11 days' + INTERVAL '18 hours',
    150,
    37.7849,
    -122.4094,
    15,
    'owner3-id',
    'venue-owner3-2',
    NOW(),
    NOW()
  ),
  -- Tech Leadership Workshop (Saturday)
  (
    'event-owner3-3',
    'Tech Leadership Workshop',
    'tech-leadership-workshop',
    'Develop your leadership skills in the tech industry. Interactive sessions with experienced tech leaders and executives.',
    'PUBLISHED',
    NOW() + INTERVAL '13 days' + INTERVAL '10 hours',
    NOW() + INTERVAL '13 days' + INTERVAL '15 hours',
    80,
    37.7749,
    -122.4194,
    15,
    'owner3-id',
    'venue-owner3-1',
    NOW(),
    NOW()
  );

-- Display summary
SELECT 
  'Summary' as info,
  COUNT(*) as total_events,
  COUNT(CASE WHEN "ownerId" = 'owner2-id' THEN 1 END) as owner2_events,
  COUNT(CASE WHEN "ownerId" = 'owner3-id' THEN 1 END) as owner3_events
FROM events 
WHERE "ownerId" IN ('owner2-id', 'owner3-id');
