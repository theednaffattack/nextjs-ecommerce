import { SOURCE_PATH } from "./config";
import {
  InterfaceTypeItem,
  InterfaceMember,
  MemberOtherDataType,
  GeneratedType,
} from "./types";
import { GeneratorLib } from "./generator-lib";
import { join } from "path";

export async function transform(
  fileText: string
): Promise<InterfaceTypeItem[]> {
  const { Project } = await import("ts-morph");

  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["DOM", "ESNext"],
      allowJs: false,
      noEmit: true,
      skipLibCheck: true,
      noImplicitAny: false,
      baseUrl: ".",
    },
  });

  const currentDir = "./";
  const filename = "newFile.ts";
  const sourcePath = join(currentDir, filename);

  const sourceFile = project.createSourceFile(sourcePath, fileText);

  const interfaces = sourceFile.getInterfaces().map((i) => ({
    itemName: i.compilerNode.name.getText(),
    members: i.getMembers().map((m) => ({
      name: m.compilerNode.name
        ? m.compilerNode.name.getText()
        : "name is undefined",
      type: m.compilerNode.type
        ? m.compilerNode.type.getText()
        : "type is undefined",
    })),
  }));

  return interfaces;
}

export const toSQL = (item: GeneratedType) => {
  let sql: string = "";
  sql += `INSERT INTO ${item.name} VALUES ${item.data
    .map(
      (m) =>
        `(${Object.values(m)
          .map((o) => `'${JSON.stringify(o)}'`)
          .join(",")})`
    )
    .join(",")}\n\n`;
  return sql;
};

export const getOtherType = (member: InterfaceMember) => {
  const pattern = /^DataType\.(?<dataType>\w+)$/;
  const matchResult = member.type.match(pattern);
  if (!matchResult || !matchResult.groups) return GeneratorLib.string();
  const dataType = matchResult.groups.dataType as MemberOtherDataType;
  switch (dataType) {
    case MemberOtherDataType.USER_NAME:
      return GeneratorLib.userName();
    case MemberOtherDataType.FIRST_NAME:
      return GeneratorLib.firstName();
    case MemberOtherDataType.LAST_NAME:
      return GeneratorLib.lastName();
    case MemberOtherDataType.FULL_NAME:
      return GeneratorLib.fullName();
    case MemberOtherDataType.PRICE:
      return GeneratorLib.price();
    case MemberOtherDataType.DESCRIPTION:
      return GeneratorLib.sentence();
    case MemberOtherDataType.PASSWORD:
      return GeneratorLib.password();
    case MemberOtherDataType.UUID:
      return GeneratorLib.uuid();
    case MemberOtherDataType.EMAIL:
      return GeneratorLib.email();
    default:
      return GeneratorLib.string();
  }
};

export function fakeForeignKey(
  member: InterfaceMember,
  interfaceNames: string[]
) {
  const isArray = member.type.includes("[]");
  const memberName = isArray ? member.type.replace("[]", "") : member.type;
  const memberIsAKnownInterface = interfaceNames.includes(memberName);
  if (!memberIsAKnownInterface) {
    throw new Error("Sorry this program only allows primitives and Interfaces");
  }

  // This should almost always be true.
  if (isArray) {
    return Array.from({ length: 5 }).map(() => GeneratorLib.uuid());
  } else {
    return GeneratorLib.uuid();
  }
}
