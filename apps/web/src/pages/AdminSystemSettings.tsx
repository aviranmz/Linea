import { useEffect, useState } from 'react';
import { getJson, putJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';

interface SystemSettings {
  // Platform Configuration
  platformName: string;
  platformDescription: string;
  platformLogo: string;
  platformFavicon: string;

  // Contact Information
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;

  // Feature Flags
  allowUserRegistration: boolean;
  allowOwnerRegistration: boolean;
  requireEventApproval: boolean;
  enableWaitlist: boolean;
  enableAnalytics: boolean;

  // Email Settings
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;

  // Social Media
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;

  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Security
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  passwordMinLength: number;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export default function AdminSystemSettings() {
  const { t } = useLanguage();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState<SystemSettings>({
    platformName: '',
    platformDescription: '',
    platformLogo: '',
    platformFavicon: '',
    supportEmail: '',
    supportPhone: '',
    supportAddress: '',
    allowUserRegistration: true,
    allowOwnerRegistration: true,
    requireEventApproval: true,
    enableWaitlist: true,
    enableAnalytics: true,
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    let mounted = true;
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then(res => {
        if (!mounted) return;
        setIsAdmin(!!res.user && res.user.role === 'ADMIN');
      })
      .catch(() => {
        if (!mounted) return;
        setIsAdmin(false);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getJson<{ settings: SystemSettings }>(
        '/api/admin/settings'
      );
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await putJson('/api/admin/settings', settings);
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading)
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        Loading...
      </div>
    );
  if (!isAdmin)
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        Forbidden: Admins only.
      </div>
    );

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          <div className='space-y-3'>
            <div className='h-4 bg-gray-200 rounded'></div>
            <div className='h-4 bg-gray-200 rounded'></div>
            <div className='h-4 bg-gray-200 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Admin • System Settings</h1>
          <p className='text-sm text-gray-600'>
            Configure platform settings and preferences
          </p>
        </div>
        <button
          className='btn btn-primary'
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg ${
            message.includes('successfully')
              ? 'bg-green-100 border border-green-200 text-green-800'
              : 'bg-red-100 border border-red-200 text-red-800'
          }`}
          role='alert'
        >
          {message}
        </div>
      )}

      <div className='space-y-8'>
        {/* Platform Configuration */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Platform Configuration</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Platform Name
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.platformName}
                onChange={e =>
                  handleInputChange('platformName', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Platform Description
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.platformDescription}
                onChange={e =>
                  handleInputChange('platformDescription', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Platform Logo URL
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.platformLogo}
                onChange={e =>
                  handleInputChange('platformLogo', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Platform Favicon URL
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.platformFavicon}
                onChange={e =>
                  handleInputChange('platformFavicon', e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Contact Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Support Email
              </label>
              <input
                type='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.supportEmail}
                onChange={e =>
                  handleInputChange('supportEmail', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Support Phone
              </label>
              <input
                type='tel'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.supportPhone}
                onChange={e =>
                  handleInputChange('supportPhone', e.target.value)
                }
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Support Address
              </label>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
                value={settings.supportAddress}
                onChange={e =>
                  handleInputChange('supportAddress', e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Feature Flags</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='allowUserRegistration'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.allowUserRegistration}
                onChange={e =>
                  handleInputChange('allowUserRegistration', e.target.checked)
                }
              />
              <label
                htmlFor='allowUserRegistration'
                className='ml-2 text-sm text-gray-700'
              >
                Allow User Registration
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='allowOwnerRegistration'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.allowOwnerRegistration}
                onChange={e =>
                  handleInputChange('allowOwnerRegistration', e.target.checked)
                }
              />
              <label
                htmlFor='allowOwnerRegistration'
                className='ml-2 text-sm text-gray-700'
              >
                Allow Owner Registration
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='requireEventApproval'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.requireEventApproval}
                onChange={e =>
                  handleInputChange('requireEventApproval', e.target.checked)
                }
              />
              <label
                htmlFor='requireEventApproval'
                className='ml-2 text-sm text-gray-700'
              >
                Require Event Approval
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='enableWaitlist'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.enableWaitlist}
                onChange={e =>
                  handleInputChange('enableWaitlist', e.target.checked)
                }
              />
              <label
                htmlFor='enableWaitlist'
                className='ml-2 text-sm text-gray-700'
              >
                Enable Waitlist
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='enableAnalytics'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.enableAnalytics}
                onChange={e =>
                  handleInputChange('enableAnalytics', e.target.checked)
                }
              />
              <label
                htmlFor='enableAnalytics'
                className='ml-2 text-sm text-gray-700'
              >
                Enable Analytics
              </label>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Email Settings</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Provider
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.emailProvider}
                onChange={e =>
                  handleInputChange('emailProvider', e.target.value)
                }
              >
                <option value='smtp'>SMTP</option>
                <option value='sendgrid'>SendGrid</option>
                <option value='mailgun'>Mailgun</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SMTP Host
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.smtpHost}
                onChange={e => handleInputChange('smtpHost', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SMTP Port
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.smtpPort}
                onChange={e =>
                  handleInputChange('smtpPort', parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SMTP Username
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.smtpUsername}
                onChange={e =>
                  handleInputChange('smtpUsername', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SMTP Password
              </label>
              <input
                type='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.smtpPassword}
                onChange={e =>
                  handleInputChange('smtpPassword', e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Social Media</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Facebook URL
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.facebookUrl}
                onChange={e => handleInputChange('facebookUrl', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Twitter URL
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.twitterUrl}
                onChange={e => handleInputChange('twitterUrl', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Instagram URL
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.instagramUrl}
                onChange={e =>
                  handleInputChange('instagramUrl', e.target.value)
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('common.linkedinUrl')}
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.linkedinUrl}
                onChange={e => handleInputChange('linkedinUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>
            {t('common.maintenance')}
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='maintenanceMode'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.maintenanceMode}
                onChange={e =>
                  handleInputChange('maintenanceMode', e.target.checked)
                }
              />
              <label
                htmlFor='maintenanceMode'
                className='ml-2 text-sm text-gray-700'
              >
                {t('common.enableMaintenanceMode')}
              </label>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('common.maintenanceMessage')}
              </label>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
                value={settings.maintenanceMessage}
                onChange={e =>
                  handleInputChange('maintenanceMessage', e.target.value)
                }
                placeholder={t('common.maintenancePlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Security</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Session Timeout (minutes)
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.sessionTimeout}
                onChange={e =>
                  handleInputChange('sessionTimeout', parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Max Login Attempts
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.maxLoginAttempts}
                onChange={e =>
                  handleInputChange(
                    'maxLoginAttempts',
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password Min Length
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={settings.passwordMinLength}
                onChange={e =>
                  handleInputChange(
                    'passwordMinLength',
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>Notifications</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='emailNotifications'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.emailNotifications}
                onChange={e =>
                  handleInputChange('emailNotifications', e.target.checked)
                }
              />
              <label
                htmlFor='emailNotifications'
                className='ml-2 text-sm text-gray-700'
              >
                Email Notifications
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='pushNotifications'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.pushNotifications}
                onChange={e =>
                  handleInputChange('pushNotifications', e.target.checked)
                }
              />
              <label
                htmlFor='pushNotifications'
                className='ml-2 text-sm text-gray-700'
              >
                Push Notifications
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='smsNotifications'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={settings.smsNotifications}
                onChange={e =>
                  handleInputChange('smsNotifications', e.target.checked)
                }
              />
              <label
                htmlFor='smsNotifications'
                className='ml-2 text-sm text-gray-700'
              >
                SMS Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
