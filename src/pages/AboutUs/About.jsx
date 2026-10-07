import Banner from '../../widgets/banner/Banner'
import OurStory from '../../widgets/ourStory/OurStory'
import AboutPrinciples from '../../widgets/aboutPrinciples/AboutPrinciples'
import AboutTeam from '../../widgets/aboutTeam/AboutTeam'
import AboutTrust from '../../widgets/aboutTrust/AboutTrust'
import Newsletter from '../../shared/newsletter/Newsletter'
import { useI18n } from '../../shared/i18n'
import aboutBannerImage from '../../shared/assets/about.png'

function About() {
  const { t } = useI18n()

  return (
    <main>
      <Banner
        subtitle={t('about.banner_subtitle')}
        title={t('about.banner_title')}
        description={t('about.banner_description')}
        buttonText={t('about.banner_button')}
        showSearchForm={false}
        bgImage={aboutBannerImage}
      />
      <OurStory />
      <AboutPrinciples />
      <AboutTeam />
      <AboutTrust />
      <Newsletter />
    </main>
  )
}

export default About
