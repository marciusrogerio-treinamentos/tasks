export interface Task {
  id: string;
  title: string;
  startDate: string;
  deadline: number;
  endDate: string | null;
  status: 'backlog' | 'todo' | 'doing' | 'waiting' | 'done';
} 