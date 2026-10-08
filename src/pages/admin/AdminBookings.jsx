import { adminApi, asList } from '../../shared/api/admin';
import useLoad from '../../shared/hooks/useLoad';

const STATUS = { new: 'Новая', contacted: 'Связались', confirmed: 'Подтверждена', cancelled: 'Отменена' };

export default function AdminBookings() {
  const { data, error, loading, reload, setError } = useLoad(adminApi.bookings);
  const change = async (id, status) => {
    try { await adminApi.setBookingStatus(id, status); reload(); } catch (e) { setError(e.message); }
  };
  return (
    <>
      <div className="adm-bar"><h1>Заявки</h1></div>
      {error && <p className="adm-err">{error}</p>}
      {loading && !data ? 'Загрузка…' : (
        <div className="adm-card"><table>
          <thead><tr><th>Клиент</th><th>Контакт</th><th>Чел.</th><th>Дата</th><th>Статус</th></tr></thead>
          <tbody>{asList(data).map((b) => (
            <tr key={b.id}>
              <td><b>{b.name}</b></td><td>{b.contact}</td><td>{b.people_count}</td><td>{b.preferred_date || '—'}</td>
              <td>
                <select aria-label="Статус заявки" value={b.status} onChange={(e) => change(b.id, e.target.value)}>
                  {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}
