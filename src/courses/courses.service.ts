import { CourseModel } from "./models/course.model";
import { SchemaValidator } from "../utils/schema-validator";
import { CreateCourseDto, EditCourseDto } from "./models/courses.dtos";
import { CoursesRepository } from "./courses.repository";
import { createCourseSchema, editCourseSchema } from "./models/courses.schemas";

export class CoursesService {
  constructor(
    private readonly courseRepository: CoursesRepository,
    private readonly schemaValidator: SchemaValidator
  ) {}

  public getAll = async (): Promise<CourseModel[]> => {
    try {
      return await this.courseRepository.getAll();
    } catch (error) {
      throw error;
    }
  };

  public getById = async (id: string): Promise<CourseModel> => {
    try {
      return await this.courseRepository.getById(id);
    } catch (error) {
      throw error;
    }
  };

  public create = async (createCourseDto: CreateCourseDto): Promise<CourseModel> => {
    try {
      this.schemaValidator.validateSchema(createCourseSchema, createCourseDto);
      return await this.courseRepository.create(createCourseDto);
    } catch (error) {
      throw error;
    }
  };

  public edit = async (
    id: string,
    editCourseDto: EditCourseDto
  ): Promise<CourseModel | undefined> => {
    try {
      const itemToBeDeleted = await this.courseRepository.getById(id);
      if (itemToBeDeleted) {
        this.schemaValidator.validateSchema(editCourseSchema, editCourseDto);
        return await this.courseRepository.edit(id, editCourseDto);
      }
    } catch (error) {
      throw error;
    }
  };

  public delete = async (id: string): Promise<void> => {
    try {
      const itemToBeDeleted = await this.courseRepository.getById(id);
      if (itemToBeDeleted) {
        await this.courseRepository.delete(id);
      }
    } catch (error) {
      throw error;
    }
  };
}
