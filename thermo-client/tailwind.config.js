/** @type {import('tailwindcss').Config} */
// Tailwind คือชั้น styling เดียวของโปรเจกต์ (เหมือน Goverlution rule 6)
// design token สีมาจากแบรนด์ THERMO MANIQ — ส้มพลังงาน + ดำเทคโน
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#F5821F',      // ส้มหลัก — ปุ่ม/หัวข้อเน้น/โลโก้
        'brand-dark': '#E5731A',
        ink: '#1A1A1A',        // ดำข้อความ/พื้นฮีโร่
        muted: '#5B5B5B',      // เทาเนื้อความ
      },
      fontFamily: {
        sans: ['Prompt', 'Noto Sans Thai', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
