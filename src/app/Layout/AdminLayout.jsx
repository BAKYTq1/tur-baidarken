import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { token } from '../../shared/api/admin';
import './admin.scss';

const links = [
  ['/admin/tours', 'Туры'],
  ['/admin/bookings', 'Заявки'],
  ['/admin/reviews', 'Отзывы'],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  if (!token.get()) return <Navigate to="/admin/login" replace />;
  const logout = () => { token.clear(); navigate('/admin/login'); };
  return (
    <div className="adm">
      <aside className="adm-side">
        <b>Админ-панель</b>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink>
        ))}
        <button type="button" onClick={logout}>Выйти</button>
      </aside>
      <main className="adm-main"><Outlet /></main>
    </div>
  );
}
