import { faker } from "@faker-js/faker";
import { DownloadVerification, Order, Product, User } from "@/types";
import {
  MemberOtherDataType,
  MemberType,
} from "../postgres-db/data-mocker/types";
import { generator, promiser } from "@/util";
import { inspect } from "util";
import { toSQL } from "../postgres-db/data-mocker/transformer";
import { writeFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

const productTemplate = {
  name: "products",
  members: {
    created_at: "{{date.recent}}",
    description: "{{commerce.productDescription}}",
    download_verifications: "{{string.uuid}}",
    id: "{{string.uuid}}",
    image_path: "{{image.urlLoremFlickr({ category: 'abstract' })}}",
    is_available_for_purchase: "{{datatype.boolean}}",
    name: "{{commerce.productName}}",
    orders: "{{string.uuid}}",
    price_in_cents: "{{number.int({ min: 100, max: 100000 })}}",
    updated_at: "{{date.recent}}",
  },
};

const downloadVerificationTemplate = {
  name: "download_verifications",
  members: {
    created_at: "{{date.recent}}",
    expires_at: "{{date.recent}}",
    id: "{{string.uuid}}",
    products: "{{string.uuid}}",
  },
};

const orderTemplate = {
  name: "orders",
  members: {
    created_at: "{{date.recent}}",
    id: "{{string.uuid}}",
    name: "{{person.fullName}}",
    price_in_cents: "{{number.int({ min: 100, max: 100000 })}}",
    product_id: "{{string.uuid}}",
    updated_at: "{{date.recent}}",
    user_id: "{{string.uuid}}",
  },
};

const userTemplate = {
  name: "users",
  members: {
    created_at: "{{date.recent}}",
    email: "{{internet.email}}",
    id: "{{string.uuid}}",
    name: "{{person.fullName}}",
    orders: ["{{string.uuid}}"],
    password: "{{internet.password}}",
    updated_at: "{{date.recent}}",
  },
};

function prepareDataForExport<T>({
  name,
  schema,
  numberOfRows = 1,
}: {
  schema: T;
  numberOfRows: number;
  name: string;
}) {
  return {
    name,
    data: generator({ schema, numberOfRows }),
  };
}

async function writeSQLFile<T>({
  name,
  schema,
  numberOfRows = 1,
}: {
  name: string;
  numberOfRows: number;
  schema: T;
}) {
  const data = prepareDataForExport({
    name,
    schema,
    numberOfRows,
  });
  const newData = toSQL(data);
  const pathToDataDir = "./postgres-db/data-mocker/mocked-data/";
  const filename = `insert-${name}-faker.sql`;
  const pathname = join(pathToDataDir, filename);

  const [fileResponse, fileError] = await promiser(
    writeFile(pathname, newData)
  );

  console.log({ fileError, fileResponse });
}

const templates = [
  productTemplate,
  orderTemplate,
  userTemplate,
  downloadVerificationTemplate,
];

async function callMe() {
  Promise.all(
    templates.map(async (template) => {
      console.log("VIEW TEMPLATE", template);
      return await writeSQLFile({
        schema: template.members,
        numberOfRows: 50,
        name: template.name,
      });
    })
  );
}

callMe().catch((err) => console.error(err));

// writeSQLFile({
//   schema: productTemplate,
//   numberOfRows: 2,
//   name: Object.keys({ productTemplate })[0].replace("Template", ""),
// }).catch((err) => console.error(err));
