import type { Document } from '../entities/document'
import type { UserAcceptance } from '../entities/user-acceptance'
import type { DocumentType } from '../entities/enums'
import type { FindManyOptions } from './common'

export interface DocumentWithAcceptances extends Document {
  acceptances: UserAcceptance[]
}

export interface DocumentCreateData {
  type: DocumentType
  version: string
  content: string
  isActive?: boolean
}

export interface DocumentUpdateData {
  content?: string
  isActive?: boolean
}

export type DocumentQuery = FindManyOptions<
  Pick<Document, 'id' | 'type' | 'version' | 'isActive' | 'createdAt'>
>
