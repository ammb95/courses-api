import { AuthError } from './auth.error';
import { BaseErrorProps } from './base-error';

export class PasswordError extends AuthError {
  constructor(props: BaseErrorProps) {
    super(props);
  }
}
