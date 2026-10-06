/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-2)',
        ink: 'var(--ink)',
        'text-secondary': 'var(--text-2)',
        'text-muted': 'var(--muted)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
        },
        secondary: 'var(--secondary)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint: '#E5F0E9',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          tint: '#F6ECD6',
        },
        error: {
          DEFAULT: 'var(--error)',
          tint: '#F4E1DE',
        },
        info: {
          DEFAULT: 'var(--info)',
          tint: '#E1ECF3',
        },
        dark: {
          DEFAULT: 'var(--dark)',
          text: 'var(--dark-text)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}
