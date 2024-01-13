import { UsersRepository } from "../users/users.repository";
import { UserModel } from "../users/models/user.model";
import { DatabaseError } from "../error-utils/custom-errors/database.error";
import { AuthError } from "../error-utils/custom-errors/auth.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { TokenManager } from "./utils/token-manager";
import { PasswordManager } from "./utils/password-manager";
import { LoginDto } from "./models/auth.dtos";
import { loginSchema } from "./models/auth.schemas";
import { SchemaValidator } from "../utils/schema-validator";

export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenManager: TokenManager,
    private readonly passwordManager: PasswordManager,
    private readonly schemaValidator: SchemaValidator
  ) {}

  private validateCredentials = async ({ username, password }: LoginDto): Promise<UserModel> => {
    try {
      const user = await this.usersRepository.getByUsername(username);

      await this.passwordManager.comparePasswords(password, user.password);

      return user;
    } catch (error) {
      if (error instanceof DatabaseError && error.code === ErrorCodes.NOT_FOUND) {
        throw new AuthError({
          message: `Wrong Username: User ${username} does not exist`,
          code: ErrorCodes.UNAUTHORIZED,
        });
      }
      throw error;
    }
  };

  public login = async (credentials: LoginDto): Promise<string> => {
    try {
      this.schemaValidator.validateSchema(loginSchema, credentials);

      const user = await this.validateCredentials(credentials);

      return this.tokenManager.generateToken(user);
    } catch (error) {
      throw error;
    }
  };

  public logout = async (token: string): Promise<void> => {
    try {
      return await this.tokenManager.invalidateToken(token);
    } catch (error) {
      throw error;
    }
  };
}
