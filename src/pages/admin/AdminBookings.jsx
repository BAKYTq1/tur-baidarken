import { adminApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';

// ⚠️ Список статусов и имена полей — предположение, сверьте с API
const STATUSES = [
  ['new', 'Новая'],
  ['confirmed', 'Подтверждена'],
  ['cancelled', 'Отменена'],
];

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('ru-RU') : '—');

export default function AdminBookings() {
  const { items, loading, error, setError, reload } = useLoad(adminApi.bookings);

  const change = async (id, status) => {
    try {
      setError('');
      await adminApi.setBookingStatus(id, status);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Заявки</h1>
      </div>

      {error && <p className="adm-err">{error}</p>}

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Контакты</th>
              <th>Тур</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5}>Заявок пока нет</td></tr>
            )}
            {items.map((b) => (
              <tr key={b.id}>
                <td>{fmtDate(b.created_at)}</td>
                <td>{b.name || b.customer_name || '—'}</td>
                <td>
                  {b.phone || '—'}
                  {b.email && <div style={{ color: '#5b6b69', fontSize: 13 }}>{b.email}</div>}
                </td>
                <td>{b.tour_title || b.tour?.title || b.tour_id || '—'}</td>
                <td>
                  <select value={b.status} onChange={(e) => change(b.id, e.target.value)}>
                    {STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}