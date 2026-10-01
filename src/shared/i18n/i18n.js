import ru from "./ru/ru.json";
import en from "./en/en.json";
import kg from "./kg/kg.json";

const dictionaries = { ru, en, kg };
export const SUPPORTED_LANGS = Object.keys(dictionaries);
const DEFAULT_LANG = "ru";
const STORAGE_KEY = "lang";

function detectLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

  const browser = (navigator.language || "").slice(0, 2);
  if (SUPPORTED_LANGS.includes(browser)) return browser;

  return DEFAULT_LANG;
}

let currentLang = detectLang();
const listeners = new Set();

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
  currentLang = lang;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }
  listeners.forEach((fn) => fn(lang));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Достаёт значение по пути вида "book.error_required" или "faq.items.0.q"
function resolve(dict, path) {
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), dict);
}

// t("book.submit") -> "Подготовить заявку"
// Если ключ не найден в текущем языке, пробует дефолтный, иначе возвращает сам ключ.
export function t(key) {
  const value = resolve(dictionaries[currentLang], key);
  if (value !== undefined) return value;

  const fallback = resolve(dictionaries[DEFAULT_LANG], key);
  if (fallback !== undefined) return fallback;

  console.warn(`[i18n] отсутствует ключ "${key}"`);
  return key;
}

// Для списков: t.list("faq.items") -> массив объектов
t.list = function list(key) {
  const value = resolve(dictionaries[currentLang], key);
  return Array.isArray(value) ? value : [];
};

if (typeof window !== "undefined") {
  document.documentElement.lang = currentLang;
}