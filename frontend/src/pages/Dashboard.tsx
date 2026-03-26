import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role, DashboardStats } from '../types';
import api from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard</div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome back, {user?.name}!</p>

      {user?.role === Role.ADMIN && (
        <div className="grid grid-4">
          <div className="stat-card">
            <h3>Total Projects</h3>
            <p className="stat-number">{stats.totalProjects}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.totalTasks}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.tasksByStatus.IN_PROGRESS}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue</h3>
            <p className="stat-number overdue">{stats.overdueTasks}</p>
          </div>
        </div>
      )}

      {user?.role === Role.PROJECT_MANAGER && (
        <>
          <div className="grid grid-4">
            <div className="stat-card">
              <h3>My Projects</h3>
              <p className="stat-number">{stats.totalProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats.totalTasks}</p>
            </div>
            <div className="stat-card">
              <h3>In Review</h3>
              <p className="stat-number">{stats.tasksByStatus.IN_REVIEW}</p>
            </div>
            <div className="stat-card">
              <h3>Due This Week</h3>
              <p className="stat-number">{stats.upcomingDueDates}</p>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3>Tasks by Status</h3>
              <div className="status-list">
                <div className="status-item">
                  <span>To Do</span>
                  <span className="badge badge-todo">{stats.tasksByStatus.TODO}</span>
                </div>
                <div className="status-item">
                  <span>In Progress</span>
                  <span className="badge badge-in-progress">
                    {stats.tasksByStatus.IN_PROGRESS}
                  </span>
                </div>
                <div className="status-item">
                  <span>In Review</span>
                  <span className="badge badge-in-review">
                    {stats.tasksByStatus.IN_REVIEW}
                  </span>
                </div>
                <div className="status-item">
                  <span>Done</span>
                  <span className="badge badge-done">{stats.tasksByStatus.DONE}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Tasks by Priority</h3>
              <div className="status-list">
                <div className="status-item">
                  <span>Critical</span>
                  <span className="badge badge-critical">
                    {stats.tasksByPriority?.CRITICAL}
                  </span>
                </div>
                <div className="status-item">
                  <span>High</span>
                  <span className="badge badge-high">{stats.tasksByPriority?.HIGH}</span>
                </div>
                <div className="status-item">
                  <span>Medium</span>
                  <span className="badge badge-medium">{stats.tasksByPriority?.MEDIUM}</span>
                </div>
                <div className="status-item">
                  <span>Low</span>
                  <span className="badge badge-low">{stats.tasksByPriority?.LOW}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {user?.role === Role.DEVELOPER && (
        <>
          <div className="grid grid-3">
            <div className="stat-card">
              <h3>My Tasks</h3>
              <p className="stat-number">{stats.totalTasks}</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-number">{stats.tasksByStatus.IN_PROGRESS}</p>
            </div>
            <div className="stat-card">
              <h3>Overdue</h3>
              <p className="stat-number overdue">{stats.overdueTasks}</p>
            </div>
          </div>
          <div className="card">
            <h3>My Tasks</h3>
            {stats.tasks && stats.tasks.length > 0 ? (
              <div className="task-list">
                {stats.tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div>
                      <h4>{task.title}</h4>
                      <p className="task-project">{task.project?.name}</p>
                    </div>
                    <div className="task-badges">
                      <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      {task.isOverdue && <span className="badge badge-critical">OVERDUE</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tasks assigned</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
