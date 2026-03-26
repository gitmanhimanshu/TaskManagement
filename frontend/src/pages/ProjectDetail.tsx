import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Activity, Task } from '../types';
import api from '../services/api';
import { getSocket, joinProject, leaveProject } from '../services/socket';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchActivities();
      joinProject(parseInt(id));

      const socket = getSocket();
      if (socket) {
        socket.on('task:updated', handleTaskUpdate);
        socket.on('activity:new', handleNewActivity);
      }

      return () => {
        leaveProject(parseInt(id));
        if (socket) {
          socket.off('task:updated', handleTaskUpdate);
          socket.off('activity:new', handleNewActivity);
        }
      };
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Fetch project error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data } = await api.get(`/activities?projectId=${id}`);
      setActivities(data);
    } catch (error) {
      console.error('Fetch activities error:', error);
    }
  };

  const handleTaskUpdate = (data: any) => {
    console.log('Task updated:', data);
    fetchProject();
  };

  const handleNewActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="container">
      <div className="project-header">
        <div>
          <h1>{project.name}</h1>
          <p className="client-name">{project.clientName}</p>
          {project.description && <p className="description">{project.description}</p>}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Tasks</h2>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="task-list">
              {project.tasks.map((task: Task) => (
                <div key={task.id} className="task-item">
                  <div>
                    <h4>{task.title}</h4>
                    {task.assignedUser && (
                      <p className="task-assignee">Assigned to: {task.assignedUser.name}</p>
                    )}
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
            <p>No tasks yet</p>
          )}
        </div>

        <div className="card">
          <h2>Activity Feed</h2>
          <div className="activity-feed">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-content">
                    <p>
                      <strong>{activity.user?.name || 'User'}</strong> {activity.action}
                    </p>
                    <span className="activity-time">{getTimeAgo(activity.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
