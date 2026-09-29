import Hero from '../component/home/Hero.jsx';
import SmartHome from '../component/home/SmartHome.jsx';
import FeatureVideo from '../component/home/FeatureVideo.jsx';

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
