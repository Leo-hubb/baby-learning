/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FFB6C1',
          blue: '#87CEEB',
          yellow: '#FFFACD',
          green: '#98FB98',
          purple: '#DDA0DD',
          pinkDark: '#FF69B4',
          blueDark: '#4A90D9',
          yellowDark: '#FFD700',
          greenDark: '#3CB371',
          purpleDark: '#9370DB',
        },
      },
      fontFamily: {
        rounded: ['"Baloo 2"', '"Quicksand"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      borderRadius: {
        'candy': '16px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'star-burst': 'starBurst 0.8s ease-out forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(2) rotate(180deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
