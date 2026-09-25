import { type SchemaTypeDefinition } from 'sanity'

import { readingTimeType } from '~/sanity/schemas/types/readingTime'

import blockContent, { downloadItem } from './schemas/blockContent'
import category from './schemas/category'
import donor from './schemas/donor'
import post from './schemas/post'
import project from './schemas/project'
import settings from './schemas/settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    readingTimeType,
    downloadItem,
    post,
    category,
    donor,
    blockContent,
    project,
    settings,
  ],
}
