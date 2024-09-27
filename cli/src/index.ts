#!/usr/bin/env node
import { generateProject } from "@/commands/generate-project.js";
import * as p from "@clack/prompts";
import { program } from "commander";
import color from "picocolors";

async function main() {
  console.clear();

  p.intro(
    `${color.bgCyan(color.black(" create-nextjs-project "))} ${color.cyan(
      "v0.1.1"
    )}`
  );

  const project = await generateProject();

  if (project) {
    p.outro(`Your new Next.js project ${color.green(project.name)} is ready!`);
    p.log.info("To get started, run:");
    p.log.info(`  cd ${project.name}`);
    p.log.info("  pnpm install");
    p.log.info("  pnpm dev");
  } else {
    p.outro("Project generation cancelled.");
  }
}

program
  .name("create-nextjs-project")
  .description("CLI to generate a Next.js project")
  .version("0.1.0")
  .action(main);

program.parse(process.argv);
