import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create categories
  const tshirtsCategory = await prisma.category.upsert({
    where: { name: 'T-shirts' },
    update: {},
    create: {
      name: 'T-shirts',
      description: 'Comfortable and stylish t-shirts for everyday wear',
      image: '/images/categories/tshirts.jpg',
    },
  })

  const shoesCategory = await prisma.category.upsert({
    where: { name: 'Shoes' },
    update: {},
    create: {
      name: 'Shoes',
      description: 'High-quality footwear for all occasions',
      image: '/images/categories/shoes.jpg',
    },
  })

  // Create products for T-shirts category
  const tshirt1 = await prisma.product.create({
    data: {
      name: 'Classic White T-shirt',
      description: 'A comfortable and versatile white t-shirt made from 100% cotton',
      price: 29.99,
      stock: 100,
      images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
      categoryId: tshirtsCategory.id,
    },
  })

  const tshirt2 = await prisma.product.create({
    data: {
      name: 'Black Graphic T-shirt',
      description: 'Stylish black t-shirt with a unique graphic design',
      price: 34.99,
      stock: 75,
      images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
      categoryId: tshirtsCategory.id,
    },
  })

  // Create products for Shoes category
  const shoe1 = await prisma.product.create({
    data: {
      name: 'Classic Sneakers',
      description: 'Comfortable and durable sneakers for everyday wear',
      price: 89.99,
      stock: 50,
      images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
      categoryId: shoesCategory.id,
    },
  })

  const shoe2 = await prisma.product.create({
    data: {
      name: 'Running Shoes',
      description: 'Lightweight and supportive running shoes for athletes',
      price: 119.99,
      stock: 40,
      images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
      categoryId: shoesCategory.id,
    },
  })

  console.log({ admin, user, tshirtsCategory, shoesCategory, tshirt1, tshirt2, shoe1, shoe2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 