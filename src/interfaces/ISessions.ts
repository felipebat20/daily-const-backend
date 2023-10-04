import { Project } from './IProject';
import { TaskInterface } from './ITask';

export interface SessionInterface {
  time_spent: number
  project_id: string | null
  project?: Project
  task_id: string
  task?: TaskInterface
  id: string
  createdAt: Date
  updatedAt: Date
}
