import { useEffect, useRef, useState } from 'react';
import './ReviewsSummary.scss';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);

const MedalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" />
    <path d="m9.5 9 1.7 1.7L14.5 7.5" />
  </svg>
);

const pluralReviews = (n) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'отзыв';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'отзыва';
  return 'отзывов';
};

// процент оценок от 5 до 1 звезды
const defaultDistribution = [89, 8, 2, 0, 1];

const ReviewsSummary = ({
  rating = 4.9,
  total = 1284,
  recommend = 98,
  brand = 'Байдаркен',
  distribution = defaultDistribution,
  badgeText = 'Выбор путешественников 2026',
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // полосы «вырастают», когда блок появляется на экране
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={`summary ${visible ? 'is-visible' : ''}`} ref={ref}>
      <div className="summary__score">
        <span className="summary__rating">
          {rating.toFixed(1).replace('.', ',')}
        </span>
        <span className="summary__stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} />
          ))}
        </span>
        <span className="summary__count">
          {total.toLocaleString('ru-RU')} {pluralReviews(total)}
        </span>
      </div>

      <div className="summary__stats">
        <h3 className="summary__title">
          {recommend}% рекомендуют {brand}
        </h3>
        <p className="summary__sub">
          Оценки после путешествий за последние 12 месяцев.
        </p>

        <ul className="summary__bars">
          {distribution.map((percent, i) => {
            const stars = 5 - i;
            return (
              <li className="summary__row" key={stars}>
                <span className="summary__label">{stars}</span>
                <StarIcon />
                <span className="summary__track">
                  <span
                    className="summary__fill"
                    style={{ '--w': `${percent}%`, '--i': i }}
                  />
                </span>
                <span className="summary__percent">{percent}%</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="summary__badge">
        <span className="summary__medal">
          <MedalIcon />
        </span>
        <span className="summary__badge-text">{badgeText}</span>
      </div>
    </section>
  );
};

export default ReviewsSummary;