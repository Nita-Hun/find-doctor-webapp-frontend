'use client';

import { AuthProvider } from "@/hooks/authContext";


export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}