import { ValidationError } from "express-validator";
import { CustomerError } from "./custom-error";

export class RequestValidationError extends CustomerError {
  statusCode = 400;
  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
    // return { errors: formattedError };
  }
}

// throw new RequestValidationError(errors)
