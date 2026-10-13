import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './TourCard.scss';

const FAVORITES_KEY = 'baidarken_favorites';

const readFavorites = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeFavorites = (ids) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

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
  id,
  image,
  location = 'Банф, Канада',
  title = 'Альпийские озёра',
  duration = '8 дней',
  groupSize = 'до 12 человек',
  price = 'от 69 900 ₽',
  subtitle,
  onClick,
}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) {
      setLiked(false);
      return;
    }

    const favorites = readFavorites();
    setLiked(favorites.includes(String(id)));
  }, [id]);

  const toggleLike = (event) => {
    event.stopPropagation();
    if (!id) return;

    const nextFavorites = readFavorites();
    const value = String(id);
    const updated = nextFavorites.includes(value)
      ? nextFavorites.filter((item) => item !== value)
      : [...nextFavorites, value];

    writeFavorites(updated);
    setLiked(updated.includes(value));
    window.dispatchEvent(new Event('baidarken-favorites-change'));
  };

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

        <button
          type="button"
          className={`tour-card__like ${liked ? 'is-active' : ''}`}
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="tour-card__body">
        {location && <span className="tour-card__location">{location}</span>}
        <h3 className="tour-card__title">{title}</h3>
        {(duration || groupSize) && (
          <p className="tour-card__meta">
            {duration}{duration && groupSize ? ' · ' : ''}{groupSize}
          </p>
        )}

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

TourCard.propTypes = {
  variant: PropTypes.oneOf(['default', 'overlay']),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.string,
  location: PropTypes.string,
  title: PropTypes.string,
  duration: PropTypes.string,
  groupSize: PropTypes.string,
  price: PropTypes.string,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
};

export default TourCard;