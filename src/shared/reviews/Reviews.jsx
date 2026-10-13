import ReviewCard from '../ui/reviewCard/ReviewCard';
import './Reviews.scss';
import { useI18n } from '../i18n';
import { usePublishedReviews } from '../api/useReviews';

const Reviews = () => {
  const { t } = useI18n();
  const { data: reviews = [], isLoading, isError, refetch } = usePublishedReviews();

  return (
    <section className="reviews">
      <h2 className="reviews__title">{t('reviews.title')}</h2>

      {isLoading ? (
        <p role="status">{t('publicUi.reviewFeed.loading')}</p>
      ) : isError ? (
        <p role="alert">
          {t('publicUi.reviewFeed.error')} <button type="button" onClick={() => refetch()}>{t('publicUi.retry')}</button>
        </p>
      ) : reviews.length === 0 ? (
        <p>{t('publicUi.reviewFeed.empty')}</p>
      ) : (
        <div className="reviews__grid">
          {reviews.slice(0, 4).map(({ id, ...review }) => (
            <ReviewCard key={id} {...review} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Reviews;