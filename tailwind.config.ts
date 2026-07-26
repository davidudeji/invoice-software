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
                display: ['"Syne"', 'system-ui', 'sans-serif'],
                body: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
            },
            fontSize: {
                'xs':   ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '0.01em' }],
                'sm':   ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
                'base': ['1rem',     { lineHeight: '1.5rem',  letterSpacing: '0' }],
                'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
                'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
                '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
                '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
                '5xl':  ['3rem',     { lineHeight: '3.5rem' }],
                '6xl':  ['3.75rem',  { lineHeight: '1' }],
                '7xl':  ['4.5rem',   { lineHeight: '1' }],
            },
            colors: {
                /* Fintra brand tokens */
                fintra: {
                    blue:       '#1469F8',
                    'blue-dark': '#0B44C2',
                    'blue-light': '#3884FF',
                    'blue-muted': '#EBF2FF',
                    ink:        '#0A0A0A',
                    'ink-secondary': '#1F1F23',
                    muted:      '#6B7280',
                },

                /* Legacy brand namespace (kept for backward compatibility) */
                brand: {
                    primary:      '#0A0A0A',
                    accent:       '#1469F8',
                    surface:      '#F9FAFB',
                    surface_muted:'#F1F5F9',
                    text:         '#6B7280',
                    border:       '#E5E7EB',
                    bg:           '#F9FAFB',
                },

                /* Slate */
                slate: {
                    50:  '#F8FAFC',
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

                /* Emerald (kept for semantic success states) */
                emerald: {
                    50:  '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },
            },
            letterSpacing: {
                tightest: '-0.04em',
                tighter:  '-0.02em',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'blue-sm': '0 2px 8px 0 rgb(20 105 248 / 0.25)',
                'blue':    '0 4px 16px 0 rgb(20 105 248 / 0.30)',
                'blue-lg': '0 8px 32px 0 rgb(20 105 248 / 0.35)',
                'card':    '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
                'card-md': '0 4px 16px 0 rgb(0 0 0 / 0.08), 0 1px 3px -1px rgb(0 0 0 / 0.04)',
            },
        },
    },
    plugins: [],
};

export default config;
