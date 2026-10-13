import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TourPicker.scss';
import { useI18n } from '../i18n';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const TourPicker = ({
  label,
  title,
  text,
  buttonText,
  href = '/tours#catalog',
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const steps = [
    t('publicUi.picker.steps.0'),
    t('publicUi.picker.steps.1'),
    t('publicUi.picker.steps.2'),
  ];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const handlePrimaryClick = (event) => {
    event.preventDefault();

    if (window.location.pathname === '/tours') {
      const catalog = document.getElementById('catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    navigate(href);
  };

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
          <span className="picker__label">{label || t('publicUi.picker.label')}</span>
          <h2 className="picker__title">{title || t('publicUi.picker.title')}</h2>
          <p className="picker__text">{text || t('publicUi.picker.text')}</p>
          <button type="button" className="picker__btn" onClick={handlePrimaryClick}>
            {buttonText || t('publicUi.picker.button')}
            <ArrowIcon />
          </button>
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