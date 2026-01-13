export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
