const KEY = 'finance-tracker-data';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAll() {
  return load();
}

export function add(tx) {
  const data = load();
  data.push({ id: crypto.randomUUID(), date: Date.now(), ...tx });
  save(data);
}

export function remove(id) {
  save(load().filter((t) => t.id !== id));
}

export function getSummary() {
  const data = load();
  const income = data.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = data.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}
