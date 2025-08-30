'use client';

import { useUserProfile } from "@/hooks/userProfile";
import Logo from "@/components/Logo";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import AuthNavbar from "@/components/AuthNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Unauthorized</p>
      </div>
    );
  }

  if (user.role === "PATIENT") {
    return (
      <div className="min-h-screen bg-gray-100">
        <AuthNavbar />
        <main>{children}</main>
      </div>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[17%] md:w-[8%] lg:w-[16%] xl:w-[17%] bg-white shadow-md">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 p-4">
          <Logo />
        </Link>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
