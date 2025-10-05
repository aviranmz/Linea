#!/bin/bash

# Enhanced Existing Events Data Script
# This script updates the existing events with comprehensive information

set -e

API_URL="http://localhost:9050"
COOKIE_FILE=".cookies_admin"

echo "🚀 Enhancing existing events with comprehensive data..."

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

echo "🎨 Updating Tech Innovation Summit 2024..."

# Tech Innovation Summit 2024
update_event \
  "cmfur5u48000buw1bmy4nj7c1" \
  "Tech Innovation Summit 2024" \
  "Join us for the most anticipated technology and innovation event of the year! The Tech Innovation Summit 2024 brings together industry leaders, visionary entrepreneurs, and cutting-edge innovators to explore the latest trends and breakthroughs shaping our digital future. This comprehensive summit features keynote presentations from top tech executives, interactive workshops on emerging technologies, and networking opportunities with like-minded professionals. Discover the latest developments in artificial intelligence, blockchain, quantum computing, and sustainable technology solutions. Our carefully curated program includes hands-on demonstrations, panel discussions with industry experts, and exclusive product launches from leading tech companies. Whether you're a startup founder, corporate executive, investor, or technology enthusiast, this summit offers unparalleled insights into the future of technology and its impact on business and society. Don't miss this opportunity to be at the forefront of technological innovation and connect with the minds that are shaping tomorrow's world." \
  "Premier technology and innovation conference" \
  "2024-12-15T09:00:00Z" \
  "2024-12-15T18:00:00Z" \
  "Milano Convention Centre, Piazza Città di Lombardia 1, 20124 Milano, Italy" \
  500 \
  150 \
  "\"technology\", \"innovation\", \"summit\", \"AI\", \"blockchain\", \"startup\"" \
  "{\"instagram\": \"https://instagram.com/techinnovationsummit\", \"twitter\": \"https://twitter.com/techinnovsummit\", \"linkedin\": \"https://linkedin.com/company/tech-innovation-summit\", \"youtube\": \"https://youtube.com/c/techinnovationsummit\", \"website\": \"https://techinnovationsummit.com\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Keynote Presentations\", \"Interactive Workshops\", \"Networking Sessions\", \"Product Demos\", \"Panel Discussions\", \"Startup Pitch Competition\"" \
  "{\"email\": \"info@techinnovationsummit.com\", \"phone\": \"+39 02 1234 5678\", \"website\": \"https://techinnovationsummit.com\"}"

echo "🎨 Updating Milano Design Week 2024..."

# Milano Design Week 2024
update_event \
  "cmfur5u48000euw1b1042hp5p" \
  "Milano Design Week 2024" \
  "Experience the pinnacle of global design excellence at Milano Design Week 2024, the world's most prestigious design event. This week-long celebration of creativity, innovation, and craftsmanship brings together the finest designers, architects, and creative minds from around the globe. Explore cutting-edge furniture, lighting, and home accessories from renowned international brands, discover emerging talent at satellite exhibitions, and immerse yourself in the vibrant design culture that defines Milan. From the iconic Salone del Mobile to the innovative Fuorisalone events, this comprehensive program offers something for every design enthusiast. Attend exclusive previews, meet the designers behind your favorite pieces, and gain insights into the latest trends shaping the future of design. Whether you're a design professional, collector, or simply appreciate beautiful craftsmanship, Milano Design Week 2024 promises an unforgettable experience filled with inspiration, discovery, and connection. Join us for this extraordinary celebration of design excellence in the heart of Italy's design capital." \
  "World's premier design event" \
  "2024-04-16T10:00:00Z" \
  "2024-04-21T18:00:00Z" \
  "Various locations across Milano, Italy" \
  10000 \
  0 \
  "\"design\", \"milano\", \"furniture\", \"architecture\", \"creativity\", \"exhibition\"" \
  "{\"instagram\": \"https://instagram.com/milanodesignweek\", \"facebook\": \"https://facebook.com/milanodesignweek\", \"linkedin\": \"https://linkedin.com/company/milano-design-week\", \"twitter\": \"https://twitter.com/milanodesignweek\", \"website\": \"https://milanodesignweek.com\"}" \
  "[\"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\", \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800\"]" \
  "\"Design Exhibitions\", \"Furniture Showcases\", \"Architecture Tours\", \"Designer Meet & Greets\", \"Workshop Sessions\", \"Networking Events\"" \
  "{\"email\": \"info@milanodesignweek.com\", \"phone\": \"+39 02 9876 5432\", \"website\": \"https://milanodesignweek.com\"}"

