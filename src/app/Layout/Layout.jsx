import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../widgets/header/Header'
import Footer from '../../widgets/footer/Footer'
import { useI18n } from '../../shared/i18n'
import styles from './Layout.module.css'

function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div>
      <Header />
      <div className={styles.headerSpacer} aria-hidden="true" />
      <Outlet />
      <Footer />
      <a
        className={styles.whatsappButton}
        href="https://wa.me/998555482020"
        target="_blank"
        rel="noreferrer"
        aria-label={t('footer.social.whatsapp')}
        title={t('footer.social.whatsapp')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 3.5a10 10 0 0 0-15.8 12l-1.2 4.4 4.5-1.2a10 10 0 0 0 12.5-15.2ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.1.9 2.2a9 9 0 0 0 3.5 3.1c.5.2.9.4 1.2.5.5.1.9.1 1.3.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      </a>
    </div>
  )
}

export default Layout
