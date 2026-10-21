import { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api/tasks";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce: type කරලා 400ms පස්සේ විතරක් search කරනවා
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks({ status, search, page, limit: 5 });
      setTasks(res.data);
      setPagination(res.pagination);
      setError("");
    } catch (err) {
      setError("Failed to load tasks. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [status, search, page]);

  const handleAdd = async (data) => {
    await createTask(data);
    setPage(1);
    await loadTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
    await loadTasks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
    await loadTasks();
  };

  return (
    <div className="container">
      <h1>📝 Task Manager</h1>

      <TaskForm onAdd={handleAdd} />

      <div className="card filters">
        <input
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && tasks.length === 0 && <p>No tasks found.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ← Prev
        </button>
        <span>
          Page {pagination.page} of {pagination.pages || 1} ({pagination.total} tasks)
        </span>
        <button
          disabled={page >= pagination.pages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}