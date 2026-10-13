import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import './PopularDestinations.scss';
import TourCard from '../ui/card/Tourcard';
import { useTours } from '../api/useTours';
import { useI18n } from '../i18n';

const formatPrice = (price, currency, lang, t) => {
  if (price == null) return t('publicUi.catalog.price_on_request')

  const locale = { ru: 'ru-RU', en: 'en-US', kg: 'ky-KG', ja: 'ja-JP' }[lang] || 'ru-RU'
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'KGS',
    maximumFractionDigits: 0,
  }).format(price)

  return `${t('publicUi.catalog.from')} ${formattedPrice}`
}

const mapTourToCard = (tour, lang, t) => {
  return {
    id: tour.id,
    image: tour.cover_image,
    location: tour.location || tour.destination || tour.tags?.slice(0, 2).join(' · ') || t('banner.kyrgyzstan'),
    title: tour.title,
    duration: tour.duration_days ? `${tour.duration_days} ${t('publicUi.catalog.days_short')}` : tour.subtitle,
    groupSize: null,
    price: formatPrice(tour.price_from, tour.price_currency, lang, t),
  };
}

const ChevronIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`chevron chevron--${direction}`}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

ChevronIcon.propTypes = {
  direction: PropTypes.string.isRequired,
}

const PopularDestinations = () => {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { data: tours = [], isLoading, isError, refetch } = useTours();
  const { t, lang } = useI18n();

  // обновляем состояние кнопок (активна / неактивна)
  const syncEdges = (s) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <section className="destinations">
      <header className="destinations__head">
        <h2 className="destinations__title">{t('publicUi.popular.title')}</h2>

        <div className="destinations__controls">
          <a className="destinations__all" href="/destinations">
            {t('publicUi.popular.all')}
          </a>

          <div className="destinations__nav">
            <button
              type="button"
              className="destinations__btn"
              onClick={() => swiper?.slidePrev(500)}
              disabled={isBeginning}
              aria-label={t('publicUi.popular.previous')}
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              className="destinations__btn"
              onClick={() => swiper?.slideNext(500)}
              disabled={isEnd}
              aria-label={t('publicUi.popular.next')}
            >
              <ChevronIcon direction="next" />
            </button>
          </div>
        </div>
      </header>

      <Swiper
        className="destinations__slider"
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode
        grabCursor
        mousewheel={{ forceToAxis: true }}
        onSwiper={(s) => {
          setSwiper(s);
          syncEdges(s);
        }}
        onProgress={syncEdges}
        onResize={syncEdges}
      >
        {tours.map((tour) => {
          const item = mapTourToCard(tour, lang, t)

          return (
            <SwiperSlide className="destinations__slide" key={item.id}>
              <TourCard {...item} onClick={() => navigate(`/tours/${item.id || item.slug}`)} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      {isLoading && <p role="status">{t('publicUi.catalog.loading')}</p>}
      {isError && (
        <div role="alert">
          <p>{t('publicUi.catalog.error')}</p>
          <button type="button" onClick={() => refetch()}>{t('publicUi.retry')}</button>
        </div>
      )}
      {!isLoading && !isError && tours.length === 0 && <p>{t('publicUi.popular.empty')}</p>}
    </section>
  );
};

export default PopularDestinations;