import { TaskInterface } from './ITask';

export interface SessionInterface {
  time_spent: number
  task_id: string
  task?: TaskInterface
  id: string
  createdAt: Date
  updatedAt: Date
}
