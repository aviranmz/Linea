import { useLanguage } from '../hooks/useLanguage'

export default function HelpCenter() {
  const { t } = useLanguage()
  
  return (
    <div className="container section">
      <h1 className="heading-2 mb-4">{t('help.title')}</h1>
      <p className="text-body mb-6">{t('help.subtitle')}</p>
      <div className="proseprose-invert max-w-none">
        <h2>{t('help.gettingStarted')}</h2>
        <p>{t('help.gettingStartedText')}</p>
        <h2>{t('help.accountPrivacy')}</h2>
        <p>{t('help.accountPrivacyText')}</p>
        <h2>{t('help.contactSupport')}</h2>
        <p>{t('help.contactSupportText')}</p>
      </div>
    </div>
  )
}
