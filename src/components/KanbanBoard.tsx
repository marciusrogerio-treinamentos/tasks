import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Task } from '../lib/supabase'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import EditTaskModal from './EditTaskModal'
import { taskService } from '../services/taskService'

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const columns = [
    { id: 'backlog', title: 'Backlog', color: '#9e9e9e', icon: 'inbox' },
    { id: 'todo', title: 'A Fazer', color: '#2196F3', icon: 'assignment' },
    { id: 'doing', title: 'Em Andamento', color: '#FF9800', icon: 'play_circle' },
    { id: 'waiting', title: 'Aguardando', color: '#9C27B0', icon: 'hourglass_empty' },
    { id: 'done', title: 'Concluído', color: '#4CAF50', icon: 'check_circle' }
  ]

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskService.getTasks()
      setTasks(loadedTasks)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    }
  }

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [...prev, newTask])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
    }
  }

  const handleEditTask = async (task: Task) => {
    try {
      const updatedTask = await taskService.updateTask(task)
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))
      setIsEditModalOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      setIsEditModalOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    // Atualizar o estado local imediatamente para feedback visual
    const updatedTask = {
      ...task,
      status: destination.droppableId as Task['status']
    }
    
    setTasks(prev => prev.map(t => t.id === draggableId ? updatedTask : t))

    try {
      // Persistir a mudança no Supabase
      const savedTask = await taskService.updateTask(updatedTask)
      console.log('Tarefa atualizada com sucesso:', savedTask)
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error)
      // Reverter a mudança em caso de erro
      setTasks(prev => prev.map(t => t.id === draggableId ? task : t))
    }
  }

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map(column => (
          <div key={column.id} className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title" style={{ color: column.color }}>
                <i className="material-icons">{column.icon}</i>
                {column.title}
              </span>
              <span className="badge blue">{tasks.filter(task => task.status === column.id).length}</span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  className="kanban-tasks"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                    minHeight: '100px'
                  }}
                >
                  {tasks
                    .filter(task => task.status === column.id)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              marginBottom: '8px'
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => {
                                setSelectedTask(task)
                                setIsEditModalOpen(true)
                              }}
                              onDelete={() => handleDeleteTask(task.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>

      <button
        className="btn-floating btn-large waves-effect waves-light blue"
        onClick={() => setIsAddModalOpen(true)}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        <i className="material-icons">add</i>
      </button>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}

export default KanbanBoard 