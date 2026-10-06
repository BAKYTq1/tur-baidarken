import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import './PopularDestinations.scss';
import TourCard from '../ui/card/Tourcard';

const IMG =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkwoUDTqPrgJyEk_1wuuYVcH5ND63Cs1hoX_uqK7LJWA&s=10';

// Замените пути на свои картинки
const destinations = [
  { id: 1, image: IMG, rating: 4.8, location: 'Банф, Канада', title: 'Альпийские озёра', duration: '8 дней', groupSize: 'до 12 человек', price: 'от 69 900 ₽' },
  { id: 2, image: IMG, rating: 4.9, location: 'Мальдивы', title: 'Тропический рай', duration: '7 дней', groupSize: 'до 10 человек', price: 'от 89 900 ₽' },
  { id: 3, image: IMG, rating: 4.9, location: 'Киото, Япония', title: 'Вечная культура', duration: '9 дней', groupSize: 'до 14 человек', price: 'от 79 900 ₽' },
  { id: 4, image: IMG, rating: 4.6, location: 'Исландия', title: 'Земля огня и льда', duration: '6 дней', groupSize: 'до 8 человек', price: 'от 74 900 ₽' },
  { id: 5, image: IMG, rating: 4.6, location: 'Исландия', title: 'Земля огня и льда', duration: '6 дней', groupSize: 'до 8 человек', price: 'от 74 900 ₽' },
  { id: 6, image: IMG, rating: 4.6, location: 'Исландия', title: 'Земля огня и льда', duration: '6 дней', groupSize: 'до 8 человек', price: 'от 74 900 ₽' },
];

const ChevronIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`chevron chevron--${direction}`}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const PopularDestinations = ({ onSelect }) => {
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
        {destinations.map((item) => (
          <SwiperSlide className="destinations__slide" key={item.id}>
            <TourCard {...item} onClick={() => onSelect?.(item)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularDestinations;