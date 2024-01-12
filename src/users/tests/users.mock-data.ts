import { marshall } from "@aws-sdk/util-dynamodb";
import { UserDepartments } from "../enums/user.departments.enum";
import { UserModel } from "../models/user.model";
import { CreateUserDto } from "../models/users.dtos";
import { UserRoles } from "../enums/user.roles.enum";

export const mockUsername = "username";
export const mockNonExistingUsername = "nonexistentuser";

export const mockHashedPassword = "mockHashedPassword";

export const mockCreateUserDto: CreateUserDto = {
  username: mockUsername,
  password: mockHashedPassword,
  roles: [UserRoles.ADMINISTRATOR],
  department: UserDepartments.MARKETING,
};

export const invalidCreateUserDto = { username: mockUsername } as CreateUserDto;

export const mockUser: UserModel = {
  id: "id",
  ...mockCreateUserDto,
};

export const mockUsersQueryResult = {
  Items: [marshall(mockUser)],
};

export const mockUsersEmptyQueryResult = {
  Items: [],
};

export const mockUsersPutItemResult = {};
