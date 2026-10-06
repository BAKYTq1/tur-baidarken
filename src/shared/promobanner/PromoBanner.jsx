import './PromoBanner.scss';
import flowersImg from '../assets/Оранжевые_лилии_среди_зелени-removebg-preview 1.svg';
import photo from '../assets/gory_zakat_pejzazh_144200_300x188.jpg';

// Передайте свои картинки через props или импортируйте их здесь:

const SparkleIcon = () => (
  <svg className="promo__sparkle" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2c.6 5.2 3.8 8.4 10 10-6.2 1.6-9.4 4.8-10 10-.6-5.2-3.8-8.4-10-10 6.2-1.6 9.4-4.8 10-10Z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PromoBanner = ({
  image = photo,
  flowers = flowersImg,
  label = 'Спецпредложение',
  title = 'Ваше следующее путешествие начинается здесь',
  text = 'Эксклюзивные пакеты. Гибкое бронирование. Воспоминания на всю жизнь.',
  buttonText = 'Пакеты',
  href = '/packages',
}) => (
  <section className="promo">
    <div className="promo__photo">
      {image && <img src={image} alt="" loading="lazy" />}
    </div>

    <div className="promo__content">
      <span className="promo__label">
        {label}
        <SparkleIcon />
      </span>
      <h2 className="promo__title">{title}</h2>
      <p className="promo__text">{text}</p>
      <a className="promo__btn" href={href}>
        {buttonText}
        <ArrowIcon />
      </a>
    </div>

    {flowers && (
      <img className="promo__flowers" src={flowers} alt="" aria-hidden="true" />
    )}
  </section>
);

export default PromoBanner;