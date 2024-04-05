import { faker } from "@faker-js/faker";

/**
 *
 * @param schema A JS object used as a template for faker.js. Object values are mustache-style strings that refer to faker.js methods.
 * @param numberOfRows Specifies the number of objects (database rows) to return.
 * @returns schema[] An array of objects modeled after the supplied schema template, filled with fake data.
 */
export function generator<T>({
  schema,
  numberOfRows = 1,
}: {
  schema: T;
  numberOfRows: number;
}) {
  //   max = max || min;
  return Array.from({
    length: numberOfRows,
    // length: faker.number.int({
    //   min,
    //   max,
    // }),
  }).map(() => {
    function innerGen(anySchema: any) {
      return Object.keys(anySchema).reduce(
        (entity: { [key: string]: any }, key) => {
          if (
            Object.prototype.toString.call(anySchema[key]) === "[object Object]"
          ) {
            entity[key] = innerGen(anySchema[key]);
            return entity;
          }
          entity[key] = faker.helpers.fake(anySchema[key]);
          return entity;
        },
        {}
      );
    }

    return innerGen(schema);
  });
}

// your schema
const clientsSchema = {
  id: "{{string.uuid}}",
  name: "{{company.companyName}} {{company.companySuffix}}",
  contact: {
    address: "{{address.streetAddress}}",
    phone: "{{phone.phoneNumber}}",
    email: "{{internet.email}}",
  },
};

// // generate random clients between 2 and 5 units, based on client schema defined above
// const data = generator(clientsSchema, 2, 5);

// Adapted from: https://blog.logrocket.com/write-declarative-javascript-promise-wrapper/
/**
 * A wrapper that allows for one-lining async functions. Now data requests and other promises look like: `const [data, error] = await promiser(myPromise(myArgs));`
 * @param promise Any promise function WITH agruments
 * @returns A promise tuple of type [data, error] if data is present error is null and vice-versa.
 */
export async function promiser<T>(
  promise: Promise<T>
): Promise<[T | null, null | unknown]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}
