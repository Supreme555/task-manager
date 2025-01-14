export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

export enum TaskStatus {
  COMPLETED = 'completed',
  NOT_COMPLETED = 'not_completed'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export interface TasksResponse {
  items: Task[];
  total: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  pageSize: number;
  sort?: string;
}

// Для сохранения в localStorage
export interface SavedFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: string;
} 