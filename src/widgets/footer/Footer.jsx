import logo from '../assets/logo-mark.jpeg'
import { useI18n } from '../../shared/i18n'
import styles from './Footer.module.css'

const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/+996',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5a10 10 0 0 0-15.8 12l-1.2 4.4 4.5-1.2a10 10 0 0 0 12.5-15.2ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.1.9 2.2a9 9 0 0 0 3.5 3.1c.5.2.9.4 1.2.5.5.1.9.1 1.3.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/turgon_baidarka/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.25" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Kayak-Turgon-Kyrgyzstan/61590817913369/?rdid=eCiGOlkKNY4ftgTg&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18shNKGjng%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
      </svg>
    ),
  },
]

function Footer() {
  const { t } = useI18n()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo} aria-label="Байдаркен — главная">
              <img src={logo} alt="" className={styles.logoIcon} />
              <span className={styles.logoText}>Байдаркен</span>
            </a>
            <p className={styles.description}>{t('footer.description')}</p>
          </div>

          <div className={styles.linkColumns}>
            <section className={styles.linkColumn}>
              <h2 className={styles.columnTitle}>{t('footer.company')}</h2>
              <a href="#about">{t('nav.about')}</a>
              <a href="#reviews">{t('nav.reviews')}</a>
              <a href="/contacts">{t('nav.contacts')}</a>
            </section>

            <section className={styles.linkColumn}>
              <h2 className={styles.columnTitle}>{t('footer.travel')}</h2>
              <a href="#tours">{t('nav.tours')}</a>
              <a href="#blog">{t('nav.blog')}</a>
              <a href="#book">{t('footer.choose_tour')}</a>
            </section>

            <section className={styles.linkColumn}>
              <h2 className={styles.columnTitle}>{t('footer.help')}</h2>
              <a href="/contacts#faq">{t('nav.faq')}</a>
              <a href="#terms">{t('footer.terms')}</a>
              <a href="#payment">{t('footer.payment')}</a>
            </section>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{t('footer.copyright')}</p>
          <div className={styles.socialLinks}>
            {socialLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                className={styles.socialLink}
                aria-label={t(`footer.social.${name.toLowerCase()}`)}
                target="_blank"
                rel="noreferrer"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
