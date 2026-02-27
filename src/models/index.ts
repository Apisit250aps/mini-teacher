import { prisma } from '@/lib/prisma'
import yearRepository from '@/repositories/year.repo'

// export * from '@/models/entities'
// export * from '@/models/repositories'

const main = async () => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })
  // Initialize database connection or any other setup if needed
  const year = await yearRepository.create({
    year: 0,
    term: 0,
    owner: { connect: { id: user.id } },
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
