import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo-mark.jpeg'
import { useI18n } from '../../shared/i18n'
import styles from './Header.module.css'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const { t, lang, setLang, SUPPORTED_LANGS } = useI18n()

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo} aria-label="Байдаркен — главная">
          <img src={logo} alt="Байдаркен" className={styles.logoIcon} />
          <span className={styles.logoText}>Байдаркен</span>
        </a>

        <nav aria-label={t('nav.aria_label')}>
          <ul className={styles.navList}>
            <li><a href="/" className={`${styles.navLink} ${styles.activeLink}`} aria-current="page">{t('nav.home')}</a></li>
            <li><a href="#about" className={styles.navLink}>{t('nav.about')}</a></li>
            <li><a href="#tours" className={styles.navLink}>{t('nav.tours')}</a></li>
            <li><a href="#reviews" className={styles.navLink}>{t('nav.reviews')}</a></li>
            <li><a href="#blog" className={styles.navLink}>{t('nav.blog')}</a></li>
            <li><a href="/contacts" className={styles.navLink}>{t('nav.contacts')}</a></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <div
            className={`${styles.searchField} ${isSearchOpen ? styles.searchFieldOpen : ''}`}
            aria-hidden={!isSearchOpen}
          >
            <input
              ref={searchInputRef}
              tabIndex={isSearchOpen ? 0 : -1}
              type="text"
              placeholder={t('nav.search')}
              aria-label={t('nav.search')}
              className={styles.searchInput}
            />
          </div>
          <button
            type="button"
            aria-label={t(isSearchOpen ? 'nav.search_close' : 'nav.search_open')}
            aria-expanded={isSearchOpen}
            className={styles.iconButton}
            onClick={() => setIsSearchOpen((open) => !open)}
          >
            <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="Избранное" className={styles.iconButton}>
            <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <label className={styles.languageSelector}>
            <span className={styles.visuallyHidden}>{t('nav.language')}</span>
            <select
              value={lang}
              onChange={(event) => setLang(event.target.value)}
              className={styles.languageSelect}
            >
              {SUPPORTED_LANGS.map((code) => (
                <option key={code} value={code}>{code.toUpperCase()}</option>
              ))}
            </select>
            <svg aria-hidden="true" className={styles.languageChevron} viewBox="0 0 16 16" fill="none">
              <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>
      </div>
    </header>
  )
}

export default Header
