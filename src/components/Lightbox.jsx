import { useEffect } from 'react';

// ─────────────────────────────────────────────────────────────
// Lightbox — ดูรูปใหญ่เต็มจอ
//   item = { src, title } | null (null = ปิด)
//   กด Esc / คลิกพื้นหลัง / ปุ่ม × เพื่อปิด · ล็อกสกอร์ลพื้นหลังตอนเปิด
// ─────────────────────────────────────────────────────────────
export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="ปิด"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
      >
        ×
      </button>
      <figure
        className="flex max-h-full max-w-4xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title || ''}
          className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        {item.title && <figcaption className="mt-3 text-sm text-white/90">{item.title}</figcaption>}
      </figure>
    </div>
  );
}
