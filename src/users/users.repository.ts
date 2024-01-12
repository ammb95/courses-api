import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  QueryCommandInput,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserModel } from "./models/user.model";
import { CreateUserDto } from "./models/users.dtos";
import { USERS_TABLE_NAME } from "./users.constants";
import { DatabaseError } from "../error-utils/custom-errors/database.error";
import { ErrorCodes } from "../error-utils/utils/error.codes.enum";
import { randomUUID } from "crypto";
import { PasswordManager } from "../auth/utils/password-manager";

export class UsersRepository {
  constructor(
    private readonly dbClient: DynamoDBClient,
    private readonly passwordManager: PasswordManager
  ) {}

  public getByUsername = async (username: string): Promise<UserModel> => {
    try {
      const params: QueryCommandInput = {
        TableName: USERS_TABLE_NAME,
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: marshall({
          ":username": username,
        }),
      };

      const command = new QueryCommand(params);
      const result = await this.dbClient.send(command);

      if (!result.Items || result.Items.length === 0) {
        throw new DatabaseError({
          message: `User With Username ${username} Not Found`,
          code: ErrorCodes.NOT_FOUND,
        });
      }

      return unmarshall(result.Items[0]) as UserModel;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError({
        message: `Error fetching user ${username}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  public create = async (createUserDto: CreateUserDto): Promise<UserModel> => {
    try {
      const id = randomUUID();
      const hashedPassword = await this.passwordManager.hashPassword(createUserDto.password);

      const params: PutItemCommandInput = {
        TableName: USERS_TABLE_NAME,
        Item: marshall({
          id,
          ...createUserDto,
          password: hashedPassword,
        }),
      };

      const command = new PutItemCommand(params);
      await this.dbClient.send(command);

      return this.getByUsername(createUserDto.username);
    } catch (error) {
      throw new DatabaseError({
        message: "Error Creating User",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };
}
