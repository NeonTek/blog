/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Link from "next/link";

const allPages = [
  "https://neontek.co.ke",
  "https://neontek.co.ke/about",
  "https://neontek.co.ke/services",
  "https://neontek.co.ke/portfolio",
  "https://neontek.co.ke/blog",
  "https://neontek.co.ke/contact"
];

const fragments: Record<string, string[]> = {
  home: ["home", "/"],
  about: ["about", "team", "company"],
  services: ["services", "offerings"],
  portfolio: ["portfolio", "projects", "work"],
  blog: ["blog", "news", "articles"],
  contact: ["contact", "support"]
};

function findRelatedPages(currentUrl: string): string[] {
  const lowerUrl = currentUrl.toLowerCase();

  const matchedKeys = Object.entries(fragments)
    .filter(([_, keywords]) =>
      keywords.some((keyword) => lowerUrl.includes(keyword))
    )
    .map(([key]) => key);

  return allPages.filter((page) => {
    const pageFragment = page.toLowerCase();
    return (
      matchedKeys.some((key) =>
        fragments[key].some((k) => pageFragment.includes(k))
      ) && page !== currentUrl
    );
  });
}

export function SuggestedPages() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this only runs client-side
    setCurrentPage(window.location.href);
  }, []);

  if (!currentPage) return null;

  const suggestions = findRelatedPages(currentPage);

  if (suggestions.length === 0) return null;

  const suggestionDisplay = (slug: string): string => {
    switch (slug.toLowerCase()) {
      case "neontek.co.ke":
      case "home":
        return "Home";
      case "about":
        return "About Us";
      case "team":
        return "Our Team";
      case "company":
        return "Company Info";
      case "services":
      case "offerings":
        return "Services";
      case "portfolio":
      case "projects":
      case "work":
        return "Our Work";
      case "blog":
      case "news":
      case "articles":
        return "Blog";
      case "contact":
      case "support":
        return "Contact Us";
      default:
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  };

  return (
    <ul className="space-y-2">
      {suggestions.map((url, id) => (
        <li key={id}>
          <Link
            href={url}
            className="text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {suggestionDisplay(url.split("/").pop()?.replace(/-/g, " ") || "Page")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
