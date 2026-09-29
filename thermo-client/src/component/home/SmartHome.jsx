import Button from '../common/Button.jsx';
import houseImg from '../../assets/images/house-3d.png';

// ─────────────────────────────────────────────────────────────
// รูปที่ 2 — เปลี่ยนบ้านให้ฉลาด
// ข้อความ + รายการ ผลิต/เก็บ/ชาร์จ ทางซ้าย · รูปบ้าน 3D ทางขวา
// ─────────────────────────────────────────────────────────────
const POINTS = [
  { tag: 'ผลิตเป็น', text: 'ผลิตไฟสะอาดใช้เอง ลดค่าไฟรายเดือน' },
  { tag: 'เก็บเป็น', text: 'กักเก็บไฟไว้ใช้กลางคืน ไฟดับบ้านก็ยังสว่าง' },
  { tag: 'ชาร์จเป็น', text: 'จัดสรรพลังงานชาร์จรถ EV และเครื่องใช้ไฟฟ้าอัตโนมัติ' },
];

export default function SmartHome() {
  return (
    <section id="smart-home" className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10">
        {/* ข้อความซ้าย — เว้นระยะซ้ายให้ตรงกับ container 1200px */}
        <div
          className="px-5 lg:pl-[max(2rem,calc((100vw-1200px)/2+2rem))] lg:pr-0"
          data-aos="fade-right"
        >
          <h2 className="text-4xl font-extrabold leading-tight text-brand sm:text-5xl">
            เปลี่ยนบ้านให้ฉลาด
          </h2>
          <p className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
            ด้วยระบบพลังงานอัจฉริยะครบวงจร
          </p>

          <p className="mt-6 leading-relaxed text-muted">
            เราเริ่มต้นจากการวิเคราะห์พฤติกรรมการใช้ไฟจริง
            <br />
            เพื่อออกแบบและติดตั้งระบบ SOLAR CELL
            <br />
            พร้อมแบตเตอรี่กักเก็บพลังงานอย่างแม่นยำ
            <br />
            ควบคุมและดูแลทุกขั้นตอนโดยทีมวิศวกรผู้เชี่ยว
            <br />
            ให้บ้านคุณมีพลังงานใช้อย่างปลอดภัย มั่นคง และคุ้มค่าระยะยาว
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p.tag} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="w-20 shrink-0 font-bold text-brand">{p.tag}</span>
                <span className="text-ink">
                  <span className="mr-2 text-brand">•</span>
                  {p.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/products" variant="primary">
              ชมสินค้าเพิ่มเติม
            </Button>
            <Button href="https://line.me/R/ti/p/@288mrska" variant="outline">
              รับคำปรึกษาฟรี
            </Button>
          </div>
        </div>

        {/* รูปบ้านขวา — ชิดขอบจอด้านขวา */}
        <div className="px-5 lg:px-0" data-aos="fade-left">
          <img
            src={houseImg}
            alt="บ้านติดตั้งระบบโซล่าเซลล์และแบตเตอรี่"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
