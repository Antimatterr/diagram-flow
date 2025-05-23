import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    languageOptions: { globals: globals.browser },
    rules: {
      // 👇 Warn on console.log, allow warn/error
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
  // Override React plugin configs
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        React: "readonly" // Make React available globally
      }
    },
    settings: {
      react: {
        version: "detect" // Automatically detect React version
      }
    },
    rules: {
      // Turn off the rule requiring React import
      "react/react-in-jsx-scope": "off",
    },
  }
]);