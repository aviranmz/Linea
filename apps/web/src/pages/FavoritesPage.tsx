import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson } from '../lib/api';
import { Event } from '../types/Event';
import { EventList as EventListComponent } from '../components/EventList';
import { useLanguage } from '../hooks/useLanguage';

interface FavoriteItem {
  id: string;
  event: Event;
  createdAt: string;
}

interface FavoritesResponse {
  favorites: FavoriteItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getJson<FavoritesResponse>(
        `/api/favorites?page=${page}&limit=20`
      );
      setFavorites(response.favorites);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setError(t('favorites.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadFavorites(newPage);
  };

  if (loading && favorites.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/3 mb-8'></div>
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

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center'>
            <div className='text-red-600 text-6xl mb-4'>!</div>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              {t('favorites.errorLoading')}
            </h1>
            <p className='text-gray-600 mb-6'>{error}</p>
            <button
              onClick={() => loadFavorites()}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              {t('favorites.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center'>
            <div className='text-gray-400 text-6xl mb-4'>💔</div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              {t('favorites.noFavoritesYet')}
            </h1>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              {t('favorites.startExploring')}
            </p>
            <Link
              to='/'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              {t('favorites.exploreEvents')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {t('favorites.myFavorites')}
          </h1>
          <p className='text-gray-600'>
            {pagination.total}{' '}
            {pagination.total === 1
              ? t('favorites.eventSaved')
              : t('favorites.eventsSaved')}
          </p>
        </div>

        {/* Favorites List */}
        <div className='mb-8'>
          <EventListComponent
            events={favorites.map(fav => fav.event)}
            variant='grid'
            showOwner={true}
            showCategory={true}
            showWaitlist={true}
            onEventClick={event => {
              window.location.href = `/events/${event.slug}`;
            }}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='flex items-center justify-center space-x-2'>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              {t('favorites.previous')}
            </button>

            <span className='px-4 py-2 text-gray-600'>
              {t('favorites.page')} {pagination.page} {t('favorites.of')}{' '}
              {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              {t('favorites.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
