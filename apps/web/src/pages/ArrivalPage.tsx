import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJson } from '../lib/api';

interface ArrivalData {
  eventTitle: string;
  userEmail: string;
  eventId: string;
  arrivalHash: string;
  qrCodeData?: string;
  alreadyArrived?: boolean;
  arrivalTime?: string;
}

export function ArrivalPage() {
  const { eventId, hash } = useParams<{ eventId: string; hash: string }>();
  const [auth, setAuth] = useState<{
    authenticated: boolean;
    user?: { role?: string };
  } | null>(null);
  const [arrivalData, setArrivalData] = useState<ArrivalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!eventId || !hash) {
      setError('Invalid arrival link');
      setLoading(false);
      return;
    }

    // Load auth status
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }));

    loadArrivalData();
  }, [eventId, hash]);

  const loadArrivalData = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/arrival/${hash}/data`);
      if (!response.ok) {
        throw new Error('Failed to load arrival data');
      }
      
      const data = await response.json();
      setArrivalData(data);
    } catch (error) {
      console.error('Error loading arrival data:', error);
      setError('Failed to load arrival information');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminScan = async () => {
    if (!auth?.authenticated || (auth.user?.role !== 'ADMIN' && auth.user?.role !== 'OWNER')) {
      alert('Only admins and owners can scan arrival codes');
      return;
    }

    setScanning(true);
    try {
      const response = await fetch(`/api/events/${eventId}/arrival/${hash}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        setArrivalData(prev => prev ? { ...prev, alreadyArrived: true, arrivalTime: new Date().toLocaleString() } : null);
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      alert('Failed to process scan');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-milano border border-neutral-200/50 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
              <p className="mt-6 text-neutral-600 text-lg">Loading arrival information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-milano border border-neutral-200/50 p-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <h2 className="text-xl font-display font-semibold text-red-800 mb-3">Error</h2>
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!arrivalData) {
    return (
      <div className="py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-milano border border-neutral-200/50 p-8">
            <div className="text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
                <h2 className="text-xl font-display font-semibold text-yellow-800 mb-3">Not Found</h2>
                <p className="text-yellow-600 text-lg">Arrival information not found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-milano border border-neutral-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-milano-navy to-milano-sage text-white p-8">
            <h1 className="text-3xl font-display font-bold">Event Arrival Check-in</h1>
            <p className="text-milano-cream/90 mt-3 text-lg">Show this to the event organizer</p>
          </div>

          {/* Event Info */}
          <div className="p-8">
            <div className="bg-milano-cream/30 rounded-xl p-6 mb-8 border border-accent-200">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-3 font-display">{arrivalData.eventTitle}</h2>
              <p className="text-neutral-600 text-lg">Attendee: {arrivalData.userEmail}</p>
            </div>

            {/* Status */}
            {arrivalData.alreadyArrived ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800">Already Checked In</h3>
                    <p className="text-green-700">Arrived at: {arrivalData.arrivalTime}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-accent-800">Ready for Check-in</h3>
                    <p className="text-accent-700">Show this QR code to the event organizer</p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code */}
            {arrivalData.qrCodeData && (
              <div className="text-center">
                <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-6">Your Arrival QR Code</h3>
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 inline-block shadow-milano">
                  <img 
                    src={arrivalData.qrCodeData} 
                    alt="Arrival QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="text-neutral-600 mt-6 text-lg">
                  The event organizer will scan this QR code to check you in
                </p>
              </div>
            )}

            {/* Admin Actions */}
            {auth?.authenticated && (auth.user?.role === 'ADMIN' || auth.user?.role === 'OWNER') && (
              <div className="mt-10 pt-8 border-t border-neutral-200">
                <h3 className="text-xl font-display font-semibold text-neutral-900 mb-6">Admin Actions</h3>
                <button
                  onClick={handleAdminScan}
                  disabled={scanning || arrivalData.alreadyArrived}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    arrivalData.alreadyArrived
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : scanning
                      ? 'bg-accent-100 text-accent-600 cursor-not-allowed'
                      : 'bg-accent-600 text-white hover:bg-accent-700 hover:shadow-milano'
                  }`}
                >
                  {scanning ? 'Processing...' : arrivalData.alreadyArrived ? 'Already Checked In' : 'Mark as Arrived'}
                </button>
                {arrivalData.alreadyArrived && (
                  <p className="text-neutral-600 mt-4 text-center text-lg">
                    This QR code was already scanned at {arrivalData.arrivalTime}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
