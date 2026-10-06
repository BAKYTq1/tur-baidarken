// pages/Home/Home.jsx
import  "react";
import Features from "../../shared/features/Features";
import PopularDestinations from "../../shared/populardestinations/Populardestinations";
import TravelStories from "../../shared/travelstories/Travelstories";
import PromoBanner from "../../shared/promobanner/PromoBanner";
import Reviews from "../../shared/reviews/Reviews";
import Banner from '../../widgets/banner/Banner'
import { useI18n } from '../../shared/i18n'

export function Home() {
  const { t } = useI18n()

  return (
 <>
    <Features/>
    <PopularDestinations/>
    <TravelStories/>
    <PromoBanner/>
    <Reviews/>
 </>
    <main>
      <Banner
        title={t('banner.title')}
        subtitle={t('banner.subtitle')}
        buttonText={t('banner.button')}
      />
    </main>
  );
}