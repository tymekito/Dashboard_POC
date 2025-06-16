import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
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
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],

  // Twoje custom reguły
  {
    rules: {
      "linebreak-style": 0,
      "object-curly-spacing": [2, "always"],
      "require-jsdoc": 0,
      "max-len": "off",
      eqeqeq: 2,
      camelcase: "error",
      "no-undef-init": "error",
      "block-scoped-var": "error",
      "no-extra-semi": "error",
      "no-empty": "error",
      "no-func-assign": "error",
      "no-unreachable": "error",
      "no-console": "warn",
      "vue/no-v-for-template-key": "off",
      "vue/no-v-model-argument": "off",
      "vue/no-multiple-template-root": 0,
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "export",
        },
      ],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },

  skipFormatting,
]);
