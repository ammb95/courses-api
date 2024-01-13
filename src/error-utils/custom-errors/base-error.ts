import { ErrorCodes } from "../enums/error.codes.enum";

export interface BaseErrorProps {
  message: string;
  code: ErrorCodes;
}

export class BaseError extends Error {
  code: ErrorCodes;
  constructor({ message, code }: BaseErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
