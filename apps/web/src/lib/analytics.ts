// TEMPORARILY DISABLED ANALYTICS TO PREVENT INFINITE LOOPS
// TODO: Redesign analytics system to prevent singleton issues

interface AnalyticsData {
  eventId: string;
  sessionId?: string;
  userAgent?: string;
  referrer?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

// InteractionData interface removed - not needed for disabled analytics

class AnalyticsTracker {
  // COMPLETELY DISABLED TO PREVENT INFINITE LOOPS
  // TODO: Redesign analytics system to prevent singleton issues

  constructor() {
    // COMPLETELY DISABLED TO PREVENT INFINITE LOOPS
    // TODO: Redesign analytics system to prevent singleton issues
  }

  // All methods are no-ops to prevent infinite loops
  async trackEventView(
    _eventId: string,
    _additionalData?: Partial<AnalyticsData>
  ) {
    // DISABLED
    return;
  }

  async trackInteraction(
    _eventId: string,
    _action: string,
    _element?: string,
    _metadata?: Record<string, unknown>
  ) {
    // DISABLED
    return;
  }

  trackButtonClick(_eventId: string, _buttonName: string) {
    // DISABLED
    return;
  }

  trackLinkClick(_eventId: string, _linkText: string, _linkUrl: string) {
    // DISABLED
    return;
  }

  trackWaitlistJoin(_eventId: string) {
    // DISABLED
    return;
  }

  trackShare(_eventId: string, _platform: string) {
    // DISABLED
    return;
  }

  trackScroll(_eventId: string, _scrollPercentage: number) {
    // DISABLED
    return;
  }

  trackVideoPlay(_eventId: string, _videoUrl: string) {
    // DISABLED
    return;
  }

  trackImageClick(_eventId: string, _imageAlt: string) {
    // DISABLED
    return;
  }

  reset() {
    // DISABLED
    return;
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker();

// React hook for easy integration
export function useAnalytics() {
  return {
    trackEventView: analytics.trackEventView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackLinkClick: analytics.trackLinkClick.bind(analytics),
    trackWaitlistJoin: analytics.trackWaitlistJoin.bind(analytics),
    trackShare: analytics.trackShare.bind(analytics),
    trackScroll: analytics.trackScroll.bind(analytics),
    trackVideoPlay: analytics.trackVideoPlay.bind(analytics),
    trackImageClick: analytics.trackImageClick.bind(analytics),
    reset: analytics.reset.bind(analytics),
  };
}
