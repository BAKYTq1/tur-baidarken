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

const formatPrice = (price, currency) => {
  if (price == null) return 'Цена уточняется'

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency || 'KGS',
    maximumFractionDigits: 0,
  }).format(price)

  return `от ${formattedPrice}`
}

const mapTourToCard = (tour) => ({
  id: tour.id,
  image: tour.cover_image,
  rating: tour.reviews_count > 0 ? tour.rating_avg : null,
  location: tour.location || tour.destination || tour.tags?.slice(0, 2).join(' · ') || 'Кыргызстан',
  title: tour.title,
  duration: tour.duration_days ? `${tour.duration_days} дн.` : tour.subtitle,
  groupSize: null,
  price: formatPrice(tour.price_from, tour.price_currency),
})

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

  // обновляем состояние кнопок (активна / неактивна)
  const syncEdges = (s) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <section className="destinations">
      <header className="destinations__head">
        <h2 className="destinations__title">Популярные направления</h2>

        <div className="destinations__controls">
          <a className="destinations__all" href="/destinations">
            Все направления
          </a>

          <div className="destinations__nav">
            <button
              type="button"
              className="destinations__btn"
              onClick={() => swiper?.slidePrev(500)}
              disabled={isBeginning}
              aria-label="Прокрутить назад"
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              className="destinations__btn"
              onClick={() => swiper?.slideNext(500)}
              disabled={isEnd}
              aria-label="Прокрутить вперёд"
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
          const item = mapTourToCard(tour)

          return (
            <SwiperSlide className="destinations__slide" key={item.id}>
              <TourCard {...item} onClick={() => navigate(`/tours/${item.id}`)} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      {isLoading && <p role="status">Загрузка туров...</p>}
      {isError && (
        <div role="alert">
          <p>Не удалось загрузить туры.</p>
          <button type="button" onClick={() => refetch()}>Повторить</button>
        </div>
      )}
      {!isLoading && !isError && tours.length === 0 && <p>Туры пока не найдены.</p>}
    </section>
  );
};

export default PopularDestinations;