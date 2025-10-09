import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
  const { auth } = useAuth();
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
    if (!auth?.authenticated || (auth.role !== 'ADMIN' && auth.role !== 'OWNER')) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading arrival information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!arrivalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Not Found</h2>
            <p className="text-yellow-600">Arrival information not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">Event Arrival Check-in</h1>
            <p className="text-blue-100 mt-2">Show this to the event organizer</p>
          </div>

          {/* Event Info */}
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{arrivalData.eventTitle}</h2>
              <p className="text-gray-600">Attendee: {arrivalData.userEmail}</p>
            </div>

            {/* Status */}
            {arrivalData.alreadyArrived ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Already Checked In</h3>
                    <p className="text-sm text-green-700">Arrived at: {arrivalData.arrivalTime}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Ready for Check-in</h3>
                    <p className="text-sm text-blue-700">Show this QR code to the event organizer</p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code */}
            {arrivalData.qrCodeData && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Arrival QR Code</h3>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                  <img 
                    src={arrivalData.qrCodeData} 
                    alt="Arrival QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  The event organizer will scan this QR code to check you in
                </p>
              </div>
            )}

            {/* Admin Actions */}
            {auth?.authenticated && (auth.role === 'ADMIN' || auth.role === 'OWNER') && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                <button
                  onClick={handleAdminScan}
                  disabled={scanning || arrivalData.alreadyArrived}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    arrivalData.alreadyArrived
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : scanning
                      ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {scanning ? 'Processing...' : arrivalData.alreadyArrived ? 'Already Checked In' : 'Mark as Arrived'}
                </button>
                {arrivalData.alreadyArrived && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
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
