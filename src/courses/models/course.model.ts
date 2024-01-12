import { CourseLearningFormats } from "../enums/course.learning-formats.enum";

export interface CourseModel {
  id: string;
  title: string;
  topic: string;
  learningFormats: CourseLearningFormats[];
  bestseller: boolean;
  startDate: string;
}
