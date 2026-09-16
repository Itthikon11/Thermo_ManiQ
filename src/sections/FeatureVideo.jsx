import { useEffect, useState } from 'react';
import { getVideos, resolveImg } from '../lib/api.js';

// ─────────────────────────────────────────────────────────────
// วิดีโอแนะนำ + ฟีเจอร์เด่น 4 อย่าง (บนหน้าแรก ถัดจาก SmartHome)
//   วิดีโอ = ลิงก์จาก backend (ตาราง videos) แอดมินเพิ่ม/ลบ/เปลี่ยนได้
//   ไอคอนฟีเจอร์อยู่ใน public/
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '/SMARTANALYSIS.png',
    title: 'SMART ANALYSIS',
    text: 'คำนวณจากพฤติกรรมการใช้ไฟจริงของบ้าน ไม่ติดเกินความจำเป็น ออกแบบให้คุ้มทุนไวที่สุด',
  },
  {
    icon: '/STRUCTUREDWIRING.png',
    title: 'STRUCTURED WIRING',
    text: 'งานตู้ไฟ เดินท่อ รางสายไฟ เป็นระเบียบ ชัดเจน ปลอดภัยตามหลักวิศวกรรม ซ่อมบำรุงง่าย',
  },
  {
    icon: '/TOTALMANAGEMENT.png',
    title: 'TOTAL MANAGEMENT',
    text: 'เชื่อมต่อโซลาร์ แบตเตอรี่ และการใช้ไฟในบ้านให้ทำงานสอดคล้องกัน ไม่ใช่แค่ติดแยกชิ้น',
  },
  {
    icon: '/LIFELONGMONITOR.png',
    title: 'LIFELONG MONITOR',
    text: 'เช็กสถานะและประสิทธิภาพการใช้ไฟได้ตลอดเวลา พร้อมทีมซัพพอร์ตเมื่อระบบมีปัญหา',
  },
];

// แปลงลิงก์วิดีโอ → วิธีแสดง (YouTube = iframe · ไฟล์ = <video> · อื่นๆ = iframe)
function toEmbed(url) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith('/uploads/')) {
    return { type: 'file', src: resolveImg(url) };
  }
  return { type: 'iframe', src: url };
}

export default function FeatureVideo() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => {}); // เงียบไว้ ถ้า backend ไม่พร้อมก็โชว์ placeholder
  }, []);

  const video = videos[0];
  const embed = video ? toEmbed(video.url) : null;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
        {/* วิดีโอ */}
        <div data-aos="fade-right">
          <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-lg">
            {embed?.type === 'iframe' && (
              <iframe
                src={embed.src}
                title={video.title || 'วิดีโอแนะนำ'}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {embed?.type === 'file' && (
              <video src={embed.src} controls className="h-full w-full object-contain" />
            )}
            {!embed && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/50">
                <span className="text-4xl">🎬</span>
                <span className="text-sm">ยังไม่มีวิดีโอ</span>
              </div>
            )}
          </div>
          {video?.title && (
            <p className="mt-3 text-center text-sm font-medium text-muted">{video.title}</p>
          )}
        </div>

        {/* ฟีเจอร์ 4 อย่าง */}
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2" data-aos="fade-left">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="flex items-center gap-3">
                <img src={f.icon} alt="" className="h-11 w-11 shrink-0 object-contain" />
                <h3 className="text-lg font-extrabold leading-tight text-brand">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
