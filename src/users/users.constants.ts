import { CreateTableInput } from "@aws-sdk/client-dynamodb";

export const USERS_ROUTE_PATH = "users";
export const USERS_TABLE_NAME = "Users";
export const USERS_DATA_FILE_PATH = "data/users.data.json";

export const USERS_TABLE_PARAMS: CreateTableInput = {
  TableName: USERS_TABLE_NAME,
  AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
  KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  BillingMode: "PROVISIONED",
};
