import React, { useState, useEffect } from 'react'
import { Task } from '../lib/supabase'

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit(editedTask)
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Editar Tarefa</h4>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              required
              placeholder=" "
            />
            <label htmlFor="title">Título da Tarefa</label>
          </div>

          <div className="input-field">
            <input
              type="date"
              id="startDate"
              value={editedTask.start_date}
              onChange={(e) => setEditedTask({ ...editedTask, start_date: e.target.value })}
              required
              placeholder=" "
            />
            <label htmlFor="startDate">Data de Início</label>
          </div>

          <div className="input-field">
            <input
              type="number"
              id="deadline"
              value={editedTask.deadline}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: Number(e.target.value) })}
              min="1"
              required
              placeholder=" "
            />
            <label htmlFor="deadline">Prazo em Dias</label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-close waves-effect waves-light btn-flat red-text"
              onClick={handleDelete}
            >
              Excluir
            </button>
            <button
              type="button"
              className="modal-close waves-effect waves-light btn-flat"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="waves-effect waves-light btn blue"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTaskModal 