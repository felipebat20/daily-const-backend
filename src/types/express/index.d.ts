// to make the file a module and avoid the TypeScript error
export {};


interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
