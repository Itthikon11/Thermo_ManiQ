import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// หน้าหลังบ้านแอดมิน (ชั่วคราว) — หลังล็อกอินสำเร็จจะมาที่นี่
//   ยังเป็นโครงเปล่า เดี๋ยวต่อไปทำ: ตารางลูกค้า (contacts) จริงจาก DB
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-content">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">แผงควบคุมผู้ดูแล</h1>
          <button
            onClick={handleLogout}
            className="rounded-full border border-ink/80 px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            ออกจากระบบ
          </button>
        </div>
        <p className="mt-4 text-muted">
          ✅ เข้าสู่ระบบสำเร็จ — หน้านี้เป็นโครงชั่วคราว ขั้นต่อไปจะแสดงรายชื่อลูกค้าจากฐานข้อมูล
        </p>
      </div>
    </main>
  );
}
