import Button from '../common/Button.jsx';
import heroBg from '../../assets/images/hero-bg.png';

// ─────────────────────────────────────────────────────────────
// รูปที่ 1 — Hero
// พื้นภาพแผงโซล่าเรืองแสงส้มบนพื้นดำ · ข้อความหัวใหญ่ซ้าย · ปุ่ม 2 อัน
// overlay ไล่เข้มด้านซ้ายให้ตัวอักษรอ่านชัด
// ─────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[88vh] items-center bg-ink bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* overlay ไล่เข้มซ้าย→จาง */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-content px-5 lg:px-8">
        <div className="max-w-2xl">
          <h1
            className="text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
            data-aos="fade-right"
          >
            พลังงานอัจฉริยะ
            <br />
            บริหารเป็น
            <br />
            <span className="text-brand">TOTAL ENERGY</span>
          </h1>

          <div
            className="mt-10 flex flex-wrap gap-4"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <Button href="/products" variant="primary">
              ชมสินค้าเพิ่มเติม
            </Button>
            <Button href="https://line.me/R/ti/p/@288mrska" variant="ghost">
              รับคำปรึกษาฟรี
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
