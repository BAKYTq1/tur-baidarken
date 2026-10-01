import { useSyncExternalStore } from "react";
import { getLang, setLang, subscribe, t, SUPPORTED_LANGS } from "./i18n";

// Использование:
// const { t, lang, setLang } = useI18n();
// <h1>{t("hero.title")}</h1>
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getLang, getLang);
  return { t, lang, setLang, SUPPORTED_LANGS };
}  