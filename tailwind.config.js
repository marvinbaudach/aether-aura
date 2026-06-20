/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-soft': 'var(--bg-soft)',
        'bg-lift': 'var(--bg-lift)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        accent: 'var(--accent)',
        'accent-deep': 'var(--accent-deep)',
        hairline: 'var(--hairline)',
        'hairline-soft': 'var(--hairline-soft)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1320px',
      },
    },
  },
  plugins: [],
}
