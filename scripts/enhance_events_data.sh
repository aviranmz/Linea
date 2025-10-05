#!/bin/bash

# Enhanced Events Data Script
# This script updates all events with comprehensive information including images, social links, and detailed content

set -e

API_URL="http://localhost:9050"
COOKIE_FILE=".cookies_admin"

echo "🚀 Enhancing events with comprehensive data..."

# Login as admin
echo "📝 Logging in as admin..."
curl -sS -X POST $API_URL/auth/dev/login \
  -H 'Content-Type: application/json' \
  -c $COOKIE_FILE \
  -d '{"email":"admin@linea.dev","role":"ADMIN","name":"Admin"}' >/dev/null

# Function to update event with comprehensive data
update_event() {
  local event_id="$1"
  local title="$2"
  local description="$3"
  local short_description="$4"
  local start_date="$5"
  local end_date="$6"
  local location="$7"
  local capacity="$8"
  local price="$9"
  local tags="${10}"
  local social_links="${11}"
  local images="${12}"
  local features="${13}"
  local contact_info="${14}"

  echo "📝 Updating event: $title"
  
  curl -sS -X PUT "$API_URL/api/owner/events/$event_id" \
    -H 'Content-Type: application/json' \
    -b $COOKIE_FILE \
    -d "{
      \"title\": \"$title\",
      \"description\": \"$description\",
      \"shortDescription\": \"$short_description\",
      \"startDate\": \"$start_date\",
      \"endDate\": \"$end_date\",
      \"location\": \"$location\",
      \"capacity\": $capacity,
      \"price\": $price,
      \"tags\": [$tags],
      \"social\": $social_links,
      \"images\": $images,
      \"features\": [$features],
      \"contact\": $contact_info,
      \"isPublic\": true,
      \"featured\": false
    }" >/dev/null
}

# Enhanced event data with comprehensive information
echo "🎨 Updating Milano Design Showcase events..."

# Milano Design Showcase events
update_event \
  "cmgb1hxci000bprnp7tiqmcrb" \
  "Milano Design Showcase" \
  "Experience the pinnacle of Italian design excellence at our exclusive Milano Design Showcase. This immersive event brings together the finest examples of contemporary Italian design, featuring cutting-edge furniture, lighting, and home accessories from renowned Milanese designers. Discover the perfect fusion of tradition and innovation that defines Milan's design heritage. Our curated collection showcases everything from minimalist modern pieces to bold, statement-making designs that capture the essence of Italian style. Whether you're a design professional, enthusiast, or simply appreciate beautiful craftsmanship, this showcase offers an unparalleled opportunity to explore the latest trends and timeless classics from the world's design capital. Join us for an evening of inspiration, networking, and discovery in the heart of design excellence." \
  "Exclusive showcase of contemporary Italian design" \
  "2025-11-05T10:00:00Z" \
  "2025-11-05T18:00:00Z" \
  "Milano Design District, Via Tortona 37, 20144 Milano, Italy" \
  150 \
  0 \
  "\"design\", \"milano\", \"italian\", \"furniture\", \"showcase\"" \
  "{\"instagram\": \"https://instagram.com/milano_design_showcase\", \"facebook\": \"https://facebook.com/milano.design.showcase\", \"linkedin\": \"https://linkedin.com/company/milano-design-showcase\", \"website\": \"https://milanodesignshowcase.com\"}" \
  "[\"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\", \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800\"]" \
  "\"Design Exhibition\", \"Networking\", \"Product Launches\", \"Designer Talks\", \"Cocktail Reception\"" \
  "{\"email\": \"info@milanodesignshowcase.com\", \"phone\": \"+39 02 1234 5678\", \"website\": \"https://milanodesignshowcase.com\"}"

