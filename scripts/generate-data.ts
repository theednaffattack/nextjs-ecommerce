import { readFile } from "fs/promises";
import { generateMockData } from "../postgres-db/data-mocker/generate-data";
import { join } from "path";
import { promiser } from "@/util";
import { inspect } from "util";

async function generateData() {
  const filename = "types.ts";
  const filedir = "./src";
  const filepath = join(filedir, filename);

  //   const fileText = await readFile(filepath, { encoding: "utf8" });
  const [fileText, fileError] = await promiser(
    readFile(filepath, { encoding: "utf8" })
  );
  // Test for error
  if (fileError) {
    throw new Error("File read error", fileError);
  }
  // Test for null data
  if (!fileText) {
    // handleNullDataError("readFile");
    throw new Error(
      "Your data is missing! 'readFile' returned no data and did not throw an error"
    );
  }

  return generateMockData(fileText);
}

generateData()
  .then((data) =>
    console.log(inspect(data, { showHidden: false, depth: null, colors: true }))
  )
  .catch((err) => console.error(err));
