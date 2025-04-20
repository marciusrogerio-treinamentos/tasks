import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: Task['status']) => {
    const colors = {
      backlog: '#9e9e9e',
      todo: '#2196F3',
      doing: '#FFC107',
      waiting: '#9C27B0',
      done: '#4CAF50'
    };
    return colors[status] || colors.todo;
  };

  const getStatusText = (status: Task['status']) => {
    const texts = {
      backlog: 'Backlog',
      todo: 'A Fazer',
      doing: 'Em Andamento',
      waiting: 'Aguardando',
      done: 'Concluído'
    };
    return texts[status] || texts.todo;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getPriorityClass = () => {
    if (task.deadline < 0) return 'danger';
    if (task.deadline <= 3) return 'warning';
    return 'info';
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h6 className="task-card-title">{task.title}</h6>
        <span 
          className="status-chip"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          <span className="material-icons">label</span>
          {getStatusText(task.status)}
        </span>
      </div>
      
      <div className="task-card-content">
        <div className="task-info">
          <div className="task-date">
            <span className="material-icons">event</span>
            Início: {formatDate(task.startDate)}
          </div>
          <div className="task-deadline">
            <span className="material-icons">schedule</span>
            Prazo: {task.deadline} dias
          </div>
          {task.endDate && (
            <div className="task-end-date">
              <span className="material-icons">check_circle</span>
              Conclusão: {formatDate(task.endDate)}
            </div>
          )}
        </div>
      </div>

      <div className="task-card-footer">
        <div className={`priority-indicator ${getPriorityClass()}`} />
        <div className="action-buttons">
          <button
            className="btn-flat waves-effect"
            onClick={() => onEdit(task)}
          >
            <span className="material-icons">edit</span>
            Editar
          </button>
          <button
            className="btn-flat waves-effect red-text"
            onClick={() => onDelete(task.id)}
          >
            <span className="material-icons">delete</span>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 