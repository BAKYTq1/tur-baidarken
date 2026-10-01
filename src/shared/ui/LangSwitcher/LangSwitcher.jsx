// widgets/header/ui/LangSwitcher.jsx

import { useI18n } from "../../i18n";

export function LangSwitcher() {
  const { lang, setLang, SUPPORTED_LANGS } = useI18n();

  return (
    <div className="lang-switcher">
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-current={code === lang}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}