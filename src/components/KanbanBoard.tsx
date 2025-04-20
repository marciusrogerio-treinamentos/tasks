import React, { useState } from 'react';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { Task } from '../types';

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Exemplo de Tarefa',
      startDate: '2024-04-20',
      deadline: '2024-04-25',
      endDate: null,
      status: 'todo'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: '#9e9e9e', icon: 'inbox' },
    { id: 'todo', title: 'A Fazer', color: '#2196F3', icon: 'assignment' },
    { id: 'doing', title: 'Em Andamento', color: '#FFC107', icon: 'play_circle' },
    { id: 'waiting', title: 'Aguardando', color: '#9C27B0', icon: 'hourglass_empty' },
    { id: 'done', title: 'Concluído', color: '#4CAF50', icon: 'check_circle' }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? task : t
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = (taskData: { title: string; startDate: string; deadline: number }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      startDate: taskData.startDate,
      deadline: taskData.deadline,
      endDate: calculateEndDate(taskData.startDate, taskData.deadline),
      status: 'backlog'
    };

    setTasks([...tasks, task]);
  };

  const calculateEndDate = (startDate: string, deadline: number): string => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + deadline);
    return date.toISOString().split('T')[0];
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
              <div className="card-title">
                <div className="row">
                  <div className="col s8">
                    <h4 className="grey-text text-darken-2">Quadro Kanban</h4>
                  </div>
                  <div className="col s4 right-align">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn waves-effect waves-light blue"
                    >
                      <i className="material-icons left">add</i>
                      Nova Tarefa
                    </button>
                  </div>
                </div>
              </div>

              <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddTask={handleAddTask}
              />

              {selectedTask && (
                <EditTaskModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                  }}
                  onSave={handleEditTask}
                  onDelete={handleDeleteTask}
                  task={selectedTask}
                />
              )}

              <div className="kanban-board">
                {columns.map(column => (
                  <div
                    key={column.id}
                    className="kanban-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id as Task['status'])}
                  >
                    <div className="kanban-column-header">
                      <h5 className="kanban-column-title">
                        <span className="material-icons" style={{ color: column.color, fontSize: '24px' }}>
                          {column.icon}
                        </span>
                        {column.title}
                      </h5>
                      <span className="badge" style={{ backgroundColor: column.color }}>
                        {tasks.filter(task => task.status === column.id).length}
                      </span>
                    </div>
                    
                    <div className="kanban-tasks">
                      {tasks
                        .filter(task => task.status === column.id)
                        .map(task => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEditClick}
                              onDelete={handleDeleteTask}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard; 