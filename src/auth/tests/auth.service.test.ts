import { AuthService } from "../auth.service";
import { UsersRepository } from "../../users/users.repository";
import { DatabaseError } from "../../error-utils/custom-errors/database.error";
import { AuthError } from "../../error-utils/custom-errors/auth.error";
import { TokenManager } from "../utils/token-manager";
import { PasswordManager } from "../utils/password-manager";
import { loginSchema } from "../models/auth.schemas";
import { UserDepartments } from "../../users/enums/user.departments.enum";
import { NextFunction, Request, Response } from "express";
import { SchemaValidator } from "../../utils/schema-validator";
import { ValidationError } from "../../error-utils/custom-errors/validation.error";
import { PasswordError } from "../../error-utils/custom-errors/password.error";
import {
  mockDatabaseError,
  mockPasswordError,
  mockTokenError,
  mockValidationError,
} from "../../error-utils/utils/mock-errors";
import {
  invalidMockCredentials,
  invalidMockToken,
  invalidPasswordMockCredentials,
  invalidUsernameMockCredentials,
  mockCredentials,
  mockRouteAllowedDepartments,
  mockRouteAllowedRoles,
  mockToken,
} from "./auth.mock-data";
import { mockUser } from "../../users/tests/users.mock-data";
import { UserRoles } from "../../users/enums/user.roles.enum";

describe("AuthService", () => {
  let authService: AuthService;
  let mockUsersRepository: UsersRepository;
  let mockTokenManager: TokenManager;
  let mockPasswordManager: PasswordManager;
  let mockSchemaValidator: SchemaValidator;

  const mockRequest = { headers: { authorization: mockToken } } as Request;
  const mockResponse = {} as Response;
  let mockNext: jest.Mock<NextFunction>;

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
    mockNext = jest.fn();
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

  describe("authenticate method", () => {
    it("should call next() with AuthError instance for missing token", async () => {
      const missingTokenMockRequest = { headers: {} } as Request;

      await authService.authenticate(missingTokenMockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
    });

    it("should call next() with TokenError instance for invalid token", async () => {
      const invalidTokenMockRequest = { headers: { authorization: invalidMockToken } } as Request;

      jest.spyOn(mockTokenManager, "validateToken").mockRejectedValue(mockTokenError);

      await authService.authenticate(invalidTokenMockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockTokenError);
    });

    it("should call next() for a valid token", async () => {
      jest.spyOn(mockTokenManager, "validateToken").mockResolvedValue(true);

      await authService.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("checkPermissionsFactory method", () => {
    it("should call next() if user has sufficient permissions", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue(mockUser);

      await authService.checkPermissionsFactory(mockRouteAllowedRoles, mockRouteAllowedDepartments)(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next() with AuthError instance if user has insufficient role", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue({
        ...mockUser,
        roles: [UserRoles.CONSULTANT],
      });

      await authService.checkPermissionsFactory(mockRouteAllowedRoles, mockRouteAllowedDepartments)(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
    });

    it("should throw AuthError for user with insufficient department", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue({
        ...mockUser,
        department: UserDepartments.ACCOUNTING,
      });

      await authService.checkPermissionsFactory(mockRouteAllowedRoles, mockRouteAllowedDepartments)(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
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
