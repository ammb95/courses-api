import Joi from "joi";
import { UserDepartments } from "../enums/user.departments.enum";
import { UserRoles } from "../enums/user.roles.enum";

const VALID_DEPARTMENTS: UserDepartments[] = [
  UserDepartments.SALES,
  UserDepartments.MARKETING,
  UserDepartments.ACCOUNTING,
];

const VALID_ROLES: UserRoles[] = [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.CONSULTANT];

export const createUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.array()
    .items(Joi.string().valid(...VALID_ROLES))
    .min(1)
    .required(),
  department: Joi.string()
    .valid(...VALID_DEPARTMENTS)
    .required(),
});
