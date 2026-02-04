import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
  const page = await prisma.page.findUnique({
    where: { slug, isActive: true },
  })
  return page
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug)
  
  if (!page) return {}
  
  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug)
  
  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-8">{page.title}</h1>
        <div 
          className="prose prose-lg max-w-none prose-zinc"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}
