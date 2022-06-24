import { ValidationError } from "express-validator";

export abstract class CustomerError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomerError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
