import { useI18n } from '../../shared/i18n'
import heroImage from '../assets/hero-img.png'
import './ContactHero.scss'

function ContactHero() {
  const { t } = useI18n()

  return (
    <section
      className="contact-hero"
      id="contact-hero"
      style={{ '--contact-hero-image': `url("${heroImage}")` }}
      aria-labelledby="contact-hero-title"
    >
      <div className="contact-container contact-hero__content">
        <p className="contact-hero__eyebrow">{t('contactPage.hero_eyebrow')}</p>
        <h1 className="contact-hero__title" id="contact-hero-title">
          {t('contactPage.hero_title')}
        </h1>
        <p className="contact-hero__description">{t('contactPage.hero_description')}</p>
        <a className="contact-hero__button" href="#contact-callback">
          {t('contactPage.hero_cta')}
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h12.5M10 3.75 16.25 10 10 16.25" />
          </svg>
        </a>
      </div>
    </section>
  )
}

export default ContactHero
