import { CoursesService } from "../courses.service";
import { SchemaValidator } from "../../utils/schema-validator";
import { CoursesRepository } from "../courses.repository";
import { createCourseSchema, editCourseSchema } from "../models/courses.schemas";
import { mockDatabaseError, mockValidationError } from "../../error-utils/utils/mock-errors";
import {
  invalidCourseId,
  invalidCreateCourseDto,
  invalidEditCourseDto,
  mockCourse,
  mockCourseId,
  mockCourses,
  mockCreateCourseDto,
  mockEditCourseDto,
  mockEditedCourse,
} from "./courses.mock-data";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let mockCoursesRepository: CoursesRepository;
  let mockSchemaValidator: SchemaValidator;

  beforeEach(() => {
    mockCoursesRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn(),
    } as unknown as CoursesRepository;

    mockSchemaValidator = {
      validateSchema: jest.fn(),
    } as unknown as SchemaValidator;

    coursesService = new CoursesService(mockCoursesRepository, mockSchemaValidator);
  });

  describe("getAll method", () => {
    it("should return all courses", async () => {
      jest.spyOn(mockCoursesRepository, "getAll").mockResolvedValue(mockCourses);

      const result = await coursesService.getAll();

      expect(result).toEqual(mockCourses);
      expect(mockCoursesRepository.getAll).toHaveBeenCalled();
    });

    it("should throw an error on repository error", async () => {
      jest.spyOn(mockCoursesRepository, "getAll").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.getAll()).rejects.toThrow(mockDatabaseError);
    });
  });

  describe("getById method", () => {
    it("should return a course by id", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);

      const result = await coursesService.getById(mockCourseId);

      expect(result).toEqual(mockCourse);
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
    });

    it("should throw an error for invalid course id", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.getById(invalidCourseId)).rejects.toThrow(mockDatabaseError);

      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(invalidCourseId);
    });

    it("should throw an error on repository error", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.getById(mockCourseId)).rejects.toThrow(mockDatabaseError);
    });
  });

  describe("create method", () => {
    it("should create a new course", async () => {
      jest.spyOn(mockCoursesRepository, "create").mockResolvedValue(mockCourse);

      await expect(coursesService.create(mockCreateCourseDto)).resolves.toEqual(mockCourse);
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        createCourseSchema,
        mockCreateCourseDto
      );
      expect(mockCoursesRepository.create).toHaveBeenCalledWith(mockCreateCourseDto);
    });

    it("should throw an error for invalid createCourseDto", async () => {
      jest.spyOn(mockSchemaValidator, "validateSchema").mockImplementation(() => {
        throw mockValidationError;
      });

      await expect(coursesService.create(invalidCreateCourseDto)).rejects.toThrow(
        mockValidationError
      );
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        createCourseSchema,
        invalidCreateCourseDto
      );
      expect(mockCoursesRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error on repository error", async () => {
      jest.spyOn(mockCoursesRepository, "create").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.create(mockCreateCourseDto)).rejects.toThrow(mockDatabaseError);
    });
  });

  describe("edit method", () => {
    it("should edit an existing course", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);
      jest.spyOn(mockCoursesRepository, "edit").mockResolvedValue(mockEditedCourse);

      await expect(coursesService.edit(mockCourseId, mockEditCourseDto)).resolves.toEqual(
        mockEditedCourse
      );
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        editCourseSchema,
        mockEditCourseDto
      );
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockCoursesRepository.edit).toHaveBeenCalledWith(mockCourseId, mockEditCourseDto);
    });

    it("should throw an error for invalid editCourseDto", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);
      jest.spyOn(mockSchemaValidator, "validateSchema").mockImplementation(() => {
        throw mockValidationError;
      });

      await expect(coursesService.edit(mockCourseId, invalidEditCourseDto)).rejects.toThrow(
        mockValidationError
      );
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        editCourseSchema,
        invalidEditCourseDto
      );
      expect(mockCoursesRepository.edit).not.toHaveBeenCalled();
    });

    it("should throw an error for non-existing course", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.edit(mockCourseId, mockEditCourseDto)).rejects.toThrow(
        mockDatabaseError
      );
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockSchemaValidator.validateSchema).not.toHaveBeenCalled();
      expect(mockCoursesRepository.edit).not.toHaveBeenCalled();
    });

    it("should throw an error on repository error", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);
      jest.spyOn(mockCoursesRepository, "edit").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.edit(mockCourseId, mockEditCourseDto)).rejects.toThrow(
        mockDatabaseError
      );
      expect(mockSchemaValidator.validateSchema).toHaveBeenCalledWith(
        editCourseSchema,
        mockEditCourseDto
      );
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockCoursesRepository.edit).toHaveBeenCalledWith(mockCourseId, mockEditCourseDto);
    });
  });

  describe("delete method", () => {
    it("should delete an existing course", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);
      jest.spyOn(mockCoursesRepository, "delete").mockResolvedValue(undefined);

      await expect(coursesService.delete(mockCourseId)).resolves.toBeUndefined();
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockCoursesRepository.delete).toHaveBeenCalledWith(mockCourseId);
    });

    it("should throw an error for non-existing course", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.delete(mockCourseId)).rejects.toThrow(mockDatabaseError);
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockCoursesRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw an error on repository error", async () => {
      jest.spyOn(mockCoursesRepository, "getById").mockResolvedValue(mockCourse);
      jest.spyOn(mockCoursesRepository, "delete").mockRejectedValue(mockDatabaseError);

      await expect(coursesService.delete(mockCourseId)).rejects.toThrow(mockDatabaseError);
      expect(mockCoursesRepository.getById).toHaveBeenCalledWith(mockCourseId);
      expect(mockCoursesRepository.delete).toHaveBeenCalledWith(mockCourseId);
    });
  });
});
