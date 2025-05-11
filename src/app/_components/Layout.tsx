"use client";

import Link from "next/link";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Mayoral Election Results(non-official) Mayoral Election Results(non-official) Mayoral Election Results(non-official) ผลการเลือกตั้งไม่เป็นทางการ
          </Link>
          <nav className="flex gap-6">
            <Link 
              href="/" 
              className="hover:underline font-medium"
            >
              Results
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto p-4 text-center text-gray-600">
          © {new Date().getFullYear()} Mayoral Election Results(non-official) ผลการเลือกตั้งไม่เป็นทางการ System
        </div>
      </footer>
    </div>
  );
}
