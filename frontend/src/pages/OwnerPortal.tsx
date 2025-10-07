export function OwnerPortal() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Owner Portal</h1>
          <p className='text-gray-600'>
            Manage your events and track waitlist performance
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Stats Cards */}
          <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>12</div>
              <div className='text-sm text-gray-600'>Total Events</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>1,234</div>
              <div className='text-sm text-gray-600'>Total Waitlist</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>89%</div>
              <div className='text-sm text-gray-600'>Conversion Rate</div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='text-2xl font-bold text-gray-900'>45</div>
              <div className='text-sm text-gray-600'>Active Events</div>
            </div>
          </div>

          {/* Recent Events */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm'>
              <div className='p-6 border-b'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Recent Events
                </h2>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        Milano Design Week 2024
                      </h3>
                      <p className='text-sm text-gray-600'>
                        April 15-21, 2024 • Milan, Italy
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium text-gray-900'>
                        1,234 waitlist
                      </div>
                      <div className='text-sm text-green-600'>Published</div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        Tech Innovation Summit
                      </h3>
                      <p className='text-sm text-gray-600'>
                        May 10-12, 2024 • San Francisco, CA
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium text-gray-900'>
                        856 waitlist
                      </div>
                      <div className='text-sm text-yellow-600'>Draft</div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        Art & Culture Festival
                      </h3>
                      <p className='text-sm text-gray-600'>
                        June 5-8, 2024 • Barcelona, Spain
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium text-gray-900'>
                        2,156 waitlist
                      </div>
                      <div className='text-sm text-green-600'>Published</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <button className='btn btn-primary w-full'>
                  Create New Event
                </button>
                <button className='btn btn-outline w-full'>
                  Import Events
                </button>
                <button className='btn btn-outline w-full'>
                  Export Waitlist
                </button>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Analytics
              </h3>
              <div className='space-y-3'>
                <div className='text-sm'>
                  <div className='text-gray-600'>This Month</div>
                  <div className='text-2xl font-bold text-gray-900'>+23%</div>
                </div>
                <div className='text-sm'>
                  <div className='text-gray-600'>Waitlist Growth</div>
                  <div className='text-2xl font-bold text-gray-900'>+156</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
