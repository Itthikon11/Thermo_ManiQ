import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './sections/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';

// ─────────────────────────────────────────────────────────────
// THERMO MANIQ — เว็บหลายหน้า
//   /        หน้าแรก (Hero + SmartHome + SolarBenefit)
//   /about   เกี่ยวกับเรา (หน้าแยก)
// Navbar ใช้ร่วมทุกหน้า · AOS = animate on scroll
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }, []);

  // เปลี่ยนหน้าแล้วเลื่อนขึ้นบนสุด + ให้ AOS สแกนอิลิเมนต์ใหม่
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.refreshHard();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
