import { useRef, useState } from 'react';
import PropTypes from 'prop-types'
import './ReviewCta.scss';
import { getLang } from '../i18n/i18n'
import { useTours } from '../api/useTours'
import { useAddReview } from '../api/useReviews'

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
  text: introText = 'Поделитесь впечатлениями — это займёт около трёх минут.',
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [attempted, setAttempted] = useState(false);
  const submittingRef = useRef(false);
  const { data: tours = [], isLoading: isLoadingTours, isError: isToursError } = useTours();
  const { mutate, isPending } = useAddReview();

  const shown = hover || rating;
  const incomplete = !selectedTourId || !rating || !authorName.trim() || !text.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (incomplete) {
      setAttempted(true);
      return;
    }
    if (isPending || submittingRef.current) return;

    submittingRef.current = true;
    mutate({
      tourId: selectedTourId,
      reviewData: {
        author_name: authorName.trim(),
        rating: Number(rating),
        text: text.trim(),
        lang: getLang() || 'ru',
      },
    }, {
      onSuccess: () => {
        setRating(0)
        setSelectedTourId('')
        setAuthorName('')
        setText('')
        setAttempted(false)
      },
      onSettled: () => {
        submittingRef.current = false
      },
    });
  };

  return (
    <section className="rcta">
      <form className="rcta__inner" onSubmit={handleSubmit} noValidate>
        <div className="rcta__info">
          <span className="rcta__label">{label}</span>
          <h2 className="rcta__title">{title}</h2>
          <p className="rcta__text">{introText}</p>
          <button type="submit" className="rcta__btn" disabled={isPending || isLoadingTours}>
            {isPending ? 'Отправка...' : 'Оставить отзыв'}
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
            value={selectedTourId}
            onChange={(e) => setSelectedTourId(e.target.value)}
            aria-label="Выберите ваш тур"
            required
            disabled={isLoadingTours || isToursError || tours.length === 0}
          >
            <option value="" disabled>
              {isLoadingTours ? 'Загрузка туров...' : 'Выберите ваш тур'}
            </option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </select>

          <input
            className="rcta__input"
            type="text"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            placeholder="Ваше имя"
            aria-label="Ваше имя"
            autoComplete="name"
            required
          />
          <textarea
            className="rcta__textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Расскажите о путешествии"
            aria-label="Текст отзыва"
            rows={4}
            required
          />

          <p className="rcta__note" role={isToursError ? 'alert' : undefined}>
            {isToursError
              ? 'Не удалось загрузить список туров.'
              : attempted && incomplete
                ? 'Заполните все поля и поставьте оценку, чтобы отправить отзыв.'
                : 'Ваш отзыв будет отправлен на модерацию.'}
          </p>
        </div>
      </form>
    </section>
  );
};

ReviewCta.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
}

export default ReviewCta;