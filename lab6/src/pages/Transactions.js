import { getAll, remove } from '../store.js';

const CATEGORIES = {
  salary: 'Зарплата', freelance: 'Фріланс', gift: 'Подарунок', other_in: 'Інше',
  food: 'Їжа', transport: 'Транспорт', housing: 'Житло', health: 'Здоров\'я',
  entertainment: 'Розваги', other_out: 'Інше',
};

function fmt(n) {
  return n.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 });
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function renderTransactions(container) {
  let filter = 'all';

  function render() {
    const all = getAll().sort((a, b) => b.date - a.date);
    const list = all.filter((t) => filter === 'all' || t.type === filter);

    container.innerHTML = `
      <div class="page">
        <h2 class="page-title">Транзакції</h2>

        <div class="filter-tabs">
          <button class="${filter === 'all' ? 'active' : ''}" data-filter="all">Усі</button>
          <button class="${filter === 'income' ? 'active' : ''}" data-filter="income">Доходи</button>
          <button class="${filter === 'expense' ? 'active' : ''}" data-filter="expense">Витрати</button>
        </div>

        ${list.length === 0 ? '<p class="empty">Транзакцій немає</p>' : `
          <ul class="tx-list full">
            ${list.map((t) => `
              <li class="tx-item" data-id="${t.id}">
                <span class="tx-date">${fmtDate(t.date)}</span>
                <span class="tx-cat">${CATEGORIES[t.category] ?? t.category}</span>
                <span class="tx-desc">${t.description || '—'}</span>
                <span class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</span>
                <button class="del-btn" data-id="${t.id}" aria-label="Видалити">✕</button>
              </li>
            `).join('')}
          </ul>
        `}
      </div>
    `;

    container.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        render();
      });
    });

    container.querySelectorAll('.del-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        remove(btn.dataset.id);
        render();
      });
    });
  }

  render();
}
