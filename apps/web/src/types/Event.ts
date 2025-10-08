// Standardized Event Information Model
// This file defines the complete event data structure used across the application

export interface EventMetadata {
  // Basic Information
  productName?: string | null;
  heroImageUrl?: string | null;
  longDescription?: string | null;
  valueProposition?: string | null;

  // Media & Content
  images?: string[];
  videoUrl?: string | null;
  pressKitUrl?: string | null;

  // Features & Activities
  features?: string[];
  awards?: string[];
  schedule?: Array<{
    title: string;
    startsAt: string;
    endsAt?: string;
  }>;

  // Social & Contact
  social?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  } | null;

  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    telegram?: string;
    website?: string;
  } | null;

  // QR & Additional
  qrUrl?: string | null;
}

export interface EventVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  website?: string;
}

export interface EventOwner {
  id: string;
  name: string;
  email: string;
  businessName?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export interface EventShow {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  youtubeUrl?: string;
}

export interface EventNearbyPlace {
  id: string;
  name: string;
  address: string;
  category: string;
  distance?: number;
  website?: string;
}

export interface EventWaitlistCount {
  waitlist: number;
}

// Main Event Interface
export interface Event {
  // Core Fields (Required)
  id: string;
  title: string;
  slug: string;
  startDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_REVIEW';

  // Basic Information (Optional but recommended)
  description?: string | null;
  shortDescription?: string | null;
  endDate?: string | null;
  capacity?: number | null;
  currentWaitlist?: number;

  // Media & Content
  youtubeUrl?: string | null;
  metadata?: EventMetadata | null;

  // Location & Mapping
  mapLat?: number | null;
  mapLng?: number | null;
  mapZoom?: number | null;
  mapAddress?: string | null;
  // New user-friendly location fields
  streetAddress?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;

  // Visibility & Organization
  isPublic: boolean;
  featured: boolean;
  tags: string[];

  // Relations
  ownerId: string;
  venueId?: string | null;
  categoryId?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Related Objects (when included)
  owner?: EventOwner;
  venue?: EventVenue;
  category?: EventCategory;
  shows?: EventShow[];
  nearbyPlaces?: EventNearbyPlace[];
  _count?: EventWaitlistCount;
}

// Event Display Components
export interface EventCardData {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  startDate: string;
  endDate?: string | null;
  heroImageUrl?: string | null;
  venue?: {
    name: string;
    city: string;
    country: string;
  };
  category?: {
    name: string;
    color: string;
    icon: string;
  };
  owner?: {
    name: string;
    businessName?: string;
  };
  featured: boolean;
  tags: string[];
  _count?: {
    waitlist: number;
  };
}

export interface EventListData {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string;
  endDate?: string | null;
  capacity?: number | null;
  currentWaitlist?: number;
  venue?: {
    name: string;
    city: string;
  };
  owner?: {
    name: string;
  };
  category?: {
    name: string;
    color: string;
  };
  featured: boolean;
  tags: string[];
  createdAt: string;
  _count?: {
    waitlist: number;
  };
}

// Event Form Data (for creation/editing)
export interface EventFormData {
  // Required fields
  title: string;
  startDate: string;

  // Optional fields
  description?: string;
  shortDescription?: string;
  endDate?: string;
  capacity?: number;
  venueId?: string;
  categoryId?: string;
  isPublic?: boolean;
  featured?: boolean;
  tags?: string[];

  // Location fields
  streetAddress?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  // Metadata fields
  productName?: string;
  heroImageUrl?: string;
  longDescription?: string;
  valueProposition?: string;
  features?: string[];
  awards?: string[];
  social?: EventMetadata['social'];
  contact?: EventMetadata['contact'];
  videoUrl?: string;
  pressKitUrl?: string;
  schedule?: EventMetadata['schedule'];
}

// Event Validation Rules
export const EVENT_VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    maxLength: 2000,
  },
  shortDescription: {
    maxLength: 200,
  },
  capacity: {
    min: 1,
    max: 10000,
  },
  tags: {
    maxItems: 10,
    maxLength: 30,
  },
  features: {
    maxItems: 20,
    maxLength: 100,
  },
} as const;

