import { Link, useParams } from 'react-router-dom'
import { useTour } from '../../shared/api/useTour'
import styles from './TourDetails.module.css'

function formatPrice(price, currency) {
  if (price == null) return 'Цена уточняется'

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency || 'KGS',
    maximumFractionDigits: 0,
  }).format(price)
}

function TourDetails() {
  const { tourId } = useParams()
  const { data: tour, isLoading, isError, refetch } = useTour(tourId)

  if (isLoading) {
    return <main className={styles.state} role="status">Загрузка информации о туре...</main>
  }

  if (isError) {
    return (
      <main className={styles.state} role="alert">
        <p>Не удалось загрузить информацию о туре.</p>
        <button type="button" onClick={() => refetch()}>Повторить</button>
        <Link to="/tours">Вернуться к турам</Link>
      </main>
    )
  }

  if (!tour) {
    return <main className={styles.state}>Тур не найден.</main>
  }

  const images = [tour.cover_image, ...(tour.gallery || [])].filter(Boolean)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} to="/tours">← Все туры</Link>

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
              от {formatPrice(tour.price_from, tour.price_currency)}
            </p>
            <p className={styles.meta}>
              {tour.duration_days ? `${tour.duration_days} дней` : ''}
              {tour.duration_days && tour.difficulty ? ' · ' : ''}
              {tour.difficulty ? `Сложность: ${tour.difficulty}` : ''}
            </p>
          </div>
        </div>

        {tour.description && (
          <section className={styles.section}>
            <h2>О туре</h2>
            <p>{tour.description}</p>
          </section>
        )}

        {images.length > 1 && (
          <section className={styles.section}>
            <h2>Галерея</h2>
            <div className={styles.gallery}>
              {images.slice(1).map((image, index) => (
                <img key={image} src={image} alt={`${tour.title} — фото ${index + 1}`} loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {tour.program?.length > 0 && (
          <section className={styles.section}>
            <h2>Программа тура</h2>
            <ol className={styles.program}>
              {tour.program.map((day) => (
                <li key={day.day}>
                  <h3>День {day.day}: {day.title}</h3>
                  <p>{day.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tour.included?.length > 0 && (
          <section className={styles.section}>
            <h2>В стоимость включено</h2>
            <ul className={styles.list}>
              {tour.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {tour.to_bring?.length > 0 && (
          <section className={styles.section}>
            <h2>Что взять с собой</h2>
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
