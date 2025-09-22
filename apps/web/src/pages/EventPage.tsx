import { useParams } from 'react-router-dom'

export function EventPage() {
  const { slug } = useParams()

  // TODO: Use slug to fetch event data from API
  console.log('Event slug:', slug)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Event Header */}
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Milano Design Week 2024
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Discover the latest in design innovation and creativity
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📅 April 15-21, 2024</span>
              <span>📍 Milan, Italy</span>
              <span>🎫 Free Event</span>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-6">
                Join us for an immersive experience at Milano Design Week 2024. 
                This exclusive event showcases cutting-edge design, innovative products, 
                and creative installations from leading designers and brands worldwide.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Expect</h3>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Exclusive product launches and previews</li>
                <li>Interactive design installations</li>
                <li>Networking opportunities with industry leaders</li>
                <li>Guided tours of featured exhibitions</li>
                <li>Panel discussions and workshops</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Date:</strong> April 15-21, 2024<br />
                    <strong>Time:</strong> 10:00 AM - 8:00 PM<br />
                    <strong>Location:</strong> Fiera Milano Rho
                  </div>
                  <div>
                    <strong>Capacity:</strong> 500 attendees<br />
                    <strong>Waitlist:</strong> 1,234 people<br />
                    <strong>Status:</strong> <span className="text-green-600">Open for Waitlist</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Waitlist Form */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Join the Waitlist
              </h3>
              <p className="text-gray-600 mb-4">
                This event is currently at capacity, but you can join our waitlist 
                to be notified if spots become available.
              </p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="input flex-1"
                />
                <button className="btn btn-primary px-6">
                  Join Waitlist
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                By joining the waitlist, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
