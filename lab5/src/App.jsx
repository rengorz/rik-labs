import { useState } from 'react';
import { useTasks } from './hooks/useTasks.js';
import TaskInput from './components/TaskInput.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const { tasks, addTask, toggleTask, deleteTask, clearDone } = useTasks();
  const [filter, setFilter] = useState('all');

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const activeCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="app-subtitle">
          {activeCount} активних · {doneCount} виконаних
        </p>
      </header>

      <main className="app-main">
        <TaskInput onAdd={addTask} />
        <TaskFilter
          current={filter}
          onChange={setFilter}
          doneCount={doneCount}
          onClearDone={clearDone}
        />
        <TaskList
          tasks={filtered}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
