import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создаём тестового администратора
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@rustulip.ru' },
    update: {},
    create: {
      email: 'admin@rustulip.ru',
      password: hashedPassword,
      name: 'Администратор',
      role: 'superadmin',
    },
  })
  console.log('✅ Создан администратор:', admin.email)

  // Создаём категории
  const tulipsCategory = await prisma.category.upsert({
    where: { slug: 'tulips' },
    update: {},
    create: {
      name: 'Тюльпаны',
      slug: 'tulips',
      description: 'Свежие тюльпаны различных сортов и оттенков',
      sortOrder: 1,
    },
  })

  const mimosaCategory = await prisma.category.upsert({
    where: { slug: 'mimosa' },
    update: {},
    create: {
      name: 'Мимоза',
      slug: 'mimosa',
      description: 'Ароматная весенняя мимоза',
      sortOrder: 2,
    },
  })
  console.log('✅ Созданы категории')

  // Создаём тестовые товары
  const products = [
    {
      name: 'Тюльпан Red Princess',
      slug: 'tulip-red-princess',
      description: 'Изысканный красный тюльпан с бархатистыми лепестками. Идеален для романтических букетов.',
      color: 'Красный',
      price: 4500, // 45₽
      quantity: 100,
      categoryId: tulipsCategory.id,
      isHit: true,
      images: JSON.stringify(['/images/products/tulip-red.jpg']),
    },
    {
      name: 'Тюльпан Yellow Sun',
      slug: 'tulip-yellow-sun',
      description: 'Яркий солнечный тюльпан, дарящий весеннее настроение.',
      color: 'Жёлтый',
      price: 4000,
      quantity: 150,
      categoryId: tulipsCategory.id,
      isNew: true,
      images: JSON.stringify(['/images/products/tulip-yellow.jpg']),
    },
    {
      name: 'Тюльпан Pink Dream',
      slug: 'tulip-pink-dream',
      description: 'Нежный розовый тюльпан с лёгким ароматом.',
      color: 'Розовый',
      price: 4200,
      quantity: 80,
      categoryId: tulipsCategory.id,
      images: JSON.stringify(['/images/products/tulip-pink.jpg']),
    },
    {
      name: 'Тюльпан White Pearl',
      slug: 'tulip-white-pearl',
      description: 'Элегантный белый тюльпан для изысканных композиций.',
      color: 'Белый',
      price: 4800,
      quantity: 60,
      categoryId: tulipsCategory.id,
      images: JSON.stringify(['/images/products/tulip-white.jpg']),
    },
    {
      name: 'Тюльпан Purple Magic',
      slug: 'tulip-purple-magic',
      description: 'Волшебный фиолетовый тюльпан с насыщенным цветом.',
      color: 'Фиолетовый',
      price: 5000,
      oldPrice: 5500,
      quantity: 40,
      categoryId: tulipsCategory.id,
      images: JSON.stringify(['/images/products/tulip-purple.jpg']),
    },
    {
      name: 'Мимоза весенняя',
      slug: 'mimosa-spring',
      description: 'Ароматная веточка мимозы — символ весны и 8 марта.',
      color: 'Жёлтый',
      price: 5000,
      quantity: 200,
      categoryId: mimosaCategory.id,
      isHit: true,
      images: JSON.stringify(['/images/products/mimosa.jpg']),
    },
    {
      name: 'Мимоза премиум',
      slug: 'mimosa-premium',
      description: 'Крупные пушистые соцветия премиального качества.',
      color: 'Жёлтый',
      price: 7500,
      quantity: 50,
      categoryId: mimosaCategory.id,
      isNew: true,
      images: JSON.stringify(['/images/products/mimosa-premium.jpg']),
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('✅ Созданы товары')

  // Создаём настройки сайта
  const settings = [
    // Общие
    { key: 'site_name', value: 'РусТюльпан', type: 'text', label: 'Название сайта', group: 'general', sortOrder: 1 },
    { key: 'site_description', value: 'Свежие тюльпаны и мимоза с доставкой', type: 'text', label: 'Описание сайта', group: 'general', sortOrder: 2 },
    { key: 'site_logo', value: '/images/logo.svg', type: 'image', label: 'Логотип', group: 'general', sortOrder: 3 },
    
    // Контакты
    { key: 'phone', value: '+7 (999) 123-45-67', type: 'text', label: 'Телефон', group: 'contacts', sortOrder: 1 },
    { key: 'email', value: 'info@rustulip.ru', type: 'text', label: 'Email', group: 'contacts', sortOrder: 2 },
    { key: 'address', value: 'Москва, ул. Цветочная, д. 1', type: 'text', label: 'Адрес', group: 'contacts', sortOrder: 3 },
    { key: 'work_hours', value: 'Пн-Вс: 8:00-22:00', type: 'text', label: 'Часы работы', group: 'contacts', sortOrder: 4 },
    
    // Соцсети
    { key: 'telegram', value: 'https://t.me/rustulip', type: 'text', label: 'Telegram', group: 'social', sortOrder: 1 },
    { key: 'whatsapp', value: 'https://wa.me/79991234567', type: 'text', label: 'WhatsApp', group: 'social', sortOrder: 2 },
    { key: 'instagram', value: 'https://instagram.com/rustulip', type: 'text', label: 'Instagram', group: 'social', sortOrder: 3 },
    { key: 'vk', value: 'https://vk.com/rustulip', type: 'text', label: 'ВКонтакте', group: 'social', sortOrder: 4 },
    
    // SEO
    { key: 'meta_title', value: 'РусТюльпан — Свежие тюльпаны и мимоза с доставкой', type: 'text', label: 'Meta Title', group: 'seo', sortOrder: 1 },
    { key: 'meta_description', value: 'Купить свежие тюльпаны и мимозу в Москве. Быстрая доставка, низкие цены, широкий ассортимент.', type: 'textarea', label: 'Meta Description', group: 'seo', sortOrder: 2 },
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Созданы настройки сайта')

  // Создаём главный баннер
  await prisma.heroBanner.upsert({
    where: { id: 'main-banner' },
    update: {},
    create: {
      id: 'main-banner',
      title: 'Свежие цветы\nк любому празднику',
      subtitle: 'Тюльпаны и мимоза напрямую с плантаций. Доставка в день заказа.',
      buttonText: 'Перейти в каталог',
      buttonLink: '/catalog',
      bgGradient: 'linear-gradient(135deg, #ff2d55 0%, #bf5af2 100%)',
      isActive: true,
      sortOrder: 1,
    },
  })
  console.log('✅ Создан баннер')

  // Создаём преимущества
  const advantages = [
    {
      title: 'Свежесть гарантирована',
      description: 'Цветы напрямую с плантаций, без посредников',
      icon: 'Flower2',
      sortOrder: 1,
    },
    {
      title: 'Быстрая доставка',
      description: 'Доставим в течение 2 часов по Москве',
      icon: 'Truck',
      sortOrder: 2,
    },
    {
      title: 'Выгодные цены',
      description: 'Работаем без торговых наценок',
      icon: 'BadgeRussianRuble',
      sortOrder: 3,
    },
    {
      title: 'Онлайн заказ',
      description: 'Оформляйте заказ 24/7 через сайт',
      icon: 'ShoppingCart',
      sortOrder: 4,
    },
  ]

  for (const advantage of advantages) {
    await prisma.advantage.upsert({
      where: { id: advantage.title.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: advantage.title.toLowerCase().replace(/\s/g, '-'),
        ...advantage,
      },
    })
  }
  console.log('✅ Созданы преимущества')

  // Создаём страницы
  const pages = [
    {
      slug: 'about',
      title: 'О компании',
      content: `
# О компании РусТюльпан

Мы — команда энтузиастов, влюблённых в цветы. С 2020 года мы поставляем свежие тюльпаны и мимозу напрямую с лучших плантаций.

## Наши принципы

- **Качество превыше всего** — только свежие цветы
- **Честные цены** — без посредников и накруток
- **Забота о клиентах** — доставка в удобное время

## Почему нас выбирают

Более 10 000 довольных клиентов уже оценили качество наших цветов. Присоединяйтесь!
      `,
      metaTitle: 'О компании РусТюльпан — История и ценности',
      metaDesc: 'Узнайте больше о компании РусТюльпан. Мы поставляем свежие тюльпаны и мимозу напрямую с плантаций.',
    },
    {
      slug: 'contacts',
      title: 'Контакты',
      content: `
# Контакты

## Как с нами связаться

- **Телефон:** +7 (999) 123-45-67
- **Email:** info@rustulip.ru
- **Telegram:** @rustulip

## Адрес

Москва, ул. Цветочная, д. 1

## Часы работы

Ежедневно с 8:00 до 22:00
      `,
      metaTitle: 'Контакты РусТюльпан — Связаться с нами',
      metaDesc: 'Контактная информация магазина РусТюльпан. Телефон, email, адрес и часы работы.',
    },
    {
      slug: 'privacy',
      title: 'Политика конфиденциальности',
      content: `
# Политика конфиденциальности

## 1. Общие положения

Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».

## 2. Сбор данных

Мы собираем только необходимые данные для обработки заказов:
- Имя
- Номер телефона
- Адрес доставки (при необходимости)

## 3. Использование данных

Ваши данные используются исключительно для:
- Обработки и доставки заказов
- Связи по вопросам заказа
- Улучшения качества обслуживания

## 4. Защита данных

Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа.
      `,
      metaTitle: 'Политика конфиденциальности — РусТюльпан',
      metaDesc: 'Политика обработки персональных данных магазина РусТюльпан.',
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }
  console.log('✅ Созданы страницы')

  console.log('')
  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('📧 Данные для входа в админку:')
  console.log('   Email: admin@rustulip.ru')
  console.log('   Пароль: admin123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
