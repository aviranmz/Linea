import { useLanguage } from '../hooks/useLanguage'

export default function Contact() {
  const { t } = useLanguage()
  
  return (
    <div className="container section">
      <h1 className="heading-2 mb-4">{t('contact.title')}</h1>
      <p className="text-body mb-6">{t('contact.subtitle')}</p>
      <div className="proseprose-invert max-w-none">
        <p>{t('contact.email')}: <a href="mailto:support@linea.app">support@linea.app</a></p>
        <p>{t('contact.issuesNote')}</p>
      </div>
    </div>
  )
}
