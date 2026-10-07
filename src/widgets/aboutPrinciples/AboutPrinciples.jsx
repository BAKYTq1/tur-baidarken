import { useI18n } from '../../shared/i18n'
import styles from './AboutPrinciples.module.css'

const values = [
  {
    id: 'nature',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 4c-8.5 0-14 3.5-14 10a6 6 0 0 0 6 6c6.5 0 8-7.5 8-16Z" />
        <path d="M4 21c1.5-4 5-7 10-10" />
      </svg>
    ),
  },
  {
    id: 'people',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'curiosity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
      </svg>
    ),
  },
]

const stats = [
  { value: '9', label: 'about.stats.years' },
  { value: '12 480', label: 'about.stats.travelers' },
  { value: '42', label: 'about.stats.guides' },
  { value: '4,9', label: 'about.stats.rating' },
]

function AboutPrinciples() {
  const { t } = useI18n()

  return (
    <>
      <section className={styles.valuesSection} aria-labelledby="about-values-title">
        <div className={styles.valuesInner}>
          <p className={styles.eyebrow}>{t('about.values_eyebrow')}</p>
          <h2 className={styles.title} id="about-values-title">
            {t('about.values_title')}
          </h2>
          <p className={styles.intro}>{t('about.values_description')}</p>
          <div className={styles.cards}>
            {values.map(({ id, icon }) => (
              <article className={styles.card} key={id}>
                <span className={styles.icon}>{icon}</span>
                <h3 className={styles.cardTitle}>{t(`about.values.${id}.title`)}</h3>
                <p className={styles.cardText}>{t(`about.values.${id}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.statsSection} aria-label={t('about.stats.label')}>
        <div className={styles.statsInner}>
          {stats.map(({ value, label }) => (
            <div className={styles.stat} key={label}>
              <strong className={styles.statValue}>{value}</strong>
              <span className={styles.statLabel}>{t(label)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default AboutPrinciples