update_event \
  "cmgb1hxcp000hprnpygvppbgj" \
  "Milano Design Showcase" \
  "Experience the pinnacle of Italian design excellence at our exclusive Milano Design Showcase. This immersive event brings together the finest examples of contemporary Italian design, featuring cutting-edge furniture, lighting, and home accessories from renowned Milanese designers. Discover the perfect fusion of tradition and innovation that defines Milan's design heritage. Our curated collection showcases everything from minimalist modern pieces to bold, statement-making designs that capture the essence of Italian style. Whether you're a design professional, enthusiast, or simply appreciate beautiful craftsmanship, this showcase offers an unparalleled opportunity to explore the latest trends and timeless classics from the world's design capital. Join us for an evening of inspiration, networking, and discovery in the heart of design excellence." \
  "Exclusive showcase of contemporary Italian design" \
  "2025-11-05T10:00:00Z" \
  "2025-11-05T18:00:00Z" \
  "Milano Design District, Via Tortona 37, 20144 Milano, Italy" \
  150 \
  0 \
  "\"design\", \"milano\", \"italian\", \"furniture\", \"showcase\"" \
  "{\"instagram\": \"https://instagram.com/milano_design_showcase\", \"facebook\": \"https://facebook.com/milano.design.showcase\", \"linkedin\": \"https://linkedin.com/company/milano-design-showcase\", \"website\": \"https://milanodesignshowcase.com\"}" \
  "[\"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\", \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800\"]" \
  "\"Design Exhibition\", \"Networking\", \"Product Launches\", \"Designer Talks\", \"Cocktail Reception\"" \
  "{\"email\": \"info@milanodesignshowcase.com\", \"phone\": \"+39 02 1234 5678\", \"website\": \"https://milanodesignshowcase.com\"}"

update_event \
  "cmgb1hxca0005prnpia9c6ici" \
  "Milano Design Showcase" \
  "Experience the pinnacle of Italian design excellence at our exclusive Milano Design Showcase. This immersive event brings together the finest examples of contemporary Italian design, featuring cutting-edge furniture, lighting, and home accessories from renowned Milanese designers. Discover the perfect fusion of tradition and innovation that defines Milan's design heritage. Our curated collection showcases everything from minimalist modern pieces to bold, statement-making designs that capture the essence of Italian style. Whether you're a design professional, enthusiast, or simply appreciate beautiful craftsmanship, this showcase offers an unparalleled opportunity to explore the latest trends and timeless classics from the world's design capital. Join us for an evening of inspiration, networking, and discovery in the heart of design excellence." \
  "Exclusive showcase of contemporary Italian design" \
  "2025-11-05T10:00:00Z" \
  "2025-11-05T18:00:00Z" \
  "Milano Design District, Via Tortona 37, 20144 Milano, Italy" \
  150 \
  0 \
  "\"design\", \"milano\", \"italian\", \"furniture\", \"showcase\"" \
  "{\"instagram\": \"https://instagram.com/milano_design_showcase\", \"facebook\": \"https://facebook.com/milano.design.showcase\", \"linkedin\": \"https://linkedin.com/company/milano-design-showcase\", \"website\": \"https://milanodesignshowcase.com\"}" \
  "[\"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\", \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800\"]" \
  "\"Design Exhibition\", \"Networking\", \"Product Launches\", \"Designer Talks\", \"Cocktail Reception\"" \
  "{\"email\": \"info@milanodesignshowcase.com\", \"phone\": \"+39 02 1234 5678\", \"website\": \"https://milanodesignshowcase.com\"}"

echo "💡 Updating Innovation Talk events..."

# Innovation Talk events
update_event \
  "cmgb1hxcy000pprnpa5c8iqh2" \
  "Innovation Talk" \
  "Join us for an inspiring evening of innovation and forward-thinking design at our exclusive Innovation Talk series. This thought-provoking event brings together industry leaders, visionary designers, and innovative entrepreneurs to share their insights on the future of design, technology, and creative thinking. Our distinguished speakers will explore cutting-edge topics including sustainable design practices, the intersection of technology and creativity, and emerging trends that are shaping the future of our industries. This intimate gathering provides a unique opportunity to engage with like-minded professionals, expand your network, and gain fresh perspectives on innovation in design and business. Whether you're an established professional or an emerging creative, this event offers valuable insights and inspiration to fuel your own innovative journey. Don't miss this chance to be part of the conversation that's defining the future of design and innovation." \
  "Inspiring talks on innovation and design" \
  "2025-11-08T11:00:00Z" \
  "2025-11-08T13:00:00Z" \
  "Innovation Hub, Via Brera 28, 20121 Milano, Italy" \
  80 \
  0 \
  "\"innovation\", \"design\", \"technology\", \"networking\", \"talks\"" \
  "{\"instagram\": \"https://instagram.com/innovation_talks_milano\", \"twitter\": \"https://twitter.com/innovation_talks\", \"linkedin\": \"https://linkedin.com/company/innovation-talks-milano\", \"youtube\": \"https://youtube.com/c/innovationtalks\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Keynote Speakers\", \"Panel Discussions\", \"Networking\", \"Q&A Sessions\", \"Light Refreshments\"" \
  "{\"email\": \"hello@innovationtalks.com\", \"phone\": \"+39 02 8765 4321\", \"website\": \"https://innovationtalks.com\"}"

