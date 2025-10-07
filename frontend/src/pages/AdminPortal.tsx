export function AdminPortal() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Portal</h1>
          <p className='text-gray-600'>Manage platform, users, and content</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Stats Overview */}
          <div className='lg:col-span-4 grid grid-cols-1 md:grid-cols-5 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>156</div>
              <div className='text-sm text-gray-600'>Total Owners</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>1,234</div>
              <div className='text-sm text-gray-600'>Total Events</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>45,678</div>
              <div className='text-sm text-gray-600'>Total Waitlist</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>89%</div>
              <div className='text-sm text-gray-600'>Active Rate</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>12</div>
              <div className='text-sm text-gray-600'>Pending Reviews</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-lg shadow-sm'>
              <div className='p-6 border-b'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Recent Activity
                </h2>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-4 p-4 border rounded-lg'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-900'>
                        <strong>New Event Created:</strong> "Milano Design Week
                        2024" by Design Studio Milano
                      </p>
                      <p className='text-xs text-gray-500'>2 hours ago</p>
                    </div>
                    <button className='btn btn-outline btn-sm'>Review</button>
                  </div>

                  <div className='flex items-center space-x-4 p-4 border rounded-lg'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-900'>
                        <strong>New Owner Registered:</strong> Creative Events
                        Ltd.
                      </p>
                      <p className='text-xs text-gray-500'>4 hours ago</p>
                    </div>
                    <button className='btn btn-outline btn-sm'>View</button>
                  </div>

                  <div className='flex items-center space-x-4 p-4 border rounded-lg'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-900'>
                        <strong>Event Published:</strong> "Tech Innovation
                        Summit" is now live
                      </p>
                      <p className='text-xs text-gray-500'>6 hours ago</p>
                    </div>
                    <button className='btn btn-outline btn-sm'>
                      View Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <button className='btn btn-primary w-full'>
                  Review Pending Events
                </button>
                <button className='btn btn-outline w-full'>
                  Manage Owners
                </button>
                <button className='btn btn-outline w-full'>
                  System Settings
                </button>
                <button className='btn btn-outline w-full'>Export Data</button>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                System Health
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>API Status</span>
                  <span className='text-sm text-green-600 font-medium'>
                    Healthy
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Database</span>
                  <span className='text-sm text-green-600 font-medium'>
                    Connected
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Email Service</span>
                  <span className='text-sm text-green-600 font-medium'>
                    Active
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Redis Cache</span>
                  <span className='text-sm text-green-600 font-medium'>
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
