import { marshall } from "@aws-sdk/util-dynamodb";
import { CourseLearningFormats } from "../enums/course.learning-formats.enum";
import { CreateCourseDto, EditCourseDto } from "../models/courses.dtos";
import { CourseModel } from "../models/course.model";

export const mockCourseId = "mockCourseId";
export const invalidCourseId = "invalidCourseId";
export const editedTitle = "edited title";

export const invalidCreateCourseDto = {} as CreateCourseDto;
export const mockCreateCourseDto: CreateCourseDto = {
  title: "Sample Course",
  topic: "Sample topic",
  bestseller: false,
  learningFormats: [CourseLearningFormats.BLENDED],
  startDate: "12-01-2024",
};

export const invalidEditCourseDto: EditCourseDto = {};
export const mockEditCourseDto: EditCourseDto = {
  title: editedTitle,
};

export const mockCourse: CourseModel = {
  id: "1",
  ...mockCreateCourseDto,
};

export const mockEditedCourse: CourseModel = {
  ...mockCourse,
  title: editedTitle,
};

export const mockCourses = [mockCourse];

export const mockCoursesScanResult = {
  Items: [marshall(mockCourse)],
};
export const mockCoursesGetItemResult = {
  Item: marshall(mockCourse),
};
export const mockGetItemNullResult = {
  Item: null,
};

export const mockCoursesPutItemResult = {};
export const mockCoursesUpdateItemResult = {};
export const mockCoursesDeleteItemResult = {};
