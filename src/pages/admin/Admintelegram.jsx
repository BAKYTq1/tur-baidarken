import { useState } from 'react';
import { telegramApi } from '../../shared/api/admin';
import { useLoad } from '../../shared/hooks/useLoad';

// Элемент списка может быть числом или объектом — поддерживаем оба варианта
const idOf = (chat) =>
  chat && typeof chat === 'object' ? chat.chat_id ?? chat.chatId ?? chat.id : chat;

export default function AdminTelegram() {
  const { items, loading, error, setError, reload } = useLoad(telegramApi.list);
  const [chatId, setChatId] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    const value = chatId.trim();
    if (!value) return;
    try {
      setBusy(true);
      setError('');
      await telegramApi.add(Number(value) || value);
      setChatId('');
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (chat) => {
    const id = idOf(chat);
    if (!window.confirm(`Удалить получателя ${id}?`)) return;
    try {
      setError('');
      await telegramApi.remove(id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="adm-bar">
        <h1>Telegram</h1>
      </div>
      <p className="adm-hint">Сюда приходят уведомления о новых заявках.</p>

      {error && <p className="adm-err">{error}</p>}

      <form className="adm-form" onSubmit={add}>
        <label>
          Chat ID получателя
          <input
            inputMode="numeric"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="например, 123456789"
          />
        </label>
        <div className="adm-form-actions">
          <button className="b p" type="submit" disabled={busy || !chatId.trim()}>
            {busy ? 'Добавляем…' : 'Добавить получателя'}
          </button>
        </div>
      </form>

      <div className="adm-card">
        <table>
          <thead>
            <tr>
              <th>Chat ID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="adm-empty"><td colSpan={2}>Загрузка…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr className="adm-empty"><td colSpan={2}>Получателей пока нет</td></tr>
            )}
            {items.map((chat) => (
              <tr key={idOf(chat)}>
                <td data-label="Chat ID">{idOf(chat)}</td>
                <td className="adm-actions-cell">
                  <div className="adm-actions">
                    <button type="button" className="b" onClick={() => remove(chat)}>
                      Удалить
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