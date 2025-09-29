import { Link } from 'react-router-dom'

export default function SaloneDelMobile() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-milano-sage/10 to-milano-terracotta/10">
        <div className="container py-16 lg:py-24">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-milano-sage/20 text-milano-sage-800 dark:bg-milano-sage/30 dark:text-milano-sage-200">
                🏛️ Milan Design Week 2024
              </span>
            </div>
            <h1 className="heading-1 mb-6">
              <span className="block">Salone del Mobile</span>
              <span className="block milano-accent">Milano</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The world's most important furniture and design fair, showcasing the latest innovations in furniture, lighting, and home accessories from leading international brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.salonemilano.it/en"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-8 py-3 text-base font-medium"
              >
                🌐 Visit Official Website
              </a>
              <Link
                to="/events"
                className="btn btn-outline px-8 py-3 text-base font-medium"
              >
                🎯 Discover Events
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-milano-sage/20 to-milano-terracotta/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-milano-terracotta/20 to-milano-sage/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* About Section */}
      <div className="section bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">
                About Salone del Mobile
              </h2>
              <div className="space-y-4 text-body">
                <p>
                  <strong>Salone del Mobile.Milano</strong> is the world's most important furniture and design fair, held annually in Milan, Italy. Since 1961, it has been the global reference point for the furniture and design sector, showcasing the latest trends and innovations.
                </p>
                <p>
                  The fair brings together over 2,000 exhibitors from more than 160 countries, attracting hundreds of thousands of visitors including designers, architects, retailers, and design enthusiasts from around the world.
                </p>
                <p>
                  Alongside the main fair, Milan Design Week transforms the entire city into a design showcase, with Fuorisalone events taking place throughout Milan's design districts including Brera, 5vie, Tortona, and Porta Nuova.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-milano-sage/10 to-milano-terracotta/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-milano-sage-600 dark:text-milano-sage-400 mb-2">60+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-milano-terracotta-600 dark:text-milano-terracotta-400 mb-2">2,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Exhibitors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-milano-sage-600 dark:text-milano-sage-400 mb-2">300K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-milano-terracotta-600 dark:text-milano-terracotta-400 mb-2">160+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Information */}
      <div className="section bg-neutral-50 dark:bg-neutral-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Key Information
            </h2>
            <p className="text-body text-lg">
              Everything you need to know about Salone del Mobile Milano
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="heading-4 mb-3">Dates & Location</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>2024 Dates:</strong> April 16-21, 2024</p>
                <p><strong>Location:</strong> Fiera Milano Rho</p>
                <p><strong>Hours:</strong> 9:30 AM - 6:30 PM</p>
                <p><strong>Last Day:</strong> 9:30 AM - 4:30 PM</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">🎫</div>
              <h3 className="heading-4 mb-3">Tickets & Access</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Professional:</strong> Free registration</p>
                <p><strong>Students:</strong> Special rates available</p>
                <p><strong>Groups:</strong> Discounted packages</p>
                <p><strong>Online:</strong> Pre-registration recommended</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">🚇</div>
              <h3 className="heading-4 mb-3">Getting There</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Metro:</strong> Line 1 to Rho Fiera</p>
                <p><strong>Train:</strong> Rho Fiera station</p>
                <p><strong>Shuttle:</strong> From city center</p>
                <p><strong>Parking:</strong> Available on-site</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="heading-4 mb-3">Exhibition Areas</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Classic:</strong> Traditional furniture</p>
                <p><strong>Design:</strong> Contemporary design</p>
                <p><strong>xLux:</strong> Luxury segment</p>
                <p><strong>S.Project:</strong> Contract solutions</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="heading-4 mb-3">Fuorisalone Events</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Brera:</strong> Art galleries & showrooms</p>
                <p><strong>5vie:</strong> Contemporary design</p>
                <p><strong>Tortona:</strong> Innovation & technology</p>
                <p><strong>Porta Nuova:</strong> Modern architecture</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="heading-4 mb-3">Digital Resources</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>App:</strong> Official mobile app</p>
                <p><strong>Virtual:</strong> Online exhibitions</p>
                <p><strong>Live:</strong> Streaming events</p>
                <p><strong>Social:</strong> #SaloneDelMobile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Districts */}
      <div className="section bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Milan Design Districts
            </h2>
            <p className="text-body text-lg">
              Explore the design districts during Milan Design Week
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-milano-sage/10 to-milano-sage/20 rounded-lg p-6 border border-milano-sage/20">
              <div className="text-2xl mb-3">🎨</div>
              <h3 className="heading-5 mb-2">Brera</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Historic artistic district with galleries, boutiques, and design studios
              </p>
              <div className="text-xs text-milano-sage-600 dark:text-milano-sage-400">
                Art galleries • Showrooms • Cafés
              </div>
            </div>

            <div className="bg-gradient-to-br from-milano-terracotta/10 to-milano-terracotta/20 rounded-lg p-6 border border-milano-terracotta/20">
              <div className="text-2xl mb-3">🏛️</div>
              <h3 className="heading-5 mb-2">5vie</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Design district with contemporary furniture showrooms and design studios
              </p>
              <div className="text-xs text-milano-terracotta-600 dark:text-milano-terracotta-400">
                Contemporary design • Showrooms • Studios
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/20 dark:to-accent-800/20 rounded-lg p-6 border border-accent-200 dark:border-accent-800/20">
              <div className="text-2xl mb-3">🏢</div>
              <h3 className="heading-5 mb-2">Porta Nuova</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Modern business district with contemporary architecture and design
              </p>
              <div className="text-xs text-accent-600 dark:text-accent-400">
                Modern architecture • Business • Innovation
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div className="text-2xl mb-3">🚤</div>
              <h3 className="heading-5 mb-2">Navigli</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Historic canal district with trendy bars, restaurants, and creative spaces
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Canals • Nightlife • Creative spaces
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Links */}
      <div className="section bg-gradient-to-r from-milano-sage/5 to-milano-terracotta/5 dark:from-milano-sage/10 dark:to-milano-terracotta/10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Official Resources
            </h2>
            <p className="text-body text-lg">
              Access official Salone del Mobile information and resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://www.salonemilano.it/en"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
              <h3 className="heading-5 mb-2">Official Website</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Complete information about the fair, exhibitors, and events
              </p>
              <div className="text-sm text-milano-sage-600 dark:text-milano-sage-400 font-medium">
                Visit salonemilano.it →
              </div>
            </a>

            <a
              href="https://www.salonemilano.it/en/visit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🎫</div>
              <h3 className="heading-5 mb-2">Visitor Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Tickets, opening hours, and practical information for visitors
              </p>
              <div className="text-sm text-milano-terracotta-600 dark:text-milano-terracotta-400 font-medium">
                Plan your visit →
              </div>
            </a>

            <a
              href="https://www.salonemilano.it/en/exhibitors"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="heading-5 mb-2">Exhibitors Directory</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Browse the complete list of exhibitors and their products
              </p>
              <div className="text-sm text-accent-600 dark:text-accent-400 font-medium">
                Explore exhibitors →
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-milano-sage to-milano-terracotta dark:from-milano-sage-700 dark:to-milano-terracotta-700">
        <div className="container py-16 lg:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl mb-6">
              <span className="block">Ready to explore Milan Design Week?</span>
              <span className="block text-milano-sage-100">Discover events and connect with designers</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="btn btn-secondary px-8 py-3 text-base font-medium"
              >
                🎯 Discover Events
              </Link>
              <Link
                to="/designers"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-milano-sage-600 px-8 py-3 text-base font-medium"
              >
                👥 Meet Designers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
