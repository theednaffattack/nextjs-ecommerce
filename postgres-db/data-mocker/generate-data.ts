import { fakeForeignKey, getOtherType, transform } from "./transformer";
import { DataItem, GeneratedType, MemberType } from "./types";
import { OPTIONS } from "./config";
import { GeneratorLib } from "./generator-lib";

export async function generateMockData(
  source: string,
  options = OPTIONS
): Promise<GeneratedType[]> {
  const interfaces = await transform(source);
  const interfaceNames = interfaces.map((intTypes) => intTypes.itemName);
  const generatedTypes: GeneratedType[] = [];
  for (const item of interfaces) {
    const generatedType: GeneratedType = { name: "", data: [] };
    generatedType.name = item.itemName;
    const itemMembers = item.members;
    Array.from({ length: +options.number_of_rows }).forEach((_) => {
      const row: DataItem = {};
      for (const member of itemMembers) {
        const memberType = member.type;
        switch (memberType) {
          case MemberType.STRING:
            row[member.name] = GeneratorLib.text();
            break;
          case MemberType.NUMBER:
            row[member.name] = GeneratorLib.number({
              max: +options.integer_max_value,
            });
            break;
          case MemberType.BOOLEAN:
            row[member.name] = GeneratorLib.boolean();
            break;
          case MemberType.DATE:
            row[member.name] = GeneratorLib.datetime();
            break;
          default:
            // row[member.name] = getOtherType(member);
            row[member.name] = fakeForeignKey(member, interfaceNames);
            break;
        }
      }
      generatedType.data.push(row);
    });
    generatedTypes.push(generatedType);
  }
  return generatedTypes;
}
