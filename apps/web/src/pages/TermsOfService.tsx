import { useLanguage } from '../hooks/useLanguage'

export default function TermsOfService() {
  const { t } = useLanguage()
  
  return (
    <div className="container section">
      <h1 className="heading-2 mb-4">{t('terms.title')}</h1>
      <div className="proseprose-invert max-w-none">
        <h2>{t('terms.useOfService')}</h2>
        <p>{t('terms.useOfServiceText')}</p>
        <h2>{t('terms.accounts')}</h2>
        <p>{t('terms.accountsText')}</p>
        <h2>{t('terms.content')}</h2>
        <p>{t('terms.contentText')}</p>
        <h2>{t('terms.liability')}</h2>
        <p>{t('terms.liabilityText')}</p>
        <h2>{t('terms.contact')}</h2>
        <p>{t('terms.contactText')} <a href="mailto:legal@linea.app">legal@linea.app</a>.</p>
      </div>
    </div>
  )
}
