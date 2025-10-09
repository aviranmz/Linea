import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScanResult {
  success: boolean;
  message: string;
  eventTitle?: string;
  userEmail?: string;
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports camera access
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access not supported in this browser');
      return;
    }

    // Check for camera permission
    navigator.permissions?.query({ name: 'camera' as PermissionName }).then((result) => {
      setHasPermission(result.state === 'granted');
    }).catch(() => {
      // Permission API not supported, we'll try to access camera directly
      setHasPermission(null);
    });
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setCameraError(null);
      // Stop any previously running stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Prefer back camera on mobile with Safari-friendly constraint
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (firstErr) {
        // Fallback without facingMode (some Android/iOS devices fail otherwise)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // iOS Safari requires both muted + playsInline + autoplay attribute
        // and play() call after a user gesture (the button click)
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // Surface a hint if autoplay fails
          console.warn('Video play() was interrupted:', playErr);
        }
        setIsScanning(true);
        setHasPermission(true);
        
        // Bring the scanner preview into view on mobile
        try {
          videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch {}

        // Start scanning loop
        scanLoop();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setCameraError(`Failed to access camera: ${message}. Please check site permissions and reload.`);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanLoop = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR code detection
    // We could read the image data here for a real QR decode implementation
    // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Simple QR code detection (in a real app, you'd use a library like jsQR)
    // For now, we'll simulate detection
    setTimeout(() => {
      if (isScanning) {
        scanLoop();
      }
    }, 100);
  };

  const handleManualInput = async (qrCode: string) => {
    if (!qrCode.trim()) return;

    try {
      setError(null);
      
      // Extract hash from QR code URL
      const url = new URL(qrCode);
      const pathParts = url.pathname.split('/');
      const eventId = pathParts[pathParts.length - 2];
      const hash = pathParts[pathParts.length - 1];
      
      const response = await fetch(`/api/events/${eventId}/arrival/${hash}`);
      const result: ScanResult = await response.json();
      
      setScanResult(result);
      
      if (result.success) {
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          setScanResult(null);
          navigate('/owner');
        }, 3000);
      }
    } catch (err) {
      console.error('Scan processing error:', err);
      setError('Failed to process QR code. Please try again.');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setCameraError(null);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>QR Code Scanner</h1>
              <p className='text-gray-600 mt-2'>
                Scan QR codes to check in attendees for your events
              </p>
            </div>
            <button
              onClick={() => navigate('/owner')}
              className='btn btn-outline'
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Camera Error */}
        {cameraError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Camera Error</h3>
                <div className='mt-2 text-sm text-red-700'>{cameraError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Scan Result */}
        {scanResult && (
          <div className={`mb-6 rounded-lg p-4 ${
            scanResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className='flex'>
              <div className='flex-shrink-0'>
                {scanResult.success ? (
                  <svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                ) : (
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                  </svg>
                )}
              </div>
              <div className='ml-3'>
                <h3 className={`text-sm font-medium ${
                  scanResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {scanResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
                </h3>
                <div className={`mt-2 text-sm ${
                  scanResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {scanResult.message}
                  {scanResult.eventTitle && (
                    <div className='mt-1'>
                      <strong>Event:</strong> {scanResult.eventTitle}
                    </div>
                  )}
                  {scanResult.userEmail && (
                    <div className='mt-1'>
                      <strong>User:</strong> {scanResult.userEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <div className='mt-2 text-sm text-red-700'>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Controls */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>Camera Scanner</h3>
              <p className='text-sm text-gray-600'>
                {hasPermission === false 
                  ? 'Camera permission denied. Please enable camera access in your browser settings.'
                  : 'Use your camera to scan QR codes from attendee devices.'
                }
              </p>
            </div>
            <div className='flex gap-2'>
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  disabled={hasPermission === false}
                  className='btn btn-primary'
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className='btn btn-outline'
                >
                  Stop Camera
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Camera View */}
        {isScanning && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6'>
            <div className='relative'>
              {/* Live preview */}
              <video
                ref={videoRef}
                className='block w-full aspect-[3/4] sm:aspect-[4/3] bg-black'
                playsInline
                muted
                autoPlay
              />

              {/* Hidden canvas used for frame reads */}
              <canvas ref={canvasRef} className='hidden' />

              {/* Visible scan guide */}
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                <div className='w-56 h-56 max-w-[75vw] max-h-[75vw] border-2 border-accent-500/90 rounded-xl shadow-[0_0_0_100vmax_rgba(0,0,0,0.35)] outline outline-1 outline-white/40'></div>
              </div>
            </div>
            <div className='px-4 py-3 text-center text-sm text-gray-600'>
              Align the QR code inside the square
            </div>
          </div>
        )}

        {/* Manual Input */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Manual QR Code Input</h3>
          <p className='text-sm text-gray-600 mb-4'>
            If camera scanning doesn't work, you can manually enter the QR code URL here.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const qrCode = formData.get('qrCode') as string;
              if (qrCode) {
                handleManualInput(qrCode);
              }
            }}
            className='flex gap-2'
          >
            <input
              type='url'
              name='qrCode'
              placeholder='Paste QR code URL here...'
              className='input flex-1'
              required
            />
            <button type='submit' className='btn btn-primary'>
              Process
            </button>
          </form>
        </div>

        {/* Reset Button */}
        {(scanResult || error) && (
          <div className='mt-6 text-center'>
            <button
              onClick={resetScanner}
              className='btn btn-outline'
            >
              Scan Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
