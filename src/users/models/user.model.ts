import { UserDepartments } from "../enums/user.departments.enum";
import { UserRoles } from "../enums/user.roles.enum";

export interface UserModel {
  id: string;
  username: string;
  password: string;
  roles: UserRoles[];
  department: UserDepartments;
}
