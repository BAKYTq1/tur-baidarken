import './TravelStories.scss';
import img from '../assets/Акварельная_композиция_зелёных_листьев-removebg-preview 1.svg'
// Вставьте свои фото: image: '/img/story-1.jpg' или импорт
const stories = [
  {
    id: 1,
    image: '',
    title: '10 скрытых жемчужин Кыргызстана',
    readTime: '5 минут',
    href: '/stories/hidden-gems',
  },
  {
    id: 2,
    image: '',
    title: 'Самое необходимое для поездки',
    readTime: 'для каждой поездки',
    href: '/stories/essentials',
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const LeavesDecor = () => (
  <img className="stories__leaves" src={img} alt="" aria-hidden="true" />
);

const TravelStories = () => (
  <section className="stories">
    <div className="stories__info">
      <p className="stories__kicker">Нужно вдохновение?</p>
      <h2 className="stories__title">Путешествия и гиды</h2>
      <p className="stories__text">
        Советы по путешествиям, гиды по направлениям и вдохновляющие истории со
        всего мира
      </p>
      <a className="stories__btn" href="/stories">
        Читать истории
        <ArrowIcon />
      </a>
    </div>

    <div className="stories__list">
      {stories.map(({ id, image, title, readTime, href }) => (
        <a className="stories__card" href={href} key={id}>
          <div className="stories__photo">
            {image && <img src={image} alt={title} loading="lazy" />}
          </div>
          <div className="stories__body">
            <h3 className="stories__card-title">{title}</h3>
            <span className="stories__time">{readTime}</span>
          </div>
        </a>
      ))}
    </div>

    <LeavesDecor />
  </section>
);

export default TravelStories;