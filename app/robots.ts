/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
      
    },
    sitemap: "https://blog.ongoro.top/sitemap.xml",
  }
}
