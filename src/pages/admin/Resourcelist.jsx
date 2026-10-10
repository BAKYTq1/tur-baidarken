import { Link } from 'react-router-dom';
import { useLoad } from '../../shared/hooks/useLoad';
import { resources } from './resources';

// Список раздела. Создание и редактирование — на отдельных страницах:
//   /admin/<resource>/new  и  /admin/<resource>/:id
export default function ResourceList({ resource }) {
  const cfg = resources[resource];
  const base = `/admin/${resource}`;
  const { items, loading, error, setError, reload } = useLoad(cfg.api.list);

  const remove = async (item) => {
    if (!window.confirm(cfg.confirmRemove ? cfg.confirmRemove(item) : 'Удалить запись?')) return;
    try {
      setError('');
      await cfg.api.remove(item.id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const span = cfg.columns.length + 1;

  return (
    <>
      <div className="adm-bar">
        <h1>{cfg.title}</h1>
        <Link className="b p" to={`${base}/new`}>
          {cfg.addLabel}
        </Link>
      </div>

      {error && <p className="adm-err">{error}</p>}

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              {cfg.columns.map((c) => (
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
                {cfg.columns.map((c) => (
                  <td key={c.label} data-label={c.label}>
                    {c.render(item)}
                  </td>
                ))}
                <td className="adm-actions-cell">
                  <div className="adm-actions">
                    <Link className="b" to={`${base}/${item.id}`}>
                      Изменить
                    </Link>
                    <button type="button" className="b" onClick={() => remove(item)}>
                      {cfg.removeLabel}
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