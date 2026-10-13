import { useCallback, useEffect, useState } from 'react';
import './Gallery.scss';
import img from '../assets/gory_zakat_pejzazh_144200_300x188.jpg';
import img2 from '../assets/горы.jpg';
import { useI18n } from '../i18n';
// Вставьте свои фото: image: '/img/photo-1.jpg' (или импорт)
const photos = [
  { id: 1, image: img, title: 'ala_kul', author: 'photo_credit', large: true },
  { id: 2, image: img2, title: 'son_kul' },
  { id: 3, image: img, title: 'sunrise' },
  { id: 4, image: img2, title: 'tea_yurt' },
  { id: 5, image: img, title: 'lake_trail' },
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
  const { t } = useI18n();
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
  const getTitle = (photo) => t(`publicUi.gallery.photos.${photo.title}`);

  return (
    <section className="gallery">
      <header className="gallery__head">
        <span className="gallery__kicker">{t('publicUi.gallery.kicker')}</span>
        <h2 className="gallery__title">{t('publicUi.gallery.title')}</h2>
        <p className="gallery__subtitle">
          {t('publicUi.gallery.subtitle')}
        </p>
      </header>

      <div className="gallery__grid">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className={`gallery__tile gallery__tile--${i + 1} ${photo.large ? 'is-large' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`${t('publicUi.gallery.open_photo')}: ${getTitle(photo)}`}
          >
            {photo.image && <img src={photo.image} alt={getTitle(photo)} loading="lazy" />}
            <span className="gallery__caption">
              <span className="gallery__caption-title">{getTitle(photo)}</span>
              {photo.author && (
                <span className="gallery__caption-author">{t(`publicUi.gallery.photos.${photo.author}`)}</span>
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
          aria-label={getTitle(active)}
          onClick={close}
        >
          <button
            type="button"
            className="gallery__lb-btn gallery__lb-close"
            onClick={close}
            aria-label={t('publicUi.gallery.close')}
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
            aria-label={t('publicUi.gallery.previous')}
          >
            <ChevronIcon flip />
          </button>

          <figure className="gallery__figure" onClick={(e) => e.stopPropagation()}>
            <div className="gallery__frame">
              {active.image ? (
                <img src={active.image} alt={getTitle(active)} />
              ) : (
                <div className="gallery__placeholder" />
              )}
            </div>
            <figcaption>
              {getTitle(active)}
              {active.author && <span> · {t(`publicUi.gallery.photos.${active.author}`)}</span>}
            </figcaption>
          </figure>

          <button
            type="button"
            className="gallery__lb-btn gallery__lb-next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={t('publicUi.gallery.next')}
          >
            <ChevronIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;