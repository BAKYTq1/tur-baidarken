import './ReviewCard.scss';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="review__quote" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  </svg>
);

const ReviewCard = ({
  avatar = '',
  name = 'Мария Соколова',
  role = 'Гость тура',
  rating = 5,
  text = 'Мы увидели невероятные места, но главное — почувствовали себя частью команды. Гид Бекет знал, когда рассказать историю, а когда просто оставить нас наедине с горами.',
  date = 'Август 2025',
  note = 'Подтверждённый отзыв',
}) => (
  <article className="review">
    <QuoteIcon />
    <header className="review__head">
      <div className="review__avatar">
        {avatar ? (
          <img src={avatar} alt={name} loading="lazy" />
        ) : (
          <span>{name.charAt(0)}</span>
        )}
      </div>
      <div className="review__author">
        <h3 className="review__name">{name}</h3>
        <span className="review__role">{role}</span>
      </div>
    </header>

    <div className="review__rating" aria-label={`Оценка ${rating} из 5`}>
      <span className="review__stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`review__star ${i < Math.round(rating) ? 'is-on' : ''}`}
            style={{ '--i': i }}
          >
            <StarIcon />
          </span>
        ))}
      </span>
      <span className="review__score">{rating.toFixed(1).replace('.', ',')}</span>
    </div>

    <p className="review__text">{text}</p>

    <footer className="review__foot">
      {date} · {note}
    </footer>
  </article>
);

export default ReviewCard;