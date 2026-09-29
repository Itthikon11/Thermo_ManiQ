// ─────────────────────────────────────────────────────────────
// HttpError — error ที่พก status code มาด้วย เพื่อให้ errorHandler
//   ตอบ HTTP status ให้ตรง (เช่น 400 กรอกไม่ครบ, 401 ล็อกอินไม่ผ่าน)
// ─────────────────────────────────────────────────────────────
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message) => new HttpError(400, message);
export const unauthorized = (message) => new HttpError(401, message);
export const notFound = (message) => new HttpError(404, message);
