import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { UsersRepository } from "../users.repository";
import { DatabaseError } from "../../error-utils/custom-errors/database.error";
import { PasswordManager } from "../../auth/utils/password-manager";
import { mockDatabaseError } from "../../error-utils/utils/mock-errors";
import {
  mockHashedPassword,
  mockUser,
  mockCreateUserDto,
  mockUsersQueryResult,
  mockUsersEmptyQueryResult,
  mockUsersPutItemResult,
} from "./users.mock-data";

describe("UsersRepository", () => {
  const mockDynamoDBClient = {
    send: jest.fn(),
  };

  const mockPasswordManager = {
    hashPassword: jest.fn(),
  };

  const usersRepository = new UsersRepository(
    mockDynamoDBClient as unknown as DynamoDBClient,
    mockPasswordManager as unknown as PasswordManager
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getByUsername method", () => {
    it("should get user by username successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockUsersQueryResult);

      const result = await usersRepository.getByUsername(mockCreateUserDto.username);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(result).toEqual(mockUser);
    });

    it("should throw DatabaseError when user is not found", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockUsersEmptyQueryResult);

      await expect(usersRepository.getByUsername("nonexistentuser")).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });

    it("should throw DatabaseError on general database error", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(usersRepository.getByUsername(mockCreateUserDto.username)).rejects.toThrow(
        DatabaseError
      );

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });
  });

  describe("create method", () => {
    it("should create a user successfully", async () => {
      mockPasswordManager.hashPassword.mockResolvedValue(mockHashedPassword);
      mockDynamoDBClient.send.mockResolvedValue(mockUsersPutItemResult);
      jest.spyOn(usersRepository, "getByUsername").mockResolvedValue(mockUser);

      const result = await usersRepository.create(mockCreateUserDto);

      expect(mockPasswordManager.hashPassword).toHaveBeenCalledWith(mockCreateUserDto.password);
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(PutItemCommand));
      expect(usersRepository.getByUsername).toHaveBeenCalledWith(mockCreateUserDto.username);
      expect(result).toEqual(mockUser);
    });

    it("should throw DatabaseError on general database error during create", async () => {
      mockPasswordManager.hashPassword.mockResolvedValue(mockHashedPassword);
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(usersRepository.create(mockCreateUserDto)).rejects.toThrow(DatabaseError);

      expect(mockPasswordManager.hashPassword).toHaveBeenCalledWith(mockCreateUserDto.password);
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(PutItemCommand));
    });
  });
});
