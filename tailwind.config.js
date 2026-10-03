/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Native CSS variables mapped colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          container: 'var(--color-primary-container)',
          text: 'var(--color-on-primary)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          light: 'var(--color-secondary-light)',
          text: 'var(--color-on-secondary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          dim: 'var(--color-surface-dim)',
          card: 'var(--color-surface-card)',
          border: 'var(--color-surface-border)',
        },
        tenantBg: 'var(--color-bg-main)',
        tenantText: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
        }
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', 'Inter', 'sans-serif'],
        heading: ['var(--font-family-heading)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        tenant: 'var(--radius-tenant)',
        'tenant-lg': 'var(--radius-tenant-lg)',
        'tenant-sm': 'var(--radius-tenant-sm)',
      },
      boxShadow: {
        tenant: 'var(--shadow-tenant)',
        'tenant-glow': 'var(--shadow-glow)',
      }
    },
  },
  plugins: [],
}
