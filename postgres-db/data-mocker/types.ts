export interface InterfaceMember {
  name: string;
  type: string;
}

export interface InterfaceTypeItem {
  itemName: string;
  members: InterfaceMember[];
}

export interface GeneratedType {
  name: string;
  data: DataItem[];
}

export type DataItem = Record<string, unknown>;

export enum MemberOtherDataType {
  USER_NAME = "USER_NAME",
  FIRST_NAME = "FIRST_NAME",
  FULL_NAME = "FULL_NAME",
  LAST_NAME = "LAST_NAME",
  PRICE = "PRICE",
  DESCRIPTION = "DESCRIPTION",
  PASSWORD = "PASSWORD",
  EMAIL = "EMAIL",
  UUID = "UUID",
}

export enum MemberType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "Date",
}

export enum OutputFormat {
  SQL = "SQL",
  JSON = "JSON",
}
