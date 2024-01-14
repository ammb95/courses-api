import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommandInput,
  PutItemCommandInput,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CourseModel } from "./models/course.model";
import { CreateCourseDto, EditCourseDto } from "./models/courses.dtos";
import { COURSES_TABLE_NAME } from "./courses.constants";
import { DatabaseError } from "../error-utils/custom-errors/database.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { randomUUID } from "crypto";

export class CoursesRepository {
  constructor(private dbClient: DynamoDBClient) {}

  public getAll = async (): Promise<CourseModel[]> => {
    try {
      const params: QueryCommandInput = {
        TableName: COURSES_TABLE_NAME,
      };

      const command = new ScanCommand(params);
      const result = await this.dbClient.send(command);

      return (result.Items?.map((item) => unmarshall(item)) || []) as unknown as CourseModel[];
    } catch (error) {
      throw new DatabaseError({
        message: "Error Fetching Courses",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  public getById = async (id: string): Promise<CourseModel> => {
    try {
      const params: GetItemCommandInput = {
        TableName: COURSES_TABLE_NAME,
        Key: marshall({
          id,
        }),
      };

      const command = new GetItemCommand(params);
      const result = await this.dbClient.send(command);

      if (!result.Item) {
        throw new DatabaseError({
          message: `Course With Id ${id} Not Found`,
          code: ErrorCodes.NOT_FOUND,
        });
      }

      return unmarshall(result.Item) as CourseModel;
    } catch (error) {
      throw new DatabaseError({
        message: `Course With Id ${id} Not Found`,
        code: ErrorCodes.NOT_FOUND,
      });
    }
  };

  public create = async (createCourseDto: CreateCourseDto): Promise<CourseModel> => {
    try {
      const id = randomUUID();

      const params: PutItemCommandInput = {
        TableName: COURSES_TABLE_NAME,
        Item: marshall({
          id,
          ...createCourseDto,
        }),
      };

      const command = new PutItemCommand(params);
      await this.dbClient.send(command);

      return this.getById(id);
    } catch (error) {
      throw new DatabaseError({
        message: "Error Creating Course",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  /* 
    The goal of this function is to help the `edit` method to identify
    which fields of the given resource should be updated based on the fields provided
    by the user in the request.
    For example: if the user sends only `title` and `topic`, those are the only fields
    that should be updated. This function will build the database request config params
    based on this information 
  */
  private getUpdateConfig = (editCourseDto: EditCourseDto) => {
    const possibleAttributes: (keyof EditCourseDto)[] = [
      "title",
      "topic",
      "startDate",
      "learningFormats",
      "bestseller",
    ];

    const updateExpressionParts: string[] = [];

    const expressionAttributeValues: Record<string, any> = {};

    possibleAttributes.forEach((attribute, index) => {
      const attributeValue = editCourseDto[attribute];

      if (attributeValue !== undefined) {
        const prefix = updateExpressionParts.length === 0 ? "SET " : "";

        updateExpressionParts.push(`${prefix}${attribute} = :${attribute}`);
        expressionAttributeValues[`:${attribute}`] = attributeValue;
      }
    });

    const updateExpression = updateExpressionParts.join(", ");

    return { updateExpression, expressionAttributeValues };
  };

  public edit = async (id: string, editCourseDto: EditCourseDto): Promise<CourseModel> => {
    try {
      const { updateExpression, expressionAttributeValues } = this.getUpdateConfig(editCourseDto);

      const params: UpdateItemCommandInput = {
        TableName: COURSES_TABLE_NAME,
        Key: marshall({
          id,
        }),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
      };

      const command = new UpdateItemCommand(params);
      await this.dbClient.send(command);

      return this.getById(id);
    } catch (error) {
      throw new DatabaseError({
        message: `Error Editing Course With Id ${id}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };

  public delete = async (id: string): Promise<void> => {
    try {
      const params: DeleteItemCommandInput = {
        TableName: COURSES_TABLE_NAME,
        Key: marshall({
          id,
        }),
      };

      const command = new DeleteItemCommand(params);
      await this.dbClient.send(command);
    } catch (error) {
      throw new DatabaseError({
        message: `Error Deleting Course With Id ${id}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  };
}
