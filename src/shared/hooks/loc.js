// API отдаёт переводимые поля объектом { ru, en, kg }.
// loc() достаёт из него строку (RU → EN → KG) и безопасно работает и с обычной строкой.
export const LANGS = [
  ['ru', 'RU'],
  ['en', 'EN'],
  ['kg', 'KG'],
];

export const loc = (value, lang = 'ru') => {
  if (value == null) return '';
  if (typeof value === 'object') {
    return value[lang] || value.ru || value.en || value.kg || '';
  }
  return String(value);
};

// строка или объект → всегда { ru, en, kg } (для полей формы)
export const toLoc = (value) => ({
  ru: '',
  en: '',
  kg: '',
  ...(value && typeof value === 'object' ? value : { ru: value ?? '' }),
});

// 'ja' на случай, если API когда-нибудь начнёт отдавать и японский
const LOC_KEYS = ['ru', 'en', 'kg', 'ja'];

const isLocObject = (v) =>
  v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.keys(v).length > 0 &&
  Object.keys(v).every((k) => LOC_KEYS.includes(k));

// Рекурсивно заменяет все { ru, en, kg } в данных на строки.
// Нужен для таблиц: так ни одно поле не сломает рендер.
export const flattenLoc = (value, lang = 'ru') => {
  if (isLocObject(value)) return loc(value, lang);
  if (Array.isArray(value)) return value.map((v) => flattenLoc(v, lang));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, flattenLoc(v, lang)]),
    );
  }
  return value;
};