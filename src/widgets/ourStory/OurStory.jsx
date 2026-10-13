import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../shared/i18n'
import storyImage from '../../shared/assets/горы.jpg'
import styles from './OurStory.module.css'

function OurStory() {
  const { t } = useI18n()
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
    <section className={`${styles.container} ${visible ? styles.isVisible : ''}`} ref={ref} aria-labelledby="our-story-title">
      <div className={styles.imageWrapper}>
        <img src={storyImage} alt={t('about.story_image_alt')} loading="lazy" />
        <div className={styles.yearBadge}>
          <span className={styles.year}>{t('about.story_year')}</span>
          <span className={styles.yearText}>{t('about.story_year_text')}</span>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.tag}>{t('about.story_tag')}</p>
        <h2 className={styles.title} id="our-story-title">
          {t('about.story_title')}
        </h2>
        <p className={styles.text}>{t('about.story_p1')}</p>
        <p className={styles.text}>{t('about.story_p2')}</p>
      </div>
    </section>
  )
}

export default OurStory
