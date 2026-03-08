import {
  DMMF,
  generatorHandler,
  GeneratorOptions,
} from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_OUTPUT_FILE_NAME = 'index.d.ts'
const DEFAULT_OUTPUT_DIR = '../src/core/domain/entities'

type NormalizedGeneratorConfig = {
  outputDir?: string
  emitRelations: boolean
  entitySuffix: string
}

const CONFIG_DEFAULTS: NormalizedGeneratorConfig = {
  outputDir: undefined,
  emitRelations: false,
  entitySuffix: '',
}

const CONFIG_TRANSLATOR = {
  outputDir: ['outputDir', 'outDir', 'outputDirectory'],
  emitRelations: [
    'emitRelations',
    'emitRelation',
    'relations',
    'includeRelations',
  ],
  entitySuffix: ['entitySuffix', 'suffix'],
} as const

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function pickConfigValue(
  rawConfig: Record<string, string | undefined>,
  aliases: readonly string[],
  allowEmpty = false,
): string | undefined {
  for (const key of aliases) {
    const value = rawConfig[key]
    if (typeof value === 'string') {
      const trimmedValue = value.trim()
      if (trimmedValue.length > 0 || allowEmpty) {
        return trimmedValue
      }
    }
  }
  return undefined
}

function translateGeneratorConfig(
  rawConfig: Record<string, string | undefined>,
): NormalizedGeneratorConfig {
  const outputDir =
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.outputDir) ||
    CONFIG_DEFAULTS.outputDir

  const emitRelations = parseBoolean(
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.emitRelations),
    CONFIG_DEFAULTS.emitRelations,
  )

  const entitySuffix =
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.entitySuffix, true) ??
    CONFIG_DEFAULTS.entitySuffix

  return {
    outputDir,
    emitRelations,
    entitySuffix,
  }
}

