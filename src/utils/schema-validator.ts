import Joi from "joi";
import { ValidationError } from "../error-utils/custom-errors/validation.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";

export class SchemaValidator {
  public validateSchema = <DtoType>(schema: Joi.ObjectSchema, dto: DtoType): void => {
    const { error } = schema.validate(dto);

    if (error) {
      throw new ValidationError({
        message: `Validation failed: ${error.message}`,
        code: ErrorCodes.VALIDATION_ERROR,
      });
    }
  };
}
