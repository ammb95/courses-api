import { UsersService } from "../users.service";
import { UsersRepository } from "../users.repository";
import { SchemaValidator } from "../../utils/schema-validator";
import { DatabaseError } from "../../error-utils/custom-errors/database.error";
import { ValidationError } from "../../error-utils/custom-errors/validation.error";
import { createUserSchema } from "../models/users.schemas";
import { mockDatabaseError, mockValidationError } from "../../error-utils/enums/mock-errors";
import {
  mockNonExistingUsername,
  mockUser,
  mockCreateUserDto,
  mockUsername,
  invalidCreateUserDto,
} from "./users.mock-data";

describe("UsersService", () => {
  let usersService: UsersService;
  let mockUsersRepository: UsersRepository;
  let mockSchemaValidator: SchemaValidator;

  beforeEach(() => {
    mockUsersRepository = {
      getByUsername: jest.fn(),
      create: jest.fn(),
    } as unknown as UsersRepository;
    mockSchemaValidator = { validateSchema: jest.fn() };
    usersService = new UsersService(mockUsersRepository, mockSchemaValidator);
  });

  describe("getByUsername method", () => {
    it("should return user by username", async () => {
      jest.spyOn(mockUsersRepository, "getByUsername").mockResolvedValue(mockUser);

      const result = await usersService.getByUsername(mockUsername);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.getByUsername).toHaveBeenCalledWith(mockUsername);
    });

    it("should throw DatabaseError for user not found", async () => {
      jest.spyOn(mockUsersRepository, "getByUsername").mockRejectedValue(mockDatabaseError);

      await expect(usersService.getByUsername(mockNonExistingUsername)).rejects.toThrow(
        DatabaseError
      );
      expect(mockUsersRepository.getByUsername).toHaveBeenCalledWith(mockNonExistingUsername);
    });
  });

  describe("create method", () => {
    it("should create a user", async () => {
      jest.spyOn(usersService, "getByUsername").mockResolvedValue(undefined);
      jest.spyOn(mockSchemaValidator, "validateSchema").mockReturnValue();
      jest.spyOn(mockUsersRepository, "create").mockResolvedValue(mockUser);

      const result = await usersService.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(usersService.getByUsername).toHaveBeenCalledWith(mockUsername);
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        createUserSchema,
        mockCreateUserDto
      );
      expect(mockUsersRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it("should throw DatabaseError for existing user", async () => {
      jest.spyOn(usersService, "getByUsername").mockResolvedValue(mockUser);

      await expect(usersService.create(mockCreateUserDto)).rejects.toThrow(DatabaseError);
      expect(usersService.getByUsername).toHaveBeenCalledWith(mockUsername);
      expect(mockSchemaValidator.validateSchema).not.toHaveBeenCalled();
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid input", async () => {
      jest.spyOn(usersService, "getByUsername");
      jest.spyOn(mockSchemaValidator, "validateSchema").mockImplementation(() => {
        throw mockValidationError;
      });

      await expect(usersService.create(invalidCreateUserDto)).rejects.toThrow(ValidationError);
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        createUserSchema,
        invalidCreateUserDto
      );
      expect(usersService.getByUsername).toHaveBeenCalledWith(mockUsername);
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });
});
