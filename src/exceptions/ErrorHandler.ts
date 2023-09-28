import { Response } from 'express';
import { AppError } from './AppError';
import { HttpCode } from '../enum/httpStatusCodes';
import { exitHandler } from '../ExitHandler';

class ErrorHandler {
  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      return this.handleTrustedError(error as AppError, response);
    }

    return this.handleUntrustedError(error, response);
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
  }

  private handleUntrustedError(error: Error | AppError, response?: Response): void {
    if (response) {
      response.status(HttpCode.INTERNAL_SERVER).json({ message: 'Internal server error' });
    }

    exitHandler.handleExit(1);
  }
}

export const errorHandler = new ErrorHandler();
