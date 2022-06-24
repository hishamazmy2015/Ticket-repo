import { CustomerError } from "./custom-error";

export class NotAuthorizedError extends CustomerError {
  statusCode = 401;
  reasons = "Not Authorized";
  constructor() {
    super("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reasons }];
  }
}
