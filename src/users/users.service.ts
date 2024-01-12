import { UserModel } from "./models/user.model";
import { CreateUserDto } from "./models/users.dtos";
import { createUserSchema } from "./models/users.schemas";
import { UsersRepository } from "./users.repository";
import { SchemaValidator } from "../utils/schema-validator";
import { DatabaseError } from "../error-utils/custom-errors/database.error";
import { ErrorCodes } from "../error-utils/utils/error.codes.enum";

export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly schemaValidator: SchemaValidator
  ) {}

  public getByUsername = async (username: string): Promise<UserModel | undefined> => {
    try {
      return await this.userRepository.getByUsername(username);
    } catch (error) {
      throw error;
    }
  };

  private handleExistingUser = async (username: string) => {
    try {
      const existingUser = await this.getByUsername(username);

      if (existingUser) {
        throw new DatabaseError({
          message: `Username ${username} Not Available`,
          code: ErrorCodes.CONFLICT,
        });
      }
    } catch (error) {
      if (error instanceof DatabaseError && error.code === ErrorCodes.NOT_FOUND) {
        return;
      }
      throw error;
    }
  };

  public create = async (createUserDto: CreateUserDto): Promise<UserModel> => {
    try {
      await this.handleExistingUser(createUserDto.username);

      this.schemaValidator.validateSchema(createUserSchema, createUserDto);

      return await this.userRepository.create(createUserDto);
    } catch (error) {
      throw error;
    }
  };
}
