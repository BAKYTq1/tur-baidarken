// pages/Home/Home.jsx
import "react";
import Features from "../../shared/features/Features";
import PopularDestinations from "../../shared/populardestinations/Populardestinations";
import TravelStories from "../../shared/travelstories/Travelstories";
import PromoBanner from "../../shared/promobanner/PromoBanner";
import Reviews from "../../shared/reviews/Reviews";
import Banner from '../../widgets/banner/Banner';
import { useI18n } from '../../shared/i18n';
import { usePageMeta } from '../../shared/hooks/usePageMeta';

const seoByLang = {
  ru: {
    title: 'Baidarken — туры по Кыргызстану и горные путешествия',
    description: 'Baidarken — туроператор и travel company в Кыргызстане. Горные туры, семейные поездки, треккинг и индивидуальные путешествия по Кыргызстану.',
    keywords: 'Baidarken, туры по кыргызстану, горные туры, travel company Кыргызстан, путешествия по Кыргызстану',
  },
  en: {
    title: 'Baidarken — tours in Kyrgyzstan and adventure travel',
    description: 'Baidarken is a travel company in Kyrgyzstan offering mountain tours, trekking, family trips and private travel experiences.',
    keywords: 'Baidarken, tours in Kyrgyzstan, travel company Kyrgyzstan, mountain tours',
  },
  kg: {
    title: 'Baidarken — Кыргызстандагы саякаттар жана турлар',
    description: 'Baidarken — Кыргызстандагы travel company. Тоолуу турлар, үй-бүлөлүк сапарлар, треккинг жана жеке саяхаттар.',
    keywords: 'Baidarken, кыргызстанга тур, саякат, travel company Кыргызстан',
  },
  ja: {
    title: 'Baidarken — キルギスのツアーと旅行',
    description: 'Baidarkenはキルギスのtravel companyです。山岳ツアー、家族旅行、トレッキング、個別旅行を提供します。',
    keywords: 'Baidarken, キルギス ツアー, travel company, トレッキング',
  },
};

export function Home() {
  const { t, lang } = useI18n();
  const seo = seoByLang[lang] || seoByLang.ru;

  usePageMeta({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    image: 'https://baiderken.onrender.com/api/v1/static/og-tour.jpg',
    url: 'https://baidarken.com/',
    type: 'website',
    locale: `${lang}_KG`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Baidarken',
      url: 'https://baidarken.com',
      description: seo.description,
      areaServed: 'Kyrgyzstan',
      sameAs: 'https://baidarken.com',
      keywords: seo.keywords,
    },
  });

  return (
    <>
      <main>
        <Banner
          title={t('banner.title')}
          subtitle={t('banner.subtitle')}
          buttonText={t('banner.button')}
        />
      </main>
      <Features />
      <PopularDestinations />
      <TravelStories />
      <PromoBanner />
      <Reviews />
    </>
  );
}