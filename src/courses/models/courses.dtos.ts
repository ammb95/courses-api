import { CourseModel } from "./course.model";

export type CreateCourseDto = Omit<CourseModel, "id">;

export type EditCourseDto = Omit<Partial<CourseModel>, "id">;
