/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        coffeeshop: {
          'primary': '#8B5CF6',
          'primary-content': '#ffffff',
          'secondary': '#F59E0B',
          'accent': '#059669',
          'neutral': '#2a323c',
          'base-100': '#f9fafb',
          'info': '#0ea5e9',
            'success': '#10b981',
          'warning': '#fbbf24',
          'error': '#ef4444'
        }
      },
      'light',
      'dark'
    ],
    darkTheme: 'dark'
  }
};