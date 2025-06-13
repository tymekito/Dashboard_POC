import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  { ignores: ["dist"] },
  {
    name: "app/src",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),
  {
    extends: [js.configs.recommended, eslintConfigPrettier],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  skipFormatting,
]);
