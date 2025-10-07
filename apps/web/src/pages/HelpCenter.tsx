import { useLanguage } from '../hooks/useLanguage';

export default function HelpCenter() {
  const { t } = useLanguage();

  return (
    <div className='container section'>
      <h1 className='heading-2 mb-4'>{t('help.title')}</h1>
      <p className='text-body mb-6'>{t('help.subtitle')}</p>
      <div className='proseprose-invert max-w-none'>
        <h2>{t('help.gettingStarted')}</h2>
        <p>{t('help.gettingStartedText')}</p>
        <h2>{t('help.account')}</h2>
        <p>{t('help.accountText')}</p>
        <h2>{t('help.events')}</h2>
        <p>{t('help.eventsText')}</p>
        <h2>{t('help.contact')}</h2>
        <p>
          {t('help.contactText')}{' '}
          <a href='mailto:support@linea.app'>support@linea.app</a>.
        </p>
      </div>
    </div>
  );
}
