import React, { useState, useEffect } from 'react';
import { Event, EventFormData } from '../types/Event';
import { getEventQualityScore } from '../utils/eventValidation';
import { useLanguage } from '../hooks/useLanguage';

interface EventFormProps {
  event?: Event;
  onSubmit: (formData: EventFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

export function EventForm({
  event,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
}: EventFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startDate: '',
    description: '',
    shortDescription: '',
    endDate: '',
    capacity: undefined,
    venueId: '',
    categoryId: '',
    isPublic: false,
    featured: false,
    tags: [],
    productName: '',
    heroImageUrl: '',
    longDescription: '',
    valueProposition: '',
    features: [],
    awards: [],
    social: {},
    contact: {},
    videoUrl: '',
    pressKitUrl: '',
    schedule: [],
    qrUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [warnings, setWarnings] = useState<Record<string, string[]>>({});
  const [, setTouched] = useState<Record<string, boolean>>({});
  const [qualityScore, setQualityScore] = useState<ReturnType<
    typeof getEventQualityScore
  > | null>(null);

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        startDate: event.startDate || '',
        description: event.description || '',
        shortDescription: event.shortDescription || '',
        endDate: event.endDate || '',
        capacity: event.capacity || undefined,
        venueId: event.venueId || '',
        categoryId: event.categoryId || '',
        isPublic: event.isPublic,
        featured: event.featured,
        tags: event.tags || [],
        productName: event.metadata?.productName || '',
        heroImageUrl: event.metadata?.heroImageUrl || '',
        longDescription: event.metadata?.longDescription || '',
        valueProposition: event.metadata?.valueProposition || '',
        features: event.metadata?.features || [],
        awards: event.metadata?.awards || [],
        social: event.metadata?.social || {},
        contact: event.metadata?.contact || {},
        videoUrl: event.metadata?.videoUrl || '',
        pressKitUrl: event.metadata?.pressKitUrl || '',
        schedule: event.metadata?.schedule || [],
        qrUrl: event.metadata?.qrUrl || '',
      });
    }
  }, [event]);

  // Validate form on change
  useEffect(() => {
    // Basic validation
    const validationErrors: Record<string, string[]> = {};
    const validationWarnings: Record<string, string[]> = {};

    if (!formData.title.trim()) {
      validationErrors.title = ['Title is required'];
    }
    if (!formData.startDate) {
      validationErrors.startDate = ['Start date is required'];
    }

    setErrors(validationErrors);
    setWarnings(validationWarnings);

    if (event) {
      const quality = getEventQualityScore(event);
      setQualityScore(quality);
    }
  }, [formData, event]);

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleArrayChange = (field: keyof EventFormData, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleObjectChange = (
    field: keyof EventFormData,
    key: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...((prev[field] as Record<string, string>) || {}),
        [key]: value,
      },
    }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const validationErrors: Record<string, string[]> = {};

    if (!formData.title.trim()) {
      validationErrors.title = ['Title is required'];
    }
    if (!formData.startDate) {
      validationErrors.startDate = ['Start date is required'];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit event:', error);
    }
  };

  const getFieldError = (field: string) => {
    return errors[field]?.[0] || null;
  };

  const getFieldWarning = (field: string) => {
    return warnings[field]?.[0] || null;
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Basic Information */}
      <div className='bg-white p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold mb-4'>
          {t('form.basicInformation')}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.eventTitle')} *
            </label>
            <input
              type='text'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className={`input w-full ${getFieldError('title') ? 'border-red-500' : ''}`}
              placeholder={t('form.enterEventTitle')}
            />
            {getFieldError('title') && (
              <p className='text-red-500 text-sm mt-1'>
                {getFieldError('title')}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.startDate')} *
            </label>
            <input
              type='datetime-local'
              value={formData.startDate}
              onChange={e => handleInputChange('startDate', e.target.value)}
              className={`input w-full ${getFieldError('startDate') ? 'border-red-500' : ''}`}
            />
            {getFieldError('startDate') && (
              <p className='text-red-500 text-sm mt-1'>
                {getFieldError('startDate')}
              </p>
            )}
            {getFieldWarning('startDate') && (
              <p className='text-yellow-600 text-sm mt-1'>
                {getFieldWarning('startDate')}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.endDate')}
            </label>
            <input
              type='datetime-local'
              value={formData.endDate}
              onChange={e => handleInputChange('endDate', e.target.value)}
              className={`input w-full ${getFieldError('endDate') ? 'border-red-500' : ''}`}
            />
            {getFieldError('endDate') && (
              <p className='text-red-500 text-sm mt-1'>
                {getFieldError('endDate')}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.capacity')}
            </label>
            <input
              type='number'
              value={formData.capacity || ''}
              onChange={e =>
                handleInputChange(
                  'capacity',
                  e.target.value ? parseInt(e.target.value) : 0
                )
              }
              className={`input w-full ${getFieldError('capacity') ? 'border-red-500' : ''}`}
              placeholder={t('form.maximumAttendees')}
            />
            {getFieldError('capacity') && (
              <p className='text-red-500 text-sm mt-1'>
                {getFieldError('capacity')}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.venue')}
            </label>
            <input
              type='text'
              value={formData.venueId}
              onChange={e => handleInputChange('venueId', e.target.value)}
              className='input w-full'
              placeholder={t('form.venueIdOrName')}
            />
          </div>
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('form.eventDescription')} *
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            className={`textarea w-full ${getFieldError('description') ? 'border-red-500' : ''}`}
            rows={4}
            placeholder={t('form.describeEventDetail')}
          />
          {getFieldError('description') && (
            <p className='text-red-500 text-sm mt-1'>
              {getFieldError('description')}
            </p>
          )}
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('form.shortDescription')}
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={e =>
              handleInputChange('shortDescription', e.target.value)
            }
            className={`textarea w-full ${getFieldError('shortDescription') ? 'border-red-500' : ''}`}
            rows={2}
            placeholder={t('form.briefDescriptionForCards')}
          />
          {getFieldError('shortDescription') && (
            <p className='text-red-500 text-sm mt-1'>
              {getFieldError('shortDescription')}
            </p>
          )}
        </div>
      </div>

      {/* Media & Content */}
      <div className='bg-white p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold mb-4'>{t('form.mediaContent')}</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.heroImageUrl')}
            </label>
            <input
              type='url'
              value={formData.heroImageUrl}
              onChange={e => handleInputChange('heroImageUrl', e.target.value)}
              className='input w-full'
              placeholder={t('form.heroImagePlaceholder')}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.videoUrl')}
            </label>
            <input
              type='url'
              value={formData.videoUrl}
              onChange={e => handleInputChange('videoUrl', e.target.value)}
              className='input w-full'
              placeholder={t('form.videoPlaceholder')}
            />
          </div>
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('form.features')}
          </label>
          <div className='space-y-2'>
            {formData.features?.map((feature, index) => (
              <div key={index} className='flex items-center space-x-2'>
                <input
                  type='text'
                  value={feature}
                  onChange={e => {
                    const newFeatures = [...(formData.features || [])];
                    newFeatures[index] = e.target.value;
                    handleArrayChange('features', newFeatures);
                  }}
                  className='input flex-1'
                  placeholder={t('form.featureDescription')}
                />
                <button
                  type='button'
                  onClick={() => {
                    const newFeatures = (formData.features || []).filter(
                      (_, i) => i !== index
                    );
                    handleArrayChange('features', newFeatures);
                  }}
                  className='btn btn-outline btn-sm text-red-600'
                >
                  {t('form.remove')}
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() =>
                handleArrayChange('features', [
                  ...(formData.features || []),
                  '',
                ])
              }
              className='btn btn-outline btn-sm'
            >
              {t('form.addFeature')}
            </button>
          </div>
          {getFieldError('features') && (
            <p className='text-red-500 text-sm mt-1'>
              {getFieldError('features')}
            </p>
          )}
        </div>
      </div>

      {/* Social & Contact */}
      <div className='bg-white p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold mb-4'>
          {t('form.socialContact')}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.website')}
            </label>
            <input
              type='url'
              value={formData.social?.website || ''}
              onChange={e =>
                handleObjectChange('social', 'website', e.target.value)
              }
              className='input w-full'
              placeholder={t('form.websitePlaceholder')}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.instagram')}
            </label>
            <input
              type='url'
              value={formData.social?.instagram || ''}
              onChange={e =>
                handleObjectChange('social', 'instagram', e.target.value)
              }
              className='input w-full'
              placeholder={t('form.instagramPlaceholder')}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.facebook')}
            </label>
            <input
              type='url'
              value={formData.social?.facebook || ''}
              onChange={e =>
                handleObjectChange('social', 'facebook', e.target.value)
              }
              className='input w-full'
              placeholder={t('form.facebookPlaceholder')}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.linkedin')}
            </label>
            <input
              type='url'
              value={formData.social?.linkedin || ''}
              onChange={e =>
                handleObjectChange('social', 'linkedin', e.target.value)
              }
              className='input w-full'
              placeholder={t('form.linkedinPlaceholder')}
            />
          </div>
        </div>

        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.contactEmail')}
            </label>
            <input
              type='email'
              value={formData.contact?.email || ''}
              onChange={e =>
                handleObjectChange('contact', 'email', e.target.value)
              }
              className={`input w-full ${getFieldError('contact') ? 'border-red-500' : ''}`}
              placeholder={t('form.contactEmailPlaceholder')}
            />
            {getFieldError('contact') && (
              <p className='text-red-500 text-sm mt-1'>
                {getFieldError('contact')}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('form.contactPhone')}
            </label>
            <input
              type='tel'
              value={formData.contact?.phone || ''}
              onChange={e =>
                handleObjectChange('contact', 'phone', e.target.value)
              }
              className='input w-full'
              placeholder={t('form.contactPhonePlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className='bg-white p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold mb-4'>{t('form.tags')}</h2>
        <div className='space-y-2'>
          {formData.tags?.map((tag, index) => (
            <div key={index} className='flex items-center space-x-2'>
              <input
                type='text'
                value={tag}
                onChange={e => {
                  const newTags = [...(formData.tags || [])];
                  newTags[index] = e.target.value;
                  handleArrayChange('tags', newTags);
                }}
                className='input flex-1'
                placeholder={t('form.tagName')}
              />
              <button
                type='button'
                onClick={() => {
                  const newTags = (formData.tags || []).filter(
                    (_, i) => i !== index
                  );
                  handleArrayChange('tags', newTags);
                }}
                className='btn btn-outline btn-sm text-red-600'
              >
                {t('form.remove')}
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={() =>
              handleArrayChange('tags', [...(formData.tags || []), ''])
            }
            className='btn btn-outline btn-sm'
          >
            {t('form.addTag')}
          </button>
        </div>
        {getFieldError('tags') && (
          <p className='text-red-500 text-sm mt-1'>{getFieldError('tags')}</p>
        )}
      </div>

      {/* Settings */}
      <div className='bg-white p-6 rounded-lg border'>
        <h2 className='text-xl font-semibold mb-4'>{t('form.settings')}</h2>

        <div className='space-y-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isPublic'
              checked={formData.isPublic}
              onChange={e => handleInputChange('isPublic', e.target.checked)}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='isPublic'
              className='ml-2 block text-sm text-gray-900'
            >
              {t('form.makeEventPublic')}
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='featured'
              checked={formData.featured}
              onChange={e => handleInputChange('featured', e.target.checked)}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='featured'
              className='ml-2 block text-sm text-gray-900'
            >
              {t('form.featureEvent')}
            </label>
          </div>
        </div>
      </div>

      {/* Quality Score */}
      {qualityScore && (
        <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
          <h2 className='text-xl font-semibold mb-4'>
            {t('form.qualityScore')}
          </h2>
          <div className='flex items-center space-x-4'>
            <div className='text-3xl font-bold text-blue-600'>
              {qualityScore.percentage}%
            </div>
            <div className='flex-1'>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${qualityScore.percentage}%` }}
                ></div>
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                {qualityScore.score.toFixed(1)} /{' '}
                {qualityScore.maxScore.toFixed(1)} points
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className='flex justify-end space-x-4'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='btn btn-outline'
            disabled={loading}
          >
            {t('form.cancel')}
          </button>
        )}
        <button
          type='submit'
          className='btn btn-primary'
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading
            ? t('form.saving')
            : mode === 'create'
              ? t('form.createEvent')
              : t('form.updateEvent')}
        </button>
      </div>
    </form>
  );
}
