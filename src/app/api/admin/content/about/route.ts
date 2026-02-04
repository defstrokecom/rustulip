import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const SETTING_KEY = "about_page_content"

const defaultContent = {
  heroTitle: "О компании РусТюльпан",
  heroSubtitle: "Мы — команда энтузиастов, которые верят, что свежие цветы могут сделать любой день особенным. Предлагаем тюльпаны, выращенные из отборных голландских луковиц.",
  storyTitle: "Наша история",
  storyText1: "Всё началось с простой идеи — сделать покупку свежих цветов простой и доступной. Мы начали работать напрямую с плантациями в Голландии, Эквадоре и России.",
  storyText2: "Сегодня РусТюльпан — это современная компания с собственным складом, холодильными камерами для хранения цветов и командой профессионалов.",
  storyText3: "Мы специализируемся на оптовых и розничных поставках тюльпанов и мимозы — самых востребованных цветов весеннего сезона. Наши клиенты — это цветочные магазины, event-агентства и частные покупатели.",
  storyImage: "",
  storyImageTitle: "Голландские луковицы",
  storyImageSubtitle: "премиум качество",
}

export async function GET() {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: SETTING_KEY },
    })

    if (setting) {
      const content = JSON.parse(setting.value)
      return NextResponse.json({ content })
    }

    return NextResponse.json({ content: defaultContent })
  } catch (error) {
    console.error("Failed to fetch about content:", error)
    return NextResponse.json({ content: defaultContent })
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json()

    await prisma.siteSettings.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        value: JSON.stringify(content),
        type: "json",
        label: "Контент страницы О нас",
        group: "content",
      },
      update: {
        value: JSON.stringify(content),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save about content:", error)
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    )
  }
}
