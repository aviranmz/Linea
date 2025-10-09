import React from 'react';
import { getJson } from '../lib/api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NearbyEvents } from '../components/NearbyEvents';
import { Event } from '../types/Event';
import { EventSEO } from '../components/SEO';
import { useLanguage } from '../hooks/useLanguage';
import { useAnalytics } from '../lib/analytics';

export function EventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const { t } = useLanguage();
  const [isPrivileged, setIsPrivileged] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    let handleScroll: (() => void) | null = null;

    if (id) {
      fetch(`/api/events/${id}`)
        .then(res => res.json())
        .then(data => {
          setEvent(data.event);
          setLoading(false);

          // Track event view
          if (data.event?.id) {
            analytics.trackEventView(data.event.id);

            // Track scroll events with throttling
            let maxScroll = 0;
            let lastScrollTime = 0;
            const SCROLL_THROTTLE_MS = 1000; // Only track scroll every 1 second

            handleScroll = () => {
              const now = Date.now();
              if (now - lastScrollTime < SCROLL_THROTTLE_MS) return;

              const scrollPercentage = Math.round(
                (window.scrollY /
                  (document.body.scrollHeight - window.innerHeight)) *
                  100
              );
              if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                lastScrollTime = now;
                analytics.trackScroll(data.event.id, scrollPercentage);
              }
            };

            window.addEventListener('scroll', handleScroll);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }

    // Cleanup function
    return () => {
      if (handleScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
      // Reset analytics tracking when component unmounts
      analytics.reset();
    };
  }, [id]);

  // Determine if current user can see QR UI (ADMIN or OWNER)
  useEffect(() => {
    (async () => {
      try {
        const res = await getJson<{ authenticated: boolean; user?: { role?: string } }>(
          '/auth/me'
        );
        const role = res?.user?.role;
        setIsPrivileged(!!res?.authenticated && (role === 'ADMIN' || role === 'OWNER'));
      } catch {
        setIsPrivileged(false);
      }
    })();
  }, []);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !email) return;

    setIsJoining(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventId: event.id,
        }),
      });

      if (response.ok) {
        setJoined(true);
        setEmail('');

        // Track waitlist join
        analytics.trackWaitlistJoin(event.id);
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!event || isGeneratingQR) return;

    setIsGeneratingQR(true);
    try {
      const response = await fetch(
        `/api/owner/events/${event.id}/generate-qr`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Update the event state with the new QR code
        setEvent(prev =>
          prev
            ? {
                ...prev,
                metadata: {
                  ...prev.metadata,
                  qrUrl: result.qrUrl,
                },
              }
            : null
        );
        alert('QR code generated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      alert('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-8'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          {t('event.notFound')}
        </h1>
        <p className='text-gray-600'>{t('event.notFoundDescription')}</p>
      </div>
    );
  }

  // Generate JSON-LD structured data (unused)
  /*
  const _generateJsonLd = () => {
    if (!event) return null
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.description || event.shortDescription,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.status === 'PUBLISHED' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventPostponed',
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      url: `${window.location.origin}/events/${event.slug}`,
      ...(event.venue && {
        location: {
          "@type": "Place",
          name: event.venue.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.venue.address,
            addressLocality: event.venue.city,
            addressCountry: event.venue.country
          },
          ...(event.venue.latitude && event.venue.longitude && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.venue.latitude,
              longitude: event.venue.longitude
            }
          })
        }
      }),
      ...(event.owner && {
        organizer: {
          "@type": "Organization",
          name: event.owner.name,
          email: event.owner.email
        }
      }),
      ...(event.capacity && {
        maximumAttendeeCapacity: event.capacity
      }),
      offers: {
        "@type": "Offer",
        url: `${window.location.origin}/events/${event.slug}`,
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString()
      }
    }
    
    return JSON.stringify(jsonLd)
  }
  */

  return (
    <>
      <EventSEO
        event={{
          title: event.title,
          slug: event.slug,
          description: event.description || undefined,
          shortDescription: event.shortDescription || undefined,
          startDate: event.startDate,
          endDate: event.endDate || undefined,
          capacity: event.capacity || undefined,
          category: event.category?.name || undefined,
          venue: event.venue
            ? {
                name: event.venue.name,
                address: event.venue.address,
                city: event.venue.city,
                country: event.venue.country,
                latitude: event.venue.latitude,
                longitude: event.venue.longitude,
              }
            : undefined,
          organizer: event.owner
            ? {
                name: event.owner.name,
                email: event.owner.email,
                businessName: event.owner.businessName,
              }
            : undefined,
          metadata: event.metadata
            ? {
                heroImageUrl: event.metadata.heroImageUrl || undefined,
              }
            : undefined,
        }}
        breadcrumbs={[
          { name: 'Home', url: 'https://linea-production.up.railway.app/' },
          {
            name: 'Events',
            url: 'https://linea-production.up.railway.app/designers',
          },
          {
            name: event.title,
            url: `https://linea-production.up.railway.app/events/${event.slug}`,
          },
        ]}
      />

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Professional Event Header */}
        <div className='mb-8'>
          <div className='bg-gradient-to-r from-white via-gray-50/30 to-white rounded-2xl border border-gray-200/50 p-6 shadow-sm'>
            <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
              {/* Title Section */}
              <div className='flex-1'>
                {/* Complete Event Information Block */}
                <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                  {/* All Event Details in One Block */}
                  <div className='flex-1'>
                    <div className='space-y-4'>
                      {/* Title and Description */}
                      <div>
                        <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2'>
                          {event.title}
                        </h1>
                        {event.shortDescription && (
                          <p className='text-lg text-gray-600 leading-relaxed'>
                            {event.shortDescription}
                          </p>
                        )}
                      </div>

                      {/* Event Details - Responsive Grid */}
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600'>
                      <div className='flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-sm'>
                          <svg
                            className='w-4 h-4 mr-2 text-gray-500 flex-shrink-0'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <span className='font-medium text-gray-700 text-xs sm:text-sm'>
                            {new Date(event.startDate).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                        {event.endDate && (
                          <div className='flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-sm'>
                            <svg
                              className='w-4 h-4 mr-2 text-gray-500 flex-shrink-0'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                            </svg>
                            <span className='font-medium text-gray-700 text-xs sm:text-sm'>
                              {t('event.ends')}:{' '}
                              {new Date(event.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className='flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-sm'>
                            <svg
                              className='w-4 h-4 mr-2 text-gray-500 flex-shrink-0'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                            </svg>
                            <span className='font-medium text-gray-700 text-xs sm:text-sm'>
                              {t('event.capacity')}: {event.capacity}
                            </span>
                          </div>
                        )}
                        {event.venue && (
                          <div className='flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-sm'>
                            <svg
                              className='w-4 h-4 mr-2 text-gray-500 flex-shrink-0'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                              />
                            </svg>
                            <span className='font-medium text-gray-700 text-xs sm:text-sm'>
                              {event.venue.name}, {event.venue.city}
                            </span>
                          </div>
                        )}
                        {event.category && (
                          <div className='flex items-center sm:col-span-2 lg:col-span-1'>
                            <span
                              className='inline-flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-sm'
                              style={{
                                backgroundColor: event.category.color + '20',
                                color: event.category.color,
                              }}
                            >
                              {event.category.icon} {event.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {event.metadata?.pricing && (
                        <div className='flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-sm'>
                          <span className='w-4 h-4 mr-2 text-gray-500'>💶</span>
                          <span className='font-medium text-gray-700 text-xs sm:text-sm'>
                            {event.metadata.pricing}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional QR Code - Responsive */}
                  <div className='flex-shrink-0 w-full lg:w-auto'>
                    {isPrivileged && event.metadata?.qrUrl &&
                    typeof event.metadata.qrUrl === 'string' ? (
                      <div className='bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group'>
                        <div className='flex flex-col items-center'>
                          <div className='relative'>
                            <div className='w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center'>
                              <img
                                src={event.metadata.qrUrl}
                                alt='Event QR Code'
                                className='w-20 h-20 sm:w-24 sm:h-24 rounded-lg'
                              />
                            </div>
                            <div className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg'>
                              <svg
                                className='w-3 h-3 sm:w-4 sm:h-4 text-white'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                          </div>
                          <div className='mt-2 sm:mt-3 text-center'>
                            <p className='text-xs sm:text-sm font-semibold text-gray-800 mb-1'>
                              Quick Access
                            </p>
                            <p className='text-xs text-gray-500 leading-tight'>
                              Scan to join event
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      isPrivileged && (
                      <div className='bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm'>
                        <div className='flex flex-col items-center'>
                          <div className='w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center mb-3'>
                            <svg
                              className='w-8 h-8 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z'
                              />
                            </svg>
                          </div>
                      <div className='text-center'>
                            <p className='text-xs sm:text-sm font-semibold text-gray-800 mb-2'>
                              QR Code Missing
                            </p>
                            <button
                              onClick={handleGenerateQR}
                              disabled={isGeneratingQR}
                              className='px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                              {isGeneratingQR
                                ? 'Generating...'
                                : 'Generate QR Code'}
                            </button>
                          </div>
                        </div>
                      </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Product */}
        {event.metadata?.heroImageUrl && (
          <div className='mb-8'>
            <img
              src={event.metadata.heroImageUrl}
              alt={event.metadata?.productName || event.title}
              className='w-full rounded-xl border border-gray-200'
            />
          </div>
        )}

        {/* Product Summary */}
        {(event.metadata?.productName || event.metadata?.valueProposition) && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              {event.metadata?.productName || t('event.product')}
            </h2>
            {event.metadata?.valueProposition && (
              <p className='text-gray-700'>{event.metadata.valueProposition}</p>
            )}
          </div>
        )}

        {/* Event Description */}
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
            {t('event.aboutEvent')}
          </h2>
          <div className='prose max-w-none'>
            <p className='text-gray-600 leading-relaxed'>
              {event.metadata?.longDescription ||
                event.description ||
                'Join us for an amazing event! More details coming soon.'}
            </p>
          </div>
        </div>

        {/* Features & Awards */}
        {(event.metadata?.features?.length ||
          event.metadata?.awards?.length) && (
          <div className='mb-8 grid md:grid-cols-2 gap-6'>
            {event.metadata?.features && event.metadata.features.length > 0 && (
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('event.features')}
                </h3>
                <ul className='list-disc pl-6 text-gray-700 space-y-1'>
                  {event.metadata.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {event.metadata?.awards && event.metadata.awards.length > 0 && (
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('event.awards')}
                </h3>
                <ul className='list-disc pl-6 text-gray-700 space-y-1'>
                  {event.metadata.awards.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Product Video */}
        {(event.metadata?.videoUrl || event.youtubeUrl) && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.video')}
            </h2>
            <div className='aspect-video bg-gray-100 rounded-lg overflow-hidden'>
              <iframe
                src={event.metadata?.videoUrl || event.youtubeUrl!}
                title={event.title}
                className='w-full h-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                onError={e => {
                  console.warn('Video iframe failed to load:', e);
                  // Hide the iframe container if it fails to load
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    container.style.display = 'none';
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Press & Socials */}
        {(event.metadata?.pressKitUrl || event.metadata?.social) && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.pressSocial')}
            </h2>
            <div className='flex flex-wrap gap-3'>
              {event.metadata?.pressKitUrl && (
                <a
                  href={event.metadata.pressKitUrl}
                  className='btn btn-outline'
                  target='_blank'
                  rel='noreferrer'
                >
                  {t('event.downloadPressKit')}
                </a>
              )}
              {event.metadata?.social &&
                Object.entries(event.metadata.social).map(([k, v]) =>
                  v ? (
                    <a
                      key={k}
                      href={v as string}
                      target='_blank'
                      rel='noreferrer'
                      className='text-indigo-600 hover:text-indigo-800 underline capitalize'
                    >
                      {k}
                    </a>
                  ) : null
                )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {event.metadata?.contact && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.contact')}
            </h2>
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <div className='space-y-1 text-gray-700'>
                {event.metadata.contact.email && (
                  <div>
                    {t('event.email')}:{' '}
                    <a
                      className='text-indigo-600'
                      href={`mailto:${event.metadata.contact.email}`}
                    >
                      {event.metadata.contact.email}
                    </a>
                  </div>
                )}
                {event.metadata.contact.phone && (
                  <div>
                    {t('event.phone')}:{' '}
                    <a
                      className='text-indigo-600'
                      href={`tel:${event.metadata.contact.phone}`}
                    >
                      {event.metadata.contact.phone}
                    </a>
                  </div>
                )}
                {event.metadata.contact.whatsapp && (
                  <div>
                    {t('event.whatsapp')}:{' '}
                    <a
                      className='text-indigo-600'
                      href={event.metadata.contact.whatsapp}
                    >
                      {t('event.open')}
                    </a>
                  </div>
                )}
                {event.metadata.contact.telegram && (
                  <div>
                    {t('event.telegram')}:{' '}
                    <a
                      className='text-indigo-600'
                      href={event.metadata.contact.telegram}
                    >
                      {t('event.open')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Form */}
        <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
            {t('event.joinWaitlist')}
          </h2>
          <p className='text-gray-600 mb-6'>
            {t('event.joinWaitlistDescription')}
          </p>

          {joined ? (
            <div className='bg-green-50 border border-green-200 rounded-md p-4'>
              <div className='flex'>
                <svg
                  className='w-5 h-5 text-green-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <div>
                  <h3 className='text-sm font-medium text-green-800'>
                    {t('event.successfullyJoined')}
                  </h3>
                  <p className='text-sm text-green-700 mt-1'>
                    {t('event.notifyWhenAvailable')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleJoinWaitlist}
              className='flex flex-col sm:flex-row gap-4'
            >
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('event.enterEmail')}
                required
                className='flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
              <button
                type='submit'
                disabled={isJoining}
                onClick={() =>
                  analytics.trackButtonClick(event.id, 'waitlist-join')
                }
                className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {isJoining ? t('event.joining') : t('event.joinWaitlist')}
              </button>
            </form>
          )}
        </div>

        {/* Venue Information */}
        {event.venue && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.venue')}
            </h2>
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {event.venue.name}
              </h3>
              <p className='text-gray-600 mb-4'>
                {event.venue.address}, {event.venue.city}, {event.venue.country}
              </p>
            {event.venue.latitude && event.venue.longitude && (
              <div className='flex flex-wrap gap-3 mb-4'>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${event.venue.name}, ${event.venue.address}, ${event.venue.city}`
                  )}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-outline'
                >
                  Open in Google Maps
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${event.venue.latitude},${event.venue.longitude}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-primary'
                >
                  Directions
                </a>
              </div>
            )}
              {event.venue.latitude && event.venue.longitude && (
                <a
                  href={`https://maps.google.com/?q=${event.venue.latitude},${event.venue.longitude}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center text-indigo-600 hover:text-indigo-800'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  {t('event.viewOnGoogleMaps')}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Shows */}
        {event.shows && event.shows.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.shows')}
            </h2>
            <div className='grid gap-4'>
              {event.shows.map(show => (
                <div
                  key={show.id}
                  className='bg-white border border-gray-200 rounded-lg p-6'
                >
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {show.title}
                  </h3>
                  {show.description && (
                    <p className='text-gray-600 mb-3'>{show.description}</p>
                  )}
                  <div className='flex items-center text-sm text-gray-500'>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    {new Date(show.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {show.endDate && (
                      <span className='ml-4'>
                        -{' '}
                        {new Date(show.endDate).toLocaleDateString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  {show.youtubeUrl && (
                    <div className='mt-4 aspect-video bg-gray-100 rounded overflow-hidden'>
                      <iframe
                        src={show.youtubeUrl}
                        title={show.title}
                        className='w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        onError={e => {
                          console.warn('Show video iframe failed to load:', e);
                          // Hide the iframe container if it fails to load
                          const container = e.currentTarget.parentElement;
                          if (container) {
                            container.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Places */}
        {event.nearbyPlaces && event.nearbyPlaces.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              {t('event.nearbyPlaces')}
            </h2>
            <div className='grid md:grid-cols-2 gap-4'>
              {event.nearbyPlaces.slice(0, 6).map(place => (
                <div
                  key={place.id}
                  className='bg-white border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-sm font-medium text-gray-900'>
                        {place.name}
                      </h3>
                      <p className='text-xs text-gray-500 mt-1'>
                        {place.address}
                      </p>
                      <div className='flex items-center mt-2'>
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          {place.category}
                        </span>
                        {place.distance && (
                          <span className='ml-2 text-xs text-gray-500'>
                            {Math.round(place.distance)}m {t('event.away')}
                          </span>
                        )}
                      </div>
                    </div>
                    {place.website && (
                      <a
                        href={place.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-2 text-indigo-600 hover:text-indigo-800'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Events */}
        <div className='mt-8'>
          <NearbyEvents eventSlug={event.slug} limit={5} />
        </div>
      </div>
    </>
  );
}
