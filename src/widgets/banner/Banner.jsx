import PropTypes from 'prop-types'
import { useI18n } from '../../shared/i18n'
import defaultBannerImage from '../assets/hero-img.png'
import styles from './Banner.module.css'

function Banner({
  title = 'Откройте природу. Найдите свой отдых.',
  subtitle = 'ИССЛЕДУЙТЕ МИР',
  subtitle2 = 'Найдите свой идеальный тур и отправляйтесь в незабываемое приключение.',
  description,
  bgImage = defaultBannerImage,
  buttonText = 'Откройте сейчас',
  showSearchForm = true,
}) {
  const { t } = useI18n()

  function handleSearch(event) {
    event.preventDefault()
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
          <p className={styles.subtitle}>{subtitle}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle2}>{subtitle2}</p>
          {description && <p className={styles.description}>{description}</p>}
          <a className={styles.ctaButton} href="#tours">
            {buttonText} 
          </a>
        </div>

        {showSearchForm && (
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <label className={styles.searchField}>
              <span>{t('banner.destination')}</span>
              <select defaultValue="">
                <option value="">{t('banner.any_destination')}</option>
                <option value="kyrgyzstan">{t('banner.kyrgyzstan')}</option>
                <option value="issyk_kul">{t('banner.issyk_kul')}</option>
              </select>
            </label>
            <label className={styles.searchField}>
              <span>{t('banner.date_from')}</span>
              <input type="date" aria-label={t('banner.date_from')} />
            </label>
            <label className={styles.searchField}>
              <span>{t('banner.date_to')}</span>
              <input type="date" aria-label={t('banner.date_to')} />
            </label>
            <label className={styles.searchField}>
              <span>{t('banner.travelers')}</span>
              <select defaultValue="2">
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
