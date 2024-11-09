/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forumBackground: '#1a1a1a', // Dark background for forum
        forumText: '#e0e0e0', // Light text for forum
        forumAccent: '#3b82f6', // Accent color for buttons and links
        forumTag: '#4b5563', // Tag background color
        forumTagText: '#ffffff', // Tag text color
        forumButton: '#3b82f6', // Button background color
        forumButtonHover: '#2563eb', // Button hover color
        forumError: '#f87171', // Error color
      },
    },
  },
  plugins: [],
}
