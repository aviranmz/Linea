import { useState, useEffect } from 'react';
import { getJson } from '../lib/api';
import { Link } from 'react-router-dom';
import { DesignersPageSEO } from '../components/SEO';

interface Designer {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessIntro: string;
  logoUrl: string;
  profilePictureUrl: string;
  website: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  _count: {
    ownedEvents: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [filteredDesigners, setFilteredDesigners] = useState<Designer[]>([]);
  const [, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    area: '',
    country: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [designersData, categoriesData] = await Promise.all([
          getJson<{ designers: Designer[] }>('/api/designers'),
          getJson<{ categories: Category[] }>('/api/categories'),
        ]);
        setDesigners(designersData.designers || []);
        setFilteredDesigners(designersData.designers || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Failed to load designers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter designers based on current filters
  useEffect(() => {
    let filtered = [...designers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        designer =>
          designer.name.toLowerCase().includes(searchLower) ||
          designer.businessName.toLowerCase().includes(searchLower) ||
          (designer.businessIntro &&
            designer.businessIntro.toLowerCase().includes(searchLower)) ||
          designer.city.toLowerCase().includes(searchLower)
      );
    }

    // Area filter (city)
    if (filters.area) {
      filtered = filtered.filter(designer =>
        designer.city.toLowerCase().includes(filters.area.toLowerCase())
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(designer =>
        designer.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    setFilteredDesigners(filtered);
  }, [designers, filters]);

  const uniqueCountries = [...new Set(designers.map(d => d.country))].sort();
  const uniqueCities = [...new Set(designers.map(d => d.city))].sort();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='animate-pulse space-y-6'>
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-white rounded-lg shadow-sm p-6'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <DesignersPageSEO
        designers={filteredDesigners}
        totalDesigners={designers.length}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='heading-1 mb-4'>
            Discover <span className='milano-accent'>Designers</span>
          </h1>
          <p className='text-body text-lg max-w-3xl mx-auto'>
            Explore the creative minds behind Milano Design Week. Find
            designers, studios, and brands showcasing their latest work.
          </p>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8'>
          <h3 className='heading-4 mb-4'>Filter Designers</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search
              </label>
              <input
                type='text'
                className='input w-full'
                placeholder='Search designers...'
                value={filters.search}
                onChange={e =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            {/* Area (City) */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Area
              </label>
              <select
                className='input w-full'
                value={filters.area}
                onChange={e =>
                  setFilters(prev => ({ ...prev, area: e.target.value }))
                }
              >
                <option value=''>All Areas</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Country
              </label>
              <select
                className='input w-full'
                value={filters.country}
                onChange={e =>
                  setFilters(prev => ({ ...prev, country: e.target.value }))
                }
              >
                <option value=''>All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className='flex items-end'>
              <button
                type='button'
                onClick={() =>
                  setFilters({
                    search: '',
                    category: '',
                    area: '',
                    country: '',
                  })
                }
                className='btn btn-outline w-full'
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Filter Status */}
          <div className='mt-4 flex justify-between items-center'>
            <div className='text-sm text-gray-600'>
              Showing {filteredDesigners.length} of {designers.length} designers
            </div>
          </div>
        </div>

        {/* Designers Grid */}
        {filteredDesigners.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredDesigners.map(designer => (
              <div
                key={designer.id}
                className='bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow'
              >
                <div className='p-6'>
                  {/* Designer Info */}
                  <div className='flex items-start space-x-4 mb-4'>
                    {designer.profilePictureUrl ? (
                      <img
                        src={designer.profilePictureUrl}
                        alt={designer.name}
                        className='w-16 h-16 rounded-full object-cover border border-gray-200'
                      />
                    ) : (
                      <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                        <span className='text-2xl text-gray-400'>
                          {designer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <h3 className='heading-5 text-gray-900 truncate'>
                        {designer.name}
                      </h3>
                      <p className='text-sm text-gray-600 truncate'>
                        {designer.businessName}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {designer.city}, {designer.country}
                      </p>
                    </div>
                  </div>

                  {/* Business Intro */}
                  {designer.businessIntro && (
                    <p className='text-sm text-gray-600 mb-4 line-clamp-3'>
                      {designer.businessIntro}
                    </p>
                  )}

                  {/* Stats */}
                  <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                    <span>{designer._count.ownedEvents} events</span>
                    {designer.website && (
                      <a
                        href={designer.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-600 hover:text-indigo-800'
                      >
                        Website
                      </a>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    to={`/designers/${designer.id}`}
                    className='btn btn-outline w-full'
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg
                className='mx-auto h-12 w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {designers.length === 0
                ? 'No designers found'
                : 'No designers match your filters'}
            </h3>
            <p className='text-gray-500'>
              {designers.length === 0
                ? 'Designers will appear here once they join the platform.'
                : 'Try adjusting your filters to see more designers.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
