﻿import globals from "globals";
import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            ...eslint.configs.recommended.rules,
            ...tslint.configs.recommended.rules,
            ...prettier.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "indent": ["error", 4], // Thiết lập thụt đầu dòng bằng 4
            "prettier/prettier": ["error", { tabWidth: 4, useTabs: false }], // Thêm cấu hình cho prettier
        },
        languageOptions: {
            parser: tslint.parser,
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2022,
                ecmaFeatures: {
                    jsx: true,
                },
                // Thêm tabWidth vào parserOptions nếu cần
                tabWidth: 4,
            },
            globals: [
                ...globals.builtin,
                ...globals.browser,
                ...globals.es2022,
            ],
        },
        plugins: {
            prettier,
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@typescript-eslint": tslint.plugin,
        },
    },
    {
        ignores: ["node_modules/**", "dist/**"],
    },
];

export default eslintConfig;
