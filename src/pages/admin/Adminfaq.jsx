import ResourcePage from './ResourcePage';
import { faqApi } from '../../shared/api/admin';

const FIELDS = [
  { key: 'question', label: 'Вопрос', type: 'loc', required: true },
  { key: 'answer', label: 'Ответ', type: 'loc', multiline: true, required: true },
  { key: 'sort_order', label: 'Порядок', type: 'number' },
];

const COLUMNS = [
  { label: 'Вопрос', render: (f) => f.question },
  { label: 'Порядок', render: (f) => f.sort_order ?? '—' },
];

export default function AdminFaq() {
  return (
    <ResourcePage
      title="FAQ"
      addLabel="Добавить вопрос"
      api={faqApi}
      fields={FIELDS}
      columns={COLUMNS}
      strict
      confirmRemove={(f) => `Удалить вопрос «${f.question}»?`}
      formTitles={{ create: 'Новый вопрос', edit: 'Редактирование вопроса' }}
    />
  );
}