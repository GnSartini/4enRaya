/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-yellow-500',
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-200',
    'bg-red-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-yellow-300',
    'bg-red-300',
    'bg-green-300',
    'bg-blue-300',
    'hover:bg-yellow-300',
    'hover:bg-red-300',
    'hover:bg-green-300',
    'hover:bg-blue-300',
  ],
};