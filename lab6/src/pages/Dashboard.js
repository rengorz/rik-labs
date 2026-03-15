import { getSummary, getAll } from '../store.js';

const CATEGORIES = {
  salary: 'Зарплата', freelance: 'Фріланс', gift: 'Подарунок', other_in: 'Інше',
  food: 'Їжа', transport: 'Транспорт', housing: 'Житло', health: 'Здоров\'я',
  entertainment: 'Розваги', other_out: 'Інше',
};

function fmt(n) {
  return n.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 });
}

export function renderDashboard(container) {
  const { income, expense, balance } = getSummary();
  const recent = getAll().sort((a, b) => b.date - a.date).slice(0, 5);

  container.innerHTML = `
    <div class="page">
      <h2 class="page-title">Огляд</h2>

      <div class="cards">
        <div class="card balance ${balance >= 0 ? 'positive' : 'negative'}">
          <span class="card-label">Баланс</span>
          <span class="card-value">${fmt(balance)}</span>
        </div>
        <div class="card income">
          <span class="card-label">Доходи</span>
          <span class="card-value">${fmt(income)}</span>
        </div>
        <div class="card expense">
          <span class="card-label">Витрати</span>
          <span class="card-value">${fmt(expense)}</span>
        </div>
      </div>

      <h3 class="section-title">Останні транзакції</h3>
      ${recent.length === 0 ? '<p class="empty">Транзакцій ще немає</p>' : `
        <ul class="tx-list">
          ${recent.map((t) => `
            <li class="tx-item">
              <span class="tx-cat">${CATEGORIES[t.category] ?? t.category}</span>
              <span class="tx-desc">${t.description || '—'}</span>
              <span class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</span>
            </li>
          `).join('')}
        </ul>
      `}
    </div>
  `;
}
