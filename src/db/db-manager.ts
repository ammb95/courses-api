import {
  DynamoDBClient,
  CreateTableCommand,
  BatchWriteItemCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { DatabaseError } from "../error-utils/custom-errors/database.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { getEnvVariables } from "../utils/get-env-variables";
import { randomUUID } from "crypto";
import { PasswordManager } from "../auth/utils/password-manager";
import { FileManager } from "./utils/file-manager";
import {
  USERS_DATA_FILE_PATH,
  USERS_TABLE_NAME,
  USERS_TABLE_PARAMS,
} from "../users/users.constants";
import {
  COURSES_DATA_FILE_PATH,
  COURSES_TABLE_NAME,
  COURSES_TABLE_PARAMS,
} from "../courses/courses.constants";
import {
  DB_DEFAULT_HOST,
  DB_DEFAULT_PORT,
  DB_DEFAULT_REGION,
  DEFAULT_AWS_ACCESS_KEY_ID,
  DEFAULT_AWS_SECRET_ACCESS_KEY,
} from "./db.constants";
import { Logger } from "../utils/logger";

type DBConfig = {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export class DBManager {
  private fileManager = new FileManager();
  dbClient: DynamoDBClient;

  constructor(private passwordManager: PasswordManager, private logger: Logger) {
    const config = this.getDBConfig();
    this.dbClient = new DynamoDBClient(config);
  }

  private getDBConfig = (): DBConfig => {
    const { DB_REGION, DB_HOST, DB_PORT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
      getEnvVariables();

    const region = DB_REGION || DB_DEFAULT_REGION;
    const host = DB_HOST || DB_DEFAULT_HOST;
    const dbPort = DB_PORT || DB_DEFAULT_PORT;

    const accessKey = AWS_ACCESS_KEY_ID || DEFAULT_AWS_ACCESS_KEY_ID;
    const secretKey = AWS_SECRET_ACCESS_KEY || DEFAULT_AWS_SECRET_ACCESS_KEY;

    const endpoint = `${host}:${dbPort}/`;

    return {
      region,
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    };
  };

  private createTable = async (tableName: string, params: any): Promise<void> => {
    try {
      const command = new CreateTableCommand({ ...params, TableName: tableName });
      await this.dbClient.send(command);
      this.logger.logMessage(`${tableName} Table Successfully Created`);
    } catch (error) {
      throw new DatabaseError({
        message: `Error creating table ${tableName}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  private mapResourceDtoToPutRequest = async <ResourceDto extends { password?: string }>(
    resourceDto: ResourceDto
  ) => {
    // Hash password in case the current DTO regards users
    if (resourceDto.password) {
      resourceDto.password = await this.passwordManager.hashPassword(resourceDto.password);
    }
    return {
      PutRequest: {
        Item: marshall({
          id: randomUUID(),
          ...resourceDto,
        }),
      },
    };
  };

  private populateTableFromFile = async <ResourceDto extends { password?: string }>(
    tableName: string,
    filePath: string
  ): Promise<void> => {
    try {
      const resourceDtos = await this.fileManager.getDataFromFile<ResourceDto>(__dirname, filePath);

      const putRequests = await Promise.all(resourceDtos.map(this.mapResourceDtoToPutRequest));

      const command = new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: putRequests,
        },
      });

      await this.dbClient.send(command);
      this.logger.logMessage(`${tableName} Table Successfully Populated`);
    } catch (error) {
      throw new DatabaseError({
        message: `Error populating table ${tableName}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  private checkTableExists = async (tableName: string): Promise<boolean> => {
    try {
      const command = new ListTablesCommand({});
      const existingTables = await this.dbClient.send(command);

      if (existingTables.TableNames && existingTables.TableNames.includes(tableName)) {
        this.logger.logMessage(`${tableName} Table Creation Skipped: Table Already Exists`);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  private handleTableCreationAndPopulation = async ({
    tableName,
    dataFilePath,
    params,
  }: {
    tableName: string;
    dataFilePath: string;
    params: any;
  }): Promise<void> => {
    try {
      const tableExists = await this.checkTableExists(tableName);
      if (!tableExists) {
        await this.createTable(tableName, params);
        await this.populateTableFromFile(tableName, dataFilePath);
      }
    } catch (error) {
      throw error;
    }
  };

  public checkDatabaseConnection = async (): Promise<boolean> => {
    try {
      this.logger.logMessage("Trying To Connect With Database");
      const command = new ListTablesCommand({});

      await this.dbClient.send(command);

      this.logger.logMessage("Connection Successfully Established With Database");
      return true;
    } catch (error) {
      this.logger.logError(
        new DatabaseError({
          message: "Error Connecting With The Database",
          code: ErrorCodes.DATABASE_ERROR,
        })
      );

      return false;
    }
  };

  public initializeDatabaseSeed = async (): Promise<void> => {
    try {
      this.logger.logMessage("Starting Database Seed");

      await this.handleTableCreationAndPopulation({
        tableName: USERS_TABLE_NAME,
        dataFilePath: USERS_DATA_FILE_PATH,
        params: USERS_TABLE_PARAMS,
      });
      await this.handleTableCreationAndPopulation({
        tableName: COURSES_TABLE_NAME,
        dataFilePath: COURSES_DATA_FILE_PATH,
        params: COURSES_TABLE_PARAMS,
      });

      this.logger.logMessage("Database Seed Finished");
    } catch (error) {
      this.logger.logError(
        new DatabaseError({
          message: "Error Seeding The Database",
          code: ErrorCodes.DATABASE_ERROR,
        })
      );
    }
  };
}
