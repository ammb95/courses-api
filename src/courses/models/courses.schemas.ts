import Joi from "joi";
import { CourseLearningFormats } from "../enums/course.learning-formats.enum";

const VALID_LEARNING_FORMATS = Array.from(Object.values(CourseLearningFormats));

export const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  topic: Joi.string().required(),
  learningFormats: Joi.array()
    .items(Joi.string().valid(...VALID_LEARNING_FORMATS))
    .min(1)
    .required(),
  bestseller: Joi.boolean().required(),
  startDate: Joi.string().isoDate().required(),
});

export const editCourseSchema = Joi.object({
  title: Joi.string(),
  topic: Joi.string(),
  learningFormats: Joi.array()
    .items(Joi.string().valid(...VALID_LEARNING_FORMATS))
    .min(1),
  bestseller: Joi.boolean(),
  startDate: Joi.string().isoDate(),
});
