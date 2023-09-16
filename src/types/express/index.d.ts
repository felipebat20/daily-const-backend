// to make the file a module and avoid the TypeScript error
export {}


interface User {
  id: String
  name: String
  email: String
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