echo "🎨 Updating Contemporary Art Exhibition..."

# Contemporary Art Exhibition
update_event \
  "cmfur5u48000duw1bu1p38hyu" \
  "Contemporary Art Exhibition" \
  "Immerse yourself in the vibrant world of contemporary art at our exclusive exhibition featuring works from emerging and established artists from around the globe. This carefully curated collection showcases the latest trends in contemporary art, from bold abstract paintings and innovative sculptures to cutting-edge digital installations and multimedia experiences. Discover the stories behind each piece as you explore our thoughtfully designed gallery spaces, where light, space, and artistic vision come together to create an unforgettable viewing experience. Meet the artists, attend exclusive preview events, and gain insights into the creative process through guided tours and artist talks. Whether you're a seasoned art collector, emerging enthusiast, or simply curious about contemporary creativity, this exhibition offers a unique opportunity to engage with the art that's defining our cultural moment. Join us for an inspiring journey through the diverse and dynamic world of contemporary art." \
  "Curated contemporary art showcase" \
  "2024-11-20T10:00:00Z" \
  "2024-12-20T18:00:00Z" \
  "Modern Art Gallery, Via Brera 2, 20121 Milano, Italy" \
  200 \
  25 \
  "\"art\", \"contemporary\", \"exhibition\", \"gallery\", \"culture\", \"creativity\"" \
  "{\"instagram\": \"https://instagram.com/contemporaryartmilano\", \"facebook\": \"https://facebook.com/contemporaryartmilano\", \"linkedin\": \"https://linkedin.com/company/contemporary-art-milano\", \"twitter\": \"https://twitter.com/contemporaryart\", \"website\": \"https://contemporaryartmilano.com\"}" \
  "[\"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800\", \"https://images.unsplash.com/photo-1578321272176-b7bbc0679852?w=800\"]" \
  "\"Artist Talks\", \"Gallery Tours\", \"Opening Reception\", \"Workshop Sessions\", \"Networking Events\", \"Private Viewings\"" \
  "{\"email\": \"info@contemporaryartmilano.com\", \"phone\": \"+39 02 5555 1234\", \"website\": \"https://contemporaryartmilano.com\"}"

echo "🎨 Updating Creative Design Workshop..."

# Creative Design Workshop
update_event \
  "event-owner2-1" \
  "Creative Design Workshop" \
  "Unleash your creative potential in our hands-on Creative Design Workshop, where imagination meets practical skills in an inspiring and collaborative environment. This intensive workshop is designed for designers, artists, and creative professionals who want to expand their skill set and explore new techniques. Led by experienced industry professionals, you'll learn cutting-edge design methodologies, experiment with innovative tools and materials, and develop your unique creative voice. Through a combination of lectures, hands-on exercises, and collaborative projects, you'll gain practical skills that you can immediately apply to your work. Whether you're looking to break into the design industry, enhance your existing skills, or simply explore your creative side, this workshop provides the perfect opportunity to learn, grow, and connect with fellow creatives. Join us for an inspiring journey of discovery and skill development in the heart of creative excellence." \
  "Hands-on design skills workshop" \
  "2024-11-25T09:00:00Z" \
  "2024-11-25T17:00:00Z" \
  "Creative Studio Milano, Via Tortona 37, 20144 Milano, Italy" \
  20 \
  75 \
  "\"workshop\", \"design\", \"creative\", \"hands-on\", \"skills\", \"learning\"" \
  "{\"instagram\": \"https://instagram.com/creativedesignworkshop\", \"facebook\": \"https://facebook.com/creativedesignworkshop\", \"linkedin\": \"https://linkedin.com/company/creative-design-workshop\", \"twitter\": \"https://twitter.com/creativedesign\", \"website\": \"https://creativedesignworkshop.com\"}" \
  "[\"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Hands-on Exercises\", \"Expert Instruction\", \"Design Tools\", \"Collaborative Projects\", \"Portfolio Review\", \"Networking Lunch\"" \
  "{\"email\": \"workshop@creativedesign.com\", \"phone\": \"+39 02 7777 8888\", \"website\": \"https://creativedesignworkshop.com\"}"

