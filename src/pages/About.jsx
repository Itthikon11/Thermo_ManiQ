import Button from '../components/Button.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าเกี่ยวกับเรา (route /about) — แยกออกมาเป็นหน้าเดี่ยว
// banner หัวเรื่องพื้นเข้ม · ย่อหน้าแนะนำ · การ์ดระบบ · แท็ก "…เป็น" · CTA
// ─────────────────────────────────────────────────────────────
const SYSTEMS = ['Solar', 'Battery', 'Backup', 'EV Charging', 'Energy Management'];

const SKILLS = [
  'ผลิตเป็น',
  'เก็บเป็น',
  'ใช้เป็น',
  'สำรองเป็น',
  'ชาร์จเป็น',
  'บริหารเป็น',
];

const GOALS = [
  {
    no: '01',
    title: 'สร้างระบบพลังงานที่ทำงานประสานกันอย่างไร้รอยต่อ (Total Energy Ecosystem)',
    text: 'พัฒนาและติดตั้งโซลูชัน Solar, Battery Storage, Backup และ EV Charging ที่ทำงานร่วมกันอย่างสมบูรณ์แบบ ตอบโจทย์ทั้งที่อยู่อาศัย ธุรกิจ และโครงการขนาดใหญ่',
  },
  {
    no: '02',
    title: 'สร้างความคุ้มค่าและความมั่นคงระยะยาวให้ลูกค้า',
    text: 'ส่งมอบระบบที่ช่วยลดค่าใช้จ่ายด้านพลังงานจริง คืนทุนไว พร้อมเป็นแหล่งพลังงานสำรองที่พึ่งพาได้ในทุกสถานการณ์',
  },
  {
    no: '03',
    title: 'ยกระดับสู่มาตรฐานงานวิศวกรรมสากล',
    text: 'เป็นแบรนด์และโชว์รูมที่ลูกค้าไว้วางใจสูงสุด ด้วยทีมวิศวกรผู้เชี่ยวชาญที่ดูแลตั้งแต่การวิเคราะห์ ออกแบบ ไปจนถึงบริการหลังการขาย',
  },
];

const OBJECTIVES = [
  {
    icon: '✏️',
    head: 'ด้านการออกแบบและบริการ',
    items: [
      'วิเคราะห์พฤติกรรมการใช้ไฟจริงของลูกค้า เพื่อออกแบบระบบพลังงานที่เหมาะสมกับรูปแบบการใช้งานเฉพาะตัว ไม่โอเวอร์ไซส์หรืออันเดอร์ไซส์',
      'ให้บริการครบวงจร (End-to-End Service) ตั้งแต่การให้คำปรึกษา การสำรวจหน้างาน การขออนุญาตหน่วยงานรัฐ งานติดตั้ง ไปจนถึงการบำรุงรักษา',
    ],
  },
  {
    icon: '⚙️',
    head: 'ด้านเทคโนโลยีและการจัดการ',
    items: [
      'ผลักดันแนวคิด “ผลิตเป็น • เก็บเป็น • ใช้เป็น • สำรองเป็น • ชาร์จเป็น • บริหารเป็น” มาประยุกต์ใช้ในทุกระบบ เพื่อให้การจัดการพลังงานเกิดประสิทธิภาพสูงสุด',
      'นำเสนออุปกรณ์และเทคโนโลยีอัจฉริยะที่ได้มาตรฐานระดับสากล ปลอดภัย และมีความทนทาน',
    ],
  },
  {
    icon: '🌱',
    head: 'ด้านความยั่งยืนและสิ่งแวดล้อม',
    items: [
      'สนับสนุนการเปลี่ยนผ่านสู่การใช้พลังงานสะอาด ลดการพึ่งพาพลังงานฟอสซิล และลดการปล่อยก๊าซเรือนกระจก',
      'เพิ่มมูลค่าให้กับทรัพย์สินของลูกค้า ให้กลายเป็นอาคารหรือที่อยู่อาศัยที่ประหยัดพลังงานและเป็นมิตรต่อสิ่งแวดล้อม',
    ],
  },
];

