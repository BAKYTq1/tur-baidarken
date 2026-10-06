import { useEffect, useState } from 'react';
import './TourPicker.scss';

const steps = [
  'Расскажите о мечте',
  'Получите подборку',
  'Отправляйтесь в путь',
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const TourPicker = ({
  label = 'Не нашли идеальный вариант?',
  title = 'Подберём путешествие под ваш ритм',
  text = 'Ответьте на пять коротких вопросов — эксперт предложит 3 маршрута в течение рабочего дня.',
  buttonText = 'Подобрать тур',
  href = '/pick',
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // шаги по очереди подсвечиваются, пока на панель не навели курсор
  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const id = setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, 2600);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="picker">
      <div className="picker__inner">
        <div className="picker__info">
          <span className="picker__label">{label}</span>
          <h2 className="picker__title">{title}</h2>
          <p className="picker__text">{text}</p>
          <a className="picker__btn" href={href}>
            {buttonText}
            <ArrowIcon />
          </a>
        </div>

        <ol
          className="picker__steps"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {steps.map((step, i) => (
            <li key={step}>
              <button
                type="button"
                className={`picker__step ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-current={i === active ? 'step' : undefined}
              >
                <span className="picker__num">{i + 1}</span>
                <span className="picker__step-text">{step}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default TourPicker;