update_event \
  "cmgb1hxcr000jprnp22d0pqfd" \
  "Innovation Talk" \
  "Join us for an inspiring evening of innovation and forward-thinking design at our exclusive Innovation Talk series. This thought-provoking event brings together industry leaders, visionary designers, and innovative entrepreneurs to share their insights on the future of design, technology, and creative thinking. Our distinguished speakers will explore cutting-edge topics including sustainable design practices, the intersection of technology and creativity, and emerging trends that are shaping the future of our industries. This intimate gathering provides a unique opportunity to engage with like-minded professionals, expand your network, and gain fresh perspectives on innovation in design and business. Whether you're an established professional or an emerging creative, this event offers valuable insights and inspiration to fuel your own innovative journey. Don't miss this chance to be part of the conversation that's defining the future of design and innovation." \
  "Inspiring talks on innovation and design" \
  "2025-11-08T11:00:00Z" \
  "2025-11-08T13:00:00Z" \
  "Innovation Hub, Via Brera 28, 20121 Milano, Italy" \
  80 \
  0 \
  "\"innovation\", \"design\", \"technology\", \"networking\", \"talks\"" \
  "{\"instagram\": \"https://instagram.com/innovation_talks_milano\", \"twitter\": \"https://twitter.com/innovation_talks\", \"linkedin\": \"https://linkedin.com/company/innovation-talks-milano\", \"youtube\": \"https://youtube.com/c/innovationtalks\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Keynote Speakers\", \"Panel Discussions\", \"Networking\", \"Q&A Sessions\", \"Light Refreshments\"" \
  "{\"email\": \"hello@innovationtalks.com\", \"phone\": \"+39 02 8765 4321\", \"website\": \"https://innovationtalks.com\"}"

update_event \
  "cmgb1hxck000dprnpg3zjwruh" \
  "Innovation Talk" \
  "Join us for an inspiring evening of innovation and forward-thinking design at our exclusive Innovation Talk series. This thought-provoking event brings together industry leaders, visionary designers, and innovative entrepreneurs to share their insights on the future of design, technology, and creative thinking. Our distinguished speakers will explore cutting-edge topics including sustainable design practices, the intersection of technology and creativity, and emerging trends that are shaping the future of our industries. This intimate gathering provides a unique opportunity to engage with like-minded professionals, expand your network, and gain fresh perspectives on innovation in design and business. Whether you're an established professional or an emerging creative, this event offers valuable insights and inspiration to fuel your own innovative journey. Don't miss this chance to be part of the conversation that's defining the future of design and innovation." \
  "Inspiring talks on innovation and design" \
  "2025-11-08T11:00:00Z" \
  "2025-11-08T13:00:00Z" \
  "Innovation Hub, Via Brera 28, 20121 Milano, Italy" \
  80 \
  0 \
  "\"innovation\", \"design\", \"technology\", \"networking\", \"talks\"" \
  "{\"instagram\": \"https://instagram.com/innovation_talks_milano\", \"twitter\": \"https://twitter.com/innovation_talks\", \"linkedin\": \"https://linkedin.com/company/innovation-talks-milano\", \"youtube\": \"https://youtube.com/c/innovationtalks\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Keynote Speakers\", \"Panel Discussions\", \"Networking\", \"Q&A Sessions\", \"Light Refreshments\"" \
  "{\"email\": \"hello@innovationtalks.com\", \"phone\": \"+39 02 8765 4321\", \"website\": \"https://innovationtalks.com\"}"

