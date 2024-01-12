import { CreateTableInput } from "@aws-sdk/client-dynamodb";

export const COURSES_ROUTE_PATH = "courses";
export const COURSES_TABLE_NAME = "Courses";
export const COURSES_DATA_FILE_PATH = "data/courses.data.json";

export const COURSES_TABLE_PARAMS: CreateTableInput = {
  TableName: COURSES_TABLE_NAME,
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  BillingMode: "PROVISIONED",
};
