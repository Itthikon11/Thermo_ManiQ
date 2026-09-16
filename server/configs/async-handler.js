// ─────────────────────────────────────────────────────────────
// asyncHandler — ห่อ controller ที่เป็น async ให้จับ error อัตโนมัติ
//   แทนการเขียน try/catch ซ้ำในทุก controller (สไตล์ cctv)
//   error ที่โยนออกมาจะถูกส่งไป errorHandler กลาง
// ─────────────────────────────────────────────────────────────
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
