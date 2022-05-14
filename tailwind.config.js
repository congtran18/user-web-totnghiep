module.exports = {
  mode: 'jit',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        shop_ave: {
					tan: '#d4af87',
					black: '#101016',
					DEFAULT: '#333333',
				},
        themePink :'#F9DBE0'
      },
      fontFamily: {
				sans: ['Red Hat Display', 'sans-serif'],
				heading: ['Lora', 'serif'],
			},
      backgroundImage: {
        'registerImg': "url('https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
      },
      flex: {
        '3': '3 3 0%',
        '2' : '2 2 0%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
