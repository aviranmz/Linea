import React, { useState, useEffect, ReactNode } from 'react';
import { LanguageContext } from './LanguageContext';

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.events': 'Events',
    'nav.designers': 'Designers',
    'nav.favorites': 'Favorites',
    'nav.salone': 'Salone del Mobile',
    'nav.owner': 'Owner Portal',
    'nav.admin': 'Admin',
    'nav.signOut': 'Sign Out',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.welcome': 'Welcome to',
    'common.welcomeBack': 'Welcome back',
    'common.heroSubtitle':
      'Your gateway to Milano Design Week and exclusive design events. Discover extraordinary experiences, connect with designers, and explore the future of design through our innovative platform.',
    'common.heroFeatures':
      'Email-only access • Curated events • Nearby discoveries',
    'common.discoverEvents': 'Discover Design Events',
    'common.joinAsDesigner': 'Join as Designer',
    'common.discoverEventsTitle': 'Discover Events',
    'common.discoverEventsSubtitle':
      'Find amazing design events happening around you',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.status': 'Status',
    'common.searchPlaceholder': 'Search events, designers, venues...',
    'common.category': 'Category',
    'common.area': 'Area',
    'common.designDistrict': 'Design District',
    'common.product': 'Product',
    'common.productSpecialty': 'Product Specialty',
    'common.dateFrom': 'From Date',
    'common.dateTo': 'To Date',
    'common.city': 'City',
    'common.owner': 'Owner',
    'common.designerOrganizer': 'Designer/Organizer',
    'common.searchByDesigner': 'Search by designer or business name...',
    'common.showing': 'Showing',
    'common.of': 'of',
    'common.events': 'events',
    'common.readyToCreate': 'Ready to create your event?',
    'common.startBuilding': 'Start building your community today.',
    'owner.manageEvents': 'Manage your events and track waitlist performance',
    'owner.createNewEvent': 'Create New Event',
    'owner.businessProfile': 'Business Profile',
    'owner.customizeTheme': 'Customize Theme',
    'owner.yourEvents': 'Your Events',
    'owner.manageEventPerformance': 'Manage and track your event performance',
    'owner.totalEvents': 'Total Events',
    'owner.filterEvents': 'Filter Events',
    'owner.searchEvents': 'Search events...',
    'owner.allStatus': 'All Status',
    'owner.allEvents': 'All Events',
    'owner.featuredOnly': 'Featured Only',
    'owner.nonFeatured': 'Non-Featured',
    'owner.fromDate': 'From Date',
    'owner.toDate': 'To Date',
    'owner.clearFilters': 'Clear Filters',
    'owner.showing': 'Showing',
    'owner.of': 'of',
    'owner.events': 'events',

    // Admin Users
    'admin.users.title': 'Admin • All Users',
    'admin.users.subtitle': 'Manage all users and their event registrations',
    'admin.users.searchPlaceholder': 'Search email or name',
    'admin.users.allRoles': 'All Roles',
    'admin.users.visitors': 'Visitors',
    'admin.users.owners': 'Owners',
    'admin.users.admins': 'Admins',
    'admin.users.allStatus': 'All Status',
    'admin.users.active': 'Active',
    'admin.users.inactive': 'Inactive',
    'admin.users.exportCsv': 'Export CSV',
    'admin.users.loadingUsers': 'Loading users...',
    'admin.users.noUsersFound': 'No users found',
    'admin.users.noUsersDescription':
      'Try adjusting your search or filter criteria',
    'admin.users.user': 'User',
    'admin.users.role': 'Role',
    'admin.users.status': 'Status',
    'admin.users.eventActivity': 'Event Activity',
    'admin.users.lastLogin': 'Last Login',
    'admin.users.actions': 'Actions',
    'admin.users.joined': 'Joined',
    'admin.users.events': 'Events',
    'admin.users.waitlist': 'Waitlist',
    'admin.users.owned': 'Owned',
    'admin.users.never': 'Never',
    'admin.users.deactivate': 'Deactivate',
    'admin.users.activate': 'Activate',
    'admin.users.previous': 'Previous',
    'admin.users.next': 'Next',
    'admin.users.showing': 'Showing',
    'admin.users.to': 'to',
    'admin.users.of': 'of',
    'admin.users.results': 'results',
    'admin.users.accessDenied': 'Access Denied',
    'admin.users.accessDeniedDescription':
      "You don't have permission to access the admin user management.",
    'admin.users.goToHome': 'Go to Home',

    // Admin Events
    'admin.events.title': 'Admin • Events',
    'admin.events.subtitle': 'Review and moderate events',
    'admin.events.searchPlaceholder': 'Search title or description',
    'admin.events.all': 'All',
    'admin.events.draft': 'Draft',
    'admin.events.published': 'Published',
    'admin.events.cancelled': 'Cancelled',
    'admin.events.completed': 'Completed',
    'admin.events.exportCsv': 'Export CSV',
    'admin.events.loading': 'Loading...',
    'admin.events.forbidden': 'Forbidden: Admins only.',
    'admin.events.approve': 'Approve',
    'admin.events.reject': 'Reject',
    'admin.events.reasonForRejection': 'Reason for rejection (optional)',
    'admin.events.event': 'Event',
    'admin.events.owner': 'Owner',
    'admin.events.waitlist': 'Waitlist',
    'admin.events.status': 'Status',
    'admin.events.noEventsFound': 'No events found.',
    'admin.events.previous': 'Previous',
    'admin.events.next': 'Next',
    'admin.events.page': 'Page',
    'admin.events.of': 'of',

    // Cookie Banner
    'cookie.message':
      'We use necessary cookies for core functionality. Optional analytics cookies help us improve the product. We currently collect only your email from anonymous users. See our',
    'cookie.privacyPolicy': 'Privacy Policy',
    'cookie.decline': 'Decline',
    'cookie.acceptAll': 'Accept all',

    // Confirmation Dialogs
    'confirm.deleteEvent': 'Delete this event?',
    'confirm.deletePhoto': 'Are you sure you want to delete this photo?',
    'confirm.deleteProduct': 'Are you sure you want to delete this product?',
    'confirm.deleteArea': 'Are you sure you want to delete this area?',
    'confirm.deleteCategory': 'Are you sure you want to delete this category?',
    'common.allCategories': 'All Categories',
    'common.allAreas': 'All Areas',
    'common.allProducts': 'All Products',
    'common.anyTime': 'Any Time',
    'common.timeOfDay': 'Time of Day',
    'common.morning': 'Morning (6AM-12PM)',
    'common.afternoon': 'Afternoon (12PM-6PM)',
    'common.evening': 'Evening (6PM-10PM)',
    'common.night': 'Night (10PM-6AM)',
    'common.featured': 'Featured',
    'common.allEvents': 'All Events',
    'common.regularEvents': 'Regular Events',
    'common.featuredEvents': 'Featured Events',
    'common.featuredOnly': 'Featured Only',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.filterEvents': 'Filter Events',
    'common.filtersActive': 'filters active',
    'common.filterActive': 'filter active',
    'common.details': 'Details',
    'common.more': 'More',
    'common.less': 'Less',

    // Events
    'events.title': 'Events',
    'events.upcoming': 'Upcoming Events',
    'events.featured': 'Featured Events',
    'events.nearby': 'Nearby Events',
    'events.noEvents': 'No events found',
    'events.joinWaitlist': 'Join Waitlist',
    'events.onWaitlist': 'On Waitlist',
    'events.capacity': 'Capacity',
    'events.attendees': 'Attendees',
    'events.date': 'Date',
    'events.time': 'Time',
    'events.location': 'Location',
    'events.organizer': 'Organizer',
    'events.description': 'Description',
    'events.tags': 'Tags',
    'events.share': 'Share',
    'events.favorite': 'Add to Favorites',
    'events.unfavorite': 'Remove from Favorites',

    // Designers
    'designers.title': 'Designers',
    'designers.all': 'All Designers',
    'designers.featured': 'Featured Designers',
    'designers.noDesigners': 'No designers found',
    'designers.follow': 'Follow',
    'designers.unfollow': 'Unfollow',
    'designers.following': 'Following',
    'designers.followers': 'Followers',
    'designers.events': 'Events',
    'designers.contact': 'Contact',
    'designers.website': 'Website',
    'designers.social': 'Social Media',

    // Favorites
    'favorites.title': 'Your Favorites',
    'favorites.noFavorites':
      "You haven't favorited any events yet. Start exploring!",
    'favorites.remove': 'Remove from Favorites',

    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.businessName': 'Business Name',
    'profile.businessIntro': 'Business Introduction',
    'profile.website': 'Website',
    'profile.address': 'Address',
    'profile.city': 'City',
    'profile.country': 'Country',
    'profile.social': 'Social Media',
    'profile.uploadPhoto': 'Upload Photo',
    'profile.changePhoto': 'Change Photo',

    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.requestMagicLink': 'Request Magic Link',
    'auth.magicLinkSent': 'Magic link sent to your email',
    'auth.checkEmail': 'Check your email for the magic link',
    'auth.invalidToken': 'Invalid or expired token',
    'auth.loginSuccess': 'Login successful',
    'auth.logoutSuccess': 'Logout successful',

    // Forms
    'form.required': 'This field is required',
    'form.invalidEmail': 'Invalid email format',
    'form.passwordTooShort': 'Password must be at least 8 characters',
    'form.passwordsDoNotMatch': 'Passwords do not match',
    'form.submit': 'Submit',
    'form.reset': 'Reset',
    'form.validating': 'Validating...',
    'form.submitting': 'Submitting...',

    // Validation Messages
    'validation.titleRequired': 'Title is required',
    'validation.titleMinLength': 'Title must be at least {min} characters',
    'validation.titleMaxLength': 'Title must be no more than {max} characters',
    'validation.startDateRequired': 'Start date is required',
    'validation.startDatePast': 'Start date is in the past',
    'validation.endDateAfterStart': 'End date must be after start date',
    'validation.capacityMin': 'Capacity must be at least {min}',
    'validation.capacityMax': 'Capacity must be no more than {max}',
    'validation.descriptionMaxLength':
      'Description must be no more than {max} characters',
    'validation.shortDescriptionMaxLength':
      'Short description must be no more than {max} characters',
    'validation.tagsMaxItems': 'Maximum {max} tags allowed',
    'validation.tagsMaxLength':
      'Tags must be no more than {max} characters each',
    'validation.featuresMaxItems': 'Maximum {max} features allowed',
    'validation.featuresMaxLength':
      'Features must be no more than {max} characters each',
    'validation.socialUrlInvalid': '{platform} URL is invalid',
    'validation.emailInvalid': 'Email is invalid',
    'validation.phoneInvalid': 'Phone number is invalid',
    'validation.scheduleTitleRequired':
      'Schedule item {index} title is required',
    'validation.scheduleStartRequired':
      'Schedule item {index} start time is required',
    'validation.scheduleEndAfterStart':
      'Schedule item {index} end time must be after start time',

    // Publication Validation
    'validation.missingTitle': 'Title',
    'validation.missingStartDate': 'Start date',
    'validation.missingDescription': 'Description',
    'validation.missingVenue': 'Venue',
    'validation.missingCategory': 'Category',
    'validation.recommendShortDescription':
      'Add a short description for better display',
    'validation.recommendHeroImage':
      'Add a hero image to make the event more attractive',
    'validation.recommendSocial':
      'Add social media links to increase visibility',
    'validation.recommendContact': 'Add contact information for attendees',
    'validation.recommendTags': 'Add tags to help people find your event',
    'validation.recommendCapacity': 'Set a capacity limit to manage attendance',

    // Errors
    'error.generic': 'Something went wrong. Please try again.',
    'error.network': 'Network error. Please check your connection.',
    'error.unauthorized': 'You are not authorized to perform this action.',
    'error.notFound': 'The requested resource was not found.',
    'error.serverError': 'Server error. Please try again later.',
    'error.validation': 'Please check your input and try again.',

    // Success messages
    'success.saved': 'Changes saved successfully',
    'success.deleted': 'Item deleted successfully',
    'success.created': 'Item created successfully',
    'success.updated': 'Item updated successfully',
    'success.followed': 'You are now following this user',
    'success.unfollowed': 'You are no longer following this user',
    'success.favorited': 'Added to favorites',
    'success.unfavorited': 'Removed from favorites',

    // API Messages
    'api.magicLinkSent':
      'Magic link sent if the email exists. Check your inbox.',
    'api.loadingWaitlist': 'Loading waitlist...',
    'api.noWaitlistEntries': 'No waitlist entries',
    'api.noWaitlistEntriesDescription':
      'No one has joined the waitlist for this event yet.',
    'api.stayInLoop': 'Stay in the loop',
    'api.stayInLoopDescription':
      'Enter your email to get quick access to waitlists and event updates.',
    'api.notNow': 'Not now',
    'api.continue': 'Continue',
    'api.refreshPage': 'Refresh Page',
    'api.somethingWentWrong': 'Something went wrong',
    'api.somethingWentWrongDescription':
      "We're sorry, but something unexpected happened. Please try refreshing the page.",
    'api.errorDetails': 'Error Details',

    // Photo Gallery
    'gallery.editPhoto': 'Edit photo',
    'gallery.deletePhoto': 'Delete photo',
    'gallery.photoTitle': 'Photo title',
    'gallery.photoDescription': 'Photo description',
    'gallery.altText': 'Alternative text for accessibility',

    // Owner Profile Placeholders
    'owner.businessNamePlaceholder': 'Studio Nova Cucine',
    'owner.businessIntroPlaceholder':
      'Tell visitors about your design philosophy, specialties, and what makes your work unique...',
    'owner.contactNamePlaceholder': 'Luca Bianchi',
    'owner.contactEmailPlaceholder': 'luca@studionovacucine.it',
    'owner.contactPhonePlaceholder': '+39 02 1234 5678',
    'owner.websitePlaceholder': 'https://studionovacucine.it',
    'owner.facebookPlaceholder': 'https://facebook.com/yourpage',
    'owner.instagramPlaceholder': 'https://instagram.com/yourhandle',
    'owner.cityPlaceholder': 'Milano',
    'owner.addressPlaceholder': 'Via Brera 15, 20121 Milano',

    // Language
    'language.english': 'English',
    'language.italian': 'Italiano',
    'language.select': 'Select Language',
    'language.current': 'Current Language',

    // Event Page
    'event.notFound': 'Event Not Found',
    'event.notFoundDescription': "The event you're looking for doesn't exist.",
    'event.ends': 'Ends',
    'event.capacity': 'Capacity',
    'event.product': 'Product',
    'event.aboutEvent': 'About This Event',
    'event.features': 'Features',
    'event.awards': 'Awards',
    'event.video': 'Event Video',
    'event.pressSocial': 'Press & Social',
    'event.downloadPressKit': 'Download Press Kit',
    'event.contact': 'Contact',
    'event.email': 'Email',
    'event.phone': 'Phone',
    'event.whatsapp': 'WhatsApp',
    'event.telegram': 'Telegram',
    'event.open': 'Open',
    'event.joinWaitlist': 'Join the Waitlist',
    'event.joinWaitlistDescription':
      "Enter your email to join the waitlist for this event. You'll be notified when spots become available.",
    'event.enterEmail': 'Enter your email address',
    'event.joining': 'Joining...',
    'event.successfullyJoined': 'Successfully joined the waitlist!',
    'event.notifyWhenAvailable':
      "We'll notify you when spots become available.",
    'event.venue': 'Venue',
    'event.viewOnGoogleMaps': 'View on Google Maps',
    'event.shows': 'Shows',
    'event.nearbyPlaces': 'Nearby Places',
    'event.away': 'away',

    // Admin Portal
    'admin.login': 'Admin Login',
    'admin.loginDescription':
      'Enter your email to receive a one-time magic link.',
    'admin.sendMagicLink': 'Send magic link',
    'admin.portal': 'Admin Portal',
    'admin.portalDescription':
      'Platform administration and analytics dashboard',
    'admin.totalUsers': 'Total Users',
    'admin.totalEvents': 'Total Events',
    'admin.totalWaitlist': 'Total Waitlist',
    'admin.activeEvents': 'Active Events',
    'admin.recentActivity': 'Recent Activity',
    'admin.newEventCreated': 'New event created:',
    'admin.newUserRegistered': 'New user registered:',
    'admin.waitlistEntryAdded': 'Waitlist entry added to',
    'admin.hoursAgo': 'hours ago',
    'admin.systemHealth': 'System Health',
    'admin.apiStatus': 'API Status',
    'admin.database': 'Database',
    'admin.redisCache': 'Redis Cache',
    'admin.emailService': 'Email Service',
    'admin.healthy': 'Healthy',
    'admin.connected': 'Connected',
    'admin.notConfigured': 'Not Configured',
    'admin.quickActions': 'Quick Actions',
    'admin.manageOwners': 'Manage Owners',
    'admin.reviewEvents': 'Review Events',
    'admin.manageCategories': 'Manage Categories',
    'admin.manageAreas': 'Manage Areas',
    'admin.manageProducts': 'Manage Products',
    'admin.systemSettings': 'System Settings',

    // Owner Portal
    'owner.login': 'Owner Login',
    'owner.loginDescription':
      'Enter your email to receive a one-time magic link.',
    'owner.sendMagicLink': 'Send magic link',
    'owner.portal': 'Owner Portal',
    'owner.portalDescription': 'Manage your events and waitlist',
    'owner.myEvents': 'My Events',
    'owner.createEvent': 'Create Event',
    'owner.editEvent': 'Edit Event',
    'owner.deleteEvent': 'Delete Event',
    'owner.eventTitle': 'Event Title',
    'owner.eventDescription': 'Event Description',
    'owner.shortDescription': 'Short Description',
    'owner.startDate': 'Start Date',
    'owner.capacity': 'Capacity',
    'owner.featured': 'Featured',
    'owner.status': 'Status',
    'owner.actions': 'Actions',

    // Favorites Page
    'favorites.errorLoading': 'Error Loading Favorites',
    'favorites.tryAgain': 'Try Again',
    'favorites.noFavoritesYet': 'No Favorites Yet',
    'favorites.startExploring':
      'Start exploring events and add them to your favorites to see them here.',
    'favorites.exploreEvents': 'Explore Events',
    'favorites.myFavorites': 'My Favorites',
    'favorites.eventsSaved': 'events saved',
    'favorites.eventSaved': 'event saved',
    'favorites.viewDetails': 'View Details',
    'favorites.previous': 'Previous',
    'favorites.next': 'Next',
    'favorites.page': 'Page',
    'favorites.of': 'of',

    // Event Form
    'form.eventTitle': 'Event Title',
    'form.eventDescription': 'Event Description',
    'form.shortDescription': 'Short Description',
    'form.startDate': 'Start Date',
    'form.endDate': 'End Date',
    'form.capacity': 'Capacity',
    'form.venue': 'Venue',
    'form.category': 'Category',
    'form.isPublic': 'Public Event',
    'form.featured': 'Featured Event',
    'form.tags': 'Tags',
    'form.productName': 'Product Name',
    'form.heroImageUrl': 'Hero Image URL',
    'form.longDescription': 'Long Description',
    'form.valueProposition': 'Value Proposition',
    'form.features': 'Features',
    'form.awards': 'Awards',
    'form.social': 'Social Media',
    'form.contact': 'Contact Information',
    'form.videoUrl': 'Video URL',
    'form.pressKitUrl': 'Press Kit URL',
    'form.schedule': 'Schedule',
    'form.qrUrl': 'QR Code URL',
    'form.addFeature': 'Add Feature',
    'form.addAward': 'Add Award',
    'form.addTag': 'Add Tag',
    'form.remove': 'Remove',
    'form.qualityScore': 'Quality Score',
    'form.validationErrors': 'Validation Errors',
    'form.warnings': 'Warnings',
    'form.cancel': 'Cancel',
    'form.saving': 'Saving...',
    'form.invalidUrl': 'Invalid URL format',
    'form.invalidDate': 'Invalid date format',
    'form.dateInPast': 'Date cannot be in the past',
    'form.endDateBeforeStart': 'End date must be after start date',
    'form.capacityMustBePositive': 'Capacity must be a positive number',
    'form.titleTooShort': 'Title must be at least 3 characters',
    'form.descriptionTooShort': 'Description must be at least 10 characters',
    'form.qualityScoreExcellent': 'Excellent',
    'form.qualityScoreGood': 'Good',
    'form.qualityScoreFair': 'Fair',
    'form.qualityScorePoor': 'Poor',
    'form.basicInformation': 'Basic Information',
    'form.mediaContent': 'Media & Content',
    'form.socialContact': 'Social & Contact',
    'form.settings': 'Settings',
    'form.website': 'Website',
    'form.instagram': 'Instagram',
    'form.facebook': 'Facebook',
    'form.linkedin': 'LinkedIn',
    'form.contactEmail': 'Contact Email',
    'form.contactPhone': 'Contact Phone',
    'form.makeEventPublic': 'Make event public',
    'form.featureEvent': 'Feature this event',
    'form.enterEventTitle': 'Enter event title',
    'form.maximumAttendees': 'Maximum attendees',
    'form.venueIdOrName': 'Venue ID or name',
    'form.describeEventDetail': 'Describe your event in detail',
    'form.briefDescriptionForCards': 'Brief description for event cards',
    'form.heroImagePlaceholder': 'https://example.com/image.jpg',
    'form.videoPlaceholder': 'https://youtube.com/watch?v=...',
    'form.featureDescription': 'Feature description',
    'form.websitePlaceholder': 'https://example.com',
    'form.instagramPlaceholder': 'https://instagram.com/username',
    'form.facebookPlaceholder': 'https://facebook.com/username',
    'form.linkedinPlaceholder': 'https://linkedin.com/company/username',
    'form.contactEmailPlaceholder': 'contact@example.com',
    'form.contactPhonePlaceholder': '+1 234 567 8900',
    'form.tagName': 'Tag name',
    'form.createEvent': 'Create Event',
    'form.updateEvent': 'Update Event',

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': "We'd love to hear from you.",
    'contact.email': 'Email',
    'contact.issuesNote':
      'For issues regarding events or access, include your email and the event name.',

    // Help Center
    'help.title': 'Help Center',
    'help.subtitle': 'Find answers to common questions about Linea.',
    'help.gettingStarted': 'Getting Started',
    'help.gettingStartedText':
      'Browse events on the home page and join waitlists using just your email.',
    'help.accountPrivacy': 'Account & Privacy',
    'help.accountPrivacyText':
      'We currently collect only your email for waitlist and updates. No other personal data is stored.',
    'help.contactSupport': 'Contact Support',
    'help.contactSupportText':
      'If you need help, visit the Contact page for assistance.',

    // Terms of Service
    'terms.title': 'Terms of Service',
    'terms.useOfService': 'Use of Service',
    'terms.useOfServiceText':
      "Linea provides event discovery and waitlist functionality. By using the service, you agree to follow applicable laws and respect event organizers' rules.",
    'terms.accounts': 'Accounts',
    'terms.accountsText':
      'Access is email-based. You are responsible for the email address you provide and for keeping it accessible to receive updates.',
    'terms.content': 'Content',
    'terms.contentText':
      'Event details are provided by organizers. We strive for accuracy but disclaim liability for errors or changes.',
    'terms.liability': 'Liability',
    'terms.liabilityText':
      "The service is provided 'as is.' To the maximum extent permitted by law, we are not liable for indirect or consequential damages.",
    'terms.contact': 'Contact',
    'terms.contactText': 'For questions about these terms, contact',

    // Countries
    'country.italy': 'Italy',
    'country.france': 'France',
    'country.germany': 'Germany',
    'country.spain': 'Spain',
    'country.denmark': 'Denmark',
    'country.sweden': 'Sweden',
    'country.netherlands': 'Netherlands',
    'country.belgium': 'Belgium',
    'country.switzerland': 'Switzerland',
    'country.austria': 'Austria',
    'country.unitedKingdom': 'United Kingdom',
    'country.other': 'Other',

    // Owner Profile Additional
    'owner.currentLogo': 'Current logo',
    'owner.currentProfilePicture': 'Current profile picture',
    'owner.getCoordinates': 'Get Coordinates',
    'owner.getCoordinatesDescription':
      "Fill in your address and click 'Get Coordinates' to see your location on the map",

    // Social Links
    'social.website': 'Website',
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',

    // Owner Waitlist
    'waitlist.ownerLogin': 'Owner Login',
    'waitlist.loginDescription':
      'Please log in to access the waitlist management.',
    'waitlist.enterEmail': 'Enter your email',
    'waitlist.requestMagicLink': 'Request Magic Link',
    'waitlist.magicLinkSent':
      'Magic link sent if the email exists. Check your inbox.',
    'waitlist.myEvents': 'My Events',
    'waitlist.waitlistManagement': 'Waitlist Management',
    'waitlist.selectEvent': 'Select an event to manage its waitlist',
    'waitlist.noEvents': 'No events found',
    'waitlist.createFirstEvent':
      'Create your first event to start managing waitlists',
    'waitlist.eventsWithWaitlists': 'Events with Waitlists',
    'waitlist.clickEventToManage': 'Click on an event to manage its waitlist',
    'waitlist.event': 'Event',
    'waitlist.date': 'Date',
    'waitlist.waitlist': 'Waitlist',
    'waitlist.capacity': 'Capacity',
    'waitlist.actions': 'Actions',
    'waitlist.manageWaitlist': 'Manage Waitlist',

    // Owner Theme
    'theme.logoPreview': 'Logo preview',
    'theme.logo': 'Logo',
    'theme.fontInter': 'Inter',
    'theme.fontRoboto': 'Roboto',
    'theme.fontOpenSans': 'Open Sans',
    'theme.fontLato': 'Lato',
    'theme.fontMontserrat': 'Montserrat',
    'theme.fontPoppins': 'Poppins',
  },
  it: {
    // Navigation
    'nav.events': 'Eventi',
    'nav.designers': 'Designer',
    'nav.favorites': 'Preferiti',
    'nav.salone': 'Salone del Mobile',
    'nav.owner': 'Portale Proprietario',
    'nav.admin': 'Amministrazione',
    'nav.signOut': 'Esci',

    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.welcome': 'Benvenuto a',
    'common.welcomeBack': 'Bentornato',
    'common.heroSubtitle':
      "La tua porta d'accesso al Milano Design Week e agli eventi di design esclusivi. Scopri esperienze straordinarie, connettiti con i designer ed esplora il futuro del design attraverso la nostra piattaforma innovativa.",
    'common.heroFeatures':
      'Accesso solo tramite email • Eventi curati • Scoperte nelle vicinanze',
    'common.discoverEvents': 'Scopri Eventi di Design',
    'common.joinAsDesigner': 'Unisciti come Designer',
    'common.discoverEventsTitle': 'Scopri Eventi',
    'common.discoverEventsSubtitle':
      'Trova fantastici eventi di design che accadono intorno a te',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.close': 'Chiudi',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.search': 'Cerca',
    'common.status': 'Stato',
    'common.searchPlaceholder': 'Cerca eventi, designer, luoghi...',
    'common.category': 'Categoria',
    'common.area': 'Area',
    'common.designDistrict': 'Distretto del Design',
    'common.product': 'Prodotto',
    'common.productSpecialty': 'Specialità del Prodotto',
    'common.dateFrom': 'Data Da',
    'common.dateTo': 'Data A',
    'common.city': 'Città',
    'common.owner': 'Proprietario',
    'common.designerOrganizer': 'Designer/Organizzatore',
    'common.searchByDesigner': 'Cerca per designer o nome azienda...',
    'common.showing': 'Mostrando',
    'common.of': 'di',
    'common.events': 'eventi',
    'common.readyToCreate': 'Pronto a creare il tuo evento?',
    'common.startBuilding': 'Inizia a costruire la tua comunità oggi.',
    'owner.manageEvents':
      "Gestisci i tuoi eventi e monitora le prestazioni delle liste d'attesa",
    'owner.createNewEvent': 'Crea Nuovo Evento',
    'owner.businessProfile': 'Profilo Aziendale',
    'owner.customizeTheme': 'Personalizza Tema',
    'owner.yourEvents': 'I Tuoi Eventi',
    'owner.manageEventPerformance':
      'Gestisci e monitora le prestazioni dei tuoi eventi',
    'owner.totalEvents': 'Eventi Totali',
    'owner.filterEvents': 'Filtra Eventi',
    'owner.searchEvents': 'Cerca eventi...',
    'owner.allStatus': 'Tutti gli Stati',
    'owner.allEvents': 'Tutti gli Eventi',
    'owner.featuredOnly': 'Solo in Evidenza',
    'owner.nonFeatured': 'Non in Evidenza',
    'owner.fromDate': 'Data Da',
    'owner.toDate': 'Data A',
    'owner.clearFilters': 'Cancella Filtri',
    'owner.showing': 'Mostrando',
    'owner.of': 'di',
    'owner.events': 'eventi',

    // Admin Users
    'admin.users.title': 'Amministrazione • Tutti gli Utenti',
    'admin.users.subtitle':
      'Gestisci tutti gli utenti e le loro registrazioni agli eventi',
    'admin.users.searchPlaceholder': 'Cerca email o nome',
    'admin.users.allRoles': 'Tutti i Ruoli',
    'admin.users.visitors': 'Visitatori',
    'admin.users.owners': 'Proprietari',
    'admin.users.admins': 'Amministratori',
    'admin.users.allStatus': 'Tutti gli Stati',
    'admin.users.active': 'Attivo',
    'admin.users.inactive': 'Inattivo',
    'admin.users.exportCsv': 'Esporta CSV',
    'admin.users.loadingUsers': 'Caricamento utenti...',
    'admin.users.noUsersFound': 'Nessun utente trovato',
    'admin.users.noUsersDescription':
      'Prova ad aggiustare i criteri di ricerca o filtro',
    'admin.users.user': 'Utente',
    'admin.users.role': 'Ruolo',
    'admin.users.status': 'Stato',
    'admin.users.eventActivity': 'Attività Eventi',
    'admin.users.lastLogin': 'Ultimo Accesso',
    'admin.users.actions': 'Azioni',
    'admin.users.joined': 'Iscritto',
    'admin.users.events': 'Eventi',
    'admin.users.waitlist': "Lista d'Attesa",
    'admin.users.owned': 'Posseduti',
    'admin.users.never': 'Mai',
    'admin.users.deactivate': 'Disattiva',
    'admin.users.activate': 'Attiva',
    'admin.users.previous': 'Precedente',
    'admin.users.next': 'Successivo',
    'admin.users.showing': 'Mostrando',
    'admin.users.to': 'a',
    'admin.users.of': 'di',
    'admin.users.results': 'risultati',
    'admin.users.accessDenied': 'Accesso Negato',
    'admin.users.accessDeniedDescription':
      'Non hai il permesso di accedere alla gestione degli utenti amministratori.',
    'admin.users.goToHome': 'Vai alla Home',

    // Admin Events
    'admin.events.title': 'Amministrazione • Eventi',
    'admin.events.subtitle': 'Rivedi e modera gli eventi',
    'admin.events.searchPlaceholder': 'Cerca titolo o descrizione',
    'admin.events.all': 'Tutti',
    'admin.events.draft': 'Bozza',
    'admin.events.published': 'Pubblicato',
    'admin.events.cancelled': 'Annullato',
    'admin.events.completed': 'Completato',
    'admin.events.exportCsv': 'Esporta CSV',
    'admin.events.loading': 'Caricamento...',
    'admin.events.forbidden': 'Vietato: Solo amministratori.',
    'admin.events.approve': 'Approva',
    'admin.events.reject': 'Rifiuta',
    'admin.events.reasonForRejection': 'Motivo del rifiuto (opzionale)',
    'admin.events.event': 'Evento',
    'admin.events.owner': 'Proprietario',
    'admin.events.waitlist': "Lista d'Attesa",
    'admin.events.status': 'Stato',
    'admin.events.noEventsFound': 'Nessun evento trovato.',
    'admin.events.previous': 'Precedente',
    'admin.events.next': 'Successivo',
    'admin.events.page': 'Pagina',
    'admin.events.of': 'di',

    // Cookie Banner
    'cookie.message':
      'Utilizziamo cookie necessari per le funzionalità principali. I cookie di analisi opzionali ci aiutano a migliorare il prodotto. Attualmente raccogliamo solo la tua email da utenti anonimi. Vedi la nostra',
    'cookie.privacyPolicy': 'Informativa sulla Privacy',
    'cookie.decline': 'Rifiuta',
    'cookie.acceptAll': 'Accetta tutto',

    // Confirmation Dialogs
    'confirm.deleteEvent': 'Eliminare questo evento?',
    'confirm.deletePhoto': 'Sei sicuro di voler eliminare questa foto?',
    'confirm.deleteProduct': 'Sei sicuro di voler eliminare questo prodotto?',
    'confirm.deleteArea': "Sei sicuro di voler eliminare quest'area?",
    'confirm.deleteCategory': 'Sei sicuro di voler eliminare questa categoria?',
    'common.allCategories': 'Tutte le Categorie',
    'common.allAreas': 'Tutte le Aree',
    'common.allProducts': 'Tutti i Prodotti',
    'common.anyTime': 'Qualsiasi Ora',
    'common.timeOfDay': 'Ora del Giorno',
    'common.morning': 'Mattina (6AM-12PM)',
    'common.afternoon': 'Pomeriggio (12PM-6PM)',
    'common.evening': 'Sera (6PM-10PM)',
    'common.night': 'Notte (10PM-6AM)',
    'common.featured': 'In Evidenza',
    'common.allEvents': 'Tutti gli Eventi',
    'common.regularEvents': 'Eventi Regolari',
    'common.featuredEvents': 'Eventi in Evidenza',
    'common.featuredOnly': 'Solo in Evidenza',
    'common.filter': 'Filtra',
    'common.sort': 'Ordina',
    'common.view': 'Visualizza',
    'common.filterEvents': 'Filtra Eventi',
    'common.filtersActive': 'filtri attivi',
    'common.filterActive': 'filtro attivo',
    'common.details': 'Dettagli',
    'common.more': 'Altro',
    'common.less': 'Meno',

    // Events
    'events.title': 'Eventi',
    'events.upcoming': 'Prossimi Eventi',
    'events.featured': 'Eventi in Evidenza',
    'events.nearby': 'Eventi Vicini',
    'events.noEvents': 'Nessun evento trovato',
    'events.joinWaitlist': "Iscriviti alla Lista d'Attesa",
    'events.onWaitlist': "In Lista d'Attesa",
    'events.capacity': 'Capienza',
    'events.attendees': 'Partecipanti',
    'events.date': 'Data',
    'events.time': 'Ora',
    'events.location': 'Posizione',
    'events.organizer': 'Organizzatore',
    'events.description': 'Descrizione',
    'events.tags': 'Tag',
    'events.share': 'Condividi',
    'events.favorite': 'Aggiungi ai Preferiti',
    'events.unfavorite': 'Rimuovi dai Preferiti',

    // Designers
    'designers.title': 'Designer',
    'designers.all': 'Tutti i Designer',
    'designers.featured': 'Designer in Evidenza',
    'designers.noDesigners': 'Nessun designer trovato',
    'designers.follow': 'Segui',
    'designers.unfollow': 'Smetti di Seguire',
    'designers.following': 'Seguiti',
    'designers.followers': 'Follower',
    'designers.events': 'Eventi',
    'designers.contact': 'Contatto',
    'designers.website': 'Sito Web',
    'designers.social': 'Social Media',

    // Favorites
    'favorites.title': 'I Tuoi Preferiti',
    'favorites.noFavorites':
      'Non hai ancora aggiunto eventi ai preferiti. Inizia a esplorare!',
    'favorites.remove': 'Rimuovi dai Preferiti',

    // Profile
    'profile.title': 'Profilo',
    'profile.edit': 'Modifica Profilo',
    'profile.name': 'Nome',
    'profile.email': 'Email',
    'profile.phone': 'Telefono',
    'profile.businessName': 'Nome Azienda',
    'profile.businessIntro': 'Introduzione Azienda',
    'profile.website': 'Sito Web',
    'profile.address': 'Indirizzo',
    'profile.city': 'Città',
    'profile.country': 'Paese',
    'profile.social': 'Social Media',
    'profile.uploadPhoto': 'Carica Foto',
    'profile.changePhoto': 'Cambia Foto',

    // Authentication
    'auth.login': 'Accedi',
    'auth.logout': 'Esci',
    'auth.signIn': 'Accedi',
    'auth.signOut': 'Esci',
    'auth.email': 'Email',
    'auth.requestMagicLink': 'Richiedi Link Magico',
    'auth.magicLinkSent': 'Link magico inviato alla tua email',
    'auth.checkEmail': 'Controlla la tua email per il link magico',
    'auth.invalidToken': 'Token non valido o scaduto',
    'auth.loginSuccess': 'Accesso riuscito',
    'auth.logoutSuccess': 'Logout riuscito',

    // Forms
    'form.required': 'Questo campo è obbligatorio',
    'form.invalidEmail': 'Formato email non valido',
    'form.passwordTooShort': 'La password deve essere di almeno 8 caratteri',
    'form.passwordsDoNotMatch': 'Le password non corrispondono',
    'form.submit': 'Invia',
    'form.reset': 'Reimposta',
    'form.validating': 'Validazione...',
    'form.submitting': 'Invio...',

    // Validation Messages
    'validation.titleRequired': 'Il titolo è obbligatorio',
    'validation.titleMinLength':
      'Il titolo deve essere di almeno {min} caratteri',
    'validation.titleMaxLength':
      'Il titolo non deve superare i {max} caratteri',
    'validation.startDateRequired': 'La data di inizio è obbligatoria',
    'validation.startDatePast': 'La data di inizio è nel passato',
    'validation.endDateAfterStart':
      'La data di fine deve essere dopo la data di inizio',
    'validation.capacityMin': 'La capienza deve essere di almeno {min}',
    'validation.capacityMax': 'La capienza non deve superare {max}',
    'validation.descriptionMaxLength':
      'La descrizione non deve superare i {max} caratteri',
    'validation.shortDescriptionMaxLength':
      'La breve descrizione non deve superare i {max} caratteri',
    'validation.tagsMaxItems': 'Massimo {max} tag consentiti',
    'validation.tagsMaxLength':
      'I tag non devono superare i {max} caratteri ciascuno',
    'validation.featuresMaxItems': 'Massimo {max} caratteristiche consentite',
    'validation.featuresMaxLength':
      'Le caratteristiche non devono superare i {max} caratteri ciascuna',
    'validation.socialUrlInvalid': 'URL {platform} non valido',
    'validation.emailInvalid': 'Email non valida',
    'validation.phoneInvalid': 'Numero di telefono non valido',
    'validation.scheduleTitleRequired':
      "Il titolo dell'elemento {index} del programma è obbligatorio",
    'validation.scheduleStartRequired':
      "L'ora di inizio dell'elemento {index} del programma è obbligatoria",
    'validation.scheduleEndAfterStart':
      "L'ora di fine dell'elemento {index} del programma deve essere dopo l'ora di inizio",

    // Publication Validation
    'validation.missingTitle': 'Titolo',
    'validation.missingStartDate': 'Data di inizio',
    'validation.missingDescription': 'Descrizione',
    'validation.missingVenue': 'Luogo',
    'validation.missingCategory': 'Categoria',
    'validation.recommendShortDescription':
      'Aggiungi una breve descrizione per una migliore visualizzazione',
    'validation.recommendHeroImage':
      "Aggiungi un'immagine principale per rendere l'evento più attraente",
    'validation.recommendSocial':
      'Aggiungi link ai social media per aumentare la visibilità',
    'validation.recommendContact':
      'Aggiungi informazioni di contatto per i partecipanti',
    'validation.recommendTags':
      'Aggiungi tag per aiutare le persone a trovare il tuo evento',
    'validation.recommendCapacity':
      'Imposta un limite di capienza per gestire la partecipazione',

    // Errors
    'error.generic': 'Qualcosa è andato storto. Riprova.',
    'error.network': 'Errore di rete. Controlla la tua connessione.',
    'error.unauthorized': 'Non sei autorizzato a eseguire questa azione.',
    'error.notFound': 'La risorsa richiesta non è stata trovata.',
    'error.serverError': 'Errore del server. Riprova più tardi.',
    'error.validation': 'Controlla i tuoi input e riprova.',

    // Success messages
    'success.saved': 'Modifiche salvate con successo',
    'success.deleted': 'Elemento eliminato con successo',
    'success.created': 'Elemento creato con successo',
    'success.updated': 'Elemento aggiornato con successo',
    'success.followed': 'Ora stai seguendo questo utente',
    'success.unfollowed': 'Non stai più seguendo questo utente',
    'success.favorited': 'Aggiunto ai preferiti',
    'success.unfavorited': 'Rimosso dai preferiti',

    // API Messages
    'api.magicLinkSent':
      "Link magico inviato se l'email esiste. Controlla la tua casella di posta.",
    'api.loadingWaitlist': "Caricamento lista d'attesa...",
    'api.noWaitlistEntries': "Nessuna voce nella lista d'attesa",
    'api.noWaitlistEntriesDescription':
      "Nessuno si è ancora iscritto alla lista d'attesa per questo evento.",
    'api.stayInLoop': 'Rimani aggiornato',
    'api.stayInLoopDescription':
      "Inserisci la tua email per ottenere accesso rapido alle liste d'attesa e agli aggiornamenti degli eventi.",
    'api.notNow': 'Non ora',
    'api.continue': 'Continua',
    'api.refreshPage': 'Aggiorna Pagina',
    'api.somethingWentWrong': 'Qualcosa è andato storto',
    'api.somethingWentWrongDescription':
      'Ci dispiace, ma è successo qualcosa di inaspettato. Prova ad aggiornare la pagina.',
    'api.errorDetails': 'Dettagli Errore',

    // Photo Gallery
    'gallery.editPhoto': 'Modifica foto',
    'gallery.deletePhoto': 'Elimina foto',
    'gallery.photoTitle': 'Titolo foto',
    'gallery.photoDescription': 'Descrizione foto',
    'gallery.altText': 'Testo alternativo per accessibilità',

    // Owner Profile Placeholders
    'owner.businessNamePlaceholder': 'Studio Nova Cucine',
    'owner.businessIntroPlaceholder':
      'Racconta ai visitatori la tua filosofia di design, le specialità e cosa rende unico il tuo lavoro...',
    'owner.contactNamePlaceholder': 'Luca Bianchi',
    'owner.contactEmailPlaceholder': 'luca@studionovacucine.it',
    'owner.contactPhonePlaceholder': '+39 02 1234 5678',
    'owner.websitePlaceholder': 'https://studionovacucine.it',
    'owner.facebookPlaceholder': 'https://facebook.com/tuapagina',
    'owner.instagramPlaceholder': 'https://instagram.com/tuohandle',
    'owner.cityPlaceholder': 'Milano',
    'owner.addressPlaceholder': 'Via Brera 15, 20121 Milano',

    // Language
    'language.english': 'English',
    'language.italian': 'Italiano',
    'language.select': 'Seleziona Lingua',
    'language.current': 'Lingua Attuale',

    // Event Page
    'event.notFound': 'Evento Non Trovato',
    'event.notFoundDescription': "L'evento che stai cercando non esiste.",
    'event.ends': 'Termina',
    'event.capacity': 'Capienza',
    'event.product': 'Prodotto',
    'event.aboutEvent': 'Informazioni su questo Evento',
    'event.features': 'Caratteristiche',
    'event.awards': 'Premi',
    'event.video': "Video dell'Evento",
    'event.pressSocial': 'Stampa e Social',
    'event.downloadPressKit': 'Scarica Press Kit',
    'event.contact': 'Contatto',
    'event.email': 'Email',
    'event.phone': 'Telefono',
    'event.whatsapp': 'WhatsApp',
    'event.telegram': 'Telegram',
    'event.open': 'Apri',
    'event.joinWaitlist': "Iscriviti alla Lista d'Attesa",
    'event.joinWaitlistDescription':
      "Inserisci la tua email per iscriverti alla lista d'attesa per questo evento. Sarai notificato quando i posti diventano disponibili.",
    'event.enterEmail': 'Inserisci il tuo indirizzo email',
    'event.joining': 'Iscrizione in corso...',
    'event.successfullyJoined': "Iscrizione alla lista d'attesa completata!",
    'event.notifyWhenAvailable':
      'Ti notificheremo quando i posti diventano disponibili.',
    'event.venue': 'Sede',
    'event.viewOnGoogleMaps': 'Visualizza su Google Maps',
    'event.shows': 'Spettacoli',
    'event.nearbyPlaces': 'Luoghi Vicini',
    'event.away': 'di distanza',

    // Admin Portal
    'admin.login': 'Accesso Amministratore',
    'admin.loginDescription':
      'Inserisci la tua email per ricevere un link magico monouso.',
    'admin.sendMagicLink': 'Invia link magico',
    'admin.portal': 'Portale Amministratore',
    'admin.portalDescription':
      'Dashboard di amministrazione e analisi della piattaforma',
    'admin.totalUsers': 'Utenti Totali',
    'admin.totalEvents': 'Eventi Totali',
    'admin.totalWaitlist': "Lista d'Attesa Totale",
    'admin.activeEvents': 'Eventi Attivi',
    'admin.recentActivity': 'Attività Recente',
    'admin.newEventCreated': 'Nuovo evento creato:',
    'admin.newUserRegistered': 'Nuovo utente registrato:',
    'admin.waitlistEntryAdded': "Voce aggiunta alla lista d'attesa per",
    'admin.hoursAgo': 'ore fa',
    'admin.systemHealth': 'Stato del Sistema',
    'admin.apiStatus': 'Stato API',
    'admin.database': 'Database',
    'admin.redisCache': 'Cache Redis',
    'admin.emailService': 'Servizio Email',
    'admin.healthy': 'Sano',
    'admin.connected': 'Connesso',
    'admin.notConfigured': 'Non Configurato',
    'admin.quickActions': 'Azioni Rapide',
    'admin.manageOwners': 'Gestisci Proprietari',
    'admin.reviewEvents': 'Rivedi Eventi',
    'admin.manageCategories': 'Gestisci Categorie',
    'admin.manageAreas': 'Gestisci Aree',
    'admin.manageProducts': 'Gestisci Prodotti',
    'admin.systemSettings': 'Impostazioni Sistema',

    // Owner Portal
    'owner.login': 'Accesso Proprietario',
    'owner.loginDescription':
      'Inserisci la tua email per ricevere un link magico monouso.',
    'owner.sendMagicLink': 'Invia link magico',
    'owner.portal': 'Portale Proprietario',
    'owner.portalDescription': "Gestisci i tuoi eventi e lista d'attesa",
    'owner.myEvents': 'I Miei Eventi',
    'owner.createEvent': 'Crea Evento',
    'owner.editEvent': 'Modifica Evento',
    'owner.deleteEvent': 'Elimina Evento',
    'owner.eventTitle': 'Titolo Evento',
    'owner.eventDescription': 'Descrizione Evento',
    'owner.shortDescription': 'Descrizione Breve',
    'owner.startDate': 'Data Inizio',
    'owner.capacity': 'Capienza',
    'owner.featured': 'In Evidenza',
    'owner.status': 'Stato',
    'owner.actions': 'Azioni',

    // Favorites Page
    'favorites.errorLoading': 'Errore nel Caricamento dei Preferiti',
    'favorites.tryAgain': 'Riprova',
    'favorites.noFavoritesYet': 'Nessun Preferito Ancora',
    'favorites.startExploring':
      'Inizia a esplorare gli eventi e aggiungili ai tuoi preferiti per vederli qui.',
    'favorites.exploreEvents': 'Esplora Eventi',
    'favorites.myFavorites': 'I Miei Preferiti',
    'favorites.eventsSaved': 'eventi salvati',
    'favorites.eventSaved': 'evento salvato',
    'favorites.viewDetails': 'Visualizza Dettagli',
    'favorites.previous': 'Precedente',
    'favorites.next': 'Avanti',
    'favorites.page': 'Pagina',
    'favorites.of': 'di',

    // Event Form
    'form.eventTitle': 'Titolo Evento',
    'form.eventDescription': 'Descrizione Evento',
    'form.shortDescription': 'Descrizione Breve',
    'form.startDate': 'Data Inizio',
    'form.endDate': 'Data Fine',
    'form.capacity': 'Capienza',
    'form.venue': 'Sede',
    'form.category': 'Categoria',
    'form.isPublic': 'Evento Pubblico',
    'form.featured': 'Evento in Evidenza',
    'form.tags': 'Tag',
    'form.productName': 'Nome Prodotto',
    'form.heroImageUrl': 'URL Immagine Principale',
    'form.longDescription': 'Descrizione Lunga',
    'form.valueProposition': 'Proposta di Valore',
    'form.features': 'Caratteristiche',
    'form.awards': 'Premi',
    'form.social': 'Social Media',
    'form.contact': 'Informazioni di Contatto',
    'form.videoUrl': 'URL Video',
    'form.pressKitUrl': 'URL Press Kit',
    'form.schedule': 'Programma',
    'form.qrUrl': 'URL Codice QR',
    'form.addFeature': 'Aggiungi Caratteristica',
    'form.addAward': 'Aggiungi Premio',
    'form.addTag': 'Aggiungi Tag',
    'form.remove': 'Rimuovi',
    'form.qualityScore': 'Punteggio Qualità',
    'form.validationErrors': 'Errori di Validazione',
    'form.warnings': 'Avvisi',
    'form.cancel': 'Annulla',
    'form.saving': 'Salvataggio...',
    'form.invalidUrl': 'Formato URL non valido',
    'form.invalidDate': 'Formato data non valido',
    'form.dateInPast': 'La data non può essere nel passato',
    'form.endDateBeforeStart':
      'La data di fine deve essere dopo la data di inizio',
    'form.capacityMustBePositive': 'La capienza deve essere un numero positivo',
    'form.titleTooShort': 'Il titolo deve essere di almeno 3 caratteri',
    'form.descriptionTooShort':
      'La descrizione deve essere di almeno 10 caratteri',
    'form.qualityScoreExcellent': 'Eccellente',
    'form.qualityScoreGood': 'Buono',
    'form.qualityScoreFair': 'Discreto',
    'form.qualityScorePoor': 'Scarso',
    'form.basicInformation': 'Informazioni Base',
    'form.mediaContent': 'Media e Contenuti',
    'form.socialContact': 'Social e Contatti',
    'form.settings': 'Impostazioni',
    'form.website': 'Sito Web',
    'form.instagram': 'Instagram',
    'form.facebook': 'Facebook',
    'form.linkedin': 'LinkedIn',
    'form.contactEmail': 'Email di Contatto',
    'form.contactPhone': 'Telefono di Contatto',
    'form.makeEventPublic': "Rendi l'evento pubblico",
    'form.featureEvent': 'Metti in evidenza questo evento',
    'form.enterEventTitle': "Inserisci il titolo dell'evento",
    'form.maximumAttendees': 'Massimo partecipanti',
    'form.venueIdOrName': 'ID sede o nome',
    'form.describeEventDetail': 'Descrivi il tuo evento nei dettagli',
    'form.briefDescriptionForCards':
      'Breve descrizione per le card degli eventi',
    'form.heroImagePlaceholder': 'https://example.com/image.jpg',
    'form.videoPlaceholder': 'https://youtube.com/watch?v=...',
    'form.featureDescription': 'Descrizione caratteristica',
    'form.websitePlaceholder': 'https://example.com',
    'form.instagramPlaceholder': 'https://instagram.com/username',
    'form.facebookPlaceholder': 'https://facebook.com/username',
    'form.linkedinPlaceholder': 'https://linkedin.com/company/username',
    'form.contactEmailPlaceholder': 'contact@example.com',
    'form.contactPhonePlaceholder': '+1 234 567 8900',
    'form.tagName': 'Nome tag',
    'form.createEvent': 'Crea Evento',
    'form.updateEvent': 'Aggiorna Evento',

    // Contact Page
    'contact.title': 'Contattaci',
    'contact.subtitle': 'Ci piacerebbe sentirti.',
    'contact.email': 'Email',
    'contact.issuesNote':
      "Per problemi relativi agli eventi o all'accesso, includi la tua email e il nome dell'evento.",

    // Help Center
    'help.title': 'Centro Assistenza',
    'help.subtitle': 'Trova risposte alle domande comuni su Linea.',
    'help.gettingStarted': 'Iniziare',
    'help.gettingStartedText':
      "Sfoglia gli eventi nella pagina principale e unisciti alle liste d'attesa usando solo la tua email.",
    'help.accountPrivacy': 'Account e Privacy',
    'help.accountPrivacyText':
      "Attualmente raccogliamo solo la tua email per le liste d'attesa e gli aggiornamenti. Nessun altro dato personale viene memorizzato.",
    'help.contactSupport': 'Contatta il Supporto',
    'help.contactSupportText':
      'Se hai bisogno di aiuto, visita la pagina Contatti per assistenza.',

    // Terms of Service
    'terms.title': 'Termini di Servizio',
    'terms.useOfService': 'Uso del Servizio',
    'terms.useOfServiceText':
      "Linea fornisce funzionalità di scoperta eventi e lista d'attesa. Utilizzando il servizio, accetti di seguire le leggi applicabili e rispettare le regole degli organizzatori di eventi.",
    'terms.accounts': 'Account',
    'terms.accountsText':
      "L'accesso è basato sull'email. Sei responsabile dell'indirizzo email che fornisci e di mantenerlo accessibile per ricevere aggiornamenti.",
    'terms.content': 'Contenuto',
    'terms.contentText':
      "I dettagli degli eventi sono forniti dagli organizzatori. Ci sforziamo per l'accuratezza ma decliniamo ogni responsabilità per errori o modifiche.",
    'terms.liability': 'Responsabilità',
    'terms.liabilityText':
      "Il servizio è fornito 'così com'è'. Nella misura massima consentita dalla legge, non siamo responsabili per danni indiretti o consequenziali.",
    'terms.contact': 'Contatto',
    'terms.contactText': 'Per domande su questi termini, contatta',

    // Countries
    'country.italy': 'Italia',
    'country.france': 'Francia',
    'country.germany': 'Germania',
    'country.spain': 'Spagna',
    'country.denmark': 'Danimarca',
    'country.sweden': 'Svezia',
    'country.netherlands': 'Paesi Bassi',
    'country.belgium': 'Belgio',
    'country.switzerland': 'Svizzera',
    'country.austria': 'Austria',
    'country.unitedKingdom': 'Regno Unito',
    'country.other': 'Altro',

    // Owner Profile Additional
    'owner.currentLogo': 'Logo attuale',
    'owner.currentProfilePicture': 'Foto profilo attuale',
    'owner.getCoordinates': 'Ottieni Coordinate',
    'owner.getCoordinatesDescription':
      "Compila il tuo indirizzo e clicca 'Ottieni Coordinate' per vedere la tua posizione sulla mappa",

    // Social Links
    'social.website': 'Sito Web',
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',

    // Owner Waitlist
    'waitlist.ownerLogin': 'Accesso Proprietario',
    'waitlist.loginDescription':
      "Accedi per accedere alla gestione delle liste d'attesa.",
    'waitlist.enterEmail': 'Inserisci la tua email',
    'waitlist.requestMagicLink': 'Richiedi Link Magico',
    'waitlist.magicLinkSent':
      "Link magico inviato se l'email esiste. Controlla la tua casella di posta.",
    'waitlist.myEvents': 'I Miei Eventi',
    'waitlist.waitlistManagement': "Gestione Lista d'Attesa",
    'waitlist.selectEvent':
      "Seleziona un evento per gestire la sua lista d'attesa",
    'waitlist.noEvents': 'Nessun evento trovato',
    'waitlist.createFirstEvent':
      "Crea il tuo primo evento per iniziare a gestire le liste d'attesa",
    'waitlist.eventsWithWaitlists': "Eventi con Liste d'Attesa",
    'waitlist.clickEventToManage':
      "Clicca su un evento per gestire la sua lista d'attesa",
    'waitlist.event': 'Evento',
    'waitlist.date': 'Data',
    'waitlist.waitlist': "Lista d'Attesa",
    'waitlist.capacity': 'Capienza',
    'waitlist.actions': 'Azioni',
    'waitlist.manageWaitlist': "Gestisci Lista d'Attesa",

    // Owner Theme
    'theme.logoPreview': 'Anteprima logo',
    'theme.logo': 'Logo',
    'theme.fontInter': 'Inter',
    'theme.fontRoboto': 'Roboto',
    'theme.fontOpenSans': 'Open Sans',
    'theme.fontLato': 'Lato',
    'theme.fontMontserrat': 'Montserrat',
    'theme.fontPoppins': 'Poppins',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<'en' | 'it'>('en');

  // Dev-only: validate translations parity between EN and IT
  useEffect(() => {
    if (import.meta.env.MODE !== 'development') return;
    try {
      const enKeys = new Set(Object.keys(translations.en));
      const itKeys = new Set(Object.keys(translations.it));
      const missingInIt: string[] = [];
      const missingInEn: string[] = [];
      enKeys.forEach(k => {
        if (!itKeys.has(k)) missingInIt.push(k);
      });
      itKeys.forEach(k => {
        if (!enKeys.has(k)) missingInEn.push(k);
      });
      if (missingInIt.length > 0 || missingInEn.length > 0) {
        console.warn('[i18n] Translation key mismatches detected', {
          missingInIt,
          missingInEn,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('linea-language') as
      | 'en'
      | 'it'
      | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'it')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  const handleSetLanguage = (lang: 'en' | 'it') => {
    setLanguage(lang);
    localStorage.setItem('linea-language', lang);

    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang;

    // Update meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        lang === 'en'
          ? 'Discover design events and connect with designers at Salone del Mobile'
          : 'Scopri eventi di design e connettiti con i designer al Salone del Mobile'
      );
    }
  };

  // Translation function with safe EN fallback and dev warnings
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation =
      (translations[language][
        key as keyof (typeof translations)[typeof language]
      ] as string | undefined) ??
      (translations.en[key as keyof (typeof translations)['en']] as
        | string
        | undefined) ??
      key;

    if (import.meta.env.MODE === 'development') {
      const hasInLang = Object.prototype.hasOwnProperty.call(
        translations[language],
        key
      );
      if (!hasInLang) {
        console.warn(`[i18n] Missing key in ${language}: ${key}`);
      }
    }

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
