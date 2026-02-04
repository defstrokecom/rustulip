import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

// GET - Получить товар по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// PUT - Обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, color, price, oldPrice, quantity, minOrder, images, categoryId, isActive, isNew, isHit } = body

    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Обновляем slug если изменилось название
    let slug = existingProduct.slug
    if (name && name !== existingProduct.name) {
      slug = slugify(name)
      const slugExists = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      })
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existingProduct.name,
        slug,
        description: description !== undefined ? description : existingProduct.description,
        color: color ?? existingProduct.color,
        price: price !== undefined ? parseInt(price) : existingProduct.price,
        oldPrice: oldPrice !== undefined ? (oldPrice ? parseInt(oldPrice) : null) : existingProduct.oldPrice,
        quantity: quantity !== undefined ? parseInt(quantity) : existingProduct.quantity,
        minOrder: minOrder !== undefined ? parseInt(minOrder) : existingProduct.minOrder,
        images: images !== undefined ? (typeof images === 'string' ? images : JSON.stringify(images)) : existingProduct.images,
        categoryId: categoryId ?? existingProduct.categoryId,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        isNew: isNew !== undefined ? isNew : existingProduct.isNew,
        isHit: isHit !== undefined ? isHit : existingProduct.isHit,
      },
      include: { category: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE - Удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    
    // Проверяем, есть ли товар в заказах
    const orderItems = await prisma.orderItem.count({
      where: { productId: id },
    })

    if (orderItems > 0) {
      // Если товар есть в заказах, просто деактивируем его
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json({ message: "Product deactivated" })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
