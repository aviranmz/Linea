# Events to Create for Owner 2 and Owner 3

## Overview

This document contains the event data for creating 6 events (3 for each owner) scheduled for next week.

## Owner 2: Sarah Johnson (Creative Events Co.)

**Business Details:**

- Email: owner2@linea.app
- Name: Sarah Johnson
- Business: Creative Events Co.
- Description: We create unforgettable experiences
- Website: https://creativeevents.co
- Location: New York, USA

### Events for Owner 2

#### 1. Creative Design Workshop

- **Title:** Creative Design Workshop
- **Description:** Join us for an immersive design workshop where creativity meets innovation. Learn from industry experts and create stunning visual experiences.
- **Short Description:** Immersive design workshop with industry experts
- **Start Date:** Next Monday (8 days from now)
- **End Date:** 3 hours after start
- **Capacity:** 50
- **Venue:** Grand Ballroom NYC
  - Address: 123 Broadway, New York, NY 10001
  - City: New York, USA
  - Coordinates: 40.7589, -73.9851
  - Website: https://grandballroomnyc.com
- **Status:** Published, Featured
- **Tags:** design, workshop, creativity
- **Map:** 40.7589, -73.9851, Zoom 15

#### 2. Art Gallery Opening Night

- **Title:** Art Gallery Opening Night
- **Description:** Experience the latest contemporary art exhibition featuring emerging and established artists. Network with art enthusiasts and collectors.
- **Short Description:** Contemporary art exhibition opening night
- **Start Date:** Next Wednesday (10 days from now)
- **End Date:** 4 hours after start
- **Capacity:** 100
- **Venue:** Creative Studio Space
  - Address: 456 Art District, New York, NY 10002
  - City: New York, USA
  - Coordinates: 40.7505, -73.9934
  - Website: https://creativestudiospace.com
- **Status:** Published, Regular
- **Tags:** art, gallery, networking
- **Map:** 40.7505, -73.9934, Zoom 15

#### 3. Creative Networking Mixer

- **Title:** Creative Networking Mixer
- **Description:** Connect with fellow creatives, entrepreneurs, and industry professionals in a relaxed and inspiring atmosphere.
- **Short Description:** Networking event for creative professionals
- **Start Date:** Next Friday (12 days from now)
- **End Date:** 3 hours after start
- **Capacity:** 75
- **Venue:** Grand Ballroom NYC
  - Address: 123 Broadway, New York, NY 10001
  - City: New York, USA
  - Coordinates: 40.7589, -73.9851
  - Website: https://grandballroomnyc.com
- **Status:** Published, Regular
- **Tags:** networking, creative, professional
- **Map:** 40.7589, -73.9851, Zoom 15

## Owner 3: Michael Chen (Tech Innovation Hub)

**Business Details:**

- Email: owner3@linea.app
- Name: Michael Chen
- Business: Tech Innovation Hub
- Description: Leading technology and innovation events
- Website: https://techinnovationhub.com
- Location: San Francisco, USA

### Events for Owner 3

#### 1. AI Innovation Summit

- **Title:** AI Innovation Summit
- **Description:** Explore the latest developments in artificial intelligence and machine learning. Hear from leading researchers and industry pioneers.
- **Short Description:** Latest AI and ML developments summit
- **Start Date:** Next Tuesday (9 days from now)
- **End Date:** 6 hours after start
- **Capacity:** 200
- **Venue:** Silicon Valley Convention Center
  - Address: 789 Innovation Drive, San Francisco, CA 94105
  - City: San Francisco, USA
  - Coordinates: 37.7749, -122.4194
  - Website: https://svconvention.com
- **Status:** Published, Featured
- **Tags:** AI, technology, innovation, summit
- **Map:** 37.7749, -122.4194, Zoom 15

#### 2. Startup Pitch Competition

- **Title:** Startup Pitch Competition
- **Description:** Watch innovative startups pitch their ideas to a panel of investors and industry experts. Great opportunity for networking and learning.
- **Short Description:** Startup pitch competition with investors
- **Start Date:** Next Thursday (11 days from now)
- **End Date:** 4 hours after start
- **Capacity:** 150
- **Venue:** Tech Hub Auditorium
  - Address: 321 Startup Blvd, San Francisco, CA 94107
  - City: San Francisco, USA
  - Coordinates: 37.7849, -122.4094
  - Website: https://techhubauditorium.com
- **Status:** Published, Regular
- **Tags:** startup, pitch, investment, competition
- **Map:** 37.7849, -122.4094, Zoom 15

#### 3. Tech Leadership Workshop

- **Title:** Tech Leadership Workshop
- **Description:** Develop your leadership skills in the tech industry. Interactive sessions with experienced tech leaders and executives.
- **Short Description:** Leadership development for tech professionals
- **Start Date:** Next Saturday (13 days from now)
- **End Date:** 5 hours after start
- **Capacity:** 80
- **Venue:** Silicon Valley Convention Center
  - Address: 789 Innovation Drive, San Francisco, CA 94105
  - City: San Francisco, USA
  - Coordinates: 37.7749, -122.4194
  - Website: https://svconvention.com
- **Status:** Published, Regular
- **Tags:** leadership, tech, workshop, development
- **Map:** 37.7749, -122.4194, Zoom 15

## Summary

- **Total Owners:** 2
- **Total Events:** 6
- **Featured Events:** 2 (Creative Design Workshop, AI Innovation Summit)
- **Regular Events:** 4
- **All events are scheduled for next week**
- **All events are public and published**
- **Geographic Distribution:** New York (3 events), San Francisco (3 events)

## Implementation Options

1. **Manual Creation:** Use the admin interface to create users and events
2. **API Integration:** Use the API endpoints to programmatically create the data
3. **Database Seeding:** Run a database seed script with this data
4. **Import Script:** Create an import script that uses the API endpoints

## API Endpoints to Use

- `POST /api/auth/register` - Create owner users
- `POST /api/venues` - Create venues
- `POST /api/owner/events` - Create events
- `GET /api/events` - List all events
- `GET /api/owner/events` - List owner's events

## Next Steps

1. Start the API server: `pnpm --filter @linea/api dev`
2. Create the owner users first
3. Create the venues
4. Create the events with proper owner and venue associations
5. Verify all events are created and visible in the system
