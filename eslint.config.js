// @ts-ignore
import globals from "globals";
// @ts-ignore
import pluginJs from "@eslint/js";
// @ts-ignore
import tseslint from "typescript-eslint";
// @ts-ignore
import react from "eslint-plugin-react";


export default [

  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/templates/**"],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: react
    },
    settings: {
      react: {
        version: "detect",

      }
    }
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,


];