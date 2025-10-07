import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

type Consent = {
  necessary: boolean;
  analytics: boolean;
  timestamp: string;
};

const STORAGE_KEY = 'cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // ignore storage failures (e.g., private mode)
      void 0;
    }
  };

  const acceptAll = () => {
    save({
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  };

  const decline = () => {
    save({
      necessary: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className='fixed inset-x-0 bottom-0 z-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6'>
        <div className='bg-whitebg-neutral-900 border border-neutral-200border-neutral-700 rounded-2xl shadow-milano p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
          <div className='text-sm text-neutral-700text-neutral-200'>
            {t('cookie.message')}{' '}
            <a className='underline hover:text-accent-600' href='/privacy'>
              {t('cookie.privacyPolicy')}
            </a>
            .
          </div>
          <div className='ml-auto flex gap-2'>
            <button onClick={decline} className='btn btn-outline'>
              {t('cookie.decline')}
            </button>
            <button onClick={acceptAll} className='btn btn-primary'>
              {t('cookie.acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// moved helper to src/lib/consent.ts to keep this file component-only
