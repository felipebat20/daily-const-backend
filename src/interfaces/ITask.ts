import { Project } from './IProject';
import { SessionInterface } from './ISessions';

export interface TaskInterface {
  description: string
  sessions?: SessionInterface[]
  project_id: string | null,
  project: Project | null
  id: string
  user_id: string
  createdAt: Date
  updatedAt: Date
  last_session_started_at?: Date
}
