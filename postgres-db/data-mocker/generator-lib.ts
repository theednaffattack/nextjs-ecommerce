import { faker } from "@faker-js/faker";

faker.datatype.string;

export const GeneratorLib = {
  string: faker.string.sample,
  text: faker.lorem.text,
  number: faker.number.int,
  boolean: faker.datatype.boolean,
  datetime: faker.date.anytime,
  userName: faker.internet.userName,
  firstName: faker.person.firstName, //.name.firstName,
  lastName: faker.person.lastName,
  fullName: faker.person.fullName,
  price: faker.commerce.price,
  sentence: faker.lorem.sentence,
  password: faker.internet.password,
  uuid: faker.string.uuid,
  email: faker.internet.email,
};