echo "🎨 Updating Art Gallery Opening Night..."

# Art Gallery Opening Night
update_event \
  "event-owner2-2" \
  "Art Gallery Opening Night" \
  "Join us for an exclusive and elegant opening night celebration at our prestigious art gallery, where art, culture, and sophistication come together in a memorable evening of discovery and connection. This exclusive event marks the debut of our latest curated exhibition, featuring works from both established masters and emerging contemporary artists. Mingle with fellow art enthusiasts, collectors, and cultural influencers in our beautifully designed gallery spaces, where each piece tells a story and every corner offers a new perspective. Enjoy complimentary refreshments and hors d'oeuvres as you explore the exhibition, meet the artists, and engage in stimulating conversations about art, culture, and creativity. This intimate gathering provides the perfect opportunity to network with like-minded individuals, discover new artistic voices, and immerse yourself in the vibrant cultural scene. Whether you're a seasoned collector, art lover, or simply curious about contemporary culture, this opening night promises an unforgettable experience filled with beauty, inspiration, and meaningful connections." \
  "Exclusive gallery opening celebration" \
  "2024-12-01T18:00:00Z" \
  "2024-12-01T22:00:00Z" \
  "Prestige Art Gallery, Via Montenapoleone 12, 20121 Milano, Italy" \
  100 \
  0 \
  "\"art\", \"gallery\", \"opening\", \"culture\", \"networking\", \"exhibition\"" \
  "{\"instagram\": \"https://instagram.com/prestigeartgallery\", \"facebook\": \"https://facebook.com/prestigeartgallery\", \"linkedin\": \"https://linkedin.com/company/prestige-art-gallery\", \"twitter\": \"https://twitter.com/prestigeart\", \"website\": \"https://prestigeartgallery.com\"}" \
  "[\"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800\", \"https://images.unsplash.com/photo-1578321272176-b7bbc0679852?w=800\"]" \
  "\"Exhibition Preview\", \"Artist Meet & Greet\", \"Complimentary Refreshments\", \"Live Music\", \"Gallery Tours\", \"Networking Reception\"" \
  "{\"email\": \"events@prestigeartgallery.com\", \"phone\": \"+39 02 9999 1111\", \"website\": \"https://prestigeartgallery.com\"}"

echo "🎨 Updating Creative Networking Mixer..."

