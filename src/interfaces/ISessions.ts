import { TaskInterface } from './ITask';

export interface SessionInterface {
  task_id: string
  task?: TaskInterface
  id: string
  createdAt: Date
  updatedAt: Date
  startAt: Date | null
  endAt: Date | null
}
