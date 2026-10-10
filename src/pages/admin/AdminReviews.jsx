import { adminApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';
import { loc } from '../../shared/hooks/loc';

// ⚠️ Имена полей — предположение, сверьте со swagger
export default function AdminReviews() {
  const { items, loading, error, setError, reload } = useLoad(adminApi.reviews);

  const toggle = async (review) => {
    try {
      setError('');
      await adminApi.setReviewPublished(review.id, !review.is_published);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (review) => {
    if (!window.confirm('Удалить отзыв безвозвратно?')) return;
    try {
      setError('');
      await adminApi.deleteReview(review.id); // см. admin.additions.js
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Отзывы</h1>
      </div>

      {error && <p className="adm-err">{error}</p>}

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              <th>Автор</th>
              <th>Оценка</th>
              <th>Отзыв</th>
              <th>На сайте</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="adm-empty"><td colSpan={5}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr className="adm-empty"><td colSpan={5}>Отзывов пока нет</td></tr>
            )}
            {items.map((r) => {
              const text = loc(r.text || r.comment);
              return (
                <tr key={r.id}>
                  <td data-label="Автор">
                    {loc(r.author_name || r.name) || '—'}
                    {r.tour_title && <div className="adm-sub">{loc(r.tour_title)}</div>}
                  </td>
                  <td data-label="Оценка">{r.rating ? `★ ${r.rating}` : '—'}</td>
                  <td data-label="Отзыв" className="adm-text-cell">
                    {text.slice(0, 140)}
                    {text.length > 140 ? '…' : ''}
                  </td>
                  <td data-label="На сайте">
                    <label className="adm-check">
                      <input
                        type="checkbox"
                        checked={!!r.is_published}
                        onChange={() => toggle(r)}
                      />
                      <span className={`adm-tag ${r.is_published ? 'ok' : ''}`}>
                        {r.is_published ? 'Опубликован' : 'Скрыт'}
                      </span>
                    </label>
                  </td>
                  <td className="adm-actions-cell">
                    <div className="adm-actions">
                      <button type="button" className="b" onClick={() => remove(r)}>
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}