import 'react'
import { useSearchParams } from 'react-router-dom'
import Features from '../../shared/features/Features'
import Catalog from '../../shared/catalog/Catalog'
import TourPicker from '../../shared/tourpicker/Tourpicker'
import Banner from '../../widgets/banner/Banner'
import { useI18n } from '../../shared/i18n'
import { usePageMeta } from '../../shared/hooks/usePageMeta'

const seoMap = {
  ru: {
    title: 'Туры по Кыргызстану — путешествия с заботой',
    description: 'Туры по Кыргызстану, горные маршруты, треккинг, семейные поездки и комфортные путешествия с гидом.',
    keywords: 'туры по кыргызстану, горные туры, треккинг, кыргызстан туры',
  },
  en: {
    title: 'Tours in Kyrgyzstan — travel with care',
    description: 'Tours in Kyrgyzstan, mountain routes, trekking, family trips and comfortable journeys with a guide.',
    keywords: 'Kyrgyzstan tours, mountain tours, trekking, travel to Kyrgyzstan',
  },
  kg: {
    title: 'Кыргызстанга саякаттар — камкордуулук менен',
    description: 'Кыргызстанга саякаттар, тоолуу маршруттар, треккинг, үй-бүлөлүк сапарлар жана гид менен ыңгайлуу саяхаттар.',
    keywords: 'кыргызстанга тур, тоолуу тур, треккинг, саякат',
  },
  ja: {
    title: 'キルギスのツアー — 丁寧な旅行',
    description: 'キルギスのツアー、山岳ルート、トレッキング、家族旅行、ガイド付きの快適な旅。',
    keywords: 'キルギス ツアー, 山岳ツアー, トレッキング, キルギス旅行',
  },
};

function Tours() {
  const [searchParams] = useSearchParams()
  const { lang, t } = useI18n();
  const seo = seoMap[lang] || seoMap.ru;
  const hasSearchFilters = ['destination', 'q', 'travelers'].some((key) => searchParams.has(key))

  const alternates = [
    { lang: 'ru', href: 'https://baidarken.com/tours' },
    { lang: 'en', href: 'https://baidarken.com/en/tours' },
    { lang: 'kg', href: 'https://baidarken.com/kg/tours' },
    { lang: 'ja', href: 'https://baidarken.com/ja/tours' },
  ];

  usePageMeta({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    image: 'https://baiderken.onrender.com/api/v1/static/og-tour.jpg',
    url: 'https://baidarken.com/tours',
    type: 'website',
    locale: `${lang}_KG`,
    alternates,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: seo.title,
      description: seo.description,
      image: 'https://baiderken.onrender.com/api/v1/static/og-tour.jpg',
      url: 'https://baidarken.com/tours',
      provider: {
        '@type': 'TravelAgency',
        name: 'Baidarken',
        sameAs: 'https://baidarken.com',
      },
      areaServed: 'Kyrgyzstan',
      availableLanguage: ['ru', 'en', 'kg', 'ja'],
    },
  });

  return (
    <div>
      <Banner
        title={t('tours.banner_title')}
        subtitle={t('tours.banner_subtitle')}
        subtitle2={t('tours.banner_description')}
        buttonText={t('tours.banner_button')}
        showSearchForm={false}
      />
      {!hasSearchFilters && <Features />}
      <Catalog/>
      <TourPicker/>
    </div>
  )
}

export default Tours
