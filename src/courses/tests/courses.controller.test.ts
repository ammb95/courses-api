import { CoursesController } from "../courses.controller";
import { CoursesService } from "../courses.service";
import { HttpStatusCodes } from "../../enums/http-status-codes.enum";
import { Request, Response } from "express";
import { mockDatabaseError, mockValidationError } from "../../error-utils/enums/mock-errors";
import {
  mockCreateCourseDto,
  invalidCreateCourseDto,
  mockCourse,
  mockCourseId,
  mockCourses,
  mockEditCourseDto,
  mockEditedCourse,
  invalidEditCourseDto,
} from "./courses.mock-data";

describe("CoursesController", () => {
  let coursesController: CoursesController;
  let mockCoursesService: CoursesService;
  let mockRequest: Request;
  let mockRequestWithId: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockCoursesService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn(),
    } as unknown as CoursesService;
    coursesController = new CoursesController(mockCoursesService);
    mockRequest = {} as Request;
    mockRequestWithId = { params: { id: mockCourseId } } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe("getAll method", () => {
    it("should return all courses", async () => {
      jest.spyOn(mockCoursesService, "getAll").mockResolvedValue(mockCourses);

      await coursesController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ courses: mockCourses });
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle error and call next", async () => {
      jest.spyOn(mockCoursesService, "getAll").mockRejectedValue(mockDatabaseError);

      await coursesController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockDatabaseError);
    });
  });

  describe("getById method", () => {
    it("should get a course by id", async () => {
      jest.spyOn(mockCoursesService, "getById").mockResolvedValue(mockCourse);

      await coursesController.getById(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ course: mockCourse });
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle error during getById", async () => {
      jest.spyOn(mockCoursesService, "getById").mockRejectedValue(mockDatabaseError);

      await coursesController.getById(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockNext).toHaveBeenCalledWith(mockDatabaseError);
    });
  });

  describe("create method", () => {
    it("should create a new course", async () => {
      mockRequest.body = mockCreateCourseDto;

      jest.spyOn(mockCoursesService, "create").mockResolvedValue(mockCourse);

      await coursesController.create(mockRequest, mockResponse, mockNext);

      expect(mockCoursesService.create).toHaveBeenCalledWith(mockCreateCourseDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ course: mockCourse });
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle error during create", async () => {
      mockRequest.body = invalidCreateCourseDto;

      jest.spyOn(mockCoursesService, "create").mockRejectedValue(mockValidationError);

      await coursesController.create(mockRequest, mockResponse, mockNext);

      expect(mockCoursesService.create).toHaveBeenCalledWith(invalidCreateCourseDto);
      expect(mockNext).toHaveBeenCalledWith(mockValidationError);
    });
  });

  describe("edit method", () => {
    it("should edit a course", async () => {
      mockRequestWithId.body = mockEditCourseDto;

      jest.spyOn(mockCoursesService, "edit").mockResolvedValue(mockEditedCourse);

      await coursesController.edit(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.edit).toHaveBeenCalledWith(mockCourseId, mockEditCourseDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ course: mockEditedCourse });
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle validation error during edit", async () => {
      mockRequestWithId.body = invalidEditCourseDto;

      jest.spyOn(mockCoursesService, "edit").mockRejectedValue(mockValidationError);

      await coursesController.edit(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.edit).toHaveBeenCalledWith(mockCourseId, invalidEditCourseDto);
      expect(mockNext).toHaveBeenCalledWith(mockValidationError);
    });

    it("should handle error during edit", async () => {
      mockRequestWithId.body = mockEditCourseDto;

      jest.spyOn(mockCoursesService, "edit").mockRejectedValue(mockDatabaseError);

      await coursesController.edit(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.edit).toHaveBeenCalledWith(mockCourseId, mockEditCourseDto);
      expect(mockNext).toHaveBeenCalledWith(mockDatabaseError);
    });
  });

  describe("delete method", () => {
    it("should delete a course", async () => {
      jest.spyOn(mockCoursesService, "delete").mockResolvedValue();

      await coursesController.delete(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.delete).toHaveBeenCalledWith(mockCourseId);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.NO_CONTENT);
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle error during delete", async () => {
      jest.spyOn(mockCoursesService, "delete").mockRejectedValue(mockDatabaseError);

      await coursesController.delete(mockRequestWithId, mockResponse, mockNext);

      expect(mockCoursesService.delete).toHaveBeenCalledWith(mockCourseId);
      expect(mockNext).toHaveBeenCalledWith(mockDatabaseError);
    });
  });
});
