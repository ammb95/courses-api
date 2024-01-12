import { BaseError, BaseErrorProps } from "./base-error";

export class DatabaseError extends BaseError {
  constructor(props: BaseErrorProps) {
    super(props);
  }
}
