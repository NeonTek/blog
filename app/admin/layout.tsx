"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Mail,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64
          bg-background border-r p-6 shadow-md
          transition-transform duration-300 ease-in-out
          h-full md:static md:translate-x-0 md:min-h-screen
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + Close Button (mobile) */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button className="md:hidden" onClick={toggleMenu}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <ModeToggle />
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/posts">
              <FileText className="mr-2 h-4 w-4" />
              Posts
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/categories">
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/newsletter">
              <Mail className="mr-2 h-4 w-4" />
              Newsletter
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
        </nav>

        {/* Bottom Logout */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Dark overlay for mobile when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Topbar for mobile */}
        <div className="flex items-center justify-between p-4 md:hidden border-b bg-background">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
