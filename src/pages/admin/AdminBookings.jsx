import { adminApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';

const STATUSES = [
  ['new', 'Новая'],
  ['confirmed', 'Подтверждена'],
  ['cancelled', 'Отменена'],
];

const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

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
              <th>Дата отправки</th>
              <th>Клиент</th>
              <th>Контакты</th>
              <th>Комментарий</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="adm-empty"><td colSpan={5}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr className="adm-empty"><td colSpan={5}>Заявок пока нет</td></tr>
            )}
            {items.map((b) => (
              <tr key={b.id}>
                <td data-label="Дата отправки">{fmtDate(b.created_at)}</td>
                <td data-label="Клиент">{b.name || '—'}</td>
                <td data-label="Контакты">
                  {b.contact ? (
                    <a href={`tel:${b.contact.replace(/[^\d+]/g, '')}`}>{b.contact}</a>
                  ) : '—'}
                </td>
                <td data-label="Комментарий" className="adm-text-cell">{b.note || '—'}</td>
                <td data-label="Статус">
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