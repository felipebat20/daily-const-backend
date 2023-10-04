import { SessionInterface } from './ISessions';

export interface TaskInterface {
  description: string
  sessions?: SessionInterface[]
  id: string
  user_id: string
  createdAt: Date
  updatedAt: Date
}
