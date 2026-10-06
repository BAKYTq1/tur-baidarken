import './Features.scss';

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11.53 2.29a.53.53 0 0 1 .94 0l2.2 4.46a2.1 2.1 0 0 0 1.58 1.15l4.92.72a.53.53 0 0 1 .3.9l-3.56 3.47a2.1 2.1 0 0 0-.6 1.86l.84 4.9a.53.53 0 0 1-.77.56l-4.4-2.31a2.1 2.1 0 0 0-1.96 0l-4.4 2.31a.53.53 0 0 1-.77-.56l.84-4.9a2.1 2.1 0 0 0-.6-1.86L2.53 9.52a.53.53 0 0 1 .3-.9l4.92-.72a2.1 2.1 0 0 0 1.58-1.15Z" />
  </svg>
);

const items = [
  { icon: <MapPinIcon />, text: '100+ маршрутов' },
  { icon: <ShieldCheckIcon />, text: 'Безопасные туры' },
  { icon: <HeadphonesIcon />, text: 'Поддержка 24/7' },
  { icon: <StarIcon />, text: 'Рейтинг 4,9' },
];

const Features = () => (
  <ul className="features">
    {items.map(({ icon, text }) => (
      <li className="features__item" key={text}>
        <span className="features__icon">{icon}</span>
        <span className="features__text">{text}</span>
      </li>
    ))}
  </ul>
);

export default Features;    