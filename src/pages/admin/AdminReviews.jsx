import { adminApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';

// ⚠️ Имена полей — предположение, сверьте с API
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
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={4}>Отзывов пока нет</td></tr>
            )}
            {items.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.author_name || r.name || '—'}
                  {r.tour_title && (
                    <div style={{ color: '#5b6b69', fontSize: 13 }}>{r.tour_title}</div>
                  )}
                </td>
                <td>{r.rating ? `★ ${r.rating}` : '—'}</td>
                <td style={{ maxWidth: 420 }}>
                  {(r.text || r.comment || '').slice(0, 140)}
                  {(r.text || r.comment || '').length > 140 ? '…' : ''}
                </td>
                <td>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}