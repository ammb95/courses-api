import { Request, Response, NextFunction } from "express";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { mockError, mockTokenError } from "../../error-utils/utils/mock-errors";
import {
  invalidAuthorizationMockHeaders,
  invalidMockToken,
  missingTokenMockHeaders,
  mockToken,
  validAuthorizationMockHeaders,
} from "./auth.mock-data";
import { AuthError } from "../../error-utils/custom-errors/auth.error";
import { HttpStatusCodes } from "../../enums/http-status-codes.enum";

describe("AuthController", () => {
  let authController: AuthController;
  let mockAuthService: AuthService;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockAuthService = { login: jest.fn(), logout: jest.fn() } as unknown as AuthService;
    authController = new AuthController(mockAuthService);
    mockRequest = {} as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe("login method", () => {
    it("should handle login successfully", async () => {
      jest.spyOn(mockAuthService, "login").mockResolvedValue(mockToken);

      await authController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle login error", async () => {
      jest.spyOn(mockAuthService, "login").mockRejectedValue(mockError);

      await authController.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("logout method", () => {
    it("should handle logout successfully", async () => {
      mockRequest.headers = validAuthorizationMockHeaders;

      await authController.logout(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockToken);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.NO_CONTENT);
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle missing token in headers", async () => {
      mockRequest.headers = missingTokenMockHeaders;

      await authController.logout(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
    });

    it("should handle logout error", async () => {
      mockRequest.headers = invalidAuthorizationMockHeaders;

      jest.spyOn(mockAuthService, "logout").mockRejectedValue(mockTokenError);

      await authController.logout(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.logout).toHaveBeenCalledWith(invalidMockToken);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockTokenError);
    });
  });
});
