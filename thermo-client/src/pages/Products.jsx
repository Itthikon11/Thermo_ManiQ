import { useState } from 'react';
import Button from '../component/common/Button.jsx';
import Lightbox from '../component/common/Lightbox.jsx';
import MagnifierIcon from '../component/common/MagnifierIcon.jsx';
import SearchBar from '../component/common/SearchBar.jsx';
import { resolveImg } from '../helper/api.js';
import useProducts from '../hooks/products/index.js';

// ─────────────────────────────────────────────────────────────
// หน้าสินค้าของเรา (route /products) — แกลเลอรีสินค้า Growatt
// ดึงข้อมูลจาก backend (ตาราง products) · แอดมินเพิ่ม/ลบได้ที่ /admin
// ─────────────────────────────────────────────────────────────

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
  const { products, loading, error } = useProducts();
  const [preview, setPreview] = useState(null); // รูปที่กำลังดูใหญ่ { src, title }
  const [query, setQuery] = useState(''); // คำค้นหา

  // กรองตามคำค้นหา (ชื่อ · รายละเอียด · หมวดหมู่)
  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter((p) =>
        [p.title, p.tagline, p.category].some((v) => (v || '').toLowerCase().includes(q)),
      )
    : products;


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
          {/* สถานะโหลด / error / ว่าง */}
          {loading && <p className="text-center text-muted">กำลังโหลดสินค้า…</p>}
          {error && !loading && (
            <p className="mx-auto max-w-md rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-muted">ยังไม่มีสินค้าในระบบ</p>
          )}

          {/* หัวข้อรวม + ช่องค้นหา */}
          {!loading && !error && products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-ink">
                สินค้าทั้งหมด{' '}
                <span className="font-semibold text-muted">({filtered.length})</span>
              </h2>
              <div className="mt-4 max-w-xl">
                <SearchBar value={query} onChange={setQuery} placeholder="ค้นหาสินค้า..." />
              </div>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
              >
                {/* รูปโพสเตอร์ — กดเพื่อดูรูปใหญ่ */}
                <div className="relative bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setPreview({ src: resolveImg(p.img), title: p.title })}
                    title="กดเพื่อดูรูปใหญ่"
                    className="group relative block w-full cursor-zoom-in"
                  >
                    <img
                      src={resolveImg(p.img)}
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
                    </div>
                    {/* ไอคอนแว่นขยายตอนโฮเวอร์ */}
                    <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-transparent transition group-hover:bg-black/25 group-hover:text-white">
                      <MagnifierIcon className="h-10 w-10" />
                    </span>
                  </button>
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

          {/* ไม่พบผลลัพธ์จากการค้นหา */}
          {!loading && !error && products.length > 0 && filtered.length === 0 && (
            <p className="text-center text-muted">ไม่พบสินค้าที่ตรงกับ “{query}”</p>
          )}

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

      {/* ดูรูปใหญ่ */}
      <Lightbox item={preview} onClose={() => setPreview(null)} />
    </main>
  );
}
