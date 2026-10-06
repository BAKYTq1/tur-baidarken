import Banner from '../../widgets/banner/Banner'
import { useI18n } from '../../shared/i18n'

export function Home() {
  const { t } = useI18n()

  return (
    <main>
      <Banner
        title={t('banner.title')}
        subtitle={t('banner.subtitle')}
        buttonText={t('banner.button')}
      />
    </main>
  );
}