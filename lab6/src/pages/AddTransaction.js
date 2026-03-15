import { add } from '../store.js';
import { navigate } from '../router.js';

const INCOME_CATS = [
  { value: 'salary', label: 'Зарплата' },
  { value: 'freelance', label: 'Фріланс' },
  { value: 'gift', label: 'Подарунок' },
  { value: 'other_in', label: 'Інше' },
];

const EXPENSE_CATS = [
  { value: 'food', label: 'Їжа' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'housing', label: 'Житло' },
  { value: 'health', label: 'Здоров\'я' },
  { value: 'entertainment', label: 'Розваги' },
  { value: 'other_out', label: 'Інше' },
];

export function renderAdd(container) {
  let type = 'expense';

  function render() {
    const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

    container.innerHTML = `
      <div class="page">
        <h2 class="page-title">Нова транзакція</h2>

        <form class="tx-form" id="txForm">
          <div class="type-switch">
            <button type="button" class="${type === 'expense' ? 'active expense' : ''}" data-type="expense">Витрата</button>
            <button type="button" class="${type === 'income' ? 'active income' : ''}" data-type="income">Дохід</button>
          </div>

          <label>
            Сума (грн)
            <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required/>
          </label>

          <label>
            Категорія
            <select name="category" required>
              ${cats.map((c) => `<option value="${c.value}">${c.label}</option>`).join('')}
            </select>
          </label>

          <label>
            Опис (необов'язково)
            <input type="text" name="description" placeholder="Коментар до транзакції"/>
          </label>

          <button type="submit" class="submit-btn ${type}">Зберегти</button>
        </form>
      </div>
    `;

    container.querySelectorAll('[data-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        type = btn.dataset.type;
        render();
      });
    });

    container.querySelector('#txForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      add({
        type,
        amount: parseFloat(fd.get('amount')),
        category: fd.get('category'),
        description: fd.get('description').trim(),
      });
      navigate('/transactions');
    });
  }

  render();
}
