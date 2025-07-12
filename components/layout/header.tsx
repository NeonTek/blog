/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Category = {
  _id: string
  name: string
  slug: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const pathname = usePathname()
  const { theme } = useTheme()

  // 🔒 Hide header on /admin routes
  if (pathname.startsWith("/admin")) {
    return null
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const result = await res.json()
          if (result.success) {
            setCategories(result.data || [])
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()

    const isAdminLightMode = pathname.startsWith("/admin") && theme === "light"
    if (isAdminLightMode) {
      setScrolled(true)
    }

    const handleScroll = () => {
      if (!isAdminLightMode) {
        setScrolled(window.scrollY > 50)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname, theme])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "https://neontek.co.ke/services" },
    { name: "Portfolio", href: "https://neontek.co.ke/portfolio" },
    { name: "Blog", href: "https://blog.neontek.co.ke/" },
    { name: "About", href: "https://neontek.co.ke/about" },
    { name: "Contact", href: "https://neontek.co.ke/contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="https://neontek.co.ke/" className="flex items-center">
            <Image
              src="/images/neontek-logo.png"
              alt="Neontek"
              width={120}
              height={40}
              className={`h-16 w-auto dark:brightness-0 dark:invert transition-all duration-300 ${
                scrolled ? "" : "invert brightness-0"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors hover:text-cyan-500 ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {!isLoading && categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`flex items-center cursor-pointer font-medium transition-colors hover:text-cyan-500 ${
                      scrolled ? "text-foreground" : "text-white"
                    }`}
                  >
                    Categories
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[180px]">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category._id} asChild>
                      <Link
                        href={`/${category.slug}`}
                        className={`w-full px-2 py-1.5 rounded-md transition-colors ${
                          pathname === `/${category.slug}`
                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-100 font-semibold"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Link href="/contact/#contact-form">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Get Quote
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${scrolled ? "text-foreground" : "text-white"}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-foreground hover:text-cyan-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  Get Quote
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
