import { useI18n } from '../../shared/i18n'
import aidanaImage from '../../shared/assets/горы.jpg'
import ilyaImage from '../../widgets/assets/hero-img.png'
import zarinaImage from '../../shared/assets/gory_zakat_pejzazh_144200_300x188.jpg'
import styles from './AboutTeam.module.css'

const team = [
  { id: 'aidana', image: aidanaImage },
  { id: 'ilya', image: ilyaImage },
  { id: 'zarina', image: zarinaImage },
]

function AboutTeam() {
  const { t } = useI18n()

  return (
    <section className={styles.section} aria-labelledby="about-team-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>{t('about.team_eyebrow')}</p>
        <h2 className={styles.title} id="about-team-title">
          {t('about.team_title')}
        </h2>
        <p className={styles.description}>{t('about.team_description')}</p>
        <div className={styles.grid}>
          {team.map(({ id, image }) => (
            <article className={styles.card} key={id}>
              <div className={styles.imageWrapper}>
                <img src={image} alt="" loading="lazy" />
              </div>
              <h3 className={styles.name}>{t(`about.team.${id}.name`)}</h3>
              <p className={styles.role}>{t(`about.team.${id}.role`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutTeam
