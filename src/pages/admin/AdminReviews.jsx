import { adminApi, asList } from '../../shared/api/admin';
import useLoad from '../../shared/hooks/useLoad';

const text = (o) => (o && typeof o === 'object' ? o.ru || o.en || o.kg || '' : o || '');

export default function AdminReviews() {
  const { data, error, loading, reload, setError } = useLoad(adminApi.reviews);
  const toggle = async (r) => {
    try { await adminApi.setReviewPublished(r.id, !r.is_published); reload(); } catch (e) { setError(e.message); }
  };
  return (
    <>
      <div className="adm-bar"><h1>Отзывы</h1></div>
      {error && <p className="adm-err">{error}</p>} 
      {loading && !data ? 'Загрузка…' : (
        <div className="adm-card"><table>
          <thead><tr><th>Автор</th><th>Оценка</th><th>Текст</th><th>Публикация</th></tr></thead>
          <tbody>{asList(data).map((r) => (
            <tr key={r.id}>
              <td><b>{r.author_name}</b></td><td>{r.rating}</td><td>{text(r.text).slice(0, 120)}</td>
              <td><button className="b" onClick={() => toggle(r)}>{r.is_published ? 'Скрыть' : 'Опубликовать'}</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}