function resolveOutputFilePath(
  baseOutputPath: string,
  outputDirOverride?: string,
  schemaPath?: string,
): string {
  const schemaDir = schemaPath ? path.dirname(schemaPath) : process.cwd()
  const resolvedBaseOutputPath = path.isAbsolute(baseOutputPath)
    ? baseOutputPath
    : path.resolve(schemaDir, baseOutputPath)

  const baseHasExtension = path.extname(resolvedBaseOutputPath).length > 0
  const baseDir = baseHasExtension
    ? path.dirname(resolvedBaseOutputPath)
    : resolvedBaseOutputPath
  const fileName = baseHasExtension
    ? path.basename(resolvedBaseOutputPath)
    : DEFAULT_OUTPUT_FILE_NAME

  if (!outputDirOverride) {
    return path.join(baseDir, fileName)
  }

  const finalDir = path.isAbsolute(outputDirOverride)
    ? outputDirOverride
    : path.resolve(schemaDir, outputDirOverride)

  return path.join(finalDir, fileName)
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function mapScalarType(field: DMMF.Field): string {
  if (field.kind === 'enum') {
    return String(field.type)
  }

  switch (field.type) {
    case 'String':
      return 'string'
    case 'Int':
    case 'Float':
      return 'number'
    case 'BigInt':
      return 'bigint'
    case 'Boolean':
      return 'boolean'
    case 'DateTime':
      return 'Date'
    case 'Json':
      return 'unknown'
    case 'Bytes':
      return 'Uint8Array'
    case 'Decimal':
      return 'string'
    default:
      return 'unknown'
  }
}

function renderField(
  field: DMMF.Field,
  modelNames: Set<string>,
  emitRelations: boolean,
  entitySuffix: string,
): string | null {
  if (field.kind === 'object' && !emitRelations) {
    return null
  }

  const optionalToken = field.isRequired ? '' : '?'
  let fieldType: string

  if (field.kind === 'object') {
    const relationName = String(field.type)
    const relationType = modelNames.has(relationName)
      ? `${relationName}${entitySuffix}`
      : relationName

    if (field.isList) {
      fieldType = `${relationType}[]`
    } else {
      fieldType = `${relationType} | null`
    }
  } else {
    const scalarType = mapScalarType(field)
    const listSuffix = field.isList ? '[]' : ''
    const nullableSuffix = field.isRequired || field.isList ? '' : ' | null'
    fieldType = `${scalarType}${listSuffix}${nullableSuffix}`
  }

  return `  ${field.name}${optionalToken}: ${fieldType}`
}

function buildEntityFile(
  model: DMMF.Model,
  modelNames: Set<string>,
  emitRelations: boolean,
  entitySuffix: string,
): string {
  const interfaceName = `${model.name}${entitySuffix}`
  const lines: string[] = [
    '// Auto-generated from prisma/schema.prisma. Do not edit manually.',
    '',
    `export interface ${interfaceName} {`,
  ]

  for (const field of model.fields) {
    const rendered = renderField(field, modelNames, emitRelations, entitySuffix)
    if (rendered) {
      lines.push(rendered)
    }
  }

  lines.push('}')
  lines.push('')

  return `${lines.join('\n')}`
}

function buildEnumsFile(enums: readonly DMMF.DatamodelEnum[]): string {
  const lines: string[] = [
    '// Auto-generated from prisma/schema.prisma. Do not edit manually.',
    '',
  ]

  for (const enumType of enums) {
    const values = enumType.values.map((value) => `'${value.name}'`).join(' | ')
    lines.push(`export type ${enumType.name} = ${values}`)
    lines.push('')
  }

  return lines.join('\n')
}

function buildIndexFile(
  models: readonly DMMF.Model[],
  hasEnums: boolean,
  entitySuffix: string,
): string {
  const lines: string[] = [
    '// Auto-generated from prisma/schema.prisma. Do not edit manually.',
    '',
  ]

  if (hasEnums) {
    lines.push("export type * from './enums'")
  }

  for (const model of models) {
    const fileName = toKebabCase(model.name)
    const interfaceName = `${model.name}${entitySuffix}`
    lines.push(`export type { ${interfaceName} } from './${fileName}'`)
  }

  lines.push('')
  return lines.join('\n')
}

generatorHandler({
  onManifest() {
    return {
      defaultOutput: path.join(DEFAULT_OUTPUT_DIR, DEFAULT_OUTPUT_FILE_NAME),
      prettyName: 'Prisma Domain Entity Generator',
    }
  },

  async onGenerate(options: GeneratorOptions) {
    const baseOutputPath = options.generator.output?.value
    if (!baseOutputPath) {
      throw new Error('Generator output path is required.')
    }

    const normalizedConfig = translateGeneratorConfig(
      options.generator.config as Record<string, string | undefined>,
    )

    const outputFilePath = resolveOutputFilePath(
      baseOutputPath,
      normalizedConfig.outputDir,
      (options as { schemaPath?: string }).schemaPath,
    )

    const entitiesDir = path.dirname(outputFilePath)
    await fs.mkdir(entitiesDir, { recursive: true })

    const models = options.dmmf.datamodel.models
    const enums = options.dmmf.datamodel.enums
    const modelNames = new Set(models.map((model) => model.name))

    const writeJobs: Promise<void>[] = []

    if (enums.length > 0) {
      writeJobs.push(
        fs.writeFile(
          path.join(entitiesDir, 'enums.d.ts'),
          buildEnumsFile(enums),
          'utf8',
        ),
      )
    }

    for (const model of models) {
      const fileName = `${toKebabCase(model.name)}.d.ts`
      const filePath = path.join(entitiesDir, fileName)
      const fileContent = buildEntityFile(
        model,
        modelNames,
        normalizedConfig.emitRelations,
        normalizedConfig.entitySuffix,
      )

      writeJobs.push(fs.writeFile(filePath, fileContent, 'utf8'))
    }

    writeJobs.push(
      fs.writeFile(
        outputFilePath,
        buildIndexFile(models, enums.length > 0, normalizedConfig.entitySuffix),
        'utf8',
      ),
    )

    await Promise.all(writeJobs)

    logger.info(`Domain entities generated at ${entitiesDir}`)
  },
})
