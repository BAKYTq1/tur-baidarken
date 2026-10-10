import { useState } from 'react';
import { useLoad } from '../../shared/hooks/useLoad';
import { FieldsForm, emptyFrom, hydrate, prepare } from './fields';

// Универсальная страница «список + форма» для любого раздела админки.
//   api:      { list, get, create, replace, remove }
//   fields:   описание полей формы (см. fields.jsx)
//   columns:  [{ label, render: (item) => ... }]
export default function ResourcePage({
  title,
  api,
  fields,
  columns,
  addLabel = 'Добавить',
  removeLabel = 'Удалить',
  confirmRemove,
  strict = false, // true — отправлять только описанные поля (схема API известна точно)
  formTitles = { create: 'Новая запись', edit: 'Редактирование' },
}) {
  const { items, loading, error, setError, reload } = useLoad(api.list);
  const [form, setForm] = useState(null); // null — форма закрыта
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyFrom(fields));
    toTop();
  };

  const openEdit = async (id) => {
    try {
      setError('');
      const full = await api.get(id); // полный объект со всеми переводами
      setEditingId(id);
      setForm(hydrate(fields, full));
      toTop();
    } catch (e) {
      setError(e.message);
    }
  };

  const close = () => {
    setForm(null);
    setEditingId(null);
  };

  const save = async (e) => {
    e.preventDefault();
    const body = prepare(fields, form, strict);
    try {
      setBusy(true);
      setError('');
      if (editingId) await api.replace(editingId, body);
      else await api.create(body);
      close();
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    const text = confirmRemove ? confirmRemove(item) : 'Удалить запись?';
    if (!window.confirm(text)) return;
    try {
      setError('');
      await api.remove(item.id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const span = columns.length + 1;

  return (
    <>
      <div className="adm-bar">
        <h1>{title}</h1>
        {!form && (
          <button type="button" className="b p" onClick={openCreate}>
            {addLabel}
          </button>
        )}
      </div>

      {error && <p className="adm-err">{error}</p>}

      {form && (
        <form className="adm-form" onSubmit={save}>
          <h2 className="adm-form-title">
            {editingId ? formTitles.edit : formTitles.create}
          </h2>

          <FieldsForm fields={fields} value={form} onChange={setForm} onError={setError} />

          <div className="adm-form-actions">
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
              {columns.map((c) => (
                <th key={c.label}>{c.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="adm-empty"><td colSpan={span}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr className="adm-empty"><td colSpan={span}>Пока ничего нет</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((c) => (
                  <td key={c.label} data-label={c.label}>
                    {c.render(item)}
                  </td>
                ))}
                <td className="adm-actions-cell">
                  <div className="adm-actions">
                    <button type="button" className="b" onClick={() => openEdit(item.id)}>
                      Изменить
                    </button>
                    <button type="button" className="b" onClick={() => remove(item)}>
                      {removeLabel}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}