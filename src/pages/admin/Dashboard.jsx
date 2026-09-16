import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MagnifierIcon from '../../components/MagnifierIcon.jsx';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getWorks,
  createWork,
  updateWork,
  deleteWork,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  resolveImg,
  getAuth,
  logout,
} from '../../lib/api.js';

// ─────────────────────────────────────────────────────────────
// แผงควบคุมผู้ดูแล — จัดการ "สินค้า" และ "ผลงาน" (เพิ่ม / ลบ)
//   ต้องมี token ใน localStorage ก่อน ไม่งั้นเด้งไป /admin/login
//   ข้อมูลทั้งหมดอ่าน/เขียนผ่าน backend (MySQL)
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('products'); // products | works
  const [preview, setPreview] = useState(null); // รูปที่กำลังดูใหญ่ { src, title }

  // ไม่มี token → ไปหน้า login
  useEffect(() => {
    if (!getAuth().token) navigate('/admin/login');
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  // token หมดอายุระหว่างใช้งาน → เคลียร์แล้วเด้งออก
  const onAuthError = useCallback(
    (err) => {
      if (/เข้าสู่ระบบ|เซสชัน|สิทธิ์/.test(err.message)) {
        logout();
        navigate('/admin/login');
      }
    },
    [navigate],
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-content">
        {/* หัวข้อ + ออกจากระบบ */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">แผงควบคุมผู้ดูแล</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/90 transition-colors hover:border-brand hover:text-brand"
            >
              ดูหน้าเว็บ
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full border border-ink/80 px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* แท็บสลับ สินค้า / ผลงาน / วิดีโอ */}
        <div className="mt-6 inline-flex rounded-full bg-white p-1 shadow-sm">
          {[
            ['products', 'สินค้า'],
            ['works', 'ผลงาน'],
            ['videos', 'วิดีโอ'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                tab === key ? 'bg-brand text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'products' && <ProductsPanel onAuthError={onAuthError} onView={setPreview} />}
          {tab === 'works' && <WorksPanel onAuthError={onAuthError} onView={setPreview} />}
          {tab === 'videos' && <VideosPanel onAuthError={onAuthError} />}
        </div>
      </div>

      {/* ดูรูปใหญ่ */}
      <Lightbox item={preview} onClose={() => setPreview(null)} />
    </main>
  );
}

// ═══════════════════════ ดูรูปใหญ่ (Lightbox) ═══════════════════════
function Lightbox({ item, onClose }) {
  // กด Esc เพื่อปิด + ล็อกสกอร์ลพื้นหลังตอนเปิด
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
      <figure className="flex max-h-full max-w-4xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
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

// ปุ่มบันทึกสีแบรนด์
function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'กำลังบันทึก…' : children}
    </button>
  );
}

// กล่องฟอร์ม/ตารางร่วม
function Card({ children }) {
  return <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">{children}</div>;
}

// ═══════════════════════ แผงสินค้า ═══════════════════════
function ProductsPanel({ onAuthError, onView }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // สินค้าที่กำลังแก้ไข (null = โหมดเพิ่ม)
  const [form, setForm] = useState({ title: '', tagline: '', category: '' });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgKey, setImgKey] = useState(0); // เปลี่ยนค่า = รีเซ็ต ImageField (ล้าง preview)
  const [query, setQuery] = useState(''); // คำค้นหา
  const [catFilter, setCatFilter] = useState(''); // กรองหมวดหมู่ ('' = ทั้งหมด)
  const formRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    getProducts()
      .then(setItems)
      .catch((e) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  // รายชื่อหมวดหมู่ (ไม่ซ้ำ) + ผลลัพธ์หลังค้นหา/กรอง
  const categories = [...new Set(items.map((p) => p.category).filter(Boolean))];
  const q = query.trim().toLowerCase();
  const filtered = items.filter((p) => {
    const matchQ =
      !q || [p.title, p.tagline, p.category].some((v) => (v || '').toLowerCase().includes(q));
    const matchCat = !catFilter || p.category === catFilter;
    return matchQ && matchCat;
  });

  function resetForm() {
    setEditing(null);
    setForm({ title: '', tagline: '', category: '' });
    setImage(null);
    setImgKey((k) => k + 1);
    setMsg('');
    formRef.current?.reset();
  }

  function startEdit(p) {
    setEditing(p);
    setForm({ title: p.title || '', tagline: p.tagline || '', category: p.category || '' });
    setImage(null);
    setImgKey((k) => k + 1);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!form.title.trim()) return setMsg('กรุณากรอกชื่อสินค้า');
    try {
      setSaving(true);
      if (editing) {
        await updateProduct(editing.id, { ...form, image });
      } else {
        await createProduct({ ...form, image });
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`ลบสินค้า "${title}" ?`)) return;
    try {
      await deleteProduct(id);
      setItems((list) => list.filter((p) => p.id !== id));
      if (editing?.id === id) resetForm();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      {/* ฟอร์มเพิ่ม/แก้ไขสินค้า */}
      <Card>
        <h2 className="text-lg font-bold text-ink">{editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field
            label="ชื่อสินค้า *"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            placeholder="เช่น Growatt MIN"
          />
          <Field
            label="รายละเอียดย่อ"
            value={form.tagline}
            onChange={(v) => setForm((f) => ({ ...f, tagline: v }))}
            placeholder="เช่น On Grid Inverter · 3–5kW"
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">หมวดหมู่</span>
            <CategoryCombobox
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={categories}
              placeholder="เลือก หรือพิมพ์หมวดใหม่"
            />
            <span className="mt-1 block text-xs text-muted">
              เลือกจากรายการ หรือพิมพ์ชื่อหมวดใหม่เพื่อเพิ่ม
            </span>
          </label>
          <ImageField
            key={imgKey}
            onChange={setImage}
            onView={onView}
            initialPreview={editing ? resolveImg(editing.img) : ''}
            initialName={editing ? editing.title : ''}
          />
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <div className="flex items-center gap-3">
            <SubmitButton loading={saving}>{editing ? 'บันทึกการแก้ไข' : 'บันทึกสินค้า'}</SubmitButton>
            {editing && <CancelButton onClick={resetForm} />}
          </div>
        </form>
      </Card>

      {/* รายการสินค้า */}
      <Card>
        <h2 className="text-lg font-bold text-ink">
          สินค้าทั้งหมด{' '}
          {!loading && (
            <span className="text-muted">
              ({q || catFilter ? `${filtered.length}/${items.length}` : items.length})
            </span>
          )}
        </h2>

        {/* ค้นหา + กรองหมวดหมู่ */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <SearchInput value={query} onChange={setQuery} placeholder="ค้นหาสินค้า…" />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 sm:w-48"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-4 text-muted">กำลังโหลด…</p>
        ) : (
          <ul className="mt-2 max-h-[65vh] divide-y divide-gray-100 overflow-y-auto pr-1">
            {filtered.map((p) => (
              <li
                key={p.id}
                className={`flex items-center gap-4 py-3 ${
                  editing?.id === p.id ? 'rounded-lg bg-brand/5' : ''
                }`}
              >
                <Thumb
                  src={resolveImg(p.img)}
                  size="h-24 w-24"
                  onView={() => onView({ src: resolveImg(p.img), title: p.title })}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{p.title}</p>
                  <p className="truncate text-sm text-muted">
                    {p.category && <span className="text-brand">{p.category}</span>}
                    {p.category && p.tagline && ' · '}
                    {p.tagline}
                  </p>
                </div>
                <EditBtn onClick={() => startEdit(p)} />
                <DeleteBtn onClick={() => handleDelete(p.id, p.title)} />
              </li>
            ))}
            {items.length === 0 && <li className="py-4 text-muted">ยังไม่มีสินค้า</li>}
            {items.length > 0 && filtered.length === 0 && (
              <li className="py-4 text-muted">ไม่พบสินค้าที่ค้นหา</li>
            )}
          </ul>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════ แผงผลงาน ═══════════════════════
function WorksPanel({ onAuthError, onView }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // ผลงานที่กำลังแก้ไข (null = โหมดเพิ่ม)
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgKey, setImgKey] = useState(0);
  const [query, setQuery] = useState(''); // คำค้นหา
  const formRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    getWorks()
      .then(setItems)
      .catch((e) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const q = query.trim().toLowerCase();
  const filtered = items.filter((w) => !q || (w.title || '').toLowerCase().includes(q));

  function resetForm() {
    setEditing(null);
    setTitle('');
    setImage(null);
    setImgKey((k) => k + 1);
    setMsg('');
    formRef.current?.reset();
  }

  function startEdit(w) {
    setEditing(w);
    setTitle(w.title || '');
    setImage(null);
    setImgKey((k) => k + 1);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!title.trim()) return setMsg('กรุณากรอกชื่อผลงาน');
    try {
      setSaving(true);
      if (editing) {
        await updateWork(editing.id, { title, image });
      } else {
        await createWork({ title, image });
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, t) {
    if (!window.confirm(`ลบผลงาน "${t}" ?`)) return;
    try {
      await deleteWork(id);
      setItems((list) => list.filter((w) => w.id !== id));
      if (editing?.id === id) resetForm();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      {/* ฟอร์มเพิ่ม/แก้ไขผลงาน */}
      <Card>
        <h2 className="text-lg font-bold text-ink">{editing ? 'แก้ไขผลงาน' : 'เพิ่มผลงาน'}</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field
            label="ชื่อผลงาน *"
            value={title}
            onChange={setTitle}
            placeholder="เช่น บ้านคุณสมชาย"
          />
          <ImageField
            key={imgKey}
            onChange={setImage}
            onView={onView}
            initialPreview={editing ? resolveImg(editing.img) : ''}
            initialName={editing ? editing.title : ''}
          />
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <div className="flex items-center gap-3">
            <SubmitButton loading={saving}>{editing ? 'บันทึกการแก้ไข' : 'บันทึกผลงาน'}</SubmitButton>
            {editing && <CancelButton onClick={resetForm} />}
          </div>
        </form>
      </Card>

      {/* รายการผลงาน */}
      <Card>
        <h2 className="text-lg font-bold text-ink">
          ผลงานทั้งหมด{' '}
          {!loading && (
            <span className="text-muted">
              ({q ? `${filtered.length}/${items.length}` : items.length})
            </span>
          )}
        </h2>

        {/* ค้นหา */}
        <div className="mt-4">
          <SearchInput value={query} onChange={setQuery} placeholder="ค้นหาผลงาน…" />
        </div>

        {loading ? (
          <p className="mt-4 text-muted">กำลังโหลด…</p>
        ) : (
          <div className="mt-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filtered.map((w) => (
                <div
                  key={w.id}
                  className={`group relative overflow-hidden rounded-xl border ${
                    editing?.id === w.id ? 'border-brand ring-2 ring-brand/30' : 'border-gray-100'
                  }`}
                >
                  <div className="aspect-[4/3] bg-gray-100">
                    <Thumb
                      src={resolveImg(w.img)}
                      cover
                      onView={() => onView({ src: resolveImg(w.img), title: w.title })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="truncate text-sm text-ink">{w.title}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <EditBtn onClick={() => startEdit(w)} />
                      <DeleteBtn onClick={() => handleDelete(w.id, w.title)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && <p className="py-4 text-muted">ยังไม่มีผลงาน</p>}
            {items.length > 0 && filtered.length === 0 && (
              <p className="py-4 text-muted">ไม่พบผลงานที่ค้นหา</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════ แผงวิดีโอ ═══════════════════════
function VideosPanel({ onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // วิดีโอที่กำลังแก้ไข (null = โหมดเพิ่ม)
  const [form, setForm] = useState({ title: '', url: '' });
  const [videoFile, setVideoFile] = useState(null); // ไฟล์วิดีโอที่เลือกอัปโหลด
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const formRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    getVideos()
      .then(setItems)
      .catch((e) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  function resetForm() {
    setEditing(null);
    setForm({ title: '', url: '' });
    setVideoFile(null);
    setMsg('');
    formRef.current?.reset();
  }

  function startEdit(v) {
    setEditing(v);
    setForm({ title: v.title || '', url: v.url || '' });
    setVideoFile(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!form.url.trim() && !videoFile && !editing) {
      return setMsg('กรุณากรอกลิงก์ หรือเลือกไฟล์วิดีโอ');
    }
    try {
      setSaving(true);
      const payload = { ...form, video: videoFile };
      if (editing) await updateVideo(editing.id, payload);
      else await createVideo(payload);
      resetForm();
      load();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`ลบวิดีโอ "${title || 'ไม่มีชื่อ'}" ?`)) return;
    try {
      await deleteVideo(id);
      setItems((list) => list.filter((v) => v.id !== id));
      if (editing?.id === id) resetForm();
    } catch (err) {
      setMsg(err.message);
      onAuthError(err);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      {/* ฟอร์มเพิ่ม/แก้ไขวิดีโอ */}
      <Card>
        <h2 className="text-lg font-bold text-ink">{editing ? 'แก้ไขวิดีโอ' : 'เพิ่มวิดีโอ'}</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field
            label="ลิงก์วิดีโอ (YouTube / ลิงก์ตรง)"
            value={form.url}
            onChange={(v) => setForm((f) => ({ ...f, url: v }))}
            placeholder="เช่น https://youtu.be/xxxxxxxxxxx"
          />

          {/* หรืออัปโหลดไฟล์ */}
          <div className="flex items-center gap-3 py-1 text-xs text-muted">
            <span className="h-px flex-1 bg-gray-200" />
            หรือ
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-ink">อัปโหลดไฟล์วิดีโอ</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
            />
            {videoFile && (
              <p className="mt-1 truncate text-xs text-brand">ไฟล์ที่เลือก: {videoFile.name}</p>
            )}
          </div>

          <Field
            label="ชื่อ/คำอธิบาย (ถ้ามี)"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            placeholder="เช่น วิดีโอแนะนำระบบ"
          />
          <p className="text-xs text-muted">
            ใส่ลิงก์ YouTube/ลิงก์ตรง หรืออัปโหลดไฟล์วิดีโอ (≤ 200MB) อย่างใดอย่างหนึ่ง —
            วิดีโอตัวแรกในรายการจะแสดงบนหน้าแรก
          </p>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <div className="flex items-center gap-3">
            <SubmitButton loading={saving}>{editing ? 'บันทึกการแก้ไข' : 'บันทึกวิดีโอ'}</SubmitButton>
            {editing && <CancelButton onClick={resetForm} />}
          </div>
        </form>
      </Card>

      {/* รายการวิดีโอ */}
      <Card>
        <h2 className="text-lg font-bold text-ink">
          วิดีโอทั้งหมด {!loading && <span className="text-muted">({items.length})</span>}
        </h2>
        {loading ? (
          <p className="mt-4 text-muted">กำลังโหลด…</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {items.map((v, i) => (
              <li
                key={v.id}
                className={`flex items-center gap-4 py-3 ${
                  editing?.id === v.id ? 'rounded-lg bg-brand/5' : ''
                }`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-lg">
                  🎬
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    <span className="truncate">{v.title || '(ไม่มีชื่อ)'}</span>
                    {i === 0 && (
                      <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        แสดงบนหน้าแรก
                      </span>
                    )}
                  </p>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-sm text-brand hover:underline"
                  >
                    {v.url}
                  </a>
                </div>
                <EditBtn onClick={() => startEdit(v)} />
                <DeleteBtn onClick={() => handleDelete(v.id, v.title)} />
              </li>
            ))}
            {items.length === 0 && <li className="py-4 text-muted">ยังไม่มีวิดีโอ</li>}
          </ul>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════ ชิ้นส่วนย่อย ═══════════════════════
function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}

// Combobox หมวดหมู่ — เลือกจากที่มี หรือพิมพ์เพื่อเพิ่มหมวดใหม่ (สไตล์เข้าธีมเอง)
function CategoryCombobox({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);

  // ปิดเมื่อคลิกนอกกล่อง
  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const q = value.trim().toLowerCase();
  const matches = options.filter((o) => o.toLowerCase().includes(q));
  const isNew = value.trim() && !options.some((o) => o.toLowerCase() === q);

  function choose(v) {
    onChange(v);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) return setOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && active >= 0 && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={wrapRef}>
      <input
        type="text"
        value={value}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setOpen((o) => !o)}
        aria-label="เปิดรายการหมวดหมู่"
        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center text-muted transition hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={`transition ${open ? 'rotate-180' : ''}`}>
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (matches.length > 0 || isNew) && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {matches.map((o, i) => {
            const selected = q === o.toLowerCase();
            return (
              <li key={o}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                    i === active ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-gray-50'
                  } ${selected ? 'font-semibold' : ''}`}
                >
                  {o}
                  {selected && <span className="text-brand">✓</span>}
                </button>
              </li>
            );
          })}
          {isNew && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(value.trim())}
                className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-brand transition hover:bg-brand/5"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/10 text-base leading-none">＋</span>
                เพิ่ม “{value.trim()}” เป็นหมวดใหม่
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function ImageField({ onChange, onView, initialPreview = '', initialName = '' }) {
  const [preview, setPreview] = useState(initialPreview);
  const [name, setName] = useState(initialName);
  const [isNew, setIsNew] = useState(false); // true = รูปที่เพิ่งเลือกใหม่ (ต้อง revoke blob)
  const inputRef = useRef(null);

  // คืนหน่วยความจำ blob URL เฉพาะรูปที่สร้างจากไฟล์ (ไม่แตะ URL รูปเดิม)
  useEffect(() => {
    if (isNew && preview) return () => URL.revokeObjectURL(preview);
  }, [isNew, preview]);

  function pick(file) {
    setIsNew(!!file);
    setName(file?.name || '');
    setPreview(file ? URL.createObjectURL(file) : '');
    onChange(file || null);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = ''; // ให้เลือกไฟล์เดิมซ้ำได้
    pick(null);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">รูปภาพ</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
        className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
      />

      {/* รูปตัวอย่างที่เลือก/รูปเดิม — กดเพื่อดูใหญ่ · มีปุ่มลบ */}
      {preview && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onView?.({ src: preview, title: name })}
            title="กดเพื่อดูรูปใหญ่"
            className="relative h-20 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            <img src={preview} alt="ตัวอย่าง" className="h-full w-full object-contain" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{isNew ? name : 'รูปเดิม'}</p>
            <button
              type="button"
              onClick={clear}
              className="mt-1 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              ลบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Thumb({ src, cover, onView, size = 'h-12 w-12' }) {
  const boxSize = `${size} shrink-0 rounded-lg bg-gray-50`;
  if (!src) {
    return (
      <div
        className={`grid place-items-center bg-gray-100 text-gray-300 ${
          cover ? 'h-full w-full' : boxSize
        }`}
      >
        🖼️
      </div>
    );
  }
  const img = (
    <img
      src={src}
      alt=""
      className={cover ? 'h-full w-full object-cover' : 'h-full w-full rounded-lg object-contain'}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
  if (!onView) {
    return cover ? img : <div className={`${boxSize} overflow-hidden`}>{img}</div>;
  }
  // กดเพื่อดูรูปใหญ่
  return (
    <button
      type="button"
      onClick={onView}
      title="กดเพื่อดูรูปใหญ่"
      className={`group relative block cursor-zoom-in overflow-hidden ${
        cover ? 'h-full w-full' : boxSize
      }`}
    >
      {img}
      <span className="absolute inset-0 grid place-items-center bg-black/0 text-transparent transition group-hover:bg-black/30 group-hover:text-white">
        <MagnifierIcon className="h-6 w-6" />
      </span>
    </button>
  );
}

// ช่องค้นหา — มีไอคอนแว่นขยาย + ปุ่มล้างคำค้นหา
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <MagnifierIcon className="h-4 w-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-9 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="ล้างคำค้นหา"
          className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-gray-100 hover:text-ink"
        >
          ×
        </button>
      )}
    </div>
  );
}

function EditBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border border-brand/40 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
    >
      แก้ไข
    </button>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
    >
      ลบ
    </button>
  );
}

// ปุ่มยกเลิกการแก้ไข (กลับสู่โหมดเพิ่ม)
function CancelButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink/80 transition-colors hover:border-ink hover:text-ink"
    >
      ยกเลิก
    </button>
  );
}
