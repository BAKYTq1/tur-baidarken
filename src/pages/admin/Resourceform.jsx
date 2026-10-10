import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FieldsForm, emptyFrom, hydrate, prepare } from './fields';
import { resources } from './resources';

// Отдельная страница создания (/new) и редактирования (/:id)
export default function ResourceForm({ resource }) {
  const cfg = resources[resource];
  const base = `/admin/${resource}`;
  const { id } = useParams(); // нет id — создаём новую запись
  const navigate = useNavigate();

  const [form, setForm] = useState(() => (id ? null : emptyFrom(cfg.fields)));
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) {
      setForm(emptyFrom(cfg.fields));
      setLoading(false);
      return undefined;
    }

    let alive = true;
    setLoading(true);
    setError('');
    cfg.api
      .get(id) // полный объект со всеми переводами
      .then((data) => alive && setForm(hydrate(cfg.fields, data)))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id, cfg]);

  // ошибку показываем вверху страницы — прокручиваем туда, чтобы её увидели на телефоне
  const fail = (message) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      const body = prepare(cfg.fields, form, cfg.strict);
      if (id) await cfg.api.replace(id, body);
      else await cfg.api.create(body);
      navigate(base);
    } catch (err) {
      fail(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link className="adm-back" to={base}>
        ← К списку
      </Link>

      <div className="adm-bar">
        <h1>{id ? cfg.formTitles.edit : cfg.formTitles.create}</h1>
      </div>

      {error && <p className="adm-err">{error}</p>}

      {loading && <p>Загрузка…</p>}

      {!loading && form && (
        <form className="adm-form" onSubmit={save}>
          <FieldsForm fields={cfg.fields} value={form} onChange={setForm} onError={fail} />

          <div className="adm-form-actions">
            <button className="b p" type="submit" disabled={busy}>
              {busy ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <Link className="b" to={base}>
              Отмена
            </Link>
          </div>
        </form>
      )}
    </>
  );
}