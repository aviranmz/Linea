export function Footer() {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>L</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>Linea</span>
            </div>
            <p className='text-gray-600 text-sm'>
              Modern event management platform with email-only access and
              waitlist functionality.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              Platform
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Owner Portal
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-gray-500'>
              © 2024 Linea. All rights reserved.
            </p>
            <p className='text-sm text-gray-500 mt-2 md:mt-0'>Version 0.1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
