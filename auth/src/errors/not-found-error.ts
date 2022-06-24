import { CustomerError } from "./custom-error";

export class NotFoundError extends CustomerError {
  statusCode = 404;
  reasons = "Route is not found";
  constructor() {
    super("Route is not found ");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reasons }];
  }
}
