import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../shared/i18n'
import { useGuides } from '../../features/guides/model/useGuides'
import styles from './GuidesSection.module.css'

function GuidesSection() {
  const { t, lang } = useI18n()
  const { data: guides = [], isLoading, isError, refetch } = useGuides()
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

  return (
    <section className={`${styles.section} ${visible ? styles.isVisible : ''}`} ref={ref} aria-labelledby="about-team-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>{t('about.team_eyebrow')}</p>
        <h2 className={styles.title} id="about-team-title">
          {t('about.team_title')}
        </h2>
        <p className={styles.description}>{t('about.team_description')}</p>

        {isLoading ? (
          <div className={styles.state} role="status">{t('publicUi.guides.loading')}</div>
        ) : isError ? (
          <div className={styles.state} role="alert">
            <p>{t('publicUi.guides.error')}</p>
            <button type="button" onClick={() => refetch()}>{t('publicUi.retry')}</button>
          </div>
        ) : guides.length === 0 ? (
          <p className={styles.state}>{t('publicUi.guides.empty')}</p>
        ) : (
          <div className={styles.guidesGrid}>
            {guides.map((guide) => {
              const role = typeof guide.role === 'object' && guide.role !== null
                ? guide.role[lang] || guide.role.ru
                : guide.role

              return (
                <article key={guide.id} className={styles.guideCard}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className={styles.avatar}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.meta}>
                    <h3 className={styles.name}>{guide.name}</h3>
                    {role && <span className={styles.role}>{role}</span>}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default GuidesSection
