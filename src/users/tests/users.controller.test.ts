import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { HttpStatusCodes } from "../../enums/http-status-codes.enum";
import { Request, Response } from "express";
import { mockDatabaseError } from "../../error-utils/utils/mock-errors";
import { mockUser } from "./users.mock-data";

describe("UsersController", () => {
  let usersController: UsersController;
  let mockUsersService: UsersService;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockUsersService = { create: jest.fn() } as unknown as UsersService;
    usersController = new UsersController(mockUsersService);
    mockRequest = { body: {} } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe("create method", () => {
    it("should handle user creation successfully", async () => {
      jest.spyOn(mockUsersService, "create").mockResolvedValue(mockUser);

      await usersController.create(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: mockUser });
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle user creation error", async () => {
      jest.spyOn(mockUsersService, "create").mockRejectedValue(mockDatabaseError);

      await usersController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockDatabaseError);
    });
  });
});
