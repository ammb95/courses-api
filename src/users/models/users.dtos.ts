import { UserModel } from "./user.model";

export type CreateUserDto = Omit<UserModel, "id">;
