"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createPost, updatePost } from "@/lib/actions/post-actions"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { marked } from "marked" 


const ReactQuill = dynamic(
  () => {
    
    if (typeof window !== "undefined") {
      require("react-quill/dist/quill.snow.css")
      return import("react-quill").then((mod) => mod.default)
    }
    return Promise.resolve(null)
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-muted animate-pulse rounded-md flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading rich text editor...</p>
        </div>
      </div>
    ),
  }
)


const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false, // Ensure HTML is parsed correctly
  },
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
]

type Category = {
  _id: string
  name: string
  slug: string
}

type PostFormProps = {
  post?: {
    _id?: string
    title: string
    slug: string
    content: string
    excerpt: string
    category: string
    coverImage: string
    published: boolean
  }
  categories?: Category[]
}

export default function PostEditorC({ post, categories: initialCategories }: PostFormProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "") // Holds Markdown or HTML based on editor mode
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [category, setCategory] = useState(post?.category || "")
  const [coverImage, setCoverImage] = useState(post?.coverImage || "")
  const [published, setPublished] = useState(post?.published || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editorMode, setEditorMode] = useState<"rich-text" | "markdown">("rich-text") // New state for editor mode
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])
  const [categoriesLoading, setCategoriesLoading] = useState(!initialCategories)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const quillRef = useRef<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  
  useEffect(() => {
    if (post?.content) {
      
      const looksLikeHtml = /<[a-z][\s\S]*>/i.test(post.content)
      setEditorMode(looksLikeHtml ? "rich-text" : "markdown")
      
      if (!looksLikeHtml) {
        setContent(post.content) 
      } else {
        setContent(post.content) // Keep as HTML for Rich Text Editor
      }
    }
  }, [post])

  // Fetch categories if not provided
  useEffect(() => {
    if (!initialCategories) {
      async function fetchCategories() {
        try {
          setCategoriesLoading(true)
          setCategoriesError(null)

          const response = await fetch("/api/categories")
          const result = await response.json()

          if (result.success) {
            setCategories(result.data)
          } else {
            setCategoriesError("Failed to load categories")
          }
        } catch (error) {
          console.error("Error fetching categories:", error)
          setCategoriesError("Failed to load categories")
        } finally {
          setCategoriesLoading(false)
        }
      }

      fetchCategories()
    }
  }, [initialCategories])

  // Generate slug from title
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
        .substring(0, 50)
      setSlug(generatedSlug)
    }
  }, [title, post])

  // Convert HTML to Markdown (basic conversion for switching)
  const convertHtmlToMarkdown = useCallback((html: string): string => {

    let markdown = html
      .replace(/<br\s*\/?>/gi, "\n") // Newlines
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "\n\n") // Paragraphs
      .replace(/<strong>(.*?)<\/strong>/gi, "**$1**") // Bold
      .replace(/<em>(.*?)<\/em>/gi, "*$1*") // Italic
      .replace(/<ul>/gi, "")
      .replace(/<\/ul>/gi, "")
      .replace(/<li>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]*>/g, "") // Strip any remaining HTML tags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
    return markdown
  }, [])

  // Handle content change based on editor mode
  const handleContentChange = useCallback(
    (value: string) => {
      // If rich text editor is active, content is HTML.
      // If markdown editor is active, content is Markdown.
      setContent(value)
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: "" }))
      }
    },
    [errors.content]
  )

  // Toggle editor mode
  const toggleEditorMode = useCallback(() => {
    if (editorMode === "rich-text") {
      // Switching to Markdown: convert current HTML content to Markdown
      setContent(convertHtmlToMarkdown(content))
      setEditorMode("markdown")
    } else {
      // Switching to Rich Text: convert current Markdown content to HTML
      setContent(marked.parse(content) as string)
      setEditorMode("rich-text")
    }
  }, [editorMode, content, convertHtmlToMarkdown])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!slug.trim()) newErrors.slug = "Slug is required"
    // Content validation: If in markdown mode, check content directly. If in rich text, check after parsing.
    const currentContent = editorMode === "markdown" ? content.trim() : marked.parse(content).trim()
    if (!currentContent || currentContent === "<p><br></p>")
      newErrors.content = "Content is required"
    if (!excerpt.trim()) newErrors.excerpt = "Excerpt is required"
    if (!category) newErrors.category = "Category is required"
    if (!coverImage.trim()) newErrors.coverImage = "Cover image URL is required"

    // Validate URL format for cover image
    if (coverImage && !isValidUrl(coverImage)) {
      newErrors.coverImage = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, slug, content, excerpt, category, coverImage, editorMode])

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // When saving, ensure content is always stored as HTML
      const finalContentToSave = editorMode === "markdown" ? (marked.parse(content) as string) : content

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content: finalContentToSave, // Always store as HTML
        excerpt: excerpt.trim(),
        category,
        coverImage: coverImage.trim(),
        published,
      }

      if (post?._id) {
        await updatePost(post._id, postData)
        toast({
          title: "Success!",
          description: "Post updated successfully",
        })
      } else {
        await createPost(postData)
        toast({
          title: "Success!",
          description: "Post created successfully",
        })
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const retryLoadCategories = () => {
    setCategoriesError(null)
    setCategoriesLoading(true)
    window.location.reload()
  }

  if (categoriesError) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {categoriesError}. Please{" "}
              <button onClick={retryLoadCategories} className="underline">
                try again
              </button>{" "}
              or{" "}
              <a href="/admin/categories/new" className="underline">
                create a category first
              </a>
              .
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (categoriesLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading categories...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No categories found. You need to{" "}
              <a href="/admin/categories/new" className="underline">
                create at least one category
              </a>{" "}
              before creating posts.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
              }}
              placeholder="Enter post title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }))
              }}
              placeholder="post-slug"
              className={errors.slug ? "border-red-500" : ""}
            />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
              }}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value)
                if (errors.excerpt) setErrors((prev) => ({ ...prev, excerpt: "" }))
              }}
              placeholder="Brief description of the post"
              className={errors.excerpt ? "border-red-500" : ""}
              rows={3}
            />
            {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => {
                setCoverImage(e.target.value)
                if (errors.coverImage) setErrors((prev) => ({ ...prev, coverImage: "" }))
              }}
              placeholder="https://example.com/image.jpg"
              className={errors.coverImage ? "border-red-500" : ""}
            />
            {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage}</p>}
            {coverImage && isValidUrl(coverImage) && (
              <div className="mt-2">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full max-h-40 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="content">Content *</Label>
              <Button type="button" onClick={toggleEditorMode} variant="outline" size="sm">
                Switch to {editorMode === "rich-text" ? "Markdown" : "Rich Text"}
              </Button>
            </div>
            <div className="min-h-[300px]">
              {editorMode === "rich-text" ? (
                // Rich Text Editor (ReactQuill)
                <ReactQuill
                  ref={quillRef}
                  value={content} // Quill expects HTML
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your post content here..."
                  theme="snow"
                  className={`${errors.content ? "border-red-500" : ""}`}
                />
              ) : (
                // Markdown Editor (Textarea)
                <Textarea
                  value={content} // Textarea expects raw string (Markdown)
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your post content here using Markdown..."
                  className={`min-h-[300px] ${errors.content ? "border-red-500" : ""}`}
                  rows={15}
                />
              )}
            </div>
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked as boolean)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : post?._id ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
