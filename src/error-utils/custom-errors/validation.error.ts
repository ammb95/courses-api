import { BaseError, BaseErrorProps } from "./base-error";

export class ValidationError extends BaseError {
  constructor(props: BaseErrorProps) {
    super(props);
  }
}
