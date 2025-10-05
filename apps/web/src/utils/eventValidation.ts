import { Event, EventFormData, validateEvent, EVENT_VALIDATION_RULES } from '../types/Event'

// Enhanced validation for event forms
export const validateEventForm = (formData: EventFormData, t?: (key: string, params?: Record<string, unknown>) => string): {
  isValid: boolean
  errors: Record<string, string[]>
  warnings: Record<string, string[]>
} => {
  const errors: Record<string, string[]> = {}
  const warnings: Record<string, string[]> = {}
  
  // Basic validation
  const basicErrors = validateEvent(formData)
  if (basicErrors.length > 0) {
    errors.general = basicErrors
  }
  
  // Title validation
  if (!formData.title) {
    errors.title = [t ? t('validation.titleRequired') : 'Title is required']
  } else if (formData.title.length < EVENT_VALIDATION_RULES.title.minLength) {
    errors.title = [t ? t('validation.titleMinLength', { min: EVENT_VALIDATION_RULES.title.minLength }) : `Title must be at least ${EVENT_VALIDATION_RULES.title.minLength} characters`]
  } else if (formData.title.length > EVENT_VALIDATION_RULES.title.maxLength) {
    errors.title = [t ? t('validation.titleMaxLength', { max: EVENT_VALIDATION_RULES.title.maxLength }) : `Title must be no more than ${EVENT_VALIDATION_RULES.title.maxLength} characters`]
  }
  
  // Start date validation
  if (!formData.startDate) {
    errors.startDate = [t ? t('validation.startDateRequired') : 'Start date is required']
  } else {
    const startDate = new Date(formData.startDate)
    const now = new Date()
    if (startDate < now) {
      warnings.startDate = [t ? t('validation.startDatePast') : 'Start date is in the past']
    }
  }
  
  // End date validation
  if (formData.endDate) {
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    if (endDate <= startDate) {
      errors.endDate = [t ? t('validation.endDateAfterStart') : 'End date must be after start date']
    }
  }
  
  // Capacity validation
  if (formData.capacity !== undefined) {
    if (formData.capacity < EVENT_VALIDATION_RULES.capacity.min) {
      errors.capacity = [t ? t('validation.capacityMin', { min: EVENT_VALIDATION_RULES.capacity.min }) : `Capacity must be at least ${EVENT_VALIDATION_RULES.capacity.min}`]
    } else if (formData.capacity > EVENT_VALIDATION_RULES.capacity.max) {
      errors.capacity = [t ? t('validation.capacityMax', { max: EVENT_VALIDATION_RULES.capacity.max }) : `Capacity must be no more than ${EVENT_VALIDATION_RULES.capacity.max}`]
    }
  }
  
  // Description validation
  if (formData.description && formData.description.length > EVENT_VALIDATION_RULES.description.maxLength) {
    errors.description = [t ? t('validation.descriptionMaxLength', { max: EVENT_VALIDATION_RULES.description.maxLength }) : `Description must be no more than ${EVENT_VALIDATION_RULES.description.maxLength} characters`]
  }
  
  // Short description validation
  if (formData.shortDescription && formData.shortDescription.length > EVENT_VALIDATION_RULES.shortDescription.maxLength) {
    errors.shortDescription = [t ? t('validation.shortDescriptionMaxLength', { max: EVENT_VALIDATION_RULES.shortDescription.maxLength }) : `Short description must be no more than ${EVENT_VALIDATION_RULES.shortDescription.maxLength} characters`]
  }
  
  // Tags validation
  if (formData.tags && formData.tags.length > EVENT_VALIDATION_RULES.tags.maxItems) {
    errors.tags = [t ? t('validation.tagsMaxItems', { max: EVENT_VALIDATION_RULES.tags.maxItems }) : `Maximum ${EVENT_VALIDATION_RULES.tags.maxItems} tags allowed`]
  }
  
  if (formData.tags) {
    const invalidTags = formData.tags.filter(tag => tag.length > EVENT_VALIDATION_RULES.tags.maxLength)
    if (invalidTags.length > 0) {
      errors.tags = [...(errors.tags || []), t ? t('validation.tagsMaxLength', { max: EVENT_VALIDATION_RULES.tags.maxLength }) : `Tags must be no more than ${EVENT_VALIDATION_RULES.tags.maxLength} characters each`]
    }
  }
  
  // Features validation
  if (formData.features && formData.features.length > EVENT_VALIDATION_RULES.features.maxItems) {
    errors.features = [t ? t('validation.featuresMaxItems', { max: EVENT_VALIDATION_RULES.features.maxItems }) : `Maximum ${EVENT_VALIDATION_RULES.features.maxItems} features allowed`]
  }
  
  if (formData.features) {
    const invalidFeatures = formData.features.filter(feature => feature.length > EVENT_VALIDATION_RULES.features.maxLength)
    if (invalidFeatures.length > 0) {
      errors.features = [...(errors.features || []), t ? t('validation.featuresMaxLength', { max: EVENT_VALIDATION_RULES.features.maxLength }) : `Features must be no more than ${EVENT_VALIDATION_RULES.features.maxLength} characters each`]
    }
  }
  
  // Social links validation
  if (formData.social) {
    const socialErrors: string[] = []
    const urlPattern = /^https?:\/\/.+\..+/
    
    Object.entries(formData.social).forEach(([platform, url]) => {
      if (url && !urlPattern.test(url)) {
        socialErrors.push(t ? t('validation.socialUrlInvalid', { platform }) : `${platform} URL is invalid`)
      }
    })
    
    if (socialErrors.length > 0) {
      errors.social = socialErrors
    }
  }
  
  // Contact validation
  if (formData.contact) {
    const contactErrors: string[] = []
    
    if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      contactErrors.push(t ? t('validation.emailInvalid') : 'Email is invalid')
    }
    
    if (formData.contact.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.contact.phone.replace(/[\s\-()]/g, ''))) {
      contactErrors.push(t ? t('validation.phoneInvalid') : 'Phone number is invalid')
    }
    
    if (contactErrors.length > 0) {
      errors.contact = contactErrors
    }
  }
  
  // Schedule validation
  if (formData.schedule) {
    const scheduleErrors: string[] = []
    
    formData.schedule.forEach((item, index) => {
      if (!item.title) {
        scheduleErrors.push(t ? t('validation.scheduleTitleRequired', { index: index + 1 }) : `Schedule item ${index + 1} title is required`)
      }
      if (!item.startsAt) {
        scheduleErrors.push(t ? t('validation.scheduleStartRequired', { index: index + 1 }) : `Schedule item ${index + 1} start time is required`)
      }
      if (item.endsAt && item.startsAt) {
        const start = new Date(item.startsAt)
        const end = new Date(item.endsAt)
        if (end <= start) {
          scheduleErrors.push(t ? t('validation.scheduleEndAfterStart', { index: index + 1 }) : `Schedule item ${index + 1} end time must be after start time`)
        }
      }
    })
    
    if (scheduleErrors.length > 0) {
      errors.schedule = scheduleErrors
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}

// Sanitize event form data
export const sanitizeEventForm = (formData: EventFormData): EventFormData => {
  return {
    ...formData,
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || undefined,
    shortDescription: formData.shortDescription?.trim() || undefined,
    tags: formData.tags?.map(tag => tag.trim()).filter(tag => tag.length > 0) || [],
    features: formData.features?.map(feature => feature.trim()).filter(feature => feature.length > 0) || [],
    social: formData.social ? Object.fromEntries(
      Object.entries(formData.social).map(([key, value]) => [key, value?.trim() || ''])
    ) : undefined,
    contact: formData.contact ? {
      email: formData.contact.email?.trim() || undefined,
      phone: formData.contact.phone?.trim() || undefined,
      whatsapp: formData.contact.whatsapp?.trim() || undefined,
      telegram: formData.contact.telegram?.trim() || undefined,
      website: formData.contact.website?.trim() || undefined
    } : undefined
  }
}

// Validate event completeness for publication
export const validateEventForPublication = (event: Event, t?: (key: string) => string): {
  isReady: boolean
  missingFields: string[]
  recommendations: string[]
} => {
  const missingFields: string[] = []
  const recommendations: string[] = []
  
  // Required fields
  if (!event.title) missingFields.push(t ? t('validation.missingTitle') : 'Title')
  if (!event.startDate) missingFields.push(t ? t('validation.missingStartDate') : 'Start date')
  if (!event.description) missingFields.push(t ? t('validation.missingDescription') : 'Description')
  if (!event.venue) missingFields.push(t ? t('validation.missingVenue') : 'Venue')
  if (!event.category) missingFields.push(t ? t('validation.missingCategory') : 'Category')
  
  // Recommended fields
  if (!event.shortDescription) recommendations.push(t ? t('validation.recommendShortDescription') : 'Add a short description for better display')
  if (!event.metadata?.heroImageUrl) recommendations.push(t ? t('validation.recommendHeroImage') : 'Add a hero image to make the event more attractive')
  if (!event.metadata?.social) recommendations.push(t ? t('validation.recommendSocial') : 'Add social media links to increase visibility')
  if (!event.metadata?.contact) recommendations.push(t ? t('validation.recommendContact') : 'Add contact information for attendees')
  if (!event.tags || event.tags.length === 0) recommendations.push(t ? t('validation.recommendTags') : 'Add tags to help people find your event')
  if (!event.capacity) recommendations.push(t ? t('validation.recommendCapacity') : 'Set a capacity limit to manage attendance')
  
  return {
    isReady: missingFields.length === 0,
    missingFields,
    recommendations
  }
}

// Get event quality score
export const getEventQualityScore = (event: Event): {
  score: number
  maxScore: number
  percentage: number
  breakdown: Record<string, { score: number; maxScore: number; weight: number }>
} => {
  const breakdown: Record<string, { score: number; maxScore: number; weight: number }> = {
    basicInfo: { score: 0, maxScore: 4, weight: 0.3 },
    media: { score: 0, maxScore: 3, weight: 0.2 },
    social: { score: 0, maxScore: 2, weight: 0.15 },
    engagement: { score: 0, maxScore: 2, weight: 0.15 },
    organization: { score: 0, maxScore: 2, weight: 0.2 }
  }
  
  // Basic info (30% weight)
  if (event.title) breakdown.basicInfo.score += 1
  if (event.description) breakdown.basicInfo.score += 1
  if (event.shortDescription) breakdown.basicInfo.score += 1
  if (event.venue) breakdown.basicInfo.score += 1
  
  // Media (20% weight)
  if (event.metadata?.heroImageUrl) breakdown.media.score += 1
  if (event.metadata?.videoUrl) breakdown.media.score += 1
  if (event.youtubeUrl) breakdown.media.score += 1
  
  // Social (15% weight)
  if (event.metadata?.social?.website) breakdown.social.score += 1
  if (event.metadata?.social?.instagram || event.metadata?.social?.facebook) breakdown.social.score += 1
  
  // Engagement (15% weight)
  if (event.metadata?.contact) breakdown.engagement.score += 1
  if (event.tags && event.tags.length > 0) breakdown.engagement.score += 1
  
  // Organization (20% weight)
  if (event.category) breakdown.organization.score += 1
  if (event.capacity) breakdown.organization.score += 1
  
  // Calculate weighted score
  let totalScore = 0
  let maxScore = 0
  
  Object.values(breakdown).forEach(category => {
    totalScore += (category.score / category.maxScore) * category.weight
    maxScore += category.weight
  })
  
  return {
    score: totalScore,
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    breakdown
  }
}
