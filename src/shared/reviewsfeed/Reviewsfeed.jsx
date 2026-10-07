import { useState } from 'react';
import './ReviewsFeed.scss';
import ReviewCard from '../ui/reviewCard/ReviewCard';

// Вставьте свои фото: avatar: '/img/maria.jpg' (или импорт)
const reviews = [
  { id: 1, category: 'mountains', avatar: '', name: 'Мария Соколова', role: 'Тянь-Шань · 9 дней', rating: 5, text: 'Мы увидели невероятные места, но главное — почувствовали себя частью команды. Гид Бекет знал, когда рассказать историю, а когда просто оставить нас наедине с горами.', date: 'Август 2025', note: 'подтверждённая поездка' },
  { id: 2, category: 'family', avatar: '', name: 'Данияр Ким', role: 'Иссык-Куль · семейный', rating: 5, text: 'Первое большое путешествие с детьми, где родителям тоже удалось отдохнуть. Трип идеальный, еда отличная, а каждая стоянка запомнилась детям надолго.', date: 'Июль 2025', note: 'подтверждённая поездка' },
  { id: 3, category: 'expeditions', avatar: '', name: 'Анна и Павел', role: 'Алтай · экспедиция', rating: 5, text: 'Это было приключение без туристического глянца, но с настоящим комфортом там, где он нужен. Каждый день удивлял — от переправы до ужина под звёздами.', date: 'Июнь 2025', note: 'подтверждённая поездка' },
  { id: 4, category: 'lakes', avatar: '', name: 'Елена Романова', role: 'Исландия · 7 дней', rating: 5, text: 'Гид умеет собирать незнакомых людей так, что через неделю они прощаются как друзья. Спасибо за чёткую организацию и свободу внутри маршрута.', date: 'Май 2025', note: 'подтверждённая поездка' },
  { id: 5, category: 'weekend', avatar: '', name: 'Артём Волков', role: 'Алматы · выходные', rating: 5, text: 'За два дня успели больше, чем иногда за целый отпуск. Маршрут продуман до мелочей, а на привалах нас ждал горячий чай и отличная компания.', date: 'Сентябрь 2025', note: 'подтверждённая поездка' },
  { id: 6, category: 'lakes', avatar: '', name: 'Ольга Левина', role: 'Иссык-Куль · 5 дней', rating: 4.8, text: 'Тишина, чистая вода и закаты, ради которых стоило ехать. Организация на высоте: трансферы без задержек, проживание лучше ожиданий.', date: 'Август 2025', note: 'подтверждённая поездка' },
  { id: 7, category: 'mountains', avatar: '', name: 'Игорь Петров', role: 'Памир · 12 дней', rating: 5, text: 'Сложный маршрут, но команда сделала всё, чтобы мы чувствовали себя уверенно. Лучший опыт в горах за последние годы, обязательно вернёмся.', date: 'Июль 2025', note: 'подтверждённая поездка' },
  { id: 8, category: 'family', avatar: '', name: 'Наталья Орлова', role: 'Сочи · семейный', rating: 4.9, text: 'Поехали с двумя детьми и бабушкой — всем нашлось занятие по душе. Программа гибкая, никто не чувствовал спешки и усталости.', date: 'Июнь 2025', note: 'подтверждённая поездка' },
];

const categories = [
  { id: 'all', label: 'Все' },
  { id: 'mountains', label: 'Горы' },
  { id: 'lakes', label: 'Озёра' },
  { id: 'family', label: 'Семейные' },
  { id: 'expeditions', label: 'Экспедиции' },
  { id: 'weekend', label: 'За выходные' },
];

const PAGE_SIZE = 4;

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ReviewsFeed = () => {
  const [category, setCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const selectCategory = (id) => {
    setCategory(id);
    setVisible(PAGE_SIZE);
  };

  const filtered =
    category === 'all' ? reviews : reviews.filter((r) => r.category === category);
  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > shown.length;

  return (
    <section className="feed">
      <header className="feed__head">
        <span className="feed__kicker">Из первых уст</span>
        <h2 className="feed__title">Путешествия в деталях</h2>
        <p className="feed__subtitle">
          Каждый отзыв опубликован с разрешения автора и привязан к реальному
          туру.
        </p>
      </header>

      <div className="feed__chips" role="group" aria-label="Категории отзывов">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`feed__chip ${category === c.id ? 'is-active' : ''}`}
            aria-pressed={category === c.id}
            onClick={() => selectCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="feed__grid">
        {shown.map(({ id, category: _category, ...review }) => (
          <div className="feed__item" key={id}>
            <ReviewCard {...review} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="feed__footer">
          <button
            type="button"
            className="feed__more"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Показать ещё отзывы
            <ArrowIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewsFeed;