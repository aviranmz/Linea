// User preferences service with merge-update functionality
import { PrismaClient } from '@prisma/client';

export interface UserPreferences {
  // Theme preferences
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    fontSize?: string;
    logoUrl?: string;
    customCSS?: string;
  };

  // Notification preferences
  notifications?: {
    email?: {
      eventUpdates?: boolean;
      waitlistConfirmations?: boolean;
      reminders?: boolean;
      marketing?: boolean;
    };
    push?: {
      eventUpdates?: boolean;
      waitlistConfirmations?: boolean;
      reminders?: boolean;
    };
    sms?: {
      urgentUpdates?: boolean;
      reminders?: boolean;
    };
  };

  // Privacy preferences
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'friends';
    showEmail?: boolean;
    showPhone?: boolean;
    allowDirectMessages?: boolean;
    dataSharing?: boolean;
  };

  // Language and localization
  localization?: {
    language?: 'en' | 'it' | 'es' | 'fr' | 'de';
    timezone?: string;
    dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat?: '12h' | '24h';
    currency?: string;
  };

  // Accessibility preferences
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
    keyboardNavigation?: boolean;
  };

  // Application preferences
  application?: {
    defaultView?: 'list' | 'grid' | 'map';
    itemsPerPage?: number;
    autoRefresh?: boolean;
    showTutorials?: boolean;
    betaFeatures?: boolean;
  };

  // Business preferences (for owners)
  business?: {
    businessHours?: {
      monday?: { open: string; close: string; closed: boolean };
      tuesday?: { open: string; close: string; closed: boolean };
      wednesday?: { open: string; close: string; closed: boolean };
      thursday?: { open: string; close: string; closed: boolean };
      friday?: { open: string; close: string; closed: boolean };
      saturday?: { open: string; close: string; closed: boolean };
      sunday?: { open: string; close: string; closed: boolean };
    };
    contactMethods?: string[];
    responseTime?: string;
    maxEventCapacity?: number;
    autoApproveWaitlist?: boolean;
  };

  // Index signature for additional properties
  [key: string]: any;
}

export interface PreferenceUpdate {
  path: string;
  value: any;
  operation: 'set' | 'merge' | 'remove';
}

