import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { Document } from '@/core/domain/entities/document'
import type { DocumentWithAcceptances } from '@/core/domain/data/document'
import type { DocumentRepository } from '@/core/domain/repositories/document'

const documentRepository: DocumentRepository = {
  getAll: async (filter = {}) => {
    const documents = await prisma.document.findMany(
      filter as unknown as Prisma.DocumentFindManyArgs,
    )
    return documents as unknown as Document[]
  },

  getById: async (id) => {
    const document = await prisma.document.findUnique({
      where: { id },
      include: { acceptances: true },
    })
    return document as unknown as DocumentWithAcceptances | null
  },

  getLatestByType: async (type) => {
    const document = await prisma.document.findFirst({
      where: { type, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return document as unknown as Document | null
  },

  create: async (data) => {
    const document = await prisma.document.create({
      data: {
        type: data.type,
        version: data.version,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    })
    return document as unknown as Document
  },

  update: async (id, data) => {
    const document = await prisma.document.update({
      where: { id },
      data: {
        content: data.content,
        isActive: data.isActive,
      },
    })
    return document as unknown as Document
  },

  delete: async (id) => {
    await prisma.document.delete({ where: { id } })
  },
}

export default documentRepository
