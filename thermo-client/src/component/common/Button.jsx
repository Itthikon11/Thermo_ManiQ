// ─────────────────────────────────────────────────────────────
// ปุ่ม CTA มาตรฐาน — 3 โทนตามดีไซน์ THERMO MANIQ
//   variant='primary'  ส้มทึบ ตัวอักษรขาว (ปุ่มหลัก)
//   variant='ghost'    ขอบขาว โปร่ง (ใช้บนพื้นเข้ม/ฮีโร่)
//   variant='outline'  ขอบดำ พื้นขาว (ใช้บนพื้นสว่าง)
//
//   <Button href="#products">ชมสินค้าเพิ่มเติม</Button>
//   <Button variant="outline" href="#contact">รับคำปรึกษาฟรี</Button>
// ─────────────────────────────────────────────────────────────
const VARIANT = {
  primary: 'bg-brand text-white border border-brand hover:bg-brand-dark',
  ghost: 'bg-transparent text-white border border-white/80 hover:bg-white/10',
  outline: 'bg-white text-ink border border-ink/80 hover:bg-ink hover:text-white',
};

export default function Button({ children, href = '#', variant = 'primary', className = '' }) {
  const tone = VARIANT[variant] ?? VARIANT.primary;
  // ลิงก์ภายนอก (http/https) → เปิดแท็บใหม่ + rel ปลอดภัย
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-colors ${tone} ${className}`}
    >
      {children}
      <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-xs leading-none">
        ›
      </span>
    </a>
  );
}
