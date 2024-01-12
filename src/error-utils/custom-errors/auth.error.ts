import { BaseError, BaseErrorProps } from "./base-error";

export class AuthError extends BaseError {
  constructor(props: BaseErrorProps) {
    super(props);
  }
}
