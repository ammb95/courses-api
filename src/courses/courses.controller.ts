import { Handler } from "express";
import { CoursesService } from "./courses.service";
import { CreateCourseDto, EditCourseDto } from "./models/courses.dtos";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";

export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  public getAll: Handler = async (req, res, next): Promise<void> => {
    try {
      const courses = await this.coursesService.getAll();
      res.status(HttpStatusCodes.OK).json({ courses }).end();
    } catch (error) {
      next(error);
    }
  };

  public getById: Handler = async (req, res, next): Promise<void> => {
    try {
      const course = await this.coursesService.getById(req.params.id);
      res.status(HttpStatusCodes.OK).json({ course }).end();
    } catch (error) {
      next(error);
    }
  };

  public create: Handler = async (req, res, next): Promise<void> => {
    const newCourse: CreateCourseDto = req.body;

    try {
      const createdCourse = await this.coursesService.create(newCourse);
      res.status(HttpStatusCodes.CREATED).json({ course: createdCourse }).end();
    } catch (error) {
      next(error);
    }
  };

  public edit: Handler = async (req, res, next): Promise<void> => {
    const editCourseDto: EditCourseDto = req.body;

    try {
      const updatedCourse = await this.coursesService.edit(req.params.id, editCourseDto);
      res.status(HttpStatusCodes.OK).json({ course: updatedCourse }).end();
    } catch (error) {
      next(error);
    }
  };

  public delete: Handler = async (req, res, next): Promise<void> => {
    try {
      await this.coursesService.delete(req.params.id);
      res.status(HttpStatusCodes.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  };
}
