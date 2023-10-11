/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
			display: ['Urbana'],
			body: ['Realist']
		},
		extend: {
			screens: {
				xs: '448px'
			}
		}
  },
  plugins: [],
}

