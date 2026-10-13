import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../shared/i18n'
import { usePublishedReviews } from '../../shared/api/useReviews'
import styles from './AboutTrust.module.css'

const trustItems = ['award', 'nature', 'guides']

function AboutTrust() {
  const { t } = useI18n()
  const { data: reviews = [] } = usePublishedReviews()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const validReviews = reviews.filter((review) => Number.isFinite(Number(review?.rating)))

  if (!validReviews.length) {
    return null
  }

  const average = validReviews.reduce((sum, review) => sum + Number(review.rating), 0) / validReviews.length
  const featuredReview = validReviews[0]
  const quote = featuredReview?.text || t('about.trust.quote')
  const attribution = featuredReview?.name ? `— ${featuredReview.name}` : t('about.trust.attribution')
  const ratingSuffix = t('about.trust.rating_suffix') || 'из 5'
  const ratingText = `${average.toFixed(1).replace('.', ',')} ${ratingSuffix}`

  return (
    <section className={`${styles.section} ${visible ? styles.isVisible : ''}`} ref={ref} aria-label={t('about.trust.label')}>
      <div className={styles.container}>
        <div className={styles.testimonial}>
          <div className={styles.rating} aria-label={t('about.trust.rating_aria')}>
            <span className={styles.stars} aria-hidden="true">★★★★★</span>
            <strong>{ratingText}</strong>
          </div>
          <blockquote className={styles.quote}>
            “{quote}”
          </blockquote>
          <p className={styles.attribution}>{attribution}</p>
        </div>

        <div className={styles.trustCard}>
          <h2 className={styles.trustTitle}>{t('about.trust.title')}</h2>
          <ul className={styles.trustList}>
            {trustItems.map((item, index) => (
              <li className={styles.trustItem} key={item}>
                <span className={styles.trustMark}>{index + 1}</span>
                <span>{t(`about.trust.items.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AboutTrust
