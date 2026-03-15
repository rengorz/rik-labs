const FILTERS = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'done', label: 'Виконані' },
];

export default function TaskFilter({ current, onChange, doneCount, onClearDone }) {
  return (
    <div className="task-filter">
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={current === f.value ? 'active' : ''}
            onClick={() => onChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {doneCount > 0 && (
        <button className="clear-btn" onClick={onClearDone}>
          Очистити виконані ({doneCount})
        </button>
      )}
    </div>
  );
}
