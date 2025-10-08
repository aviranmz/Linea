import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson } from '../lib/api';
import { NearbyEvents } from '../components/NearbyEvents';
import { InteractiveMapView } from '../components/InteractiveMapView';
import { Event } from '../types/Event';
import { EventList } from '../components/EventList';
import { HomeSEO } from '../components/SEO';
import { useLanguage } from '../hooks/useLanguage';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

interface Area {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export function HomePage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: '',
    dateFrom: '',
    dateTo: '',
    city: '',
    owner: '',
    area: '',
    product: '',
    hours: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, categoriesData, areasData, productsData] =
          await Promise.all([
            getJson<{ events: Event[] }>('/api/events'),
            getJson<{ categories: Category[] }>('/api/categories'),
            getJson<{ areas: Area[] }>('/api/areas'),
            getJson<{ products: Product[] }>('/api/products'),
          ]);
        setEvents(eventsData.events || []);
        setFilteredEvents(eventsData.events || []);
        setCategories(categoriesData.categories || []);
        setAreas(areasData.areas || []);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter events based on current filters
  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchLower) ||
          (event.description &&
            event.description.toLowerCase().includes(searchLower)) ||
          (event.shortDescription &&
            event.shortDescription.toLowerCase().includes(searchLower)) ||
          (event.owner?.name &&
            event.owner.name.toLowerCase().includes(searchLower)) ||
          (event.owner?.businessName &&
            event.owner.businessName.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        event => event.category?.slug === filters.category
      );
    }

    // Featured filter
    if (filters.featured === 'true') {
      filtered = filtered.filter(event => event.featured === true);
    } else if (filters.featured === 'false') {
      filtered = filtered.filter(event => event.featured === false);
    }

    // Date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(
        event => new Date(event.startDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(event => new Date(event.startDate) <= toDate);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(event =>
        event.venue?.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Owner filter
    if (filters.owner) {
      filtered = filtered.filter(
        event =>
          event.owner?.name
            .toLowerCase()
            .includes(filters.owner.toLowerCase()) ||
          (event.owner?.businessName &&
            event.owner.businessName
              .toLowerCase()
              .includes(filters.owner.toLowerCase()))
      );
    }

    // Area filter (filter by venue city matching area)
    if (filters.area) {
      const selectedArea = areas.find(a => a.slug === filters.area);
      if (selectedArea) {
        filtered = filtered.filter(event =>
          event.venue?.city
            .toLowerCase()
            .includes(selectedArea.name.toLowerCase())
        );
      }
    }

    // Product filter (filter by owner's product specialty)
    if (filters.product) {
      const selectedProduct = products.find(p => p.slug === filters.product);
      if (selectedProduct) {
        // This would need to be enhanced when we have product data in events
        // For now, we'll filter by owner name containing product name
        filtered = filtered.filter(
          event =>
            event.owner?.businessName
              ?.toLowerCase()
              .includes(selectedProduct.name.toLowerCase()) ||
            event.owner?.name
              .toLowerCase()
              .includes(selectedProduct.name.toLowerCase())
        );
      }
    }

    // Hours filter (filter by time of day)
    if (filters.hours) {
      filtered = filtered.filter(event => {
        const eventTime = new Date(event.startDate);
        const hour = eventTime.getHours();

        switch (filters.hours) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 22;
          case 'night':
            return hour >= 22 || hour < 6;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(filtered);
  }, [events, filters, areas, products]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      featured: '',
      dateFrom: '',
      dateTo: '',
      city: '',
      owner: '',
      area: '',
      product: '',
      hours: '',
    });
  };

  // formatDate is unused currently; keep implementation out to avoid TS6133

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <div className='relative'>
      <HomeSEO
        featuredEvents={filteredEvents.slice(0, 6).map(event => ({
          title: event.title,
          slug: event.slug,
          startDate: event.startDate,
          venue: event.venue?.name,
        }))}
        stats={{
          totalEvents: events.length,
          totalDesigners: 0, // TODO: Get from API
          totalAttendees: 0, // TODO: Get from API
        }}
      />
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        {/* Background Image with 70% opacity */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: 'url(/assets/linea_light.png)',
            opacity: 0.2,
          }}
        />
        <div className='container relative z-10'>
          <div className='relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32'>
            <main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
              <div className='sm:text-center lg:text-left'>
                <h1 className='heading-1'>
                  <span className='block xl:inline'>{t('common.welcome')}</span>{' '}
                  <span className='block milano-accent xl:inline'>Linea</span>
                </h1>
                <p className='mt-6 text-body sm:mt-8 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0'>
                  {t('common.heroSubtitle')}
                </p>
                <div className='mt-4 text-sm text-neutral-600'>
                  <p>{t('common.heroFeatures')}</p>
                </div>
                <div className='mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start'>
                  <div className='rounded-lg shadow-milano'>
                    <Link
                      to='#events'
                      className='btn btn-primary px-8 py-3 text-base font-medium transform hover:scale-105 md:py-4 md:text-lg md:px-10'
                    >
                      Discover Design Events
                    </Link>
                  </div>
                  <div className='mt-3 sm:mt-0 sm:ml-3'>
                    <Link
                      to='/owner'
                      className='btn btn-outline px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10'
                    >
                      Join as Designer
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Milano-inspired background decoration */}
        <div className='absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-milano-terracotta/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div className='absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-milano-sage/20 to-accent-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
      </div>

      {/* Events Section */}
      <div id='events' className='section bg-white'>
        <div className='container'>
          <div className='text-center'>
            <h2 className='heading-2'>Discover Events</h2>
            <p className='mt-4 text-body text-lg'>
              Find amazing design events happening around you
            </p>
          </div>

          {/* Filter Controls */}
          <div className='mt-8 bg-neutral-50 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='heading-5'>{t('common.filterEvents')}</h3>
              <div className='flex items-center space-x-2'>
                {getActiveFiltersCount() > 0 && (
                  <span className='text-sm text-accent-600'>
                    {getActiveFiltersCount()}{' '}
                    {getActiveFiltersCount() !== 1
                      ? t('common.filtersActive')
                      : t('common.filterActive')}
                  </span>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className='btn btn-outline btn-sm'
                >
                  {showFilters
                    ? t('common.hideFilters')
                    : t('common.showFilters')}
                </button>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className='btn btn-outline btn-sm text-red-600 hover:text-red-800'
                  >
                    {t('common.clearAll')}
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.search')}
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    placeholder={t('common.searchPlaceholder')}
                    value={filters.search}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, search: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.category')}
                  </label>
                  <select
                    className='input w-full'
                    value={filters.category}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value=''>{t('common.allCategories')}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.designDistrict')}
                  </label>
                  <select
                    className='input w-full'
                    value={filters.area}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, area: e.target.value }))
                    }
                  >
                    <option value=''>{t('common.allAreas')}</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.slug}>
                        {area.icon} {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.productSpecialty')}
                  </label>
                  <select
                    className='input w-full'
                    value={filters.product}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, product: e.target.value }))
                    }
                  >
                    <option value=''>{t('common.allProducts')}</option>
                    {products.map(product => (
                      <option key={product.id} value={product.slug}>
                        {product.icon} {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.timeOfDay')}
                  </label>
                  <select
                    className='input w-full'
                    value={filters.hours}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, hours: e.target.value }))
                    }
                  >
                    <option value=''>{t('common.anyTime')}</option>
                    <option value='morning'>{t('common.morning')}</option>
                    <option value='afternoon'>{t('common.afternoon')}</option>
                    <option value='evening'>{t('common.evening')}</option>
                    <option value='night'>{t('common.night')}</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.featured')}
                  </label>
                  <select
                    className='input w-full'
                    value={filters.featured}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        featured: e.target.value,
                      }))
                    }
                  >
                    <option value=''>{t('common.allEvents')}</option>
                    <option value='true'>{t('common.featuredOnly')}</option>
                    <option value='false'>{t('common.regularEvents')}</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.dateFrom')}
                  </label>
                  <input
                    type='date'
                    className='input w-full'
                    value={filters.dateFrom}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.dateTo')}
                  </label>
                  <input
                    type='date'
                    className='input w-full'
                    value={filters.dateTo}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, dateTo: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.city')}
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    placeholder='e.g., Milano'
                    value={filters.city}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>

                <div className='md:col-span-2 lg:col-span-3'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('common.designerOrganizer')}
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    placeholder={t('common.searchByDesigner')}
                    value={filters.owner}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, owner: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            <div className='mt-4 flex justify-between items-center'>
              <div className='text-sm text-gray-600'>
                {t('common.showing')} {filteredEvents.length} {t('common.of')}{' '}
                {events.length} {t('common.events')}
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className='btn btn-outline btn-sm'
              >
                {showMap ? t('common.listView') : t('common.mapView')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className='mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='card overflow-hidden animate-pulse'>
                  <div className='h-48 bg-neutral-200'></div>
                  <div className='p-6'>
                    <div className='h-4 bg-neutral-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-neutral-200 rounded w-1/2 mb-4'></div>
                    <div className='h-3 bg-neutral-200 rounded w-full'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='mt-12 space-y-8'>
              {/* Map View */}
              <div className='bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'>
                <InteractiveMapView events={filteredEvents} />
              </div>

              {/* Events Grid Below Map */}
              {filteredEvents.length > 0 ? (
                <div>
                  <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
                    All Events
                  </h2>
                  <EventList
                    events={filteredEvents}
                    variant='grid'
                    showOwner={true}
                    showCategory={true}
                    showWaitlist={true}
                    onEventClick={event => {
                      window.location.href = `/events/${event.id}`;
                    }}
                  />
                </div>
              ) : (
                <div className='col-span-full text-center py-12'>
                  <div className='text-neutral-400 mb-4'>
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
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <h3 className='heading-4 mb-2'>
                    {getActiveFiltersCount() > 0
                      ? t('common.noEventsMatch')
                      : t('common.noEventsYet')}
                  </h3>
                  <p className='text-body mb-4'>
                    {getActiveFiltersCount() > 0
                      ? t('common.tryAdjustingFilters')
                      : t('common.checkBackSoon')}
                  </p>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className='btn btn-outline'
                    >
                      {t('common.clearFilters')}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nearby Events Section */}
      {filteredEvents.length > 0 && (
        <div className='section bg-neutral-50'>
          <div className='container'>
            <div className='text-center mb-8'>
              <h2 className='heading-2 mb-4'>Discover More Events</h2>
              <p className='text-body text-lg'>
                Find related events happening in your area or industry
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {filteredEvents.slice(0, 2).map(event => (
                <div key={event.id}>
                  <NearbyEvents
                    eventSlug={event.slug}
                    limit={3}
                    showTitle={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className='section bg-neutral-50'>
        <div className='container'>
          <div className='text-center mb-16'>
            <h2 className='heading-2 mb-4'>Why Choose Linea?</h2>
            <p className='text-body text-lg'>
              The premier platform for Milano Design Week and design events
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center group'>
              <div className='w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200'>
                <span className='text-2xl'>📧</span>
              </div>
              <h3 className='heading-4 mb-2'>Email-Only Access</h3>
              <p className='text-body'>
                Seamless access to exclusive design events with just your email.
                No complex registrations.
              </p>
            </div>

            <div className='text-center group'>
              <div className='w-16 h-16 bg-gradient-to-br from-milano-sage/20 to-milano-sage/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200'>
                <span className='text-2xl'>📋</span>
              </div>
              <h3 className='heading-4 mb-2'>Curated Design Events</h3>
              <p className='text-body'>
                Access handpicked design events, exhibitions, and workshops from
                leading designers and studios.
              </p>
            </div>

            <div className='text-center group'>
              <div className='w-16 h-16 bg-gradient-to-br from-milano-terracotta/20 to-milano-terracotta/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200'>
                <span className='text-2xl text-gray-400'>Map</span>
              </div>
              <h3 className='heading-4 mb-2'>Milano Design Network</h3>
              <p className='text-body'>
                Discover design districts, showrooms, and cultural landmarks
                around Milano Design Week.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='bg-gradient-to-r from-accent-600 to-accent-700'>
        <div className='container py-12 lg:py-16 lg:flex lg:items-center lg:justify-between'>
          <h2 className='text-3xl font-display font-bold tracking-tight text-white sm:text-4xl'>
            <span className='block'>{t('common.readyToCreate')}</span>
            <span className='block text-accent-200'>
              {t('common.startBuilding')}
            </span>
          </h2>
          <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
            <div className='inline-flex rounded-lg shadow-milano'>
              <Link
                to='/owner'
                className='btn btn-secondary px-5 py-3 text-base font-medium'
              >
                Get started
              </Link>
            </div>
            <div className='ml-3 inline-flex rounded-lg shadow-milano'>
              <Link
                to='#events'
                className='btn btn-outline border-white text-white hover:bg-white hover:text-accent-600 px-5 py-3 text-base font-medium'
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
