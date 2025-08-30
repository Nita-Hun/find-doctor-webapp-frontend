'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // e.g., 'ADMIN', 'DOCTOR', 'PATIENT'

    if (!token) {
      router.push('/login');
    } else {
      setRole(userRole);
    }
  }, [router]);

  return { role };
}
