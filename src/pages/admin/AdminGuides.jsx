import { useState } from 'react'
import { adminApi } from '../../shared/api/admin'
import { toLoc } from '../../shared/hooks/loc'
import { useLoad } from '../../shared/hooks/useLoad'

const GUIDE_LANGS = [
  ['ru', 'RU'],
  ['en', 'EN'],
  ['kg', 'KG'],
  ['ja', 'JA'],
]

const EMPTY_GUIDE = {
  name: '',
  role: toLoc(),
  bio: toLoc(),
  photo: '',
  years_experience: '',
  sort_order: 0,
}

export default function AdminGuides() {
  const { items, loading, error, setError, reload } = useLoad(adminApi.guides)
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const setLocalizedField = (field, lang) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: { ...current[field], [lang]: event.target.value },
    }))
  }

  const openCreate = () => {
    setError('')
    setEditingId(null)
    setForm({ ...EMPTY_GUIDE, role: toLoc(), bio: toLoc() })
  }

  const openEdit = async (id) => {
    try {
      setError('')
      const guide = await adminApi.guide(id)
      setEditingId(id)
      setForm({
        ...EMPTY_GUIDE,
        ...guide,
        role: toLoc(guide.role),
        bio: toLoc(guide.bio),
        years_experience: guide.years_experience ?? '',
        sort_order: guide.sort_order ?? 0,
      })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const close = () => {
    setForm(null)
    setEditingId(null)
  }

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setBusy(true)
      setError('')
      const uploaded = await adminApi.uploadImage(file)
      const photo = uploaded.secure_url || uploaded.url
      if (!photo) throw new Error('Сервер не вернул ссылку на загруженное изображение')
      setForm((current) => ({ ...current, photo }))
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  const save = async (event) => {
    event.preventDefault()
    const body = {
      name: form.name.trim(),
      role: form.role,
      bio: form.bio,
      photo: form.photo.trim(),
      years_experience: form.years_experience === '' ? 0 : Number(form.years_experience),
      sort_order: Number(form.sort_order) || 0,
    }

    try {
      setBusy(true)
      setError('')
      if (editingId) await adminApi.replaceGuide(editingId, body)
      else await adminApi.createGuide(body)
      close()
      await reload()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (guide) => {
    if (!window.confirm(`Удалить гида «${guide.name}»?`)) return

    try {
      setError('')
      await adminApi.deleteGuide(guide.id)
      await reload()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <>
      <div className="adm-bar">
        <h1>Гиды</h1>
        {!form && <button className="b p" type="button" onClick={openCreate}>Добавить гида</button>}
      </div>

      {error && <p className="adm-err">{error}</p>}

      {form && (
        <form className="adm-form" onSubmit={save}>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            {editingId ? 'Редактирование гида' : 'Новый гид'}
          </h2>

          <div className="adm-g3">
            <label>
              Имя
              <input value={form.name} onChange={setField('name')} minLength={2} maxLength={120} required />
            </label>
            <label>
              Стаж, лет
              <input
                type="number"
                min="0"
                max="100"
                value={form.years_experience}
                onChange={setField('years_experience')}
              />
            </label>
            <label>
              Порядок сортировки
              <input type="number" min="0" value={form.sort_order} onChange={setField('sort_order')} />
            </label>
          </div>

          <h3 style={{ margin: 0 }}>Должность / роль</h3>
          <div className="adm-g3">
            {GUIDE_LANGS.map(([lang, label]) => (
              <label key={`role-${lang}`}>
                {label}
                <input value={form.role[lang] || ''} onChange={setLocalizedField('role', lang)} />
              </label>
            ))}
          </div>

          <h3 style={{ margin: 0 }}>О гиде</h3>
          <div className="adm-g3">
            {GUIDE_LANGS.map(([lang, label]) => (
              <label key={`bio-${lang}`}>
                {label}
                <textarea value={form.bio[lang] || ''} onChange={setLocalizedField('bio', lang)} />
              </label>
            ))}
          </div>

          <label>
            Фото (URL)
            <input type="url" value={form.photo} onChange={setField('photo')} required />
          </label>
          <label>
            Загрузить фото
            <input type="file" accept="image/*" onChange={uploadPhoto} disabled={busy} />
          </label>
          {form.photo && (
            <img
              src={form.photo}
              alt={`Фото гида ${form.name}`}
              style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8 }}
            />
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="b p" type="submit" disabled={busy}>
              {busy ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button className="b" type="button" onClick={close} disabled={busy}>Отмена</button>
          </div>
        </form>
      )}

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Стаж</th>
              <th>Порядок</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6}>Загрузка…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={6}>Гидов пока нет</td></tr>}
            {items.map((guide) => (
              <tr key={guide.id}>
                <td>
                  {guide.photo && (
                    <img
                      src={guide.photo}
                      alt=""
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                    />
                  )}
                </td>
                <td>{guide.name}</td>
                <td>{guide.role || '—'}</td>
                <td>{guide.years_experience ?? '—'}</td>
                <td>{guide.sort_order ?? '—'}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="b" type="button" onClick={() => openEdit(guide.id)}>Изменить</button>{' '}
                  <button className="b" type="button" onClick={() => remove(guide)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
