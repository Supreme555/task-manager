export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE'
}

export enum TaskStatus {
  COMPLETED = 'COMPLETED',
  NOT_COMPLETED = 'NOT_COMPLETED'
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

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  pageSize: number;
} 