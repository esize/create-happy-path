import path from "path";
import { writeRenderedTemplate } from "@/utils/templating.js";
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

  await generateProjectFiles(project);

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

async function generateProjectFiles(config: ProjectConfig) {
  const baseTemplates = [
    "package.json.njk",
    "tsconfig.json.njk",
    "next.config.js.njk",
    "README.md.njk",
    ".env.local.njk",
  ];

  for (const template of baseTemplates) {
    await writeRenderedTemplate(
      path.join("base", template),
      path.join(config.name, template.replace(".njk", "")),
      config
    );
  }

  // Generate app files
  await writeRenderedTemplate(
    path.join("app", "layout.tsx.njk"),
    path.join(config.name, "app", "layout.tsx"),
    config
  );
  await writeRenderedTemplate(
    path.join("app", "page.tsx.njk"),
    path.join(config.name, "app", "page.tsx"),
    config
  );

  // Generate other files based on user choices
  if (config.includeAdmin) {
    await writeRenderedTemplate(
      path.join("admin", "page.tsx.njk"),
      path.join(config.name, "app", "admin", "page.tsx"),
      config
    );
  }

  if (config.includeDocs) {
    await writeRenderedTemplate(
      path.join("docs", "page.tsx.njk"),
      path.join(config.name, "app", "docs", "page.tsx"),
      config
    );
  }

  if (config.includeRedis) {
    await writeRenderedTemplate(
      path.join("redis", "client.ts.njk"),
      path.join(config.name, "lib", "redis.ts"),
      config
    );
  }

  // Always include db and auth
  await writeRenderedTemplate(
    path.join("lib", "db.ts.njk"),
    path.join(config.name, "lib", "db.ts"),
    config
  );
  await writeRenderedTemplate(
    path.join("lib", "auth.ts.njk"),
    path.join(config.name, "lib", "auth.ts"),
    config
  );
}
