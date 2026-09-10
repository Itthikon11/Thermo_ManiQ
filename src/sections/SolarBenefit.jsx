import Button from '../components/Button.jsx';
import solarImg from '../assets/images/solar-3d.png';

// ─────────────────────────────────────────────────────────────
// รูปที่ 3 — ประโยชน์ของโซล่าเซลล์
// รูปแผงโซล่า 3D ทางซ้าย · หัวข้อ + bullet 4 ข้อ ทางขวา
// ─────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    lead: 'ช่วยลดค่าใช้จ่ายด้านพลังงาน:',
    text: 'การผลิตไฟฟ้าใช้เองช่วยตัดภาระค่าไฟฟ้ารายเดือนอย่างเห็นผล คืนทุนไว และสร้างความประหยัดต่อเนื่องในระยะยาว 20–25 ปี',
  },
  {
    lead: 'ช่วยลดการปล่อยคาร์บอนและมลพิษ:',
    text: 'เป็นพลังงานสะอาด 100% ไม่สร้างมลพิษทางอากาศ และช่วยลดการปล่อยก๊าซเรือนกระจก ร่วมขับเคลื่อนสู่เป้าหมายความยั่งยืน',
  },
  {
    lead: 'เพิ่มมูลค่าและความทันสมัยให้กับอสังหาริมทรัพย์:',
    text: 'การติดตั้งระบบพลังงานแสงอาทิตย์มาตรฐานวิศวกรรม ช่วยยกระดับบ้าน อาคาร หรือโรงงานให้เป็น SMART GREEN PROPERTY ที่มีมูลค่าประเมินสูงขึ้น',
  },
  {
    lead: 'สร้างความมั่นคงทางพลังงานให้กับสถานที่:',
    text: 'เมื่อทำงานร่วมกับระบบ BATTERY ENERGY STORAGE (BESS) จะช่วยให้คุณมีกระแสไฟฟ้าสำรองใช้งานได้อย่างต่อเนื่อง แม้ในภาวะไฟตกหรือไฟดับฉุกเฉิน',
  },
];

export default function SolarBenefit() {
  return (
    <section id="install" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* รูปแผงโซล่าซ้าย */}
        <div className="order-2 flex justify-center lg:order-1" data-aos="fade-right">
          <img
            src={solarImg}
            alt="แผงโซล่าเซลล์และแบตเตอรี่กักเก็บพลังงาน"
            className="w-full max-w-lg"
          />
        </div>

        {/* หัวข้อ + bullet ขวา */}
        <div className="order-1 lg:order-2" data-aos="fade-left">
          <h2 className="text-right text-4xl font-extrabold leading-tight text-brand sm:text-5xl">
            ประโยชน์ของโซล่าเซลล์
          </h2>

          <ul className="mt-8 space-y-6">
            {BENEFITS.map((b) => (
              <li key={b.lead} className="flex gap-3 leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <p>
                  <span className="font-semibold">{b.lead}</span> {b.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href="#contact" variant="outline">
              รับคำปรึกษาฟรี
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