export class UserPreferencesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return (user.theme as UserPreferences) || {};
  }

  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    // Get current preferences
    const currentPreferences = await this.getUserPreferences(userId);

    // Merge updates with current preferences
    const mergedPreferences = this.deepMerge(currentPreferences, updates);

    // Update in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { theme: mergedPreferences },
    });

    return mergedPreferences;
  }

  async updatePreferencePath(
    userId: string,
    path: string,
    value: any,
    operation: 'set' | 'merge' | 'remove' = 'set'
  ): Promise<UserPreferences> {
    const currentPreferences = await this.getUserPreferences(userId);

    let updatedPreferences: UserPreferences;

    switch (operation) {
      case 'set':
        updatedPreferences = this.setNestedValue(
          currentPreferences,
          path,
          value
        );
        break;
      case 'merge': {
        const existingValue =
          this.getNestedValue(currentPreferences, path) || {};
        const mergedValue = this.deepMerge(existingValue, value);
        updatedPreferences = this.setNestedValue(
          currentPreferences,
          path,
          mergedValue
        );
        break;
      }
      case 'remove':
        updatedPreferences = this.removeNestedValue(currentPreferences, path);
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }

    // Update in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { theme: updatedPreferences },
    });

    return updatedPreferences;
  }

  async batchUpdatePreferences(
    userId: string,
    updates: PreferenceUpdate[]
  ): Promise<UserPreferences> {
    let currentPreferences = await this.getUserPreferences(userId);

    for (const update of updates) {
      switch (update.operation) {
        case 'set':
          currentPreferences = this.setNestedValue(
            currentPreferences,
            update.path,
            update.value
          );
          break;
        case 'merge': {
          const existingValue =
            this.getNestedValue(currentPreferences, update.path) || {};
          const mergedValue = this.deepMerge(existingValue, update.value);
          currentPreferences = this.setNestedValue(
            currentPreferences,
            update.path,
            mergedValue
          );
          break;
        }
        case 'remove':
          currentPreferences = this.removeNestedValue(
            currentPreferences,
            update.path
          );
          break;
      }
    }

    // Update in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { theme: currentPreferences },
    });

    return currentPreferences;
  }

  async resetUserPreferences(
    userId: string,
    category?: keyof UserPreferences
  ): Promise<UserPreferences> {
    const currentPreferences = await this.getUserPreferences(userId);

    let updatedPreferences: UserPreferences;

    if (category) {
      // Reset specific category
      updatedPreferences = {
        ...currentPreferences,
        [category]: this.getDefaultPreferences()[category],
      };
    } else {
      // Reset all preferences
      updatedPreferences = this.getDefaultPreferences();
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { theme: updatedPreferences },
    });

    return updatedPreferences;
  }

  async exportUserPreferences(
    userId: string
  ): Promise<{ preferences: UserPreferences; exportedAt: Date }> {
    const preferences = await this.getUserPreferences(userId);
    return {
      preferences,
      exportedAt: new Date(),
    };
  }

  async importUserPreferences(
    userId: string,
    preferences: UserPreferences,
    merge: boolean = true
  ): Promise<UserPreferences> {
    if (merge) {
      const currentPreferences = await this.getUserPreferences(userId);
      const mergedPreferences = this.deepMerge(currentPreferences, preferences);

      await this.prisma.user.update({
        where: { id: userId },
        data: { theme: mergedPreferences },
      });

      return mergedPreferences;
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { theme: preferences },
      });

      return preferences;
    }
  }

  private deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) {
      return target;
    }

    if (typeof source !== 'object' || Array.isArray(source)) {
      return source;
    }

    if (typeof target !== 'object' || Array.isArray(target)) {
      return { ...source };
    }

    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  private setNestedValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key) continue;
      if (
        !(key in current) ||
        typeof current[key] !== 'object' ||
        Array.isArray(current[key])
      ) {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  private removeNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key || !(key in current)) {
        return result;
      }
      current[key] = { ...current[key] };
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      delete current[lastKey];
    }
    return result;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        accentColor: '#F59E0B',
        fontFamily: 'Inter',
        fontSize: '16px',
      },
      notifications: {
        email: {
          eventUpdates: true,
          waitlistConfirmations: true,
          reminders: true,
          marketing: false,
        },
        push: {
          eventUpdates: true,
          waitlistConfirmations: true,
          reminders: true,
        },
        sms: {
          urgentUpdates: true,
          reminders: false,
        },
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowDirectMessages: true,
        dataSharing: false,
      },
      localization: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currency: 'USD',
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false,
        keyboardNavigation: true,
      },
      application: {
        defaultView: 'list',
        itemsPerPage: 20,
        autoRefresh: true,
        showTutorials: true,
        betaFeatures: false,
      },
      business: {
        businessHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true },
        },
        contactMethods: ['email'],
        responseTime: '24h',
        maxEventCapacity: 100,
        autoApproveWaitlist: false,
      },
    };
  }

  async getPreferencesByCategory(
    userId: string,
    category: keyof UserPreferences
  ): Promise<any> {
    const preferences = await this.getUserPreferences(userId);
    return preferences[category] || this.getDefaultPreferences()[category];
  }

  async validatePreferences(
    preferences: Partial<UserPreferences>
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate theme preferences
    if (preferences.theme) {
      if (
        preferences.theme.primaryColor &&
        !this.isValidColor(preferences.theme.primaryColor)
      ) {
        errors.push('Invalid primary color format');
      }
      if (
        preferences.theme.secondaryColor &&
        !this.isValidColor(preferences.theme.secondaryColor)
      ) {
        errors.push('Invalid secondary color format');
      }
    }

    // Validate notification preferences
    if (preferences.notifications) {
      const validNotificationChannels = ['email', 'push', 'sms'];
      for (const channel of Object.keys(preferences.notifications)) {
        if (!validNotificationChannels.includes(channel)) {
          errors.push(`Invalid notification channel: ${channel}`);
        }
      }
    }

    // Validate privacy preferences
    if (preferences.privacy) {
      if (
        preferences.privacy.profileVisibility &&
        !['public', 'private', 'friends'].includes(
          preferences.privacy.profileVisibility
        )
      ) {
        errors.push('Invalid profile visibility setting');
      }
    }

    // Validate localization preferences
    if (preferences.localization) {
      const validLanguages = ['en', 'it', 'es', 'fr', 'de'];
      if (
        preferences.localization.language &&
        !validLanguages.includes(preferences.localization.language)
      ) {
        errors.push('Invalid language setting');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
