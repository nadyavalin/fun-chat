// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    linterOptions: {
      noInlineConfig: true,
    },
    languageOptions: {
      globals: globals.builtin,
    },
    rules: {
      "no-unused-expressions": "error",
      "unicorn/better-regex": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/empty-brace-spaces": "off",
      "unicorn/expiring-todo-comments": "off",
      "unicorn/filename-case": "off",
      "unicorn/import-style": "off",
      "unicorn/no-abusive-eslint-disable": "off",
      "unicorn/no-anonymous-default-export": "off",
      "unicorn/no-empty-file": "warn",
    },
  }
);
