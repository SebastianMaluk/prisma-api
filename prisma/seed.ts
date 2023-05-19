import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.student.create({
    data: {
      firstName: 'Alice',
      lastName: 'Prisma',
      email: 'alice@prisma.io'
    }
  })

  const bob = await prisma.student.create({
    data: {
      firstName: 'Bob',
      lastName: 'Nexus',
      email: 'example@example.com'
    }
  })

  const eve = await prisma.student.create({
    data: {
      firstName: 'Eve',
      lastName: 'Ríos',
      email: 'test@test.com'
    }
  })

  const felipe = await prisma.student.create({
    data: {
      firstName: 'Felipe',
      lastName: 'Ríos',
      email: 'test2@test2.com'
    }
  })

  const group1 = await prisma.group.create({
    data: {
      name: 'Group 1',
      size: 0
    }
  })

  const group2 = await prisma.group.create({
    data: {
      name: 'Group 2',
      size: 0
    }
  })

  await prisma.group.update({
    where: { id: group1.id },
    data: {
      students: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: felipe.id }]
      }
    }
  })

  await prisma.group.update({
    where: { id: group2.id },
    data: {
      students: {
        connect: [{ id: eve.id }]
      }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
