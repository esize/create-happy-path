import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import nunjucks from "nunjucks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure nunjucks
const env = nunjucks.configure(path.join(__dirname, "..", "..", "templates"), {
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true,
});

// Add custom filters if needed
env.addFilter("kebabCase", (str: string) => {
  return str.replace(/\s+/g, "-").toLowerCase();
});

export async function renderTemplate(
  templatePath: string,
  context: object
): Promise<string> {
  const template = await fs.readFile(templatePath, "utf-8");
  return env.renderString(template, context);
}

export async function writeRenderedTemplate(
  templatePath: string,
  outputPath: string,
  context: object
): Promise<void> {
  const rendered = await renderTemplate(templatePath, context);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, rendered);
}
