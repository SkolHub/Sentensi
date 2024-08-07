/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			screens: {
				'height-1': {
					raw: '(max-height: 800px)'
				},
				'height-2': {
					raw: '(max-height: 675px)'
				},
				'height-3': {
					raw: '(max-height: 530px)'
				}
			}
		}
	},
	plugins: []
};
