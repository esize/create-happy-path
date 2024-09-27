import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProjectConfig } from "@/commands/generate-project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeAllTemplates = async (config: ProjectConfig) => {
  const templates = await fs.readdirSync(
    path.join(__dirname, "templates/base")
  );
  for (const template of templates) {
    await writeTemplate(
      path.join(__dirname, "templates/base", template),
      path.join(config.name, template)
    );
  }
};
export const writeTemplate = async (
  templatePath: string,
  targetPath: string
) => {
  await fs.copyFileSync(templatePath, targetPath);
};
