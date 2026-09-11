import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './sections/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import Works from './pages/Works.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';

// ─────────────────────────────────────────────────────────────
// THERMO MANIQ — เว็บหลายหน้า
//   /        หน้าแรก (Hero + SmartHome + SolarBenefit)
//   /about   เกี่ยวกับเรา (หน้าแยก)
// Navbar ใช้ร่วมทุกหน้า · AOS = animate on scroll
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { pathname } = useLocation();

  // โซนแอดมิน (/admin, /admin/login) มีเลย์เอาต์ของตัวเอง → ไม่โชว์ Navbar เว็บหลัก
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    // once:false → เล่นซ้ำทุกครั้งที่เข้า viewport · mirror:true → สไลด์ออกตอนเลื่อนผ่าน
    AOS.init({
      duration: 700,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // เปลี่ยนหน้าแล้วเลื่อนขึ้นบนสุด + ให้ AOS สแกนอิลิเมนต์ใหม่
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.refreshHard();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/works" element={<Works />} />

        {/* โซนผู้ดูแลระบบ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
