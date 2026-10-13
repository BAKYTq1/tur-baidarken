import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Catalog.scss';
import TourCard from '../ui/card/Tourcard';
import { useTours } from '../api/useTours';
import { useI18n } from '../i18n';

const PAGE_SIZE = 6;

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

const normalizeCategory = (value) => {
  if (!value) return 'all';
  const key = String(value).trim().toLowerCase();

  if (['mountains', 'mountain', 'горы', 'горный'].includes(key)) return 'mountains';
  if (['lakes', 'lake', 'озёра', 'озеро', 'water'].includes(key)) return 'lakes';
  if (['family', 'families', 'семейные', 'семейный'].includes(key)) return 'family';
  if (['expeditions', 'expedition', 'экспедиции', 'экспедиция'].includes(key)) return 'expeditions';
  if (['weekend', 'weekends', 'выходные', 'выходной'].includes(key)) return 'weekend';

  return key;
};

const mapTourToCard = (tour, t, lang) => {
  const id = tour.id ?? tour.slug ?? tour.title;
  const slug = tour.slug ?? String(id);
  const tags = Array.isArray(tour.tags) ? tour.tags : [];
  const category = normalizeCategory(tour.category || tags[0] || 'all');
  const title = tour.title || tour.name || t('publicUi.catalog.tour_fallback');
  const location = tour.location || tour.destination || tour.country || tags.join(' · ') || t('banner.kyrgyzstan');
  const priceValue = Number(tour.price_from ?? tour.price ?? 0);
  const duration = tour.duration_days ? `${tour.duration_days} ${t('publicUi.catalog.days_short')}` : (tour.duration || tour.subtitle || t('publicUi.catalog.route_duration'));
  const numberLocale = { ru: 'ru-RU', en: 'en-US', kg: 'ky-KG', ja: 'ja-JP' }[lang] || 'ru-RU';
  const price = priceValue > 0 && tour.price_currency
    ? new Intl.NumberFormat(numberLocale, { style: 'currency', currency: tour.price_currency, maximumFractionDigits: 0 }).format(priceValue)
    : priceValue > 0
      ? new Intl.NumberFormat(numberLocale).format(priceValue)
      : t('publicUi.catalog.price_on_request');

  return {
    id,
    slug,
    category,
    image: tour.cover_image || tour.image || tour.photo || '',
    location,
    title,
    duration,
    groupSize: tour.group_size ? t('publicUi.catalog.group_size').replace('{count}', tour.group_size) : null,
    price: priceValue > 0 ? `${t('publicUi.catalog.from')} ${price}` : price,
    popularity: Number(tour.popularity ?? tour.views ?? 0),
    subtitle: tour.subtitle || tour.description || '',
  };
};

const Catalog = ({ onSelect }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: apiTours = [], isLoading, isError, refetch } = useTours();
  const { t, lang } = useI18n();
  const categories = ['all', 'mountains', 'lakes', 'family', 'expeditions', 'weekend'].map((id) => ({
    id,
    label: t(`publicUi.catalog.categories.${id}`),
  }));
  const sorts = ['popular', 'price-asc', 'price-desc'].map((id) => ({
    id,
    label: t(`publicUi.catalog.sorts.${id}`),
  }));
  const initialQuery = searchParams.get('destination') || searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const nextQuery = searchParams.get('destination') || searchParams.get('q') || '';
    setQuery((prev) => (prev === nextQuery ? prev : nextQuery));
  }, [searchParams]);

  const tours = useMemo(
    () => (Array.isArray(apiTours) ? apiTours.map((tour) => mapTourToCard(tour, t, lang)) : []),
    [apiTours, t, lang],
  );

  const update = (setter) => (value) => {
    setter(value);
    setVisible(PAGE_SIZE);
  };

  const applyQueryToUrl = (nextQuery) => {
    const params = new URLSearchParams(searchParams);
    if (nextQuery) {
      params.set('destination', nextQuery);
      params.set('q', nextQuery);
    } else {
      params.delete('destination');
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = tours.filter((t) => {
      const currentCategory = normalizeCategory(t.category);
      const byCategory = category === 'all' || currentCategory === category;
      const bySearch = !q || `${t.location} ${t.title}`.toLowerCase().includes(q);
      return byCategory && bySearch;
    });

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => Number(String(a.price).replace(/\D/g, '')) - Number(String(b.price).replace(/\D/g, '')),
      'price-desc': (a, b) => Number(String(b.price).replace(/\D/g, '')) - Number(String(a.price).replace(/\D/g, '')),
    };

    return [...list].sort(sorters[sort]);
  }, [query, category, sort, tours]);

  const shown = filtered.slice(0, visible);
  const rest = filtered.length - shown.length;

  const reset = () => {
    setQuery('');
    setCategory('all');
    setSort('popular');
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="catalog" id="catalog">
      <header className="catalog__head">
        <span className="catalog__kicker">{t('publicUi.catalog.kicker')}</span>
        <h2 className="catalog__title">{t('publicUi.catalog.title')}</h2>
        <p className="catalog__subtitle">
          {t('publicUi.catalog.subtitle')}
        </p>
      </header>

      <div className="catalog__panel">
        <div className="catalog__row">
          <label className="catalog__search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                update(setQuery)(e.target.value);
                applyQueryToUrl(e.target.value);
              }}
              placeholder={t('publicUi.catalog.search_placeholder')}
              aria-label={t('publicUi.catalog.search_aria')}
            />
          </label>

          <select
            className="catalog__select"
            value={sort}
            onChange={(e) => update(setSort)(e.target.value)}
            aria-label={t('publicUi.catalog.sort_aria')}
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog__chips" role="group" aria-label={t('publicUi.catalog.categories_aria')}>
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

      {isLoading && <p role="status">{t('publicUi.catalog.loading')}</p>}
      {isError && (
        <div role="alert" className="catalog__empty">
          <p>{t('publicUi.catalog.error')}</p>
          <button type="button" className="catalog__more" onClick={() => refetch()}>
            {t('publicUi.retry')}
          </button>
        </div>
      )}

      {!isLoading && !isError && shown.length > 0 ? (
        <div className="catalog__grid">
          {shown.map((tour) => (
            <div className="catalog__item" key={tour.id}>
              <TourCard
                {...tour}
                price={tour.price}
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
          <p>{t('publicUi.catalog.empty')}</p>
          <button type="button" className="catalog__more" onClick={reset}>
            {t('publicUi.catalog.reset')}
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
            {t('publicUi.catalog.show_more').replace('{count}', rest)}
            <PlusIcon />
          </button>
        </div>
      )}
    </section>
  );
};

export default Catalog;