import { useState, useEffect } from 'react';

const STORAGE_KEY = 'task-tracker-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(title) {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() },
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  return { tasks, addTask, toggleTask, deleteTask, clearDone };
}
