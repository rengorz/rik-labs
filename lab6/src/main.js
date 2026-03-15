import { route, startRouter } from './router.js';
import { renderDashboard } from './pages/Dashboard.js';
import { renderTransactions } from './pages/Transactions.js';
import { renderAdd } from './pages/AddTransaction.js';

const app = document.getElementById('app');

route('/', () => renderDashboard(app));
route('/transactions', () => renderTransactions(app));
route('/add', () => renderAdd(app));
route('*', () => renderDashboard(app));

startRouter();
