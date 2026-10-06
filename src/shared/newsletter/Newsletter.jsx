import { useState } from 'react';
import './Newsletter.scss';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Newsletter = ({
  label = 'Письма из путешествий',
  title = 'Вдохновение — раз в две недели',
  text = 'Новые маршруты, истории и секретные места без лишнего шума.',
  onSubscribe, // (email) => Promise | void
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | loading | success

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      await onSubscribe?.(email.trim());
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="newsletter">
      <span className="newsletter__circle" aria-hidden="true" />

      <div className="newsletter__info">
        <span className="newsletter__label">{label}</span>
        <h2 className="newsletter__title">{title}</h2>
        <p className="newsletter__text">{text}</p>
      </div>

      <div className="newsletter__side">
        {status === 'success' ? (
          <p className="newsletter__done" role="status">
            <span className="newsletter__check">
              <CheckIcon />
            </span>
            Спасибо! Первое письмо уже в пути.
          </p>
        ) : (
          <form
            className={`newsletter__form ${status === 'error' ? 'is-error' : ''}`}
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              className="newsletter__input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Ваш email"
              aria-label="Ваш email"
              aria-invalid={status === 'error'}
              autoComplete="email"
            />
            <button
              className="newsletter__btn"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Отправляем…' : 'Подписаться'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="newsletter__error" role="alert">
            Проверьте адрес — он должен выглядеть как name@mail.com
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;