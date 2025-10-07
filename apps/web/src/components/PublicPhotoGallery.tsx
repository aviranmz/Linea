import { useState } from 'react';

interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  order: number;
  isActive: boolean;
}

interface PublicPhotoGalleryProps {
  photos: Photo[];
  maxPhotos?: number;
  showTitles?: boolean;
  gridCols?: 2 | 3 | 4;
}

export function PublicPhotoGallery({
  photos,
  maxPhotos = 8,
  showTitles = true,
  gridCols = 3,
}: PublicPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Filter active photos and limit to maxPhotos
  const activePhotos = photos
    .filter(photo => photo.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, maxPhotos);

  if (activePhotos.length === 0) {
    return null;
  }

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridCols];

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center mb-4'>
        <span className='text-2xl mr-2'>📸</span>
        <h3 className='heading-4'>Photo Gallery</h3>
      </div>

      <div className={`grid ${gridClass} gap-4`}>
        {activePhotos.map(photo => (
          <div key={photo.id} className='relative group'>
            <div
              className='aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText || photo.title}
                className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                loading='lazy'
              />
            </div>

            {showTitles && (
              <div className='mt-2'>
                <h4 className='text-sm font-medium text-gray-900 truncate'>
                  {photo.title}
                </h4>
                {photo.description && (
                  <p className='text-xs text-gray-500 line-clamp-2'>
                    {photo.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
          <div className='max-w-4xl max-h-full p-4'>
            <button
              onClick={() => setSelectedPhoto(null)}
              className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10'
            >
              <svg
                className='w-8 h-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            <div className='text-center'>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className='max-w-full max-h-[80vh] object-contain rounded-lg'
              />
              <div className='mt-4 text-white'>
                <h3 className='text-xl font-semibold'>{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className='text-gray-300 mt-2'>
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
