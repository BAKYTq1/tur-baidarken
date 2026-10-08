import { useState } from 'react';
import { adminApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';

// ⚠️ Имена полей — предположение. Сверьте со схемой вашего API
// и поправьте здесь, остальной код трогать не нужно.
const EMPTY = {
  title: '',
  location: '',
  category: '',
  duration: '',
  group_size: '',
  price: '',
  image_url: '',
  is_active: true,
};

const fmtPrice = (v) => (v || v === 0 ? `${Number(v).toLocaleString('ru-RU')} ₽` : '—');

export default function AdminTours() {
  const { items, loading, error, setError, reload } = useLoad(adminApi.tours);
  const [form, setForm] = useState(null); // null — форма закрыта
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
  };

  const openEdit = async (id) => {
    try {
      setError('');
      const full = await adminApi.tour(id);
      setEditingId(id);
      setForm({ ...EMPTY, ...full });
    } catch (e) {
      setError(e.message);
    }
  };

  const close = () => {
    setForm(null);
    setEditingId(null);
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const res = await adminApi.uploadImage(file);
      // поле с адресом картинки зависит от API
      setForm((f) => ({ ...f, image_url: res.url || res.image_url || res.path }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price) || 0 };
    try {
      setBusy(true);
      setError('');
      if (editingId) await adminApi.replaceTour(editingId, body);
      else await adminApi.createTour(body);
      close();
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const archive = async (tour) => {
    if (!window.confirm(`Убрать в архив «${tour.title}»?`)) return;
    try {
      await adminApi.archiveTour(tour.id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Туры</h1>
        {!form && (
          <button className="b p" onClick={openCreate}>
            Добавить тур
          </button>
        )}
      </div>

      {error && <p className="adm-err">{error}</p>}

      {form && (
        <form className="adm-form" onSubmit={save}>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            {editingId ? 'Редактирование тура' : 'Новый тур'}
          </h2>

          <div className="adm-g3">
            <label>
              Название
              <input value={form.title} onChange={set('title')} required />
            </label>
            <label>
              Локация
              <input value={form.location} onChange={set('location')} placeholder="Банф, Канада" />
            </label>
            <label>
              Категория
              <select value={form.category} onChange={set('category')}>
                <option value="">Не выбрана</option>
                <option value="mountains">Горы</option>
                <option value="lakes">Озёра</option>
                <option value="family">Семейные</option>
                <option value="expeditions">Экспедиции</option>
                <option value="weekend">За выходные</option>
              </select>
            </label>
          </div>

          <div className="adm-g3">
            <label>
              Длительность
              <input value={form.duration} onChange={set('duration')} placeholder="8 дней" />
            </label>
            <label>
              Группа
              <input value={form.group_size} onChange={set('group_size')} placeholder="до 12 человек" />
            </label>
            <label>
              Цена, ₽
              <input type="number" min="0" value={form.price} onChange={set('price')} required />
            </label>
          </div>

          <label>
            Фото
            <input type="file" accept="image/*" onChange={upload} />
          </label>
          {form.image_url && (
            <img
              src={form.image_url}
              alt=""
              style={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={!!form.is_active} onChange={set('is_active')} />
            Показывать на сайте
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b p" type="submit" disabled={busy}>
              {busy ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button className="b" type="button" onClick={close}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              <th>Тур</th>
              <th>Локация</th>
              <th>Цена</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5}>Туров пока нет</td></tr>
            )}
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.location || '—'}</td>
                <td>{fmtPrice(t.price)}</td>
                <td>
                  <span className={`adm-tag ${t.is_active ? 'ok' : ''}`}>
                    {t.is_active ? 'Опубликован' : 'Скрыт'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="b" onClick={() => openEdit(t.id)}>Изменить</button>{' '}
                  <button className="b" onClick={() => archive(t)}>В архив</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}