import { AuthService } from "../auth.service";
import { UsersRepository } from "../../users/users.repository";
import { DatabaseError } from "../../error-utils/custom-errors/database.error";
import { TokenManager } from "../utils/token-manager";
import { PasswordManager } from "../utils/password-manager";
import { loginSchema } from "../models/auth.schemas";
import { SchemaValidator } from "../../utils/schema-validator";
import { ValidationError } from "../../error-utils/custom-errors/validation.error";
import { PasswordError } from "../../error-utils/custom-errors/password.error";
import {
  mockDatabaseError,
  mockPasswordError,
  mockTokenError,
  mockValidationError,
} from "../../error-utils/enums/mock-errors";
import {
  invalidMockCredentials,
  invalidPasswordMockCredentials,
  invalidUsernameMockCredentials,
  mockCredentials,
  mockToken,
} from "./auth.mock-data";
import { mockUser } from "../../users/tests/users.mock-data";

describe("AuthService", () => {
  let authService: AuthService;
  let mockUsersRepository: UsersRepository;
  let mockTokenManager: TokenManager;
  let mockPasswordManager: PasswordManager;
  let mockSchemaValidator: SchemaValidator;

  beforeEach(() => {
    mockUsersRepository = {
      getByUsername: jest.fn(),
    } as unknown as UsersRepository;

    mockTokenManager = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
      invalidateToken: jest.fn(),
      getUserFromToken: jest.fn(),
    } as unknown as TokenManager;
    mockPasswordManager = { comparePasswords: jest.fn() } as unknown as PasswordManager;
    mockSchemaValidator = { validateSchema: jest.fn() };

    authService = new AuthService(
      mockUsersRepository,
      mockTokenManager,
      mockPasswordManager,
      mockSchemaValidator
    );
  });

  describe("login method", () => {
    it("should throw ValidationError for validation error", async () => {
      jest.spyOn(mockSchemaValidator, "validateSchema").mockImplementation(() => {
        throw mockValidationError;
      });

      await expect(authService.login(invalidMockCredentials)).rejects.toThrow(ValidationError);
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        loginSchema,
        invalidMockCredentials
      );
    });

    it("should throw DatabaseError for invalid username", async () => {
      jest.spyOn(mockUsersRepository, "getByUsername").mockRejectedValue(() => {
        throw mockDatabaseError;
      });

      await expect(authService.login(invalidUsernameMockCredentials)).rejects.toThrow(
        DatabaseError
      );

      expect(mockUsersRepository.getByUsername).toHaveBeenCalledWith(
        invalidUsernameMockCredentials.username
      );
    });

    it("should throw PasswordError for valid username and invalid password", async () => {
      jest.spyOn(mockUsersRepository, "getByUsername").mockResolvedValue(mockUser);
      jest.spyOn(mockPasswordManager, "comparePasswords").mockImplementation(() => {
        throw mockPasswordError;
      });

      await expect(authService.login(invalidPasswordMockCredentials)).rejects.toThrow(
        PasswordError
      );

      expect(mockUsersRepository.getByUsername).toHaveBeenCalledWith(
        invalidPasswordMockCredentials.username
      );
    });

    it("should generate a token for valid credentials", async () => {
      jest.spyOn(mockUsersRepository, "getByUsername").mockResolvedValue(mockUser);
      jest.spyOn(mockPasswordManager, "comparePasswords").mockResolvedValue(true);

      jest.spyOn(mockTokenManager, "generateToken").mockReturnValue(mockToken);

      await expect(authService.login(mockCredentials)).resolves.toEqual(mockToken);

      expect(mockUsersRepository.getByUsername).toHaveBeenCalledWith(mockCredentials.username);
      expect(mockTokenManager.generateToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("logout method", () => {
    it("should call invalidateTokenMethod from tokenManager", async () => {
      jest.spyOn(mockTokenManager, "invalidateToken");

      await authService.logout(mockToken);

      expect(mockTokenManager.invalidateToken).toHaveBeenCalledWith(mockToken);
    });

    it("should throw error from invalidateTokenMethod from tokenManager", async () => {
      jest.spyOn(mockTokenManager, "invalidateToken").mockRejectedValue(mockTokenError);

      await expect(authService.logout(mockToken)).rejects.toThrow(mockTokenError);

      expect(mockTokenManager.invalidateToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
