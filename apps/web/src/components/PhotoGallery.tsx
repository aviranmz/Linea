import React, { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';

interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PhotoGalleryProps {
  ownerId?: string;
  isEditable?: boolean;
  maxPhotos?: number;
}

export function PhotoGallery({
  ownerId,
  isEditable = false,
  maxPhotos = 12,
}: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { t } = useLanguage();

  // Form state for adding/editing photos
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    altText: '',
    order: 0,
  });

  useEffect(() => {
    loadPhotos();
  }, [ownerId]);

  const loadPhotos = async () => {
    try {
      const endpoint = ownerId
        ? `/api/owners/${ownerId}/photo-gallery`
        : '/api/owner/photo-gallery';
      const data = await getJson<{ photos: Photo[] }>(endpoint);
      setPhotos(data.photos || []);
    } catch (err) {
      console.error('Failed to load photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const photo = await postJson<{ photo: Photo }>(
        '/api/owner/photo-gallery',
        formData
      );
      setPhotos(prev => [...prev, photo.photo]);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        thumbnailUrl: '',
        altText: '',
        order: 0,
      });
    } catch (err) {
      console.error('Failed to add photo:', err);
      setError('Failed to add photo');
    }
  };

  const handleEditPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const photo = await putJson<{ photo: Photo }>(
        `/api/owner/photo-gallery/${editingPhoto.id}`,
        formData
      );
      setPhotos(prev =>
        prev.map(p => (p.id === photo.photo.id ? photo.photo : p))
      );
      setEditingPhoto(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        thumbnailUrl: '',
        altText: '',
        order: 0,
      });
    } catch (err) {
      console.error('Failed to edit photo:', err);
      setError('Failed to edit photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm(t('confirm.deletePhoto'))) return;

    try {
      await deleteJson(`/api/owner/photo-gallery/${photoId}`);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setError('Failed to delete photo');
    }
  };

  const openEditModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl,
      thumbnailUrl: photo.thumbnailUrl || '',
      altText: photo.altText || '',
      order: photo.order,
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingPhoto(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      thumbnailUrl: '',
      altText: '',
      order: 0,
    });
  };

  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='heading-4 mb-4'>📸 Photo Gallery</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='animate-pulse'>
              <div className='aspect-square bg-gray-200 rounded-lg'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='heading-4 mb-4'>📸 Photo Gallery</h3>
        <div className='text-center py-8'>
          <p className='text-red-600'>{error}</p>
          <button
            onClick={loadPhotos}
            className='mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='heading-4'>📸 Photo Gallery</h3>
        {isEditable && photos.length < maxPhotos && (
          <button
            onClick={() => setShowAddModal(true)}
            className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm'
          >
            + Add Photo
          </button>
        )}
      </div>

      {photos.length === 0 ? (
        <div className='text-center py-8'>
          <div className='text-6xl mb-4'>📸</div>
          <p className='text-gray-500 mb-4'>No photos yet</p>
          {isEditable && (
            <button
              onClick={() => setShowAddModal(true)}
              className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
            >
              Add Your First Photo
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {photos.map(photo => (
            <div key={photo.id} className='relative group'>
              <div
                className='aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.altText || photo.title}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
              </div>

              {isEditable && (
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='flex space-x-1'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        openEditModal(photo);
                      }}
                      className='p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors'
                      title={t('gallery.editPhoto')}
                    >
                      <svg
                        className='w-4 h-4 text-gray-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      className='p-1 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors'
                      title={t('gallery.deletePhoto')}
                    >
                      <svg
                        className='w-4 h-4 text-red-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

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
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Photo Modal */}
      {(showAddModal || editingPhoto) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h3 className='heading-4 mb-4'>
              {editingPhoto ? 'Edit Photo' : 'Add Photo'}
            </h3>

            <form onSubmit={editingPhoto ? handleEditPhoto : handleAddPhoto}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Title *
                  </label>
                  <input
                    type='text'
                    required
                    className='input w-full'
                    value={formData.title}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder={t('gallery.photoTitle')}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    className='input w-full'
                    rows={3}
                    value={formData.description}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t('gallery.photoDescription')}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Image URL *
                  </label>
                  <input
                    type='url'
                    required
                    className='input w-full'
                    value={formData.imageUrl}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    placeholder='https://example.com/image.jpg'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Thumbnail URL
                  </label>
                  <input
                    type='url'
                    className='input w-full'
                    value={formData.thumbnailUrl}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        thumbnailUrl: e.target.value,
                      }))
                    }
                    placeholder='https://example.com/thumbnail.jpg'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Alt Text
                  </label>
                  <input
                    type='text'
                    className='input w-full'
                    value={formData.altText}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        altText: e.target.value,
                      }))
                    }
                    placeholder={t('gallery.altText')}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Display Order
                  </label>
                  <input
                    type='number'
                    className='input w-full'
                    value={formData.order}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  type='button'
                  onClick={closeModals}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
                >
                  {editingPhoto ? 'Update Photo' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
