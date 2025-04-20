import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export type Task = {
  id: string
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'doing' | 'waiting' | 'done'
  priority: 'low' | 'medium' | 'high'
  start_date: string
  deadline: number
  end_date?: string
  created_at: string
  updated_at: string
}

// Funções para interagir com o Supabase
export const taskService = {
  // Buscar todas as tarefas
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Task[]
  },

  // Buscar tarefa por ID
  async getTaskById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Task
  },

  // Criar nova tarefa
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  // Atualizar tarefa
  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  // Deletar tarefa
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 