import { useEffect, useMemo, useRef, useState } from 'react';
import './ReviewsSummary.scss';
import { useI18n } from '../i18n';

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

const buildSummaryFromReviews = (reviews = []) => {
  const validRatings = reviews
    .map((review) => Number(review?.rating))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

  if (validRatings.length < 3) {
    return null;
  }

  const total = validRatings.length;
  const average = validRatings.reduce((sum, value) => sum + value, 0) / total;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = validRatings.filter((value) => value === star).length;
    return Math.round((count / total) * 100);
  });
  const recommend = Math.round((validRatings.filter((value) => value >= 4).length / total) * 100);

  return {
    rating: average,
    total,
    recommend,
    distribution,
  };
};

const ReviewsSummary = ({
  reviews = [],
  brand = 'Байдаркен',
  badgeText = 'Выбор путешественников 2026',
}) => {
  const { t, lang } = useI18n();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const summary = useMemo(() => buildSummaryFromReviews(reviews), [reviews]);

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

  if (!summary) {
    return null;
  }

  const { rating, total, recommend, distribution } = summary;

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
          {t(`publicUi.reviewSummary.count.${new Intl.PluralRules(lang).select(total)}`).replace('{count}', new Intl.NumberFormat(lang).format(total))}
        </span>
      </div>

      <div className="summary__stats">
        <h3 className="summary__title">
          {t('publicUi.reviewSummary.recommend').replace('{percent}', recommend).replace('{brand}', brand)}
        </h3>
        <p className="summary__sub">
          {t('publicUi.reviewSummary.subtitle')}
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