# Creative Networking Mixer
update_event \
  "event-owner2-3" \
  "Creative Networking Mixer" \
  "Connect with fellow creatives, entrepreneurs, and industry professionals at our dynamic Creative Networking Mixer, where meaningful connections and collaborative opportunities come to life. This carefully curated event brings together designers, artists, writers, marketers, and creative entrepreneurs in a relaxed and inspiring atmosphere. Whether you're looking to expand your professional network, find collaborators for your next project, or simply connect with like-minded individuals, this mixer provides the perfect platform for authentic relationship building. Enjoy complimentary drinks and light refreshments as you engage in stimulating conversations, share your creative journey, and discover new opportunities for collaboration and growth. Our structured networking activities and ice-breaker sessions ensure that everyone has the chance to connect and engage, regardless of their networking experience. Join us for an evening of inspiration, connection, and creative energy that could lead to your next big opportunity or meaningful professional relationship." \
  "Professional creative networking event" \
  "2024-12-08T18:30:00Z" \
  "2024-12-08T21:30:00Z" \
  "Creative Hub Milano, Via Brera 28, 20121 Milano, Italy" \
  50 \
  0 \
  "\"networking\", \"creative\", \"professional\", \"collaboration\", \"entrepreneurship\"" \
  "{\"instagram\": \"https://instagram.com/creativenetworkingmilano\", \"facebook\": \"https://facebook.com/creativenetworkingmilano\", \"linkedin\": \"https://linkedin.com/company/creative-networking-milano\", \"twitter\": \"https://twitter.com/creativenetwork\", \"website\": \"https://creativenetworkingmilano.com\"}" \
  "[\"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Structured Networking\", \"Ice-breaker Activities\", \"Complimentary Drinks\", \"Collaboration Opportunities\", \"Professional Development\", \"Creative Showcase\"" \
  "{\"email\": \"networking@creativenetworkingmilano.com\", \"phone\": \"+39 02 8888 9999\", \"website\": \"https://creativenetworkingmilano.com\"}"

echo "🎨 Updating AI Innovation Summit..."

# AI Innovation Summit
update_event \
  "event-owner3-1" \
  "AI Innovation Summit" \
  "Explore the cutting edge of artificial intelligence and its transformative impact on business, society, and human creativity at our comprehensive AI Innovation Summit. This premier event brings together leading AI researchers, industry executives, startup founders, and technology visionaries to discuss the latest breakthroughs, emerging applications, and future possibilities of artificial intelligence. From machine learning and deep learning to natural language processing and computer vision, our expert speakers will share insights into the technologies that are reshaping our world. Discover how AI is revolutionizing industries from healthcare and finance to creative arts and education, and learn about the ethical considerations and responsible development practices that are shaping the future of AI. Whether you're a technology professional, business leader, researcher, or simply curious about the future of AI, this summit offers unparalleled insights into one of the most important technological developments of our time. Join us for a day of learning, inspiration, and connection with the minds that are building tomorrow's intelligent world." \
  "Premier AI technology and innovation conference" \
  "2024-12-10T09:00:00Z" \
  "2024-12-10T18:00:00Z" \
  "Tech Innovation Center, Via Sarpi 8, 20136 Milano, Italy" \
  300 \
  200 \
  "\"AI\", \"artificial intelligence\", \"technology\", \"innovation\", \"machine learning\", \"future\"" \
  "{\"instagram\": \"https://instagram.com/aiinnovationsummit\", \"twitter\": \"https://twitter.com/aiinnovsummit\", \"linkedin\": \"https://linkedin.com/company/ai-innovation-summit\", \"youtube\": \"https://youtube.com/c/aiinnovationsummit\", \"website\": \"https://aiinnovationsummit.com\"}" \
  "[\"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800\", \"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800\", \"https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800\"]" \
  "\"Keynote Presentations\", \"Technical Workshops\", \"AI Demonstrations\", \"Panel Discussions\", \"Networking Sessions\", \"Startup Showcase\"" \
  "{\"email\": \"info@aiinnovationsummit.com\", \"phone\": \"+39 02 1111 2222\", \"website\": \"https://aiinnovationsummit.com\"}"

echo "🎨 Updating Startup Pitch Competition..."

