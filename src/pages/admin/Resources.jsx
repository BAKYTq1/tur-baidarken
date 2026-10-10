import { adminApi, faqApi, guidesApi } from '../../shared/api/admin';

// Описание разделов, у которых есть список + страница создания/редактирования.
// Список и форма читают один и тот же конфиг.

// ---------- Туры (схема из swagger: POST /admin/tours) ----------
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

const difficultyLabel = Object.fromEntries(DIFFICULTY);

const fmtPrice = (t) =>
  t.price_from || t.price_from === 0
    ? `от ${Number(t.price_from).toLocaleString('ru-RU')} ${t.price_currency || ''}`.trim()
    : '—';

const tours = {
  title: 'Туры',
  addLabel: 'Добавить тур',
  removeLabel: 'В архив',
  strict: true, // отправляем только поля схемы
  confirmRemove: (t) => `Убрать в архив «${t.title}»?`,
  formTitles: { create: 'Новый тур', edit: 'Редактирование тура' },
  api: {
    list: adminApi.tours,
    get: adminApi.tour,
    create: adminApi.createTour,
    replace: adminApi.replaceTour,
    remove: adminApi.archiveTour, // DELETE — архивация, не физическое удаление
  },
  fields: [
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

    { type: 'heading', label: 'Публикация' },
    { key: 'is_active', label: 'Показывать на сайте', type: 'bool', default: true },
  ],
  columns: [
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
  ],
};

// ---------- Гиды ----------
const guides = {
  title: 'Гиды',
  addLabel: 'Добавить гида',
  removeLabel: 'Удалить',
  confirmRemove: (g) => `Удалить гида «${g.name}»?`,
  formTitles: { create: 'Новый гид', edit: 'Редактирование гида' },
  api: guidesApi,
  fields: [
    { key: 'name', label: 'Имя', type: 'text', required: true },
    { key: 'role', label: 'Должность', type: 'loc' },
    { key: 'bio', label: 'О гиде', type: 'loc', multiline: true },
    { key: 'photo', label: 'Фото', type: 'image' },
    { key: 'years_experience', label: 'Опыт, лет', type: 'number', min: 0 },
    { key: 'sort_order', label: 'Порядок сортировки', type: 'number', min: 0 },
  ],
  columns: [
    { label: 'Имя', render: (g) => g.name },
    {
      label: 'Фото',
      render: (g) => g.photo ? <img className="adm-guide-photo" src={g.photo} alt={`Фото гида ${g.name}`} /> : '—',
    },
    { label: 'Должность', render: (g) => g.role || '—' },
    { label: 'Опыт, лет', render: (g) => g.years_experience ?? '—' },
    { label: 'Порядок', render: (g) => g.sort_order ?? '—' },
  ],
};

// ---------- FAQ ----------
const faq = {
  title: 'FAQ',
  addLabel: 'Добавить вопрос',
  removeLabel: 'Удалить',
  strict: true,
  confirmRemove: (f) => `Удалить вопрос «${f.question}»?`,
  formTitles: { create: 'Новый вопрос', edit: 'Редактирование вопроса' },
  api: faqApi,
  fields: [
    { key: 'question', label: 'Вопрос', type: 'loc', required: true },
    { key: 'answer', label: 'Ответ', type: 'loc', multiline: true, required: true },
    { key: 'sort_order', label: 'Порядок', type: 'number' },
  ],
  columns: [
    { label: 'Вопрос', render: (f) => f.question },
    { label: 'Порядок', render: (f) => f.sort_order ?? '—' },
  ],
};

export const resources = { tours, guides, faq };