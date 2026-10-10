import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalog.scss';
import TourCard from '../ui/card/Tourcard';
import { tours } from '../data/tours';

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
  const navigate = useNavigate();
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
                onClick={() => {
                  onSelect?.(tour);
                  navigate(`/tours/${tour.slug || tour.id}`);
                }}
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