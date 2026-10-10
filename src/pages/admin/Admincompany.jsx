import { useEffect, useState } from 'react';
import { companyApi } from '../../shared/api/admin';
import { FieldsForm, emptyFrom, hydrate, prepare } from './fields';

const FIELDS = [
  { key: 'phone', label: 'Телефон', type: 'text' },
  { key: 'instagram_url', label: 'Ссылка Instagram', type: 'text' },
  { key: 'whatsapp_url', label: 'Ссылка WhatsApp', type: 'text' },
  { key: 'address', label: 'Адрес', type: 'loc' },
  { key: 'included_default', label: 'Что включено по умолчанию', type: 'loclist', addLabel: 'Добавить пункт' },
  { key: 'bring_default', label: 'Что взять с собой по умолчанию', type: 'loclist', addLabel: 'Добавить пункт' },
];

export default function AdminCompany() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    companyApi
      .get()
      .then((data) => setForm(hydrate(FIELDS, data)))
      // данных компании может ещё не быть — тогда начинаем с пустой формы
      .catch(() => setForm(emptyFrom(FIELDS)));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      setSaved(false);
      await companyApi.save(prepare(FIELDS, form, true));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Компания</h1>
      </div>

      {error && <p className="adm-err">{error}</p>}
      {saved && <p className="adm-ok">Сохранено</p>}

      {!form ? (
        <p>Загрузка…</p>
      ) : (
        <form className="adm-form" onSubmit={save}>
          <FieldsForm
            fields={FIELDS}
            value={form}
            onChange={(v) => {
              setSaved(false);
              setForm(v);
            }}
            onError={setError}
          />
          <div className="adm-form-actions">
            <button className="b p" type="submit" disabled={busy}>
              {busy ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}