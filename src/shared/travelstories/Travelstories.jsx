import './TravelStories.scss';
import img from '../assets/Акварельная_композиция_зелёных_листьев-removebg-preview 1.svg'
import { useI18n } from '../i18n';
// Вставьте свои фото: image: '/img/story-1.jpg' или импорт
const stories = [
  {
    id: 1,
    image: '',
    title: 'story_one',
    readTime: 'story_one_time',
    href: '/stories/hidden-gems',
  },
  {
    id: 2,
    image: '',
    title: 'story_two',
    readTime: 'story_two_time',
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

const TravelStories = () => {
  const { t } = useI18n();
  return (
    <section className="stories">
    <div className="stories__info">
      <p className="stories__kicker">{t('publicUi.stories.kicker')}</p>
      <h2 className="stories__title">{t('publicUi.stories.title')}</h2>
      <p className="stories__text">
        {t('publicUi.stories.text')}
      </p>
      <a className="stories__btn" href="/stories">
        {t('publicUi.stories.button')}
        <ArrowIcon />
      </a>
    </div>

    <div className="stories__list">
      {stories.map(({ id, image, title, readTime, href }) => (
        <a className="stories__card" href={href} key={id}>
          <div className="stories__photo">
            {image && <img src={image} alt={t(`publicUi.stories.${title}`)} loading="lazy" />}
          </div>
          <div className="stories__body">
            <h3 className="stories__card-title">{t(`publicUi.stories.${title}`)}</h3>
            <span className="stories__time">{t(`publicUi.stories.${readTime}`)}</span>
          </div>
        </a>
      ))}
    </div>

    <LeavesDecor />
  </section>
  );
};

export default TravelStories;