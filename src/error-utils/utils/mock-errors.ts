import { ErrorCodes } from "./error.codes.enum";
import { DatabaseError } from "../custom-errors/database.error";
import { PasswordError } from "../custom-errors/password.error";
import { TokenError } from "../custom-errors/token.error";
import { ValidationError } from "../custom-errors/validation.error";

export const mockError = new Error("Mock Error");

export const mockValidationError = new ValidationError({
  message: "Mock Validation Error",
  code: ErrorCodes.VALIDATION_ERROR,
});

export const mockDatabaseError = new DatabaseError({
  message: "Mock Database Error",
  code: ErrorCodes.DATABASE_ERROR,
});

export const mockPasswordError = new PasswordError({
  message: "Mock Password Error",
  code: ErrorCodes.PASSWORD_ERROR,
});

export const mockTokenError = new TokenError({
  message: "Mock Token Error",
  code: ErrorCodes.UNAUTHORIZED,
});
