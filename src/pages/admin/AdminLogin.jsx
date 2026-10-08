import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { adminApi, token } from '../../shared/api/admin';
import '../../shared/api/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token.get()) return <Navigate to="/admin/tours" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await adminApi.login(email.trim(), password);
      // имя поля токена зависит от API — поправьте при необходимости
      token.set(data.token || data.access_token);
      navigate('/admin/tours', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm">
      <form className="adm-form adm-login" onSubmit={submit}>
        <h1>Вход</h1>
        {error && <p className="adm-err">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="b p" type="submit" disabled={busy}>
          {busy ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}