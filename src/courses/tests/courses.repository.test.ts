import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { DatabaseError } from "../../error-utils/custom-errors/database.error";
import { CoursesRepository } from "../courses.repository";
import {
  mockCourse,
  mockCourseId,
  mockCreateCourseDto,
  mockCoursesDeleteItemResult,
  mockEditCourseDto,
  mockGetItemNullResult,
  mockCoursesGetItemResult,
  mockCoursesPutItemResult,
  mockCoursesScanResult,
  mockCoursesUpdateItemResult,
} from "./courses.mock-data";
import { mockDatabaseError } from "../../error-utils/enums/mock-errors";

describe("CoursesRepository", () => {
  const mockDynamoDBClient = {
    send: jest.fn(),
  };

  const coursesRepository = new CoursesRepository(mockDynamoDBClient as unknown as DynamoDBClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll method", () => {
    it("should get all courses successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockCoursesScanResult);

      const result = await coursesRepository.getAll();

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
      expect(result).toEqual([mockCourse]);
    });

    it("should throw DatabaseError on general database error", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(coursesRepository.getAll()).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    });
  });

  describe("getById method", () => {
    it("should get course by id successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockCoursesGetItemResult);

      const result = await coursesRepository.getById(mockCourseId);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
      expect(result).toEqual(mockCourse);
    });

    it("should throw DatabaseError when course is not found", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockGetItemNullResult);

      await expect(coursesRepository.getById("nonexistentcourse")).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });

    it("should throw DatabaseError on general database error", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(coursesRepository.getById(mockCourseId)).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });
  });

  describe("create method", () => {
    it("should create a course successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockCoursesPutItemResult);
      jest.spyOn(coursesRepository, "getById").mockResolvedValue(mockCourse);

      const result = await coursesRepository.create(mockCreateCourseDto);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(PutItemCommand));
      expect(coursesRepository.getById).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockCourse);
    });

    it("should throw DatabaseError on general database error during create", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(coursesRepository.create(mockCreateCourseDto)).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(PutItemCommand));
      expect(coursesRepository.getById).not.toHaveBeenCalled();
    });
  });

  describe("edit method", () => {
    it("should edit a course successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockCoursesUpdateItemResult);
      jest.spyOn(coursesRepository, "getById").mockResolvedValue(mockCourse);

      const result = await coursesRepository.edit(mockCourseId, mockEditCourseDto);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
      expect(coursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(result).toEqual(mockCourse);
    });

    it("should throw DatabaseError on general database error during edit", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(coursesRepository.edit(mockCourseId, mockEditCourseDto)).rejects.toThrow(
        DatabaseError
      );

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
      expect(coursesRepository.getById).not.toHaveBeenCalled();
    });
  });

  describe("delete method", () => {
    it("should delete a course successfully", async () => {
      mockDynamoDBClient.send.mockResolvedValue(mockCoursesDeleteItemResult);

      await coursesRepository.delete(mockCourseId);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(DeleteItemCommand));
    });

    it("should throw DatabaseError on general database error during delete", async () => {
      mockDynamoDBClient.send.mockRejectedValue(mockDatabaseError);

      await expect(coursesRepository.delete(mockCourseId)).rejects.toThrow(DatabaseError);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(DeleteItemCommand));
    });
  });
});
