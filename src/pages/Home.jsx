import Hero from '../sections/Hero.jsx';
import SmartHome from '../sections/SmartHome.jsx';
import SolarBenefit from '../sections/SolarBenefit.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าแรก — Hero → เปลี่ยนบ้านให้ฉลาด → ประโยชน์ของโซล่าเซลล์
// ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Hero />
      <SmartHome />
      <SolarBenefit />
    </main>
  );
}
