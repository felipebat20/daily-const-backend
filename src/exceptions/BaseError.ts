

class BaseError extends Error {
  constructor (name: string, statusCode: number, isOperational: Boolean, description: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}