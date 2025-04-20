import { supabase } from '../lib/supabase'
import { Task } from '../lib/supabase'

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(task: Task): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', task.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
  }
} 