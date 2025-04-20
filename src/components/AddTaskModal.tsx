import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../lib/supabase'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState(1)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      title,
      start_date: startDate,
      deadline,
      status: 'backlog',
      priority: 'medium'
    })
    setTitle('')
    setStartDate(new Date().toISOString().split('T')[0])
    setDeadline(1)
  }

  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Nova Tarefa</h4>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="title">Título da Tarefa</label>
          </div>

          <div className="input-field">
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="startDate">Data de Início</label>
          </div>

          <div className="input-field">
            <input
              type="number"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(Number(e.target.value))}
              min="1"
              required
              placeholder=" "
            />
            <label htmlFor="deadline">Prazo em Dias</label>
          </div>

          <div className="modal-footer">
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
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal 