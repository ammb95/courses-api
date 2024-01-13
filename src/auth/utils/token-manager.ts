import jwt from "jsonwebtoken";
import { UsersRepository } from "../../users/users.repository";
import { getEnvVariables } from "../../utils/get-env-variables";
import { TokenError } from "../../error-utils/custom-errors/token.error";
import { ErrorCodes } from "../../error-utils/enums/error.codes.enum";
import { UserModel } from "../../users/models/user.model";
import { JWT_DEFAULT_SECRET_KEY } from "../auth.constants";

const TOKEN_PREFIX = "Bearer ";

export class TokenManager {
  private secretKey: string;
  private invalidatedTokens: Set<string>;

  constructor(private usersRepository: UsersRepository) {
    this.secretKey = this.getSecretKey();
    this.invalidatedTokens = new Set();
  }

  private getSecretKey = (): string => {
    const { JWT_SECRET_KEY } = getEnvVariables();
    return JWT_SECRET_KEY || JWT_DEFAULT_SECRET_KEY;
  };

  private formatToken = (token: string): string => {
    return `${TOKEN_PREFIX}${token}`;
  };

  private extractToken = (formattedToken: string): string => {
    if (formattedToken.startsWith(TOKEN_PREFIX)) {
      return formattedToken.slice(TOKEN_PREFIX.length);
    }

    throw new TokenError({
      message: "Invalid Token",
      code: ErrorCodes.UNAUTHORIZED,
    });
  };

  public generateToken = (credentials: { username: string; password: string }): string => {
    try {
      const token = jwt.sign(credentials, this.secretKey, { expiresIn: "1h" });
      return this.formatToken(token);
    } catch (error) {
      throw new TokenError({
        message: "Error generating token",
        code: ErrorCodes.UNAUTHORIZED,
      });
    }
  };

  public decodeToken = (formattedToken: string) => {
    try {
      const token = this.extractToken(formattedToken);
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new TokenError({
        message: "Invalid Token",
        code: ErrorCodes.UNAUTHORIZED,
      });
    }
  };

  public getUserFromToken = (token: string): UserModel => {
    try {
      return this.decodeToken(token) as UserModel;
    } catch (error) {
      throw error;
    }
  };

  public validateToken = async (token: string): Promise<boolean> => {
    try {
      const decodedUser = this.getUserFromToken(token);

      const user = await this.usersRepository.getByUsername(decodedUser.username);

      return !!user && user.password === decodedUser.password && !this.invalidatedTokens.has(token);
    } catch (error) {
      throw error;
    }
  };

  public invalidateToken = async (token: string): Promise<void> => {
    const isTokenValid = await this.validateToken(token);
    if (isTokenValid) {
      this.invalidatedTokens.add(token);
      return;
    } else {
      throw new TokenError({
        message: "Invalid Token",
        code: ErrorCodes.UNAUTHORIZED,
      });
    }
  };
}
