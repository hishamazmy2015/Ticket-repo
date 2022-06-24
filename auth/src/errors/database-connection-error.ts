// import { ValidationError } from "expess-validator";
// import {DataBaseC} from 'express-validator'

import { CustomerError } from "./custom-error";

export class DatabaseConnectionError extends CustomerError {
  statusCode = 500;
  reasons = "Error connecting to DB";
  constructor() {
    super('Error connect to DB');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reasons }];
  }
}
