import { AuthError } from "../../error-utils/custom-errors/auth.error";
import { TokenManager } from "../utils/token-manager";
import { UserDepartments } from "../../users/enums/user.departments.enum";
import { NextFunction, Request, Response } from "express";
import { mockTokenError } from "../../error-utils/utils/mock-errors";
import { invalidMockToken, mockPermissionsConfig, mockToken } from "./auth.mock-data";
import { mockUser } from "../../users/tests/users.mock-data";
import { UserRoles } from "../../users/enums/user.roles.enum";
import { AuthGuard } from "../auth.guard";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  let mockTokenManager: TokenManager;

  const mockRequest = { headers: { authorization: mockToken } } as Request;
  const mockResponse = {} as Response;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockTokenManager = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
      invalidateToken: jest.fn(),
      getUserFromToken: jest.fn(),
    } as unknown as TokenManager;
    authGuard = new AuthGuard(mockTokenManager);
    mockNext = jest.fn();
  });

  describe("authenticate method", () => {
    it("should call next() with AuthError instance for missing token", async () => {
      const missingTokenMockRequest = { headers: {} } as Request;

      await authGuard.authenticate(missingTokenMockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
    });

    it("should call next() with TokenError instance for invalid token", async () => {
      const invalidTokenMockRequest = { headers: { authorization: invalidMockToken } } as Request;

      jest.spyOn(mockTokenManager, "validateToken").mockRejectedValue(mockTokenError);

      await authGuard.authenticate(invalidTokenMockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockTokenError);
    });

    it("should call next() for a valid token", async () => {
      jest.spyOn(mockTokenManager, "validateToken").mockResolvedValue(true);

      await authGuard.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("checkPermissions method", () => {
    it("should call next() if user has sufficient permissions", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue(mockUser);

      await authGuard.checkPermissions(mockPermissionsConfig)(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next() with AuthError instance if user has insufficient role", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue({
        ...mockUser,
        roles: [UserRoles.CONSULTANT],
      });

      await authGuard.checkPermissions(mockPermissionsConfig)(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
    });

    it("should throw AuthError for user with insufficient department", async () => {
      jest.spyOn(mockTokenManager, "getUserFromToken").mockReturnValue({
        ...mockUser,
        department: UserDepartments.ACCOUNTING,
      });

      await authGuard.checkPermissions(mockPermissionsConfig)(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AuthError);
    });
  });
});