# Startup Pitch Competition
update_event \
  "event-owner3-2" \
  "Startup Pitch Competition" \
  "Witness the next generation of innovative startups as they compete for funding, mentorship, and recognition in our high-energy Startup Pitch Competition. This exciting event brings together ambitious entrepreneurs, visionary investors, and industry experts for an evening of innovation, inspiration, and opportunity. Watch as carefully selected startups present their groundbreaking ideas, innovative solutions, and business models to a panel of experienced judges and a captivated audience. From cutting-edge technology and sustainable solutions to creative services and social impact initiatives, you'll discover the diverse range of innovation happening in our entrepreneurial ecosystem. Whether you're an investor looking for your next opportunity, an entrepreneur seeking inspiration and feedback, or simply someone who loves to see innovation in action, this competition offers an exciting glimpse into the future of business and technology. Join us for an evening of high-energy presentations, valuable networking, and the chance to witness the birth of the next big success story." \
  "High-energy startup pitch competition" \
  "2024-12-15T18:00:00Z" \
  "2024-12-15T22:00:00Z" \
  "Startup Hub Milano, Via Torino 12, 20123 Milano, Italy" \
  150 \
  0 \
  "\"startup\", \"pitch\", \"competition\", \"entrepreneurship\", \"investment\", \"innovation\"" \
  "{\"instagram\": \"https://instagram.com/startuppitchmilano\", \"twitter\": \"https://twitter.com/startuppitch\", \"linkedin\": \"https://linkedin.com/company/startup-pitch-milano\", \"youtube\": \"https://youtube.com/c/startuppitchmilano\", \"website\": \"https://startuppitchmilano.com\"}" \
  "[\"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800\", \"https://images.unsplash.com/photo-1552664730-d307ca884978?w=800\", \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\"]" \
  "\"Startup Presentations\", \"Judging Panel\", \"Networking Reception\", \"Awards Ceremony\", \"Investor Meet & Greet\", \"After-party\"" \
  "{\"email\": \"competition@startuppitchmilano.com\", \"phone\": \"+39 02 3333 4444\", \"website\": \"https://startuppitchmilano.com\"}"

echo "🎨 Updating Tech Leadership Workshop..."

# Tech Leadership Workshop
update_event \
  "event-owner3-3" \
  "Tech Leadership Workshop" \
  "Develop the essential leadership skills needed to thrive in today's fast-paced technology environment at our comprehensive Tech Leadership Workshop. This intensive program is designed for current and aspiring technology leaders who want to enhance their management capabilities, build high-performing teams, and navigate the unique challenges of leading in the tech industry. Led by experienced technology executives and leadership experts, you'll learn proven strategies for team building, conflict resolution, strategic planning, and driving innovation in technical organizations. Through interactive exercises, case studies, and peer discussions, you'll gain practical insights into effective communication, decision-making, and change management in technology-driven environments. Whether you're a new manager, experienced leader, or aspiring executive, this workshop provides the tools and knowledge you need to excel in technology leadership roles. Join us for a day of learning, growth, and connection with fellow technology leaders who are shaping the future of the industry." \
  "Comprehensive technology leadership development" \
  "2024-12-20T09:00:00Z" \
  "2024-12-20T17:00:00Z" \
  "Leadership Academy Milano, Via Manzoni 15, 20121 Milano, Italy" \
  30 \
  150 \
  "\"leadership\", \"technology\", \"management\", \"team building\", \"strategy\", \"development\"" \
  "{\"instagram\": \"https://instagram.com/techleadershipworkshop\", \"linkedin\": \"https://linkedin.com/company/tech-leadership-workshop\", \"twitter\": \"https://twitter.com/techleadership\", \"website\": \"https://techleadershipworkshop.com\"}" \
  "[\"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800\", \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800\", \"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800\"]" \
  "\"Interactive Workshops\", \"Case Studies\", \"Peer Discussions\", \"Leadership Exercises\", \"Networking Lunch\", \"Action Planning\"" \
  "{\"email\": \"workshop@techleadership.com\", \"phone\": \"+39 02 5555 6666\", \"website\": \"https://techleadershipworkshop.com\"}"

echo "✅ All existing events enhanced with comprehensive data!"
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
