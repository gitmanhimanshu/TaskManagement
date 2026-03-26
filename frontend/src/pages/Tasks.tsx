import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import api from '../services/api';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId: number, status: TaskStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="container">
      <h1>Tasks</h1>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by status:</label>
        <select
          className="form-control"
          style={{ width: '200px', display: 'inline-block' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Task</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Project</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Due Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '12px' }}>
                  {task.title}
                  {task.isOverdue && <span className="badge badge-critical" style={{ marginLeft: '8px' }}>OVERDUE</span>}
                </td>
                <td style={{ padding: '12px' }}>{task.project?.name}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  <select
                    className="form-control"
                    style={{ width: '150px' }}
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
