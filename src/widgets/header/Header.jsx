import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-mark.jpeg'
import { useI18n } from '../../shared/i18n'
import styles from './Header.module.css'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const mobileSearchContainerRef = useRef(null)
  const searchToggleRef = useRef(null)
  const mobileSearchToggleRef = useRef(null)
  const burgerRef = useRef(null)
  const headerRef = useRef(null)
  const { t, lang, setLang, SUPPORTED_LANGS } = useI18n()

  useEffect(() => {
    if (isSearchOpen) {
      if (window.matchMedia('(max-width: 768px)').matches && isMobileMenuOpen) {
        mobileSearchInputRef.current?.focus()
      } else {
        searchInputRef.current?.focus()
      }
    }
  }, [isSearchOpen, isMobileMenuOpen])

  useEffect(() => {
    if (!isSearchOpen && !isMobileMenuOpen) return undefined

    function handlePointerDown(event) {
      const clickedInsideSearch = searchContainerRef.current?.contains(event.target)
        || mobileSearchContainerRef.current?.contains(event.target)
      if (isSearchOpen && !clickedInsideSearch) {
        setIsSearchOpen(false)
      }
      if (isMobileMenuOpen && !headerRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileMenuOpen(false)
        if (window.matchMedia('(max-width: 768px)').matches) {
          burgerRef.current?.focus()
        } else {
          searchToggleRef.current?.focus()
        }
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen, isMobileMenuOpen])

  function closeSearch() {
    setIsSearchOpen(false)
    if (window.matchMedia('(max-width: 768px)').matches) {
      mobileSearchToggleRef.current?.focus()
    } else {
      searchToggleRef.current?.focus()
    }
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container} ref={headerRef}>
        <Link to="/" className={styles.logo} aria-label="Байдаркен — главная">
          <img src={logo} alt="Байдаркен" className={styles.logoIcon} />
          <span className={styles.logoText}>Байдаркен</span>
        </Link>

        {!isSearchOpen && (
          <nav className={styles.desktopNav} aria-label={t('nav.aria_label')}>
            <ul className={styles.navList}>
              <li><NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.home')}</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.about')}</NavLink></li>
              <li><NavLink to="/tours" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.tours')}</NavLink></li>
              <li><NavLink to="/reviews" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.reviews')}</NavLink></li>
              <li><NavLink to="/blog" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.blog')}</NavLink></li>
              <li><NavLink to="/contacts" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>{t('nav.contacts')}</NavLink></li>
            </ul>
          </nav>
        )}

        {isSearchOpen && (
          <div ref={searchContainerRef} className={styles.expandedSearch}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder={t('nav.search')}
              aria-label={t('nav.search')}
              className={styles.searchInput}
            />
            <button
              type="button"
              aria-label={t('nav.search_close')}
              className={styles.closeButton}
              onClick={closeSearch}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}

        <div className={styles.actions}>
          {!isSearchOpen && (
            <button
              ref={searchToggleRef}
              type="button"
              aria-label={t('nav.search_open')}
              aria-expanded={isSearchOpen}
              className={styles.iconButton}
              onClick={() => setIsSearchOpen(true)}
            >
              <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" strokeLinecap="round" />
              </svg>
            </button>
          )}
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

        <button
          type="button"
          className={styles.burgerBtn}
          aria-label={t(isMobileMenuOpen ? 'nav.menu_close' : 'nav.menu_open')}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setIsMobileMenuOpen((open) => !open)
            setIsSearchOpen(false)
          }}
        >
          <span aria-hidden="true">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>

        {isMobileMenuOpen && (
          <nav
            className={styles.mobileMenu}
            id="mobile-navigation"
            aria-label={t('nav.aria_label')}
          >
            <ul className={styles.mobileNavLinks}>
              <li><Link to="/" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.home')}</Link></li>
              <li><a href="#about" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.about')}</a></li>
              <li><Link to="/tours" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.tours')}</Link></li>
              <li><a href="#reviews" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.reviews')}</a></li>
              <li><Link to="/blog" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.blog')}</Link></li>
              <li><a href="#contacts" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.contacts')}</a></li>
            </ul>
            <div className={styles.mobileMenuControls}>
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
              <div
                ref={mobileSearchContainerRef}
                className={styles.mobileSearchContainer}
              >
                {isSearchOpen ? (
                  <>
                    <input
                      ref={mobileSearchInputRef}
                      type="search"
                      placeholder={t('nav.search')}
                      aria-label={t('nav.search')}
                      className={styles.searchInput}
                    />
                    <button
                      type="button"
                      aria-label={t('nav.search_close')}
                      className={styles.closeButton}
                      onClick={closeSearch}
                    >
                      <span aria-hidden="true">✕</span>
                    </button>
                  </>
                ) : (
                  <button
                    ref={mobileSearchToggleRef}
                    type="button"
                    className={styles.mobileSearchButton}
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" strokeLinecap="round" />
                    </svg>
                    {t('nav.search')}
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