update_event \
  "cmgb1hxce0007prnp3hqgakp5" \
  "Innovation Talk" \
  "Join us for an inspiring evening of innovation and forward-thinking design at our exclusive Innovation Talk series. This thought-provoking event brings together industry leaders, visionary designers, and innovative entrepreneurs to share their insights on the future of design, technology, and creative thinking. Our distinguished speakers will explore cutting-edge topics including sustainable design practices, the intersection of technology and creativity, and emerging trends that are shaping the future of our industries. This intimate gathering provides a unique opportunity to engage with like-minded professionals, expand your network, and gain fresh perspectives on innovation in design and business. Whether you're an established professional or an emerging creative, this event offers valuable insights and inspiration to fuel your own innovative journey. Don't miss this chance to be part of the conversation that's defining the future of design and innovation." \
  "Inspiring talks on innovation and design" \
  "2025-11-08T11:00:00Z" \
  "2025-11-08T13:00:00Z" \
  "Innovation Hub, Via Brera 28, 20121 Milano, Italy" \
  80 \
  0 \
  "\"innovation\", \"design\", \"technology\", \"networking\", \"talks\"" \
  "{\"instagram\": \"https://instagram.com/innovation_talks_milano\", \"twitter\": \"https://twitter.com/innovation_talks\", \"linkedin\": \"https://linkedin.com/company/innovation-talks-milano\", \"youtube\": \"https://youtube.com/c/innovationtalks\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Keynote Speakers\", \"Panel Discussions\", \"Networking\", \"Q&A Sessions\", \"Light Refreshments\"" \
  "{\"email\": \"hello@innovationtalks.com\", \"phone\": \"+39 02 8765 4321\", \"website\": \"https://innovationtalks.com\"}"

echo "🏢 Updating Studio Open Day events..."

# Studio Open Day events
update_event \
  "cmgb1hxd1000rprnpbvxgi7m7" \
  "Studio Open Day" \
  "Step inside our creative sanctuary and discover the magic behind exceptional design at our exclusive Studio Open Day. This intimate behind-the-scenes experience offers a rare glimpse into our design process, from initial concept to final execution. Visitors will have the unique opportunity to explore our working spaces, meet our talented team of designers and artisans, and witness live demonstrations of our craft techniques. From sketching and prototyping to material selection and finishing touches, you'll see firsthand how we bring our creative visions to life. Our open studio format encourages interaction and dialogue, allowing you to ask questions, share ideas, and gain insights into the creative process. Whether you're a design enthusiast, aspiring creative, or simply curious about the world of design, this immersive experience promises to inspire and educate. Join us for a day of creativity, learning, and connection in the heart of our design studio." \
  "Behind-the-scenes studio experience" \
  "2025-11-11T10:30:00Z" \
  "2025-11-11T16:30:00Z" \
  "Creative Studio Milano, Via Garibaldi 15, 20121 Milano, Italy" \
  25 \
  0 \
  "\"studio\", \"open day\", \"creative\", \"behind-the-scenes\", \"workshop\"" \
  "{\"instagram\": \"https://instagram.com/studio_open_day\", \"facebook\": \"https://facebook.com/studioopenday\", \"linkedin\": \"https://linkedin.com/company/studio-open-day\", \"website\": \"https://studioopenday.com\"}" \
  "[\"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Studio Tours\", \"Live Demonstrations\", \"Meet the Team\", \"Interactive Workshops\", \"Refreshments\"" \
  "{\"email\": \"studio@openday.com\", \"phone\": \"+39 02 9876 5432\", \"website\": \"https://studioopenday.com\"}"

update_event \
  "cmgb1hxct000lprnpqo43j7u4" \
  "Studio Open Day" \
  "Step inside our creative sanctuary and discover the magic behind exceptional design at our exclusive Studio Open Day. This intimate behind-the-scenes experience offers a rare glimpse into our design process, from initial concept to final execution. Visitors will have the unique opportunity to explore our working spaces, meet our talented team of designers and artisans, and witness live demonstrations of our craft techniques. From sketching and prototyping to material selection and finishing touches, you'll see firsthand how we bring our creative visions to life. Our open studio format encourages interaction and dialogue, allowing you to ask questions, share ideas, and gain insights into the creative process. Whether you're a design enthusiast, aspiring creative, or simply curious about the world of design, this immersive experience promises to inspire and educate. Join us for a day of creativity, learning, and connection in the heart of our design studio." \
  "Behind-the-scenes studio experience" \
  "2025-11-11T10:30:00Z" \
  "2025-11-11T16:30:00Z" \
  "Creative Studio Milano, Via Garibaldi 15, 20121 Milano, Italy" \
  25 \
  0 \
  "\"studio\", \"open day\", \"creative\", \"behind-the-scenes\", \"workshop\"" \
  "{\"instagram\": \"https://instagram.com/studio_open_day\", \"facebook\": \"https://facebook.com/studioopenday\", \"linkedin\": \"https://linkedin.com/company/studio-open-day\", \"website\": \"https://studioopenday.com\"}" \
  "[\"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Studio Tours\", \"Live Demonstrations\", \"Meet the Team\", \"Interactive Workshops\", \"Refreshments\"" \
  "{\"email\": \"studio@openday.com\", \"phone\": \"+39 02 9876 5432\", \"website\": \"https://studioopenday.com\"}"

