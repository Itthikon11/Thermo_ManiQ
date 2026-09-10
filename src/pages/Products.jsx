import Button from '../components/Button.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าสินค้าของเรา (route /products) — แกลเลอรีสินค้า Growatt
// วางไฟล์รูปไว้ที่ public/products/ ตามชื่อในฟิลด์ img
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    title: 'Growatt MIN',
    tagline: 'On Grid Inverter · 3–5kW · 1 Phase',
    category: 'On Grid',
    img: '/products/growatt-min-ongrid.jpg',
  },
  {
    title: 'Growatt MOD',
    tagline: 'On Grid Inverter · 5–10kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mod-ongrid.jpg',
  },
  {
    title: 'Growatt MID 20kW',
    tagline: 'On Grid Inverter · 20kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mid-20kw.jpg',
  },
  {
    title: 'Growatt MID 40kW',
    tagline: 'On Grid Inverter · 40kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mid-40kw.jpg',
  },
  {
    title: 'Growatt MID 60kW',
    tagline: 'On Grid Inverter · 60kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mid-60kw.jpg',
  },
  {
    title: 'Growatt MID 80kW',
    tagline: 'On Grid Inverter · 80kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mid-80kw.jpg',
  },
  {
    title: 'Growatt MID 125kW',
    tagline: 'On Grid Inverter · 125kW · 3 Phase',
    category: 'On Grid',
    img: '/products/growatt-mid-125kw.jpg',
  },
  {
    title: 'Growatt SP',
    tagline: 'Hybrid Inverter · 6–10kW · 1 Phase',
    category: 'Hybrid',
    img: '/products/growatt-sp-hybrid.jpg',
  },
  {
    title: 'Growatt WIT',
    tagline: 'Hybrid Inverter · 10–15kW · 3 Phase',
    category: 'Hybrid',
    img: '/products/growatt-wit-hybrid.jpg',
  },
  {
    title: 'Growatt SPF',
    tagline: 'Off Grid Inverter · 3–6kW · ใช้แบตเตอรี่ได้ทุกยี่ห้อ',
    category: 'Off Grid',
    img: '/products/growatt-spf-offgrid.jpg',
  },
  {
    title: 'Growatt NEO',
    tagline: 'Micro Inverter · 2.5kW · 1 Phase',
    category: 'Micro',
    img: '/products/growatt-neo-micro.jpg',
  },
  {
    title: 'HOPE Battery',
    tagline: 'แบตเตอรี่ลิเธียม · 5.0L / 16.0L',
    category: 'Battery',
    img: '/products/hope-battery.jpg',
  },
  {
    title: 'Growatt Module',
    tagline: 'ShineMaster · WiFi · Smart Energy Manager',
    category: 'Module',
    img: '/products/growatt-module.jpg',
  },
];

// ถ้ารูปโหลดไม่ได้ → แสดง placeholder บอกชื่อไฟล์ที่ต้องวาง
function handleImgError(e, file) {
  const box = e.currentTarget.nextElementSibling;
  e.currentTarget.style.display = 'none';
  if (box) {
    box.style.display = 'flex';
    box.dataset.file = file;
  }
}

export default function Products() {
  return (
    <main>
      {/* banner หัวเรื่อง */}
      <section className="relative overflow-hidden bg-ink py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-brand/20" />
        <div className="relative mx-auto max-w-content px-5 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            สินค้าของเรา
          </h1>
          <p className="mt-3 text-white/70">
            อินเวอร์เตอร์ Growatt แบตเตอรี่ และอุปกรณ์เสริมครบวงจร
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-brand" />
        </div>
      </section>

      {/* แกลเลอรีสินค้า */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-content px-5 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* รูปโพสเตอร์ */}
                <div className="relative bg-gray-50">
                  <img
                    src={p.img}
                    alt={`โปรโมชัน ${p.title}`}
                    loading="lazy"
                    className="block w-full"
                    onError={(e) => handleImgError(e, p.img)}
                  />
                  {/* placeholder เมื่อยังไม่มีไฟล์รูป */}
                  <div
                    className="hidden aspect-video w-full flex-col items-center justify-center gap-2 bg-gray-100 p-6 text-center text-sm text-muted"
                    style={{ display: 'none' }}
                  >
                    <span className="text-3xl">🖼️</span>
                    <span className="font-semibold text-ink">{p.title}</span>
                    <span>วางไฟล์รูปที่</span>
                    <code className="rounded bg-white px-2 py-1 text-xs text-brand">
                      public{p.img}
                    </code>
                  </div>
                </div>

                {/* รายละเอียด */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-2 inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {p.category}
                  </span>
                  <h2 className="text-xl font-bold text-ink">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted">{p.tagline}</p>

                  <div className="mt-6 flex-1" />
                  <div className="pt-2">
                    <Button href="https://line.me/R/ti/p/@288mrska" variant="primary" className="w-full justify-center">
                      สอบถาม / รับคำปรึกษาฟรี
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ติดต่อ */}
          <div className="mt-14 text-center text-muted" data-aos="fade-up">
            <p>
              สอบถามเพิ่มเติม โทร{' '}
              <span className="font-semibold text-ink">044-210299</span>,{' '}
              <span className="font-semibold text-ink">094-5392459</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
