import { useState } from 'react';
import './ReviewCta.scss';

const tours = [
  'Альпийские озёра',
  'Тишина ледников',
  'Высокогорная Япония',
  'В сердце Тянь-Шаня',
  'Дикий Алтай',
  'Южный берег',
];

const ratingLabels = ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично!'];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ReviewCta = ({
  label = 'Уже путешествовали с нами?',
  title = 'Ваша история поможет другим решиться',
  text = 'Поделитесь впечатлениями — это займёт около трёх минут.',
  tourOptions = tours,
  onSubmit, // ({ rating, tour }) => void
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tour, setTour] = useState('');
  const [attempted, setAttempted] = useState(false);

  const shown = hover || rating;
  const incomplete = !rating || !tour;

  const handleSubmit = () => {
    if (incomplete) {
      setAttempted(true);
      return;
    }
    onSubmit?.({ rating, tour });
  };

  return (
    <section className="rcta">
      <div className="rcta__inner">
        <div className="rcta__info">
          <span className="rcta__label">{label}</span>
          <h2 className="rcta__title">{title}</h2>
          <p className="rcta__text">{text}</p>
          <button type="button" className="rcta__btn" onClick={handleSubmit}>
            Оставить отзыв
            <PlusIcon />
          </button>
        </div>

        <div className={`rcta__card ${attempted && incomplete ? 'is-attempted' : ''}`}>
          <h3 className="rcta__card-title">Оцените путешествие</h3>

          <div
            className="rcta__stars"
            role="radiogroup"
            aria-label="Оценка путешествия"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} из 5`}
                className={`rcta__star ${n <= shown ? 'is-on' : ''} ${n === rating ? 'is-picked' : ''}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
              >
                <StarIcon />
              </button>
            ))}
            <span className="rcta__rating-label" aria-live="polite">
              {ratingLabels[shown]}
            </span>
          </div>

          <select
            className="rcta__select"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            aria-label="Выберите ваш тур"
          >
            <option value="" disabled>
              Выберите ваш тур
            </option>
            {tourOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <p className="rcta__note">
            {attempted && incomplete
              ? 'Поставьте оценку и выберите тур, чтобы продолжить.'
              : 'Затем откроется короткая форма: расскажите о маршруте и добавьте фото.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewCta;