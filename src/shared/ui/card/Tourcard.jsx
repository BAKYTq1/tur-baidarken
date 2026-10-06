import { useState } from 'react';
import './TourCard.scss';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.5s-8-4.7-8-10.6A4.6 4.6 0 0 1 8.6 5.3c1.4 0 2.7.7 3.4 1.8.7-1.1 2-1.8 3.4-1.8A4.6 4.6 0 0 1 20 9.9c0 5.9-8 10.6-8 10.6Z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const TourCard = ({
  variant = 'default', // 'default' | 'overlay'
  image,
  rating = 4.8,
  location = 'Банф, Канада',
  title = 'Альпийские озёра',
  duration = '8 дней',
  groupSize = 'до 12 человек',
  price = 'от 69 900 ₽',
  subtitle,
  onClick,
}) => {
  const [liked, setLiked] = useState(false);

  // Компактная карточка для карусели: текст поверх фото
  if (variant === 'overlay') {
    return (
      <article
        className="tour-card tour-card--overlay"
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      >
        <img className="tour-card__img" src={image} alt={title} loading="lazy" />

        <span className="tour-card__rating">
          <StarIcon />
          {String(rating).replace(',', '.')}
        </span>

        <div className="tour-card__shade" />

        <div className="tour-card__caption">
          <h3 className="tour-card__title">{title}</h3>
          <p className="tour-card__meta">{subtitle}</p>
        </div>
        <span className="tour-card__price">{price}</span>
      </article>
    );
  }

  return (
    <article className="tour-card">
      <div className="tour-card__media">
        <img className="tour-card__img" src={image} alt={title} loading="lazy" />

        <span className="tour-card__rating">
          <StarIcon />
          {String(rating).replace('.', ',')}
        </span>

        <button
          type="button"
          className={`tour-card__like ${liked ? 'is-active' : ''}`}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="tour-card__body">
        <span className="tour-card__location">{location}</span>
        <h3 className="tour-card__title">{title}</h3>
        <p className="tour-card__meta">
          {duration} · {groupSize}
        </p>

        <div className="tour-card__footer">
          <span className="tour-card__price">{price}</span>
          <button
            type="button"
            className="tour-card__go"
            onClick={onClick}
            aria-label={`Открыть тур: ${title}`}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TourCard;