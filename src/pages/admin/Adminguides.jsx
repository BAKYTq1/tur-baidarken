import ResourcePage from './ResourcePage';
import { guidesApi } from '../../shared/api/admin';

const FIELDS = [
  { key: 'name', label: 'Имя', type: 'text', required: true },
  { key: 'role', label: 'Должность', type: 'loc' },
  { key: 'bio', label: 'О гиде', type: 'loc', multiline: true },
  { key: 'photo', label: 'Фото', type: 'image' },
  { key: 'years_experience', label: 'Опыт, лет', type: 'number', min: 0 },
  { key: 'sort_order', label: 'Порядок сортировки', type: 'number', min: 0 },
];

const COLUMNS = [
  { label: 'Имя', render: (g) => g.name },
  {
    label: 'Фото',
    render: (g) => g.photo ? <img className="adm-guide-photo" src={g.photo} alt={`Фото гида ${g.name}`} /> : '—',
  },
  { label: 'Должность', render: (g) => g.role || '—' },
  { label: 'Опыт, лет', render: (g) => g.years_experience ?? '—' },
  { label: 'Порядок', render: (g) => g.sort_order ?? '—' },
];

export default function AdminGuides() {
  return (
    <ResourcePage
      title="Гиды"
      addLabel="Добавить гида"
      api={guidesApi}
      fields={FIELDS}
      columns={COLUMNS}
      confirmRemove={(g) => `Удалить гида «${g.name}»?`}
      formTitles={{ create: 'Новый гид', edit: 'Редактирование гида' }}
    />
  );
}