import { useCallback, useEffect, useState } from 'react';
import './Gallery.scss';
import img from '../assets/gory_zakat_pejzazh_144200_300x188.jpg';
import img2 from '../assets/горы.jpg';
// Вставьте свои фото: image: '/img/photo-1.jpg' (или импорт)
const photos = [
  { id: 1, image: img, title: 'Перевал Ала-Куль', author: 'фото @name_gr', large: true },
  { id: 2, image: img2, title: 'Сон-Куль, весь' },
  { id: 3, image: img, title: 'Рассвет в пути' },
  { id: 4, image: img2, title: 'Чай в юрте перевала' },
  { id: 5, image: img, title: 'Тропа к озеру' },
];

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ChevronIcon = ({ flip }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const Gallery = () => {
  const [current, setCurrent] = useState(null); // индекс открытого фото

  const close = useCallback(() => setCurrent(null), []);
  const step = useCallback(
    (dir) => setCurrent((i) => (i + dir + photos.length) % photos.length),
    [],
  );

  // клавиатура и блокировка прокрутки, пока открыт просмотр
  useEffect(() => {
    if (current === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [current, close, step]);

  const active = current !== null ? photos[current] : null;

  return (
    <section className="gallery">
      <header className="gallery__head">
        <span className="gallery__kicker">Моменты из поездок</span>
        <h2 className="gallery__title">Снято путешественниками</h2>
        <p className="gallery__subtitle">
          Без постановки и фильтров — только то, что хочется сохранить.
        </p>
      </header>

      <div className="gallery__grid">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className={`gallery__tile gallery__tile--${i + 1} ${photo.large ? 'is-large' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Открыть фото: ${photo.title}`}
          >
            {photo.image && <img src={photo.image} alt={photo.title} loading="lazy" />}
            <span className="gallery__caption">
              <span className="gallery__caption-title">{photo.title}</span>
              {photo.author && (
                <span className="gallery__caption-author">{photo.author}</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={close}
        >
          <button
            type="button"
            className="gallery__lb-btn gallery__lb-close"
            onClick={close}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            className="gallery__lb-btn gallery__lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Предыдущее фото"
          >
            <ChevronIcon flip />
          </button>

          <figure className="gallery__figure" onClick={(e) => e.stopPropagation()}>
            <div className="gallery__frame">
              {active.image ? (
                <img src={active.image} alt={active.title} />
              ) : (
                <div className="gallery__placeholder" />
              )}
            </div>
            <figcaption>
              {active.title}
              {active.author && <span> · {active.author}</span>}
            </figcaption>
          </figure>

          <button
            type="button"
            className="gallery__lb-btn gallery__lb-next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Следующее фото"
          >
            <ChevronIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;