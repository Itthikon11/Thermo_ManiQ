import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './sections/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import SmartHome from './sections/SmartHome.jsx';
import SolarBenefit from './sections/SolarBenefit.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าแลนดิ้ง THERMO MANIQ — เลื่อนลงตามลำดับรูป 1-2-3
//   1) Hero          — พลังงานอัจฉริยะ บริหารเป็น TOTAL ENERGY
//   2) SmartHome     — เปลี่ยนบ้านให้ฉลาด (ผลิต/เก็บ/ชาร์จ)
//   3) SolarBenefit  — ประโยชน์ของโซล่าเซลล์
// AOS = animate on scroll (เหมือน Goverlution)
// ─────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SmartHome />
        <SolarBenefit />
      </main>
    </div>
  );
}
