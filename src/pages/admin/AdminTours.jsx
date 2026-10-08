import { useState } from 'react';
import { adminApi, asList } from '../../shared/api/admin';
import useLoad from '../../shared/hooks/useLoad';

const LANGS = ['ru', 'en', 'kg'];
const t = (o) => (o && typeof o === 'object' ? o.ru || o.en || o.kg || '' : o || '');

function TourForm({ tour, onDone, onCancel }) {
  const [error, setError] = useState('');
  const [cover, setCover] = useState(tour?.cover_image || '');
  const i18n = (f, k) => Object.fromEntries(LANGS.map((c) => [c, f.get(`${k}_${c}`)]).filter(([, s]) => s));

  const upload = async (file) => {
    try {
      const r = await adminApi.uploadImage(file);
      if (r.secure_url) { setCover(r.secure_url); setError(''); }
      else setError('Файл загружен, но ссылка не вернулась — вставьте её вручную');
    } catch (e) { setError(e.message); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = {
      ...(tour || {}),
      title: i18n(f, 'title'),
      description: i18n(f, 'description'),
      duration_days: Number(f.get('duration_days')),
      difficulty: f.get('difficulty'),
      price_from: f.get('price_from') === '' ? null : Number(f.get('price_from')),
      cover_image: cover,
      is_active: f.has('is_active'),
    };
    ['id', 'slug', 'created_at', 'updated_at'].forEach((k) => delete body[k]);
    try {
      if (tour) await adminApi.replaceTour(tour.id, body); else await adminApi.createTour(body);
      onDone();
    } catch (x) { setError(x.message); }
  };

  const group = (k, label, area) => (
    <div className="adm-g3">{LANGS.map((c) => (
      <label key={c}>{label} ({c})
        {area ? <textarea name={`${k}_${c}`} defaultValue={tour?.[k]?.[c] || ''} />
              : <input name={`${k}_${c}`} defaultValue={tour?.[k]?.[c] || ''} />}
      </label>
    ))}</div>
  );

  return (
    <form className="adm-form" onSubmit={submit}>
      {group('title', 'Название')}
      {group('description', 'Описание', true)}
      <div className="adm-g3">
        <label>Дней<input name="duration_days" type="number" min="1" max="365" required defaultValue={tour?.duration_days || 1} /></label>
        <label>Сложность
          <select name="difficulty" defaultValue={tour?.difficulty || 'easy'}>
            <option>easy</option><option>medium</option><option>hard</option>
          </select>
        </label>
        <label>Цена от (KGS)<input name="price_from" type="number" min="0" defaultValue={tour?.price_from ?? ''} /></label>
      </div>
      <label>Обложка (ссылка)<input type="url" required value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" /></label>
      <label>Или загрузить файл<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} /></label>
      <label><span><input type="checkbox" name="is_active" defaultChecked={tour ? tour.is_active : true} /> Активен</span></label>
      {error && <p className="adm-err">{error}</p>}
      <div><button className="b p">Сохранить</button> <button type="button" className="b" onClick={onCancel}>Отмена</button></div>
    </form>
  );
}

export default function AdminTours() {
  const { data, error, loading, reload, setError } = useLoad(adminApi.tours);
  const [form, setForm] = useState(null); // null | {} (новый) | tour

  const edit = async (id) => {
    try { setForm(await adminApi.tour(id)); } catch (e) { setError(e.message); }
  };
  const archive = async (id) => {
    if (!window.confirm('Архивировать тур?')) return;
    try { await adminApi.archiveTour(id); reload(); } catch (e) { setError(e.message); }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Туры</h1>
        <button className="b p" onClick={() => setForm({})}>Создать тур</button>
      </div>
      {error && <p className="adm-err">{error}</p>}
      {form && (
        <TourForm
          key={form.id || 'new'}
          tour={form.id ? form : null}
          onCancel={() => setForm(null)}
          onDone={() => { setForm(null); reload(); }}
        />
      )}
      {loading && !data ? 'Загрузка…' : (
        <div className="adm-card"><table>
          <thead><tr><th>Название</th><th>Цена</th><th>Дней</th><th>Статус</th><th /></tr></thead>
          <tbody>{asList(data).map((x) => (
            <tr key={x.id}>
              <td><b>{t(x.title)}</b></td>
              <td>{x.price_from != null ? `${x.price_from} ${x.price_currency || ''}` : '—'}</td>
              <td>{x.duration_days}</td>
              <td><span className={`adm-tag ${x.is_active ? 'ok' : ''}`}>{x.is_active ? 'Активен' : 'В архиве'}</span></td>
              <td>
                <button className="b" onClick={() => edit(x.id)}>Изменить</button>{' '}
                <button className="b" onClick={() => archive(x.id)}>В архив</button>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}
