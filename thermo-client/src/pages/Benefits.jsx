import SolarBenefit from '../component/benefits/SolarBenefit.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าประโยชน์ของโซล่าเซลล์ (route /benefits) — แยกออกจากหน้าแรก
// ─────────────────────────────────────────────────────────────
export default function Benefits() {
  return (
    <main>
      <SolarBenefit />
    </main>
  );
}