export default function About() {
  return (
    <main>
      {/* banner หัวเรื่อง */}
      <section className="relative overflow-hidden bg-ink py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-brand/20" />
        <div className="relative mx-auto max-w-content px-5 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            เกี่ยวกับ <span className="text-brand">THERMO MANIQ</span>
          </h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-brand" />
        </div>
      </section>

      {/* เนื้อหา */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-content px-5 lg:px-8">
          {/* ย่อหน้าแนะนำบริษัท */}
          <p
            className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted"
            data-aos="fade-up"
          >
            <span className="font-semibold text-ink">Thermo ManiQ</span> (เทอร์โม-มานิก)
            คือแบรนด์และโชว์รูมผลิตภัณฑ์ภายใต้การดำเนินงานของ{' '}
            <span className="whitespace-nowrap font-semibold text-ink">
              บริษัท ไท อคิเทค โปร จำกัด
            </span>{' '}
            พร้อมนำเสนอผลิตภัณฑ์คุณภาพและโซลูชันที่ตอบโจทย์ทั้งบ้านพักอาศัย ธุรกิจ และงานโครงการ
            โดยมีทีมงานวิศวกรผู้เชี่ยวชาญคอยให้คำแนะนำและดูแลอย่างครบวงจร
          </p>

          {/* เรื่องราวของเรา + คำโปรย + pullquote */}
          <div
            className="mx-auto mt-8 max-w-3xl"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            <p className="text-center text-lg leading-relaxed text-muted">
              <span className="font-bold text-brand">ThermoManiq</span>{' '}
              เราไม่ได้เพียงขายโซลาร์เซลล์ แต่เราออกแบบโซลูชันพลังงานที่เหมาะกับคุณ
            </p>

            <blockquote className="mx-auto mt-6 max-w-2xl rounded-r-xl border-l-4 border-brand bg-brand/5 px-6 py-4">
              <p className="text-xl font-semibold text-ink sm:text-2xl">
                “ลงทุนอย่างคุ้มค่า เพื่อการประหยัดในระยะยาว”
              </p>
            </blockquote>

            <p className="mt-6 leading-relaxed text-muted">
              เพราะทุกพื้นที่มีรูปแบบการใช้พลังงานแตกต่างกัน ทีมงานของเราพร้อมให้คำปรึกษา
              ใส่ใจตั้งแต่การวิเคราะห์ค่าไฟ สำรวจพื้นที่ และออกแบบระบบ
              ไปจนถึงการติดตั้งและดูแลหลังการขาย เพื่อให้คุณได้รับระบบโซลาร์เซลล์ที่เหมาะสม
              คุ้มค่า และตอบโจทย์การใช้งานในระยะยาวอย่างแท้จริง
            </p>
          </div>

          {/* การ์ดจุดเด่นระบบ */}
          <div
            className="mx-auto mt-10 max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:p-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <p className="leading-relaxed text-muted">
              <span className="font-bold text-brand">ThermoManiq</span>{' '}
              เราคือผู้เชี่ยวชาญด้านระบบพลังงานอัจฉริยะ เราเริ่มจากการเข้าใจพฤติกรรมการใช้พลังงาน
              แล้วออกแบบ{' '}
              <span className="font-semibold text-ink">Solar</span>,{' '}
              <span className="font-semibold text-ink">Battery</span>,{' '}
              <span className="font-semibold text-ink">Backup</span>,{' '}
              <span className="font-semibold text-ink">EV Charging</span>{' '}
              และระบบบริหารพลังงานให้ทำงานร่วมกันอย่างเหมาะสมและมีประสิทธิภาพ
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {SYSTEMS.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-4 py-1.5 text-sm font-medium text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* แท็ก "…เป็น" 6 อย่าง */}
          <div className="mt-14 text-center" data-aos="fade-up" data-aos-delay="150">
            <p className="text-lg font-medium text-ink">
              ThermoManiq ออกแบบให้พลังงาน
            </p>
            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-3">
              {SKILLS.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* วิสัยทัศน์ */}
          <div
            className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl bg-ink p-8 text-center shadow-sm lg:px-14 lg:py-12"
            data-aos="fade-up"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-brand/20" />
            <span className="pointer-events-none absolute left-6 top-2 select-none font-serif text-8xl leading-none text-brand/25">
              “
            </span>
            <div className="relative">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Vision
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">วิสัยทัศน์</h2>
              <p className="mx-auto mt-5 max-w-5xl text-base leading-relaxed text-white/85">
                “มุ่งสู่การเป็นผู้นำด้านโซลูชันระบบพลังงานอัจฉริยะครบวงจร ที่ผสานเทคโนโลยีการผลิต จัดเก็บ
                <br className="hidden lg:block" />
                และบริหารจัดการพลังงานสะอาด เพื่อยกระดับคุณภาพชีวิต ความมั่นคงทางพลังงาน และความยั่งยืนของทุกภาคส่วน”
              </p>
            </div>
          </div>

          {/* เป้าหมาย */}
          <div className="mt-20">
            <div className="text-center" data-aos="fade-up">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Goals
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">เป้าหมาย</h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand" />
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {GOALS.map((g, i) => (
                <div
                  key={g.no}
                  className="rounded-2xl border border-gray-100 border-t-4 border-t-brand bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-brand text-lg font-bold text-white">
                    {g.no}
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-ink">{g.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{g.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* วัตถุประสงค์ */}
          <div className="mt-20">
            <div className="text-center" data-aos="fade-up">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Objectives
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">วัตถุประสงค์</h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand" />
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
              {OBJECTIVES.map((o, i) => (
                <div
                  key={o.head}
                  className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-2xl">
                    {o.icon}
                  </div>
                  <h3 className="mt-4 border-b border-brand/20 pb-3 text-base font-bold text-brand">
                    {o.head}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {o.items.map((it, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center" data-aos="fade-up">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              ให้เราช่วยออกแบบโซลูชันพลังงานที่เหมาะกับคุณ
              ติดต่อเราเพื่อรับคำปรึกษาโดยทีมวิศวกรผู้เชี่ยวชาญ
              และประเมินระบบเบื้องต้น{' '}
              <span className="font-semibold text-brand">ฟรี ไม่มีค่าใช้จ่ายใด ๆ ทั้งสิ้น</span>
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="https://line.me/R/ti/p/@288mrska" variant="primary">
                รับคำปรึกษาฟรี
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
