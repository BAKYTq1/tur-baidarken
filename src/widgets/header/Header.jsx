import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-mark.jpeg'
import { useI18n } from '../../shared/i18n'
import { useTours } from '../../shared/api/useTours'
import styles from './Header.module.css'

const FAVORITES_KEY = 'baidarken_favorites'

function readFavorites() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [favoritesVersion, setFavoritesVersion] = useState(0)
  const [headerSearch, setHeaderSearch] = useState('')
  const searchInputRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const mobileSearchContainerRef = useRef(null)
  const favoritesRef = useRef(null)
  const searchToggleRef = useRef(null)
  const mobileSearchToggleRef = useRef(null)
  const burgerRef = useRef(null)
  const headerRef = useRef(null)
  const navigate = useNavigate()
  const { t, lang, setLang, SUPPORTED_LANGS } = useI18n()
  const { data: tours = [] } = useTours()

  const getTourImage = (tour) => (
    tour?.image
    || tour?.cover
    || tour?.photo
    || tour?.thumbnail
    || tour?.images?.[0]
    || tour?.gallery?.[0]
    || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80'
  )

  useEffect(() => {
    const syncFavorites = () => setFavoritesVersion((value) => value + 1)
    window.addEventListener('baidarken-favorites-change', syncFavorites)
    return () => window.removeEventListener('baidarken-favorites-change', syncFavorites)
  }, [])

  const favoriteIds = useMemo(() => readFavorites(), [favoritesVersion, tours.length])
  const favoriteTours = useMemo(
    () => tours.filter((tour) => favoriteIds.includes(String(tour.id || tour.slug))),
    [favoriteIds, tours],
  )

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
    if (!isSearchOpen && !isMobileMenuOpen && !isFavoritesOpen) return undefined

    function handlePointerDown(event) {
      const clickedInsideSearch = searchContainerRef.current?.contains(event.target)
        || mobileSearchContainerRef.current?.contains(event.target)
      const clickedInsideFavorites = favoritesRef.current?.contains(event.target)

      if (isSearchOpen && !clickedInsideSearch) {
        setIsSearchOpen(false)
      }
      if (isFavoritesOpen && !clickedInsideFavorites) {
        setIsFavoritesOpen(false)
      }
      if (isMobileMenuOpen && !headerRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
        setIsFavoritesOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsFavoritesOpen(false)
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
  }, [isSearchOpen, isMobileMenuOpen, isFavoritesOpen])

  function submitHeaderSearch(nextValue = headerSearch) {
    const query = String(nextValue || '').trim()
    const params = new URLSearchParams()

    if (query) {
      params.set('destination', query)
      params.set('q', query)
    }

    setIsSearchOpen(false)
    setHeaderSearch('')
    navigate(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function closeSearch() {
    setIsSearchOpen(false)
    setHeaderSearch('')
    if (window.matchMedia('(max-width: 768px)').matches) {
      mobileSearchToggleRef.current?.focus()
    } else {
      searchToggleRef.current?.focus()
    }
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setIsFavoritesOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container} ref={headerRef}>
        <Link to="/" className={styles.logo} aria-label={`Baidarken — ${t('nav.home')}`}>
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

        {isSearchOpen && !isMobileMenuOpen && (
          <div ref={searchContainerRef} className={styles.expandedSearch}>
            <input
              ref={searchInputRef}
              type="text"
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submitHeaderSearch(event.target.value)
                }
              }}
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
          <div ref={favoritesRef} className={styles.favoritesWrap}>
            <button
              type="button"
              aria-label={t('nav.favorites')}
              className={styles.iconButton}
              onClick={() => setIsFavoritesOpen((open) => !open)}
            >
              <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {favoriteTours.length > 0 && (
                <span className={styles.favoriteBadge}>{favoriteTours.length > 99 ? '99+' : favoriteTours.length}</span>
              )}
            </button>
            {isFavoritesOpen && (
              <div className={styles.favoritesModal} role="dialog" aria-label={t('nav.favorites')}>
                <div className={styles.favoritesHeader}>
                  <strong>{t('nav.favorites')}</strong>
                  <span>{favoriteTours.length}</span>
                </div>

                {favoriteTours.length === 0 ? (
                  <p className={styles.favoritesEmpty}>{t('publicUi.catalog.empty')}</p>
                ) : (
                  <ul className={styles.favoritesList}>
                    {favoriteTours.map((tour) => (
                      <li key={tour.id || tour.slug}>
                        <button
                          type="button"
                          className={styles.favoriteItem}
                          onClick={() => {
                            setIsFavoritesOpen(false)
                            navigate(`/tours/${tour.slug || tour.id}`)
                          }}
                        >
                          <img
                            className={styles.favoriteItemImage}
                            src={getTourImage(tour)}
                            alt={tour.title || tour.name || 'Tour'}
                          />
                          <span className={styles.favoriteItemText}>{tour.title || tour.name || 'Tour'}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
              <li><Link to="/about" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.about')}</Link></li>
              <li><Link to="/tours" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.tours')}</Link></li>
              <li><Link to="/reviews" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.reviews')}</Link></li>
              <li><Link to="/blog" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.blog')}</Link></li>
              <li><Link to="/contacts" className={styles.navLink} onClick={closeMobileMenu}>{t('nav.contacts')}</Link></li>
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
              <div ref={favoritesRef} className={styles.favoritesWrap}>
                <button
                  type="button"
                  aria-label={t('nav.favorites')}
                  className={styles.iconButton}
                  onClick={() => setIsFavoritesOpen((open) => !open)}
                >
                  <svg aria-hidden="true" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {favoriteTours.length > 0 && (
                    <span className={styles.favoriteBadge}>{favoriteTours.length > 99 ? '99+' : favoriteTours.length}</span>
                  )}
                </button>
                {isFavoritesOpen && (
                  <div className={styles.favoritesModal} role="dialog" aria-label={t('nav.favorites')}>
                    <div className={styles.favoritesHeader}>
                      <strong>{t('nav.favorites')}</strong>
                      <span>{favoriteTours.length}</span>
                    </div>
                    {favoriteTours.length === 0 ? (
                      <p className={styles.favoritesEmpty}>{t('publicUi.catalog.empty')}</p>
                    ) : (
                      <ul className={styles.favoritesList}>
                        {favoriteTours.map((tour) => (
                          <li key={tour.id || tour.slug}>
                            <button
                              type="button"
                              className={styles.favoriteItem}
                              onClick={() => {
                                setIsFavoritesOpen(false)
                                navigate(`/tours/${tour.slug || tour.id}`)
                              }}
                            >
                              <img
                                className={styles.favoriteItemImage}
                                src={getTourImage(tour)}
                                alt={tour.title || tour.name || 'Tour'}
                              />
                              <span className={styles.favoriteItemText}>{tour.title || tour.name || 'Tour'}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div
                ref={mobileSearchContainerRef}
                className={styles.mobileSearchContainer}
              >
                {isSearchOpen ? (
                  <>
                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={headerSearch}
                      onChange={(event) => setHeaderSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          submitHeaderSearch(event.target.value)
                        }
                      }}
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
