import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types/Event';
import { getJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';
import { EventList } from '../components/EventList';

export function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getJson<{ events: Event[] }>('/api/events')
      .then(res => setEvents(res.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>{t('nav.events') || 'Events'}</h1>
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='h-64 bg-gray-100 rounded-lg animate-pulse' />
          ))}
        </div>
      ) : (
        <EventList
          events={events}
          showOwner
          className=''
          onEventClick={ev => navigate(`/events/${ev.id}`)}
        />
      )}
    </div>
  );
}


