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
                body:    ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono:    ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
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
                /* ── Velora dark-theme palette ── */
                velora: {
                    /* Backgrounds */
                    'bg':          '#08090e',   /* page background  */
                    'bg-sidebar':  '#111218',   /* sidebar          */
                    'bg-card':     '#16171e',   /* card background  */
                    'bg-elevated': '#1a1b24',   /* elevated card    */
                    'bg-input':    '#13141b',   /* input fields     */

                    /* Borders */
                    'border':       'rgba(255,255,255,0.07)',
                    'border-hover': 'rgba(255,255,255,0.12)',

                    /* Electric blue accent */
                    'blue':        '#3b82f6',
                    'blue-hover':  '#2563eb',
                    'blue-muted':  'rgba(59,130,246,0.12)',
                    'blue-glow':   'rgba(59,130,246,0.25)',

                    /* Text */
                    'text':          '#f8fafc',
                    'text-secondary':'#94a3b8',
                    'text-muted':    '#475569',

                    /* Semantic */
                    'success':  '#10b981',
                    'warning':  '#f59e0b',
                    'danger':   '#ef4444',
                },

                /* Legacy brand namespace — kept for backward compatibility */
                brand: {
                    primary:       '#08090e',
                    accent:        '#3b82f6',
                    surface:       '#16171e',
                    surface_muted: '#111218',
                    text:          '#94a3b8',
                    border:        'rgba(255,255,255,0.07)',
                    bg:            '#08090e',
                },

                /* Fintra namespace alias → velora values (keeps old class names working) */
                fintra: {
                    blue:           '#3b82f6',
                    'blue-dark':    '#2563eb',
                    'blue-light':   '#60a5fa',
                    'blue-muted':   'rgba(59,130,246,0.12)',
                    ink:            '#08090e',
                    'ink-secondary':'#111218',
                    muted:          '#94a3b8',
                },

                /* Slate — kept for utility classes */
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

                emerald: {
                    50:  '#F0FDF4',
                    100: '#DCFCE7',
                    400: '#4ADE80',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
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
                /* Blue glow shadows */
                'blue-sm': '0 2px 8px 0 rgba(59,130,246,0.25)',
                'blue':    '0 4px 16px 0 rgba(59,130,246,0.30)',
                'blue-lg': '0 8px 32px 0 rgba(59,130,246,0.35)',

                /* Dark card shadows */
                'card':    '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.3)',
                'card-md': '0 4px 16px 0 rgba(0,0,0,0.5), 0 1px 3px -1px rgba(0,0,0,0.3)',
                'card-lg': '0 8px 32px 0 rgba(0,0,0,0.6)',

                /* Glow effect */
                'glow-blue': '0 0 24px rgba(59,130,246,0.2)',
            },
            backgroundImage: {
                /* Subtle dot-grid hero pattern (Velora-style) */
                'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            },
            backgroundSize: {
                'dot-grid': '28px 28px',
            },
            animation: {
                'fade-up':   'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                'glow-pulse':'glowPulse 3s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                glowPulse: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%':      { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
