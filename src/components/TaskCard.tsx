import React from 'react';
import { Task } from '../lib/supabase';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog':
        return '#9e9e9e';
      case 'todo':
        return '#2196F3';
      case 'doing':
        return '#FF9800';
      case 'waiting':
        return '#9C27B0';
      case 'done':
        return '#4CAF50';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'backlog':
        return 'Backlog';
      case 'todo':
        return 'A Fazer';
      case 'doing':
        return 'Em Andamento';
      case 'waiting':
        return 'Aguardando';
      case 'done':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'grey';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete();
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h5 className="task-card-title">{task.title}</h5>
        <div className="action-buttons">
          <button
            className="btn-flat"
            onClick={onEdit}
            title="Editar"
          >
            <i className="material-icons">edit</i>
          </button>
          <button
            className="btn-flat"
            onClick={handleDelete}
            title="Excluir"
          >
            <i className="material-icons">delete</i>
          </button>
        </div>
      </div>

      <div className="task-card-content">
        <div className="task-info">
          <div className="task-date">
            <i className="material-icons">event</i>
            Início: {new Date(task.start_date).toLocaleDateString()}
          </div>
          <div className="task-deadline">
            <i className="material-icons">timer</i>
            Prazo: {task.deadline} dias
          </div>
          {task.end_date && (
            <div className="task-end-date">
              <i className="material-icons">event_available</i>
              Conclusão: {new Date(task.end_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="task-card-footer">
        <div
          className="status-chip"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          <i className="material-icons">
            {task.status === 'backlog' ? 'inbox' :
             task.status === 'todo' ? 'assignment' :
             task.status === 'doing' ? 'play_circle' :
             task.status === 'waiting' ? 'hourglass_empty' :
             'check_circle'}
          </i>
          {getStatusText(task.status)}
        </div>
        <div className={`priority-indicator ${getPriorityClass(task.priority)}`} />
      </div>
    </div>
  );
};

export default TaskCard; 