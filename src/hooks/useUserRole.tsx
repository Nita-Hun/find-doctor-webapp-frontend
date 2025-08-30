// 'use client';

// import { useState, useEffect } from 'react';

// export function useUserRole(): "ADMIN" | "DOCTOR" | "PATIENT" {
//   const [role, setRole] = useState<"ADMIN" | "DOCTOR" | "PATIENT">("PATIENT");

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     console.log("Loaded role from storage:", storedRole);
//     if (storedRole === "ADMIN" || storedRole === "DOCTOR" || storedRole === "PATIENT") {
//       setRole(storedRole);
//     }
//   }, []);

//   return role;
// }

'use client';

import { useState, useEffect } from 'react';

export type RoleType = "ADMIN" | "DOCTOR" | "PATIENT";

export function useUserRole(): RoleType | null {
  const [role, setRole] = useState<RoleType | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole === "ADMIN" || storedRole === "DOCTOR" || storedRole === "PATIENT") {
      setRole(storedRole);
    } else {
      setRole(null);
    }
  }, []);

  return role;
}
