import { readFile } from "fs/promises";
import { transform } from "../postgres-db/data-mocker/transformer";
import { promiser } from "@/util";
import { join } from "path";
import { inspect } from "util";
import { generateMockData } from "../postgres-db/data-mocker/generate-data";

// fileText: string
async function transformMyInterfaces() {
  const filename = "types.ts";
  const filedir = "./src";
  const filepath = join(filedir, filename);

  const fileText = await readFile(filepath, { encoding: "utf8" });
  //   const [fileText, fileError] = await promiser(
  //     readFile(filepath, { encoding: "utf8" })
  //   );
  if (!fileText) {
    // handleNullDataError("readFile");
    throw new Error(
      "Your data is missing! 'readFile' returned no data and did not throw an error"
    );
  }
  const [what, error] = await promiser(transform(fileText));
  if (!what) {
    throw new Error("Oh noooo, transform function failed");
  }

  console.log(
    "VIEW WHAT",
    inspect(what, { showHidden: false, depth: null, colors: true })
  );
}

function handleNullDataError(funcName: string) {
  throw new Error("Your data is missing!");
}

transformMyInterfaces().catch((err) => {
  console.error(err);
});
