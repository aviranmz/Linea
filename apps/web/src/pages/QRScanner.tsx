import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScanResult {
  success: boolean;
  message: string;
  eventTitle?: string;
  userEmail?: string;
}

// Simple QR code detection function
const detectQRCode = (imageData: ImageData): boolean => {
  // This is a very basic QR code detection
  // In a real implementation, you'd use a proper QR library like jsQR
  const data = imageData.data;
  
  // Look for high contrast patterns that might indicate a QR code
  let contrastCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    
    // Count pixels that are very dark or very light (high contrast)
    if (brightness < 50 || brightness > 200) {
      contrastCount++;
    }
  }
  
  // If we have enough high contrast pixels, assume it might be a QR code
  const contrastRatio = contrastCount / (data.length / 4);
  return contrastRatio > 0.3; // 30% of pixels are high contrast
};

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
      console.log('Starting camera...');
      // Show preview area right away so users see where it will appear
      setIsScanning(true);
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
        console.log('First camera attempt failed:', firstErr);
        // Fallback without facingMode (some Android/iOS devices fail otherwise)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (secondErr) {
          console.error('Second camera attempt failed:', secondErr);
          throw new Error('Camera access denied or not available');
        }
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        // Prepare video element for iOS Safari
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        // WebKit-specific hint
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        // iOS Safari: start playback when metadata is ready
        const v = videoRef.current;
        v.onloadedmetadata = async () => {
          try {
            await v.play();
          } catch (playErr) {
            console.warn('Video play() failed on metadata:', playErr);
          }
        };
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
      setCameraError(
        `Failed to access camera: ${message}. On iPhone Safari: Settings → Safari → Camera → Allow; or tap the address bar lock → Website Settings → Allow Camera.`
      );
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanLoop = async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Maintain a reasonable canvas size for performance
    const targetWidth = Math.min(640, video.videoWidth || 640);
    const aspect = (video.videoWidth || 640) / (video.videoHeight || 480);
    const targetHeight = Math.max(1, Math.round(targetWidth / (aspect || 1.333)));
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 1) Prefer BarcodeDetector if supported
    // @ts-ignore - experimental API
    const BD: typeof window.BarcodeDetector | undefined = (window as any).BarcodeDetector;
    if (BD && typeof BD === 'function') {
      try {
        // @ts-ignore
        const detector = new BD({ formats: ['qr_code'] });
        const bitmap = await createImageBitmap(canvas);
        // @ts-ignore
        const codes = await detector.detect(bitmap);
        if (codes && codes.length > 0) {
          const raw = codes[0].rawValue || '';
          handleDecodedValue(raw);
          return;
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // 2) Fallback naive luminance-based detection (placeholder until jsQR is added)
    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const found = detectQRCode(imageData);
      if (found) {
        setScanResult({ success: true, message: 'QR detected. Paste URL below to process.' });
        setIsScanning(false);
        return;
      }
    } catch {}

    // Continue scanning
    setTimeout(() => {
      if (isScanning) scanLoop();
    }, 120);
  };

  const handleDecodedValue = async (value: string) => {
    try {
      // Parse QR content - should be JSON with scanUrl
      let scanUrl = value;
      try {
        const obj = JSON.parse(value);
        if (obj && typeof obj === 'object') {
          if (obj.scanUrl) {
            scanUrl = obj.scanUrl as string;
          } else if (obj.url) {
            // Legacy format - convert arrival URL to scan URL
            const url = obj.url as string;
            const match = url.match(/\/events\/([^/]+)\/arrival\/([^?/]+)/);
            if (match) {
              const [, eventId, hash] = match;
              scanUrl = `/api/events/${eventId}/arrival/${hash}/scan`;
            }
          }
        }
      } catch {}

      if (!scanUrl || typeof scanUrl !== 'string') {
        setScanResult({ success: false, message: 'Invalid QR content' });
        return;
      }

      // Call the scan API directly
      const resp = await fetch(scanUrl, { method: 'POST' });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setScanResult({ success: true, message: data.message || 'Checked in' });
      } else {
        setScanResult({ success: false, message: data.message || 'Failed to check in' });
      }
      setIsScanning(false);
    } catch (e) {
      setScanResult({ success: false, message: 'Scan processing failed' });
      setIsScanning(false);
    }
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
                className='block w-full h-[60vh] sm:h-[70vh] object-cover bg-black'
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
