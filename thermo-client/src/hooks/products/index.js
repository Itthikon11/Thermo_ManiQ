// ─────────────────────────────────────────────────────────────
// useProducts — ดึงรายการจาก backend + สถานะ loading / error (สไตล์ cctv-client hooks)
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { getProducts } from '../../helper/api.js';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchdata = async () => {
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ยังไม่ได้เปิด backend)'
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return { products, loading, error, refetch: fetchdata };
};

export default useProducts;
