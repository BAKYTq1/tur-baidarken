import { useMemo, useState } from 'react';
import './Catalog.scss';
import TourCard from '../ui/card/Tourcard';
import img from '../assets/gory_zakat_pejzazh_144200_300x188.jpg';

// Вставьте свои фото в поле image: '/img/tour-1.jpg' (или импорт)
const tours = [
  { id: 1, image: img, rating: 4.8, popularity: 98, category: 'mountains', location: 'Банф, Канада', title: 'Альпийские озёра', duration: '8 дней', groupSize: 'до 12 человек', price: 69900 },
  { id: 2, image: img, rating: 4.9, popularity: 95, category: 'lakes', location: 'Исландия', title: 'Тишина ледников', duration: '7 дней', groupSize: 'комфорт', price: 74900 },
  { id: 3, image: img, rating: 4.9, popularity: 92, category: 'mountains', location: 'Хоккайдо, Япония', title: 'Высокогорная Япония', duration: '10 дней', groupSize: 'до 10 человек', price: 79900 },
  { id: 4, image: img, rating: 4.7, popularity: 90, category: 'mountains', location: 'Кыргызстан', title: 'В сердце Тянь-Шаня', duration: '6 дней', groupSize: 'приключение', price: 42900 },
  { id: 5, image: img, rating: 4.8, popularity: 88, category: 'expeditions', location: 'Россия', title: 'Дикий Алтай', duration: '9 дней', groupSize: 'экспедиция', price: 56900 },
  { id: 6, image: img, rating: 4.7, popularity: 85, category: 'lakes', location: 'Турция', title: 'Южный берег', duration: '7 дней', groupSize: 'до 14 человек', price: 61900 },
  { id: 7, image: img, rating: 4.6, popularity: 80, category: 'family', location: 'Иссык-Куль', title: 'Семейный отдых у озера', duration: '5 дней', groupSize: 'семейный', price: 38900 },
  { id: 8, image: img, rating: 4.8, popularity: 78, category: 'weekend', location: 'Алматы, Казахстан', title: 'Горный уик-энд', duration: '3 дня', groupSize: 'до 8 человек', price: 24900 },
  { id: 9, image: img, rating: 4.9, popularity: 75, category: 'mountains', location: 'Непал', title: 'Треккинг в Гималаях', duration: '12 дней', groupSize: 'экспедиция', price: 89900 },
];

const categories = [
  { id: 'all', label: 'Все туры' },
  { id: 'mountains', label: 'Горы' },
  { id: 'lakes', label: 'Озёра' },
  { id: 'family', label: 'Семейные' },
  { id: 'expeditions', label: 'Экспедиции' },
  { id: 'weekend', label: 'Выходные' },
];

const sorts = [
  { id: 'popular', label: 'Сначала популярные' },
  { id: 'price-asc', label: 'Сначала дешевле' },
  { id: 'price-desc', label: 'Сначала дороже' },
  { id: 'rating', label: 'По рейтингу' },
];

const PAGE_SIZE = 6;

const formatPrice = (value) => `от ${value.toLocaleString('ru-RU')} ₽`;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// склонение: 1 тур, 2 тура, 5 туров
const pluralTours = (n) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'тур';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'тура';
  return 'туров';
};

const Catalog = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // любое изменение фильтра возвращает список к первой странице
  const update = (setter) => (value) => {
    setter(value);
    setVisible(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = tours.filter((t) => {
      const byCategory = category === 'all' || t.category === category;
      const bySearch =
        !q || `${t.location} ${t.title}`.toLowerCase().includes(q);
      return byCategory && bySearch;
    });

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };

    return [...list].sort(sorters[sort]);
  }, [query, category, sort]);

  const shown = filtered.slice(0, visible);
  const rest = filtered.length - shown.length;

  const reset = () => {
    setQuery('');
    setCategory('all');
    setSort('popular');
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="catalog">
      <header className="catalog__head">
        <span className="catalog__kicker">Найдите своё направление</span>
        <h2 className="catalog__title">Каталог путешествий</h2>
        <p className="catalog__subtitle">
          Выберите настроение, формат и сезон — остальное мы уже придумали.
        </p>
      </header>

      <div className="catalog__panel">
        <div className="catalog__row">
          <label className="catalog__search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => update(setQuery)(e.target.value)}
              placeholder="Страна, регион или категория"
              aria-label="Поиск по каталогу"
            />
          </label>

          <select
            className="catalog__select"
            value={sort}
            onChange={(e) => update(setSort)(e.target.value)}
            aria-label="Сортировка"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog__chips" role="group" aria-label="Категории">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`catalog__chip ${category === c.id ? 'is-active' : ''}`}
              aria-pressed={category === c.id}
              onClick={() => update(setCategory)(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="catalog__grid">
          {shown.map(({ price, popularity, category: _c, ...tour }) => (
            <div className="catalog__item" key={tour.id}>
              <TourCard
                {...tour}
                price={formatPrice(price)}
                onClick={() => onSelect?.(tour)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog__empty">
          <p>По вашему запросу туров не нашлось.</p>
          <button type="button" className="catalog__more" onClick={reset}>
            Сбросить фильтры
          </button>
        </div>
      )}

      {rest > 0 && (
        <div className="catalog__footer">
          <button
            type="button"
            className="catalog__more"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Показать ещё {rest} {pluralTours(rest)}
            <PlusIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default Catalog;