// ─────────────────────────────────────────────────────────────
// useWorks — ดึงรายการจาก backend + สถานะ loading / error (สไตล์ cctv-client hooks)
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { getWorks } from '../../helper/api.js';

const useWorks = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchdata = async () => {
    try {
      setWorks(await getWorks());
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

  return { works, loading, error, refetch: fetchdata };
};

export default useWorks;
