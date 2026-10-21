export default function TaskItem({ task, onStatusChange, onDelete }) {
  return (
    <li className={`task ${task.status}`}>
      <div>
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
        <span className={`badge ${task.priority}`}>{task.priority}</span>
      </div>
      <div className="actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button className="danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </li>
  );
}