import ResourcePage from './ResourcePage';
import { adminApi } from '../../shared/api/admin';

// Схема из swagger: POST /admin/tours
// ⚠️ Значения difficulty и price_currency кроме "easy" и "KGS" — предположение,
// сверьте со списком enum в swagger.
const DIFFICULTY = [
  ['easy', 'Лёгкий'],
  ['medium', 'Средний'],
  ['hard', 'Сложный'],
];

const CURRENCIES = [
  ['KGS', 'KGS — сом'],
  ['USD', 'USD — доллар'],
  ['EUR', 'EUR — евро'],
  ['RUB', 'RUB — рубль'],
];

const FIELDS = [
  { type: 'heading', label: 'Основное' },
  { key: 'title', label: 'Название', type: 'loc', required: true },
  { key: 'subtitle', label: 'Подзаголовок', type: 'loc' },
  { key: 'description', label: 'Описание', type: 'loc', multiline: true },

  { type: 'heading', label: 'Условия' },
  { key: 'duration_days', label: 'Длительность, дней', type: 'number', min: 1, max: 365, required: true, default: 1 },
  { key: 'difficulty', label: 'Сложность', type: 'select', options: DIFFICULTY, required: true, default: 'easy' },
  { key: 'price_from', label: 'Цена от', type: 'number', min: 0, required: true },
  { key: 'price_currency', label: 'Валюта', type: 'select', options: CURRENCIES, required: true, default: 'KGS' },

  { type: 'heading', label: 'Детали' },
  { key: 'tags', label: 'Теги', type: 'loclist', addLabel: 'Добавить тег', hint: 'Например: горы, озёра, треккинг' },
  { key: 'included', label: 'Что включено', type: 'loclist', addLabel: 'Добавить пункт' },
  { key: 'to_bring', label: 'Что взять с собой', type: 'loclist', addLabel: 'Добавить пункт' },

  { type: 'heading', label: 'Программа' },
  { key: 'program', label: 'Дни тура', type: 'program' },

  { type: 'heading', label: 'Фото' },
  { key: 'cover_image', label: 'Обложка', type: 'image' },
  { key: 'gallery', label: 'Галерея', type: 'gallery' },

  { type: 'heading', label: 'SEO' },
  { key: 'slug', label: 'URL slug', type: 'text', hint: 'Например: zheltaya-reka-trek' },
  { key: 'canonical_url', label: 'Canonical URL', type: 'text', hint: 'Опционально, например: https://site.com/tours/zheltaya-reka-trek' },
  { key: 'meta_title', label: 'Meta title', type: 'loc' },
  { key: 'meta_description', label: 'Meta description', type: 'loc', multiline: true },
  { key: 'og_title', label: 'OG title', type: 'loc' },
  { key: 'og_description', label: 'OG description', type: 'loc', multiline: true },
  { key: 'og_image', label: 'OG image', type: 'image' },
  { key: 'seo_keywords', label: 'SEO keywords', type: 'loclist', addLabel: 'Добавить ключевое слово', hint: 'Например: треккинг, Кыргызстан, поход' },

  { type: 'heading', label: 'Публикация' },
  { key: 'is_active', label: 'Показывать на сайте', type: 'bool', default: true },
];

const API = {
  list: adminApi.tours,
  get: adminApi.tour,
  create: adminApi.createTour,
  replace: adminApi.replaceTour,
  remove: adminApi.archiveTour, // DELETE — это архивация, не физическое удаление
};

const difficultyLabel = Object.fromEntries(DIFFICULTY);

const fmtPrice = (t) =>
  t.price_from || t.price_from === 0
    ? `от ${Number(t.price_from).toLocaleString('ru-RU')} ${t.price_currency || ''}`.trim()
    : '—';

const COLUMNS = [
  { label: 'Тур', render: (t) => t.title },
  { label: 'Дней', render: (t) => t.duration_days ?? '—' },
  { label: 'Сложность', render: (t) => difficultyLabel[t.difficulty] || t.difficulty || '—' },
  { label: 'Цена', render: fmtPrice },
  {
    label: 'Статус',
    render: (t) => (
      <span className={`adm-tag ${t.is_active ? 'ok' : ''}`}>
        {t.is_active ? 'Опубликован' : 'Скрыт'}
      </span>
    ),
  },
];

export default function AdminTours() {
  return (
    <ResourcePage
      title="Туры"
      addLabel="Добавить тур"
      removeLabel="В архив"
      api={API}
      fields={FIELDS}
      columns={COLUMNS}
      strict
      confirmRemove={(t) => `Убрать в архив «${t.title}»?`}
      formTitles={{ create: 'Новый тур', edit: 'Редактирование тура' }}
    />
  );
}