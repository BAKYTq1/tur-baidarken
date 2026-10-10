import Banner from '../../widgets/banner/Banner'
import OurStory from '../../widgets/ourStory/OurStory'
import AboutPrinciples from '../../widgets/aboutPrinciples/AboutPrinciples'
import GuidesSection from '../../widgets/aboutTeam/GuidesSection'
import AboutTrust from '../../widgets/aboutTrust/AboutTrust'
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
      <GuidesSection />
      <AboutTrust />
    </main>
  )
}

export default About
