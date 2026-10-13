import { useState } from 'react';
import './ReviewsFeed.scss';
import ReviewCard from '../ui/reviewCard/ReviewCard';
import { useI18n } from '../i18n';
import { usePublishedReviews } from '../api/useReviews';

const PAGE_SIZE = 4;

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ReviewsFeed = () => {
  const { t } = useI18n();
  const { data: reviews = [], isLoading, isError, refetch } = usePublishedReviews();
  const [category, setCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const selectCategory = (id) => {
    setCategory(id);
    setVisible(PAGE_SIZE);
  };

  const filtered =
    category === 'all' || reviews.every((item) => !item.category)
      ? reviews
      : reviews.filter((r) => (r.category || 'all') === category);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > shown.length;
  const categories = ['all', 'mountains', 'lakes', 'family', 'expeditions', 'weekend'].map((id) => ({
    id,
    label: t(`publicUi.reviewFeed.categories.${id}`),
  }));

  return (
    <section className="feed">
      <header className="feed__head">
        <span className="feed__kicker">{t('publicUi.reviewFeed.kicker')}</span>
        <h2 className="feed__title">{t('publicUi.reviewFeed.title')}</h2>
        <p className="feed__subtitle">
          {t('publicUi.reviewFeed.subtitle')}
        </p>
      </header>

      <div className="feed__chips" role="group" aria-label={t('publicUi.reviewFeed.categories_aria')}>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`feed__chip ${category === c.id ? 'is-active' : ''}`}
            aria-pressed={category === c.id}
            onClick={() => selectCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p role="status">{t('publicUi.reviewFeed.loading')}</p>
      ) : isError ? (
        <p role="alert">
          {t('publicUi.reviewFeed.error')} <button type="button" onClick={() => refetch()}>{t('publicUi.retry')}</button>
        </p>
      ) : shown.length === 0 ? (
        <p>{t('publicUi.reviewFeed.empty')}</p>
      ) : (
        <div className="feed__grid">
          {shown.map(({ id, category: _category, ...review }) => (
            <div className="feed__item" key={id}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="feed__footer">
          <button
            type="button"
            className="feed__more"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            {t('publicUi.reviewFeed.show_more')}
            <ArrowIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewsFeed;