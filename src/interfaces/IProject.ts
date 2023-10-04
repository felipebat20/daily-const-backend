import { UserInterface } from './IUser';

export interface Project {
  name: string
  user_id: string
  id: string
  createdAt: Date
  updatedAt: Date
  user?: UserInterface
}
