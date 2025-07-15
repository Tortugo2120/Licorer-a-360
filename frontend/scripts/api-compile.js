import SwaggerParser from "@apidevtools/swagger-parser";
import { readFileSync, writeFileSync } from "fs";
import {
  generateZodClientFromOpenAPI,
  getHandlebars,
} from "openapi-zod-client";

// Env

const apiUrl = process.env.API_URL || "http://localhost:8000";

// Configs
const distPath = "src/api.ts";

const handlebars = getHandlebars();

handlebars.registerHelper("camelCase", function (str) {
  return str
    .replace(/([-_]\w)/g, (match) => match[1].toUpperCase())
    .replace(/^\w/, (match) => match.toLowerCase());
});
handlebars.registerHelper(
  "notEmitted",
  (schema, types) => {
    if (schema in types) {
      return false;
    }

    return true;
  },
);

// Open API
const openApiDoc = (await SwaggerParser.parse(
  `${apiUrl}/openapi.json`,
)) ;

// Create Zodios Client
await generateZodClientFromOpenAPI({
  openApiDoc,
  distPath,
  handlebars: handlebars,
  options: {
    baseUrl: apiUrl,
    groupStrategy: "tag",
    withDocs: true,
    withAlias: true,
    withDescription: true,
    shouldExportAllTypes: true,
    shouldExportAllSchemas: true,
  },
  templatePath: "scripts/api.hbs",
});

// Read all the content as string
const apiContent = readFileSync(distPath, "utf-8");

// Remove all the passthroughs
const updatedApiContent = apiContent.replaceAll("passthrough()", "strict()");

// Write the updated content back to the file
writeFileSync(distPath, updatedApiContent, "utf-8");

console.log("Api generated successfully! ✅");