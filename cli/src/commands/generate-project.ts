import { writeAllTemplates } from "@/utils/templating.js";
import * as p from "@clack/prompts";
import color from "picocolors";

export interface ProjectConfig {
  name: string;
  includeAdmin: boolean;
  includeDocs: boolean;
  includeRedis: boolean;
}

export async function generateProject(): Promise<ProjectConfig | null> {
  const project = await p.group(
    {
      name: () =>
        p.text({
          message: "What is your project named?",
          validate: (value) => {
            if (value.length === 0) return "Project name cannot be empty";
            if (value.length > 214)
              return "Project name must be less than 214 characters";
            if (!/^[a-z0-9-_]+$/i.test(value))
              return "Project name can only contain letters, numbers, underscores, and hyphens";
            return;
          },
        }),
      includeAdmin: () =>
        p.confirm({ message: "Would you like to include an admin UI?" }),
      includeDocs: () =>
        p.confirm({
          message: "Would you like to include documentation pages?",
        }),
      includeRedis: () =>
        p.confirm({
          message: "Would you like to include Redis configuration?",
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled. Sorry!");
        return null;
      },
    }
  );

  if (!project) {
    return null;
  }

  const spinner = p.spinner();
  spinner.start("Generating project");

  await writeAllTemplates(project);

  spinner.stop("Project generated");

  p.log.success(`${color.green("✔")} Project configuration complete!`);
  p.log.info(`Created a new Next.js project with the following configuration:`);
  p.log.info(`  ${color.cyan("Name")}: ${project.name}`);
  p.log.info(
    `  ${color.cyan("Include Admin UI")}: ${
      project.includeAdmin ? "Yes" : "No"
    }`
  );
  p.log.info(
    `  ${color.cyan("Include Docs")}: ${project.includeDocs ? "Yes" : "No"}`
  );
  p.log.info(
    `  ${color.cyan("Include Redis")}: ${project.includeRedis ? "Yes" : "No"}`
  );
  if (!project) {
    return null;
  }

  return project;
}

// ... previous code ...
