import { useLanguage } from '../hooks/useLanguage';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className='container section'>
      <h1 className='heading-2 mb-4'>{t('privacy.title')}</h1>
      <p className='text-body mb-6'>{t('privacy.subtitle')}</p>
      <div className='proseprose-invert max-w-none'>
        <h2>{t('privacy.collection')}</h2>
        <p>{t('privacy.collectionText')}</p>
        <h2>{t('privacy.use')}</h2>
        <p>{t('privacy.useText')}</p>
        <h2>{t('privacy.cookies')}</h2>
        <p>{t('privacy.cookiesText')}</p>
        <h2>{t('privacy.retention')}</h2>
        <p>{t('privacy.retentionText')}</p>
        <h2>{t('privacy.rights')}</h2>
        <p>
          {t('privacy.rightsText')}{' '}
          <a href='mailto:privacy@linea.app'>privacy@linea.app</a>.
        </p>
      </div>
    </div>
  );
}
