/*
John 1:5
The light shines in darkness, but the darkness has not understood it
*/
import { Suspense } from "react"
import { getCategories } from "@/lib/actions/category-actions"
import PostEditorC from "@/components/editor/rich-text-editor" // This is your Client Component
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function EditorSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default async function NewPostPage() {
  let categoriesData = []
  let categoriesError: string | null = null

  try {
    categoriesData = await getCategories() 
  } catch (error) {
    console.error("Error loading categories:", error)
    categoriesError = "Failed to load categories."
  }

  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to create a new blog post.</p>
        </div>
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{categoriesError} Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to create a new blog post.</p>
        </div>
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No categories found. You need to create at least one category.
              </p>
              <a href="/admin/categories/new" className="text-primary hover:underline">
                Create a category first
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">Fill in the details below to create a new blog post.</p>
      </div>

      <Suspense fallback={<EditorSkeleton />}>
        <PostEditorC categories={categoriesData} />
      </Suspense>
    </div>
  )
}