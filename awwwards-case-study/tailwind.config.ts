import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mega: ["var(--font-mega)", "system-ui", "sans-serif"],
                heading: ["var(--font-heading)", "system-ui", "sans-serif"],
                text: ["var(--font-text)", "system-ui", "sans-serif"],
            },
            fontSize: {
                "mega-h1": ["var(--fs-mega-h1)", { lineHeight: "var(--lh-mega)", letterSpacing: "var(--ls-mega)", fontWeight: "400" }],
                "mega-h2": ["var(--fs-mega-h2)", { lineHeight: "var(--lh-mega)", letterSpacing: "var(--ls-mega)", fontWeight: "400" }],
                h1: ["var(--fs-h1)", { lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.06em" }],
                h2: ["var(--fs-h2)", { lineHeight: "1.15", fontWeight: "500", letterSpacing: "-0.05em" }],
                h3: ["var(--fs-h3)", { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.04em" }],
                h4: ["var(--fs-h4)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
                "text-lg": ["var(--fs-text-lg)", { lineHeight: "var(--lh-text)", fontWeight: "400" }],
                "text-md": ["var(--fs-text-md)", { lineHeight: "var(--lh-text)", fontWeight: "400" }],
                "text-sm": ["var(--fs-text-sm)", { lineHeight: "var(--lh-text)", fontWeight: "400" }],
            },
            colors: {
                brand: "rgb(var(--color-brand) / <alpha-value>)",
                text: "rgb(var(--color-text) / <alpha-value>)",
                white: "rgb(var(--color-white) / <alpha-value>)",
            },
            spacing: {
                4: "var(--space-4)",
                8: "var(--space-8)",
                12: "var(--space-12)",
                16: "var(--space-16)",
                20: "var(--space-20)",
                24: "var(--space-24)",
                32: "var(--space-32)",
                48: "var(--space-48)",
                64: "var(--space-64)",
                128: "var(--space-128)",
            },
        },
    },
    plugins: [],
};
export default config;
