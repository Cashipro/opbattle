"use client";

import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />

      <main
        className="
        flex-1
        bg-black
        p-6
        md:p-10
        overflow-y-auto
        "
      >
        {children}
      </main>
    </div>
  );
}
