import Hero from '../sections/Hero.jsx';
import SmartHome from '../sections/SmartHome.jsx';
import FeatureVideo from '../sections/FeatureVideo.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าแรก — Hero → เปลี่ยนบ้านให้ฉลาด
//   (ประโยชน์ของโซล่าเซลล์ แยกไปหน้า /benefits แล้ว)
// ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Hero />
      <SmartHome />
      <FeatureVideo />
    </main>
  );
}
