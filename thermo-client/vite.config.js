import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // strictPort:false → ถ้า 5180 ไม่ว่าง (เช่นมี dev server ค้างอยู่) vite จะขยับไปพอร์ตว่างถัดไปเอง
  server: { port: 5180, strictPort: false },
});
