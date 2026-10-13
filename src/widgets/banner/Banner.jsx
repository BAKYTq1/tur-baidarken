import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import defaultBannerImage from '../assets/hero-img.png'
import styles from './Banner.module.css'


const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
function Banner({
  title,
  subtitle,
  subtitle2,
  description,
  bgImage = defaultBannerImage,
  buttonText,
  showSearchForm = true,
}) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const bannerTitle = title || t('banner.title')
  const bannerSubtitle = subtitle || t('banner.subtitle')
  const bannerSubtitle2 = subtitle2 || t('banner.subtitle2')
  const bannerButtonText = buttonText || t('banner.button')
  const [form, setForm] = useState({
    destination: '',
    travelers: '2',
  })

  function handleSearch(event) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (form.destination) params.set('destination', form.destination)
    if (form.travelers) params.set('travelers', form.travelers)

    navigate(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function handleExploreTours(event) {
    event.preventDefault()

    if (window.location.pathname === '/tours') {
      const catalog = document.getElementById('catalog')
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    navigate('/tours')
  }

  return (
    <section
      className={styles.banner}
      style={{
        backgroundImage: `url("${bgImage}")`,
      }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.subtitle}>{bannerSubtitle}</p>
          <h1 className={styles.title}>{bannerTitle}</h1>
          <p className={styles.subtitle2}>{bannerSubtitle2}</p>
          {description && <p className={styles.description}>{description}</p>}
          <button type="button" className={styles.ctaButton} onClick={handleExploreTours}>
            {bannerButtonText} <ArrowIcon />
          </button>
        </div>

        {showSearchForm && (
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <label className={styles.searchField}>
              <span>{t('banner.destination')}</span>
              <select
                value={form.destination}
                onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
              >
                <option value="">{t('banner.any_destination')}</option>
                <option value="kyrgyzstan">{t('banner.kyrgyzstan')}</option>
                <option value="issyk_kul">{t('banner.issyk_kul')}</option>
                <option value="almaty">{t('banner.almaty')}</option>
                <option value="pamir">{t('banner.pamir')}</option>
                <option value="aigul">{t('banner.aigul')}</option>
              </select>
            </label>

            <label className={styles.searchField}>
              <span>{t('banner.travelers')}</span>
              <select
                value={form.travelers}
                onChange={(e) => setForm((prev) => ({ ...prev, travelers: e.target.value }))}
              >
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {t('banner.travelers_count').replace('{count}', count)}
                  </option>
                ))}
              </select>
            </label>

            <button className={styles.searchButton} type="submit">
              {t('banner.search')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

Banner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  bgImage: PropTypes.string,
  buttonText: PropTypes.string,
  showSearchForm: PropTypes.bool,
  subtitle2: PropTypes.string,
}

export default Banner
