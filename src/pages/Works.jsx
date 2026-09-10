import { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button.jsx';

// ─────────────────────────────────────────────────────────────
// หน้าผลงานของเรา (route /works) — แกลเลอรีงานติดตั้งจริง
// รูปวางไว้ที่ public/works/ ตามชื่อไฟล์ในฟิลด์ img
// คลิกรูป → เปิดดูภาพใหญ่ (lightbox) · Esc / คลิกพื้นหลัง = ปิด
// ─────────────────────────────────────────────────────────────
const WORKS = [
  { title: 'บ้านดอนท้าว', img: '/works/work-05.jpg' },
  { title: 'เทศบาลตำบลหัวทะเล', img: '/works/work-06.png' },
  { title: 'บ้านท่ากระท่ม', img: '/works/work-07.png' },
  { title: 'บ้านบะใหญ่', img: '/works/work-08.png' },
  { title: 'บ้านบุกระโทก', img: '/works/work-09.png' },
  { title: 'บ้านคุณทิ', img: '/works/work-10.jpg' },
  { title: 'บ้านคุณพริษ', img: '/works/work-11.png' },
  { title: 'บ้านคุณเท็น', img: '/works/work-12.png' },
  { title: 'บ้านงิ้ว', img: '/works/work-13.jpg' },
  { title: 'บ้าน ผอ.หมวย', img: '/works/work-14.png' },
  { title: 'บ้านพระ', img: '/works/work-15.png' },
  { title: 'บ้านพี่แม็ก', img: '/works/work-16.png' },
  { title: 'บ้านพี่โจ้', img: '/works/work-17.png' },
  { title: 'บ้านอาขวัญ', img: '/works/work-18.png' },
  { title: 'บ้านเหล่า', img: '/works/work-19.png' },
  { title: 'บ้านใหม่', img: '/works/work-20.png' },
  { title: 'บ้านไพ', img: '/works/work-21.jpg' },
  { title: 'บ้านปลายราง', img: '/works/work-22.png' },
  { title: 'บ้านมะรุม', img: '/works/work-23.png' },
  { title: 'โรงงานชนะชัยฯ', img: '/works/work-24.png' },
  { title: 'บ้านระเริง', img: '/works/work-25.png' },
  { title: 'บ้านลำนางแก้ว', img: '/works/work-26.png' },
  { title: 'บ้านลุงเขว้า', img: '/works/work-27.png' },
  { title: 'บ้านสุขัง', img: '/works/work-28.png' },
  { title: 'บ้านหนองน้ำใส', img: '/works/work-29.jpg' },
  { title: 'บ้านหนองพลอง', img: '/works/work-30.jpg' },
  { title: 'บ้านหนองหัวแรด', img: '/works/work-31.png' },
  { title: 'บ้านหลุมข้าว', img: '/works/work-32.jpg' },
  { title: 'บ้านหัวทำนบ', img: '/works/work-33.jpg' },
  { title: 'บ้านเขาฉกรรจ์', img: '/works/work-34.png' },
  { title: 'บ้านเมืองเก่า', img: '/works/work-35.png' },
  { title: 'บ้านเอื้อมน่าน', img: '/works/work-36.png' },
  { title: 'บ้านโค้งยาง', img: '/works/work-37.png' },
  { title: 'บ้านโตนด', img: '/works/work-38.png' },
  { title: 'บ้านโนนสำราญ', img: '/works/work-39.png' },
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

export default function Works() {
  const [active, setActive] = useState(null); // index ของรูปที่เปิดดูใหญ่ · null = ปิด

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + WORKS.length) % WORKS.length)),
    [],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % WORKS.length)),
    [],
  );

  // คีย์ลัดตอนเปิด lightbox: Esc ปิด · ←/→ เลื่อนรูป · ล็อกสกอลล์พื้นหลัง
  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, prev, next]);

  return (
    <main>
      {/* banner หัวเรื่อง */}
      <section className="relative overflow-hidden bg-ink py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-brand/20" />
        <div className="relative mx-auto max-w-content px-5 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            ผลงานของเรา
          </h1>
          <p className="mt-3 text-white/70">
            งานติดตั้งระบบโซล่าเซลล์จริง กว่า {WORKS.length} หลังคาเรือน บ้าน · เทศบาล · โรงงาน
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-brand" />
        </div>
      </section>

      {/* แกลเลอรีผลงาน */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-content px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((w, i) => (
              <button
                key={w.img}
                type="button"
                onClick={() => setActive(i)}
                className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
              >
                {/* รูปงานติดตั้ง (สัดส่วน 4:3 ครอบเต็มกรอบ) */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={w.img}
                    alt={`ผลงานติดตั้ง ${w.title}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => handleImgError(e, w.img)}
                  />
                  {/* placeholder เมื่อยังไม่มีไฟล์รูป */}
                  <div
                    className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-gray-100 p-6 text-center text-sm text-muted"
                    style={{ display: 'none' }}
                  >
                    <span className="text-3xl">🖼️</span>
                    <span className="font-semibold text-ink">{w.title}</span>
                    <code className="rounded bg-white px-2 py-1 text-xs text-brand">
                      public{w.img}
                    </code>
                  </div>

                  {/* แถบชื่อไล่เฉดล่าง */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-sm font-semibold text-white drop-shadow">
                      {w.title}
                    </span>
                  </div>
                  {/* ไอคอนแว่นขยายตอน hover */}
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand opacity-0 shadow transition-opacity group-hover:opacity-100">
                    ⤢
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* CTA ปิดท้าย */}
          <div className="mt-14 text-center" data-aos="fade-up">
            <p className="text-muted">
              อยากให้บ้านคุณเป็นผลงานชิ้นต่อไปของเรา?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-4">
              <Button href="https://line.me/R/ti/p/@288mrska" variant="primary">
                รับคำปรึกษาฟรี
              </Button>
              <Button href="/products" variant="outline">
                ชมสินค้าของเรา
              </Button>
            </div>
            <p className="mt-6 text-muted">
              โทร{' '}
              <span className="font-semibold text-ink">044-210299</span>,{' '}
              <span className="font-semibold text-ink">094-5392459</span>
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox — ดูรูปใหญ่ */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
        >
          {/* ปุ่มปิด */}
          <button
            type="button"
            aria-label="ปิด"
            onClick={close}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>

          {/* ก่อนหน้า */}
          <button
            type="button"
            aria-label="รูปก่อนหน้า"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            ‹
          </button>

          {/* รูป + ชื่อ (คลิกในกรอบไม่ปิด) */}
          <figure
            className="max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={WORKS[active].img}
              alt={WORKS[active].title}
              className="mx-auto max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-white">
              <span className="font-semibold">{WORKS[active].title}</span>
              <span className="ml-2 text-white/50">
                {active + 1} / {WORKS.length}
              </span>
            </figcaption>
          </figure>

          {/* ถัดไป */}
          <button
            type="button"
            aria-label="รูปถัดไป"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
