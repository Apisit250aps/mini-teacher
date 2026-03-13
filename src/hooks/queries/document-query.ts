import type {
  DocumentCreateData,
  DocumentQuery,
  DocumentUpdateData,
  DocumentWithAcceptances,
} from '@/core/domain/data'
import type { Document } from '@/core/domain/entities'
import type {
  DocumentType,
  DocumentLanguage,
} from '@/core/domain/entities/enums'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export const useDocumentListQuery = (filter?: DocumentQuery) => {
  const list = useApiQueryWithDates(
    'get',
    '/document',
    {
      params: {
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<Document[]>(res, []),
    },
  )

  return {
    data: list.data ?? [],
    isLoading: list.isPending,
    query: list,
  }
}

export const useDocumentByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/document/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<DocumentWithAcceptances | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useDocumentLatestByTypeQuery = (
  latestType: DocumentType,
  lang?: DocumentLanguage,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/document/latest',
    {
      params: {
        query: { latestType, ...(lang ? { lang } : {}) },
      },
    },
    {
      select: (res) => selectData<Document | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export type DocumentMutations = {
  create: (data: DocumentCreateData) => Promise<Document>
  update: (id: string, data: DocumentUpdateData) => Promise<Document>
  remove: (id: string) => Promise<void>
}

export const useDocumentMutations = (): DocumentMutations => {
  const createMutation = useApiMutationWithDates('post', '/document')
  const updateMutation = useApiMutationWithDates('patch', '/document/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/document/{id}')

  const create = (data: DocumentCreateData) =>
    mutateApiData<Document, { body: DocumentCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create document',
      },
    )

  const update = (id: string, data: DocumentUpdateData) =>
    mutateApiData<
      Document,
      { params: { path: { id: string } }; body: DocumentUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update document',
      },
    )

  const remove = (id: string) =>
    mutateApiSuccess<{ params: { path: { id: string } } }>(
      deleteMutation.mutateAsync,
      {
        params: { path: { id } },
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to delete document',
      },
    )

  return { create, update, remove }
}
