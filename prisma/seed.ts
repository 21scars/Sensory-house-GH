// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sensoryhouse.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@sensoryhouse.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✓ Admin user:', admin.email)

  // Sample user
  const userPassword = await bcrypt.hash('user1234!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@sensoryhouse.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@sensoryhouse.com',
      password: userPassword,
      accountType: 'PARENT'
    },
  })
  console.log('✓ Demo user:', user.email)

  // Products (Hybrid)
  const products = await Promise.all([
    // Digital Products
    prisma.product.upsert({
      where: { slug: 'parenting-in-the-digital-age' },
      update: {},
      create: {
        title: 'Parenting in the Digital Age',
        slug: 'parenting-in-the-digital-age',
        description: 'A comprehensive guide for parents navigating the challenges of technology and child development.',
        price: 14.99,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        type: 'DIGITAL',
        category: 'Parenting Guides',
        author: 'Dr. Jane Smith',
        pageCount: 120,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'phonics-mastery-workbook' },
      update: {},
      create: {
        title: 'Phonics Mastery Workbook',
        slug: 'phonics-mastery-workbook',
        description: 'Interactive PDF materials for kids to practice literacy skills.',
        price: 9.99,
        coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
        type: 'DIGITAL',
        category: 'Workbooks',
        author: 'Sensory House Team',
        pageCount: 45,
      },
    }),
    // Physical Products
    prisma.product.upsert({
      where: { slug: 'deluxe-wooden-activity-board' },
      update: {},
      create: {
        title: 'Deluxe Wooden Activity Board',
        slug: 'deluxe-wooden-activity-board',
        description: 'Handcrafted activity board designed to stimulate fine motor skills and sensory exploration.',
        price: 45.00,
        coverImage: 'https://images.unsplash.com/photo-1537655780520-1e392ead81f2?w=600',
        type: 'PHYSICAL',
        category: 'Wooden & Activity Boards',
        stock: 15,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'sensory-sand-base-kit' },
      update: {},
      create: {
        title: 'Sensory Sand Base Kit',
        slug: 'sensory-sand-base-kit',
        description: 'Premium non-toxic sensory sand with base tray and exploration tools.',
        price: 29.99,
        coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600',
        type: 'PHYSICAL',
        category: 'Sensory Base Materials',
        stock: 25,
      },
    }),
  ])
  console.log(`✓ ${products.length} Products created`)

  // Sessions
  const sessions = await Promise.all([
    prisma.session.upsert({
      where: { slug: 'inclusive-classroom-strategies' },
      update: {},
      create: {
        title: 'Inclusive Classroom Strategies',
        slug: 'inclusive-classroom-strategies',
        description: 'Learn how to create a supportive environment for students with diverse sensory needs.',
        price: 35.00,
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        duration: 60,
        maxSlots: 30,
        host: 'Prof. Ama Osei',
        coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600'
      },
    }),
  ])
  console.log(`✓ ${sessions.length} sessions created`)

  console.log('✅ Seeding complete!')
  console.log('\nLogin credentials:')
  console.log('  Admin: admin@sensoryhouse.com / admin123!')
  console.log('  User:  demo@sensoryhouse.com  / user1234!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
