import { useI18n } from '../../shared/i18n'
import styles from './AboutTrust.module.css'

const trustItems = ['award', 'nature', 'guides']

function AboutTrust() {
  const { t } = useI18n()

  return (
    <section className={styles.section} aria-label={t('about.trust.label')}>
      <div className={styles.container}>
        <div className={styles.testimonial}>
          <div className={styles.rating} aria-label={t('about.trust.rating_aria')}>
            <span className={styles.stars} aria-hidden="true">★★★★★</span>
            <strong>{t('about.trust.rating')}</strong>
          </div>
          <blockquote className={styles.quote}>
            “{t('about.trust.quote')}”
          </blockquote>
          <p className={styles.attribution}>{t('about.trust.attribution')}</p>
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
