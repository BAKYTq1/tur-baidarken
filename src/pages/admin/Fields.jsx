import { useState } from 'react';
import { LANGS, toLoc } from '../../shared/hooks/loc';
import { uploadPhoto } from '../../shared/hooks/upload';

// ---------- Поля RU / EN / KG / JA (с пометкой языка внутри поля) ----------
export function LocInputs({ value, onChange, multiline, required, label }) {
  const v = toLoc(value);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="adm-g4 adm-langs">
      {LANGS.map(([code, name]) => (
        <div className="adm-lang" key={code}>
          <span className="adm-lang-label" data-lang={name}>{name}</span>
          <Tag
            value={v[code]}
            onChange={(e) => onChange({ ...v, [code]: e.target.value })}
            aria-label={`${label || ''} (${name})`.trim()}
            required={required && code === 'ru'}
          />
        </div>
      ))}
    </div>
  );
}

export function LocalizedInput({ label, value, onChange, required, multiline }) {
  return (
    <div className="adm-field adm-wide">
      <span className="adm-field-label">{label}</span>
      <LocInputs
        value={value}
        onChange={onChange}
        multiline={multiline}
        required={required}
        label={label}
      />
    </div>
  );
}

// ---------- Список переводимых строк (теги, «включено», «что взять») ----------
export function LocList({ label, hint, value = [], onChange, addLabel = 'Добавить' }) {
  const update = (i, v) => onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="adm-field adm-wide">
      <span className="adm-field-label">{label}</span>
      {hint && <span className="adm-hint">{hint}</span>}

      {value.map((item, i) => (
        <div className="adm-item" key={i}>
          <LocInputs value={item} onChange={(v) => update(i, v)} label={`${label} ${i + 1}`} />
          <button
            type="button"
            className="b adm-item-remove"
            onClick={() => remove(i)}
            aria-label={`Удалить: ${label} ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="b adm-add" onClick={() => onChange([...value, toLoc('')])}>
        + {addLabel}
      </button>
    </div>
  );
}

// ---------- Программа по дням ----------
export function ProgramEditor({ label, value = [], onChange }) {
  const update = (i, patch) => onChange(value.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="adm-field adm-wide">
      <span className="adm-field-label">{label}</span>

      {value.map((day, i) => (
        <div className="adm-day" key={i}>
          <div className="adm-day-head">
            <b>День {i + 1}</b>
            <div className="adm-day-tools">
              <button type="button" className="b" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Поднять день выше">
                ↑
              </button>
              <button type="button" className="b" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Опустить день ниже">
                ↓
              </button>
              <button type="button" className="b" onClick={() => remove(i)} aria-label={`Удалить день ${i + 1}`}>
                ✕
              </button>
            </div>
          </div>

          <span className="adm-field-label">Заголовок</span>
          <LocInputs value={day.title} onChange={(v) => update(i, { title: v })} label={`День ${i + 1}: заголовок`} />

          <span className="adm-field-label">Описание</span>
          <LocInputs value={day.text} multiline onChange={(v) => update(i, { text: v })} label={`День ${i + 1}: описание`} />
        </div>
      ))}

      <button
        type="button"
        className="b adm-add"
        onClick={() => onChange([...value, { day: value.length + 1, title: toLoc(''), text: toLoc('') }])}
      >
        + Добавить день
      </button>
    </div>
  );
}

// ---------- Одно фото (на телефоне — камера или галерея) ----------
export function ImageField({ label, value, onChange, onError }) {
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      onChange(await uploadPhoto(file));
    } catch (err) {
      onError?.(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="adm-field adm-wide">
      <span className="adm-field-label">{label}</span>
      <input type="file" accept="image/*" onChange={pick} disabled={busy} />
      <span className="adm-hint">Выберите фото из галереи — оно сожмётся автоматически.</span>
      {busy && <span className="adm-hint">Обрабатываем фото…</span>}
      {value && (
        <div className="adm-thumb-row">
          <img className="adm-thumb" src={value} alt="" />
          <button type="button" className="b" onClick={() => onChange('')}>
            Убрать
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Галерея: несколько фото сразу ----------
export function GalleryField({ label, value = [], onChange, onError }) {
  const [progress, setProgress] = useState(null); // { done, total }

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;

    const urls = [];
    setProgress({ done: 0, total: files.length });
    for (const file of files) {
      try {
        urls.push(await uploadPhoto(file));
      } catch (err) {
        onError?.(`${file.name}: ${err.message}`);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setProgress(null);
    // добавляем сразу все удачно загруженные, даже если часть упала
    onChange([...value, ...urls.filter(Boolean)]);
  };

  return (
    <div className="adm-field adm-wide">
      <span className="adm-field-label">{label}</span>
      <input type="file" accept="image/*" multiple onChange={pick} disabled={!!progress} />
      {progress && (
        <span className="adm-hint">
          Обрабатываем {progress.done} из {progress.total}…
        </span>
      )}

      {value.length > 0 && (
        <div className="adm-gallery">
          {value.map((url, i) => (
            <div className="adm-tile" key={`${url}-${i}`}>
              <img src={url} alt="" />
              <button
                type="button"
                aria-label={`Удалить фото ${i + 1}`}
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Форма по описанию полей ----------
// field: { key, label, type, required, multiline, options: [[value, label]],
//          default, min, max, hint, addLabel }
// type: heading | loc | loclist | program | image | gallery | bool |
//       select | textarea | number | text
export function FieldsForm({ fields, value, onChange, onError }) {
  const set = (key, v) => onChange({ ...value, [key]: v });

  return (
    <div className="adm-fields">
      {fields.map((f, idx) => {
        if (f.type === 'heading') {
          return (
            <h3 className="adm-section adm-wide" key={`h-${idx}`}>
              {f.label}
            </h3>
          );
        }

        const v = value[f.key];

        switch (f.type) {
          case 'loc':
            return (
              <LocalizedInput
                key={f.key}
                label={f.label}
                value={v}
                required={f.required}
                multiline={f.multiline}
                onChange={(x) => set(f.key, x)}
              />
            );
          case 'loclist':
            return (
              <LocList
                key={f.key}
                label={f.label}
                hint={f.hint}
                addLabel={f.addLabel}
                value={v}
                onChange={(x) => set(f.key, x)}
              />
            );
          case 'program':
            return <ProgramEditor key={f.key} label={f.label} value={v} onChange={(x) => set(f.key, x)} />;
          case 'image':
            return (
              <ImageField key={f.key} label={f.label} value={v} onChange={(x) => set(f.key, x)} onError={onError} />
            );
          case 'gallery':
            return (
              <GalleryField key={f.key} label={f.label} value={v} onChange={(x) => set(f.key, x)} onError={onError} />
            );
          case 'bool':
            return (
              <label key={f.key} className="adm-check adm-wide">
                <input type="checkbox" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />
                {f.label}
              </label>
            );
          case 'select':
            return (
              <label key={f.key}>
                {f.label}
                <select value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required}>
                  {!f.required && <option value="">Не выбрано</option>}
                  {f.options.map(([val, text]) => (
                    <option key={val} value={val}>
                      {text}
                    </option>
                  ))}
                </select>
              </label>
            );
          case 'textarea':
            return (
              <label key={f.key} className="adm-wide">
                {f.label}
                <textarea value={v ?? ''} required={f.required} onChange={(e) => set(f.key, e.target.value)} />
              </label>
            );
          default:
            return (
              <label key={f.key}>
                {f.label}
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  inputMode={f.type === 'number' ? 'numeric' : undefined}
                  min={f.type === 'number' ? f.min ?? 0 : undefined}
                  max={f.type === 'number' ? f.max : undefined}
                  value={v ?? ''}
                  required={f.required}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              </label>
            );
        }
      })}
    </div>
  );
}

// ---------- Подготовка данных ----------
const dataFields = (fields) => fields.filter((f) => f.type !== 'heading');
const LISTS = ['loclist', 'program', 'gallery'];

export const emptyFrom = (fields) =>
  Object.fromEntries(
    dataFields(fields).map((f) => [
      f.key,
      f.type === 'loc'
        ? toLoc('')
        : LISTS.includes(f.type)
          ? []
          : f.type === 'bool'
            ? f.default ?? false
            : f.default ?? '',
    ]),
  );

const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const applySeoDefaults = (fields, value = {}) => {
  const out = { ...value };
  const titleRu = value.title?.ru || value.title?.ru || '';
  const slug = out.slug || slugify(titleRu || value.title || '');
  if (slug) out.slug = slug;

  if (!out.meta_title || isLocEmpty(out.meta_title)) {
    out.meta_title = toLoc(titleRu || 'Тур');
  }

  if (!out.meta_description || isLocEmpty(out.meta_description)) {
    out.meta_description = toLoc(String(value.description?.ru || value.description || '').slice(0, 160));
  }

  if (!out.og_title || isLocEmpty(out.og_title)) {
    out.og_title = toLoc(titleRu || 'Тур');
  }

  if (!out.og_description || isLocEmpty(out.og_description)) {
    out.og_description = toLoc(String(value.description?.ru || value.description || '').slice(0, 200));
  }

  if (!out.canonical_url && slug) {
    out.canonical_url = `https://baidarken.com/tours/${slug}`;
  }

  return out;
};

// ответ API → значения формы (неизвестные поля сохраняем)
export const hydrate = (fields, data = {}) => {
  const out = { ...data };
  dataFields(fields).forEach((f) => {
    const raw = data[f.key];
    if (f.type === 'loc') out[f.key] = toLoc(raw);
    else if (f.type === 'loclist') out[f.key] = (raw || []).map(toLoc);
    else if (f.type === 'program')
      out[f.key] = (raw || []).map((d, i) => ({
        day: d.day ?? i + 1,
        title: toLoc(d.title),
        text: toLoc(d.text),
      }));
    else if (f.type === 'gallery') out[f.key] = raw || [];
    else if (f.type === 'bool') out[f.key] = raw ?? f.default ?? false;
    else out[f.key] = raw ?? f.default ?? '';
  });
  return out;
};

const isLocEmpty = (v) => !Object.values(toLoc(v)).some((x) => String(x).trim());

// значения формы → тело запроса.
// strict: отправлять только описанные поля (когда схема API известна точно)
export const prepare = (fields, value, strict = false) => {
  const out = strict ? {} : { ...value };

  dataFields(fields).forEach((f) => {
    const v = value[f.key];
    if (f.type === 'number') out[f.key] = Number(v) || 0;
    else if (f.type === 'loc') out[f.key] = strict ? toLoc(v) : v;
    else if (f.type === 'loclist')
      out[f.key] = (v || [])
        .filter((x) => !isLocEmpty(x))
        .map((x) => (strict ? toLoc(x) : x));
    else if (f.type === 'program')
      out[f.key] = (v || [])
        .filter((d) => !isLocEmpty(d.title) || !isLocEmpty(d.text))
        .map((d, i) => ({
          day: i + 1,
          title: toLoc(d.title),
          text: toLoc(d.text),
        }));
    else if (f.type === 'gallery') out[f.key] = (v || []).filter(Boolean);
    else out[f.key] = v;
  });

  return out;
};