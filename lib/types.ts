// lib/types.ts

export interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  description?: string
  priority: 'low' | 'medium' | 'high';
}

export interface Project {
  id: string
  name: string
  tasks: Task[]
}