update_event \
  "cmgb1hxcm000fprnpjqy0hyct" \
  "Studio Open Day" \
  "Step inside our creative sanctuary and discover the magic behind exceptional design at our exclusive Studio Open Day. This intimate behind-the-scenes experience offers a rare glimpse into our design process, from initial concept to final execution. Visitors will have the unique opportunity to explore our working spaces, meet our talented team of designers and artisans, and witness live demonstrations of our craft techniques. From sketching and prototyping to material selection and finishing touches, you'll see firsthand how we bring our creative visions to life. Our open studio format encourages interaction and dialogue, allowing you to ask questions, share ideas, and gain insights into the creative process. Whether you're a design enthusiast, aspiring creative, or simply curious about the world of design, this immersive experience promises to inspire and educate. Join us for a day of creativity, learning, and connection in the heart of our design studio." \
  "Behind-the-scenes studio experience" \
  "2025-11-11T10:30:00Z" \
  "2025-11-11T16:30:00Z" \
  "Creative Studio Milano, Via Garibaldi 15, 20121 Milano, Italy" \
  25 \
  0 \
  "\"studio\", \"open day\", \"creative\", \"behind-the-scenes\", \"workshop\"" \
  "{\"instagram\": \"https://instagram.com/studio_open_day\", \"facebook\": \"https://facebook.com/studioopenday\", \"linkedin\": \"https://linkedin.com/company/studio-open-day\", \"website\": \"https://studioopenday.com\"}" \
  "[\"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Studio Tours\", \"Live Demonstrations\", \"Meet the Team\", \"Interactive Workshops\", \"Refreshments\"" \
  "{\"email\": \"studio@openday.com\", \"phone\": \"+39 02 9876 5432\", \"website\": \"https://studioopenday.com\"}"

update_event \
  "cmgb1hxcg0009prnpv35l7fdf" \
  "Studio Open Day" \
  "Step inside our creative sanctuary and discover the magic behind exceptional design at our exclusive Studio Open Day. This intimate behind-the-scenes experience offers a rare glimpse into our design process, from initial concept to final execution. Visitors will have the unique opportunity to explore our working spaces, meet our talented team of designers and artisans, and witness live demonstrations of our craft techniques. From sketching and prototyping to material selection and finishing touches, you'll see firsthand how we bring our creative visions to life. Our open studio format encourages interaction and dialogue, allowing you to ask questions, share ideas, and gain insights into the creative process. Whether you're a design enthusiast, aspiring creative, or simply curious about the world of design, this immersive experience promises to inspire and educate. Join us for a day of creativity, learning, and connection in the heart of our design studio." \
  "Behind-the-scenes studio experience" \
  "2025-11-11T10:30:00Z" \
  "2025-11-11T16:30:00Z" \
  "Creative Studio Milano, Via Garibaldi 15, 20121 Milano, Italy" \
  25 \
  0 \
  "\"studio\", \"open day\", \"creative\", \"behind-the-scenes\", \"workshop\"" \
  "{\"instagram\": \"https://instagram.com/studio_open_day\", \"facebook\": \"https://facebook.com/studioopenday\", \"linkedin\": \"https://linkedin.com/company/studio-open-day\", \"website\": \"https://studioopenday.com\"}" \
  "[\"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Studio Tours\", \"Live Demonstrations\", \"Meet the Team\", \"Interactive Workshops\", \"Refreshments\"" \
  "{\"email\": \"studio@openday.com\", \"phone\": \"+39 02 9876 5432\", \"website\": \"https://studioopenday.com\"}"

echo "✅ Events enhanced with comprehensive data!"
echo "📊 Updated events with:"
echo "   - Detailed descriptions and short descriptions"
echo "   - Start and end dates"
echo "   - Location information"
echo "   - Capacity and pricing"
echo "   - Social media links (Instagram, Facebook, LinkedIn, Twitter, YouTube)"
echo "   - High-quality images from Unsplash"
echo "   - Event features and activities"
echo "   - Contact information"
echo "   - Relevant tags and categories"

echo "🎉 All events now have rich, comprehensive information!"
