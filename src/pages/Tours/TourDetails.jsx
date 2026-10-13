import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import { useTour } from '../../shared/api/useTour'
import styles from './TourDetails.module.css'

function formatPrice(price, currency, lang, t) {
  if (price == null) return t('publicUi.tourDetails.price_unknown')

  const locale = { ru: 'ru-RU', en: 'en-US', kg: 'ky-KG', ja: 'ja-JP' }[lang] || 'ru-RU'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'KGS',
    maximumFractionDigits: 0,
  }).format(price)
}

function TourDetails() {
  const { tourId } = useParams()
  const { t, lang } = useI18n()
  const { data: tour, isLoading, isError, refetch } = useTour(tourId)

  if (isLoading) {
    return <main className={styles.state} role="status">{t('publicUi.tourDetails.loading')}</main>
  }

  if (isError) {
    return (
      <main className={styles.state} role="alert">
        <p>{t('publicUi.tourDetails.error')}</p>
        <button type="button" onClick={() => refetch()}>{t('publicUi.retry')}</button>
        <Link to="/tours">{t('publicUi.tourDetails.back')}</Link>
      </main>
    )
  }

  if (!tour) {
    return <main className={styles.state}>{t('publicUi.tourDetails.not_found')}</main>
  }

  const images = [tour.cover_image, ...(tour.gallery || [])].filter(Boolean)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} to="/tours">← {t('publicUi.tourDetails.all_tours')}</Link>

        <div className={styles.hero}>
          <img className={styles.cover} src={tour.cover_image} alt={tour.title} />
          <div className={styles.heroContent}>
            {tour.tags?.length > 0 && (
              <ul className={styles.tags}>
                {tour.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
            <h1>{tour.title}</h1>
            {tour.subtitle && <p className={styles.subtitle}>{tour.subtitle}</p>}
            <p className={styles.price}>
              {t('publicUi.catalog.from')} {formatPrice(tour.price_from, tour.price_currency, lang, t)}
            </p>
            <p className={styles.meta}>
              {tour.duration_days ? t('publicUi.tourDetails.days').replace('{count}', tour.duration_days) : ''}
              {tour.duration_days && tour.difficulty ? ' · ' : ''}
              {tour.difficulty ? `${t('publicUi.tourDetails.difficulty')}: ${tour.difficulty}` : ''}
            </p>
          </div>
        </div>

        {tour.description && (
          <section className={styles.section}>
            <h2>{t('publicUi.tourDetails.about')}</h2>
            <p>{tour.description}</p>
          </section>
        )}

        {images.length > 1 && (
          <section className={styles.section}>
            <h2>{t('publicUi.tourDetails.gallery')}</h2>
            <div className={styles.gallery}>
              {images.slice(1).map((image, index) => (
                <img key={image} src={image} alt={`${tour.title} — ${t('publicUi.tourDetails.photo')} ${index + 1}`} loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {tour.program?.length > 0 && (
          <section className={styles.section}>
            <h2>{t('publicUi.tourDetails.program')}</h2>
            <ol className={styles.program}>
              {tour.program.map((day) => (
                <li key={day.day}>
                  <h3>{t('publicUi.tourDetails.day').replace('{day}', day.day)}: {day.title}</h3>
                  <p>{day.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tour.included?.length > 0 && (
          <section className={styles.section}>
            <h2>{t('publicUi.tourDetails.included')}</h2>
            <ul className={styles.list}>
              {tour.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {tour.to_bring?.length > 0 && (
          <section className={styles.section}>
            <h2>{t('publicUi.tourDetails.to_bring')}</h2>
            <ul className={styles.list}>
              {tour.to_bring.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

export default TourDetails
