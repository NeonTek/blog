/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SuggestedPages } from "./suggested-pages";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/images/neontek-logo.png"
              alt="Neontek"
              width={150}
              height={50}
              className="mb-4 brightness-100 dark:invert dark:brightness-0"
            />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Innovating the future through cutting-edge web development,
              software solutions, and cloud services.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com/neontek"
                className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/@neontek_kenya"
                className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/neontek"
                className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/neontek"
                className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { label: "Web Development", href: "/services/web-development" },
                { label: "Mobile Development", href: "/services/mobile-development" },
                { label: "Cloud Services", href: "/services/cloud-services" },
                { label: "Software Solutions", href: "/services/software-solutions" },
                { label: "Database Management", href: "/services/database-management" },
                { label: "Security Solutions", href: "/services/security-solutions" },
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suggested Pages</h3>
            {typeof window !== "undefined" && <SuggestedPages />}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 mt-8 md:mt-0">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">info@neontek.co.ke</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">+254 (764)-514179</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Nairobi City, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Neontek. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
