import { CreateTableInput } from "@aws-sdk/client-dynamodb";
import { UserRoles } from "../users/enums/user.roles.enum";
import { UserDepartments } from "../users/enums/user.departments.enum";
import { PermissionsMiddlewareConfig } from "../utils/route.model";

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

export const COURSES_PERMISSIONS_CONFIG: PermissionsMiddlewareConfig = {
  allowedRoles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER],
  allowedDepartments: [UserDepartments.MARKETING],
};
