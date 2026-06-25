/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cinnabar: '#8B1A1A',
        cinnabarLight: '#A52222',
        ink: '#1A1A1A',
        rice: '#F5F0E8',
        riceDark: '#E8DFD0',
        bamboo: '#2D5A27',
        gold: '#C5A55A',
        goldLight: '#D4BC7C',
        jade: '#5C8A7A',
        cloud: '#B8A88A',
      },
      fontFamily: {
        brush: ['"Ma Shan Zheng"', 'cursive'],
        song: ['"Noto Serif SC"', 'serif'],
        kai: ['"ZCOOL XiaoWei"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'petal-fall': 'petalFall linear infinite',
        'ink-spread': 'inkSpread 0.6s ease-out forwards',
        'stamp-press': 'stampPress 0.3s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'scroll-unroll': 'scrollUnroll 0.8s ease-out forwards',
        'typing-cursor': 'typingCursor 0.8s step-end infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown: { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        breathe: { '0%,100%': { transform: 'scale(1)', opacity: '1' }, '50%': { transform: 'scale(1.02)', opacity: '0.95' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        petalFall: {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(110vh) translateX(100px) rotate(360deg)', opacity: '0' }
        },
        inkSpread: { '0%': { clipPath: 'circle(0% at 50% 50%)' }, '100%': { clipPath: 'circle(150% at 50% 50%)' } },
        stampPress: { '0%': { transform: 'scale(1.3)', opacity: '0' }, '50%': { transform: 'scale(0.95)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        scrollUnroll: { '0%': { transform: 'scaleY(0)', opacity: '0' }, '100%': { transform: 'scaleY(1)', opacity: '1' } },
        typingCursor: { '0%,100%': { borderColor: 'transparent' }, '50%': { borderColor: '#1A1A1A' } },
      },
    },
  },
  plugins: [],
};
