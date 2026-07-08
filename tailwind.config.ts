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
                display: ['var(--font-display)', 'Georgia', 'serif'],
                body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
                'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '500' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '600' }],
                '5xl': ['3rem', { lineHeight: '3.5rem', fontWeight: '600' }],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    primary: "#1F2937",        /* Slate Navy */
                    accent: "#10B981",         /* Emerald */
                    surface: "#FAFAF8",        /* Warm Paper */
                    surface_muted: "#F3F4F6",  /* Soft Slate */
                    text: "#374151",
                    border: "#E5E7EB"
                },
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
                emerald: {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#10B981', /* brand accent */
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                }
            },
        },
    },
    plugins: [],
};
export default config;
