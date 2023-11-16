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
  safelist: [
		{
			pattern: /bg-(red|orange|yellow|green|blue|purple)-./,
			variants: ['hover', 'focus']
		},
		{
			pattern: /text-(red|orange|yellow|green|blue|purple)-./,
			variants: ['hover', 'focus']
		},
		{
			pattern: /border-b-(red|orange|yellow|green|blue|purple)-./,
			variants: ['hover', 'focus']
		},
		{
			pattern: /border-(red|orange|yellow|green|blue|purple)-./,
			variants: ['hover', 'focus']
		},
		{
			pattern: /text-(white|slate|black)./,
			variants: ['hover', 'focus']
		}
  ],
  plugins: [],
}