// Event Display Helpers
export const getEventDisplayData = (event: Event): EventCardData => ({
  id: event.id,
  title: event.title,
  slug: event.slug,
  shortDescription: event.shortDescription,
  startDate: event.startDate,
  endDate: event.endDate,
  heroImageUrl: event.metadata?.heroImageUrl || null,
  venue: event.venue
    ? {
        name: event.venue.name,
        city: event.venue.city,
        country: event.venue.country,
      }
    : undefined,
  category: event.category
    ? {
        name: event.category.name,
        color: event.category.color,
        icon: event.category.icon,
      }
    : undefined,
  owner: event.owner
    ? {
        name: event.owner.name,
        businessName: event.owner.businessName,
      }
    : undefined,
  featured: event.featured,
  tags: event.tags,
  _count: event._count,
});

export const getEventListData = (event: Event): EventListData => ({
  id: event.id,
  title: event.title,
  slug: event.slug,
  status: event.status,
  startDate: event.startDate,
  endDate: event.endDate,
  capacity: event.capacity,
  currentWaitlist: event.currentWaitlist,
  venue: event.venue
    ? {
        name: event.venue.name,
        city: event.venue.city,
      }
    : undefined,
  owner: event.owner
    ? {
        name: event.owner.name,
      }
    : undefined,
  category: event.category
    ? {
        name: event.category.name,
        color: event.category.color,
      }
    : undefined,
  featured: event.featured,
  tags: event.tags,
  createdAt: event.createdAt,
  _count: event._count,
});

// Event Validation Functions
export const validateEvent = (event: EventFormData): string[] => {
  const errors: string[] = [];

  if (
    !event.title ||
    event.title.length < EVENT_VALIDATION_RULES.title.minLength
  ) {
    errors.push(
      `Title must be at least ${EVENT_VALIDATION_RULES.title.minLength} characters`
    );
  }

  if (
    event.title &&
    event.title.length > EVENT_VALIDATION_RULES.title.maxLength
  ) {
    errors.push(
      `Title must be no more than ${EVENT_VALIDATION_RULES.title.maxLength} characters`
    );
  }

  if (
    event.description &&
    event.description.length > EVENT_VALIDATION_RULES.description.maxLength
  ) {
    errors.push(
      `Description must be no more than ${EVENT_VALIDATION_RULES.description.maxLength} characters`
    );
  }

  if (
    event.shortDescription &&
    event.shortDescription.length >
      EVENT_VALIDATION_RULES.shortDescription.maxLength
  ) {
    errors.push(
      `Short description must be no more than ${EVENT_VALIDATION_RULES.shortDescription.maxLength} characters`
    );
  }

  if (
    event.capacity &&
    (event.capacity < EVENT_VALIDATION_RULES.capacity.min ||
      event.capacity > EVENT_VALIDATION_RULES.capacity.max)
  ) {
    errors.push(
      `Capacity must be between ${EVENT_VALIDATION_RULES.capacity.min} and ${EVENT_VALIDATION_RULES.capacity.max}`
    );
  }

  if (event.tags && event.tags.length > EVENT_VALIDATION_RULES.tags.maxItems) {
    errors.push(`Maximum ${EVENT_VALIDATION_RULES.tags.maxItems} tags allowed`);
  }

  if (
    event.features &&
    event.features.length > EVENT_VALIDATION_RULES.features.maxItems
  ) {
    errors.push(
      `Maximum ${EVENT_VALIDATION_RULES.features.maxItems} features allowed`
    );
  }

  return errors;
};

// Event Fallback Data
export const getEventFallbacks = (event: Event): Partial<Event> => ({
  description: event.description || 'No description available',
  shortDescription: event.shortDescription || 'Join us for this exciting event',
  metadata: {
    ...event.metadata,
    heroImageUrl:
      event.metadata?.heroImageUrl || '/images/event-placeholder.jpg',
  },
  venue: event.venue || {
    id: 'default',
    name: 'TBA',
    address: 'Location to be announced',
    city: 'Milano',
    country: 'Italy',
  },
  category: event.category || {
    id: 'default',
    name: 'General',
    slug: 'general',
    color: '#c4b69e',
    icon: 'Event',
  },
  owner: event.owner || {
    id: 'unknown',
    name: 'Event Organizer',
    email: 'organizer@example.com',
  },
  tags: event.tags.length > 0 ? event.tags : ['event'],
  featured: event.featured || false,
});
