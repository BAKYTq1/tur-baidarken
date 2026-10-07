import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { adminApi, token } from '../../shared/api/admin';
import '../../app/Layout/admin.scss';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  if (token.get()) return <Navigate to="/admin/tours" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const d = await adminApi.login(f.get('email'), f.get('password'));
      token.set(d.access_token);
      navigate('/admin/tours');
    } catch (x) { setError(x.message); }
  };

  return (
    <div className="adm" style={{ display: 'block' }}>
      <form className="adm-form adm-login" onSubmit={submit}>
        <h1>Вход</h1>
        {error && <p className="adm-err">{error}</p>}
        <label>Email<input name="email" type="email" required /></label>
        <label>Пароль<input name="password" type="password" required /></label>
        <button className="b p">Войти</button>
      </form>
    </div>
  );
}
