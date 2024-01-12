import bcrypt from "bcryptjs";
import { PasswordError } from "../../error-utils/custom-errors/password.error";
import { ErrorCodes } from "../../error-utils/utils/error.codes.enum";
import { BCRYPT_SALT_ROUNDS } from "../auth.constants";

export class PasswordManager {
  public hashPassword = async (password: string): Promise<string> => {
    try {
      return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      // return password;
    } catch (error) {
      throw new PasswordError({
        message: "Error Hashing Password",
        code: ErrorCodes.PASSWORD_ERROR,
      });
    }
  };

  public comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
      // const match = password === hashedPassword;
      const match = await bcrypt.compare(password, hashedPassword);
      if (!match) {
        throw new PasswordError({
          message: "Wrong Password",
          code: ErrorCodes.PASSWORD_ERROR,
        });
      }
      return match;
    } catch (error) {
      throw error;
    }
  };
}
