import {
  DMMF,
  generatorHandler,
  GeneratorOptions,
} from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import fs from 'node:fs/promises'
import path from 'node:path'

const RESERVED_IDENTIFIERS = new Set([
  'model',
  'enum',
  'namespace',
  'union',
  'interface',
  'scalar',
  'alias',
  'is',
  'extends',
  'import',
  'using',
  'op',
])

const DEFAULT_NAMESPACE = 'MiniTeacherService.PrismaModels'
const DEFAULT_OUTPUT_FILE_NAME = 'prisma-models.tsp'

type NormalizedGeneratorConfig = {
  namespace: string
  outputDir?: string
  emitRelations: boolean
  includeDbMap: boolean
}

const CONFIG_DEFAULTS: NormalizedGeneratorConfig = {
  namespace: DEFAULT_NAMESPACE,
  outputDir: undefined,
  emitRelations: false,
  includeDbMap: true,
}

// Translate incoming prisma generator config keys into one normalized shape.
const CONFIG_TRANSLATOR = {
  namespace: ['namespace', 'ns'],
  outputDir: ['outputDir', 'outDir', 'outputDirectory'],
  emitRelations: [
    'emitRelations',
    'emitRelation',
    'relations',
    'includeRelations',
  ],
  includeDbMap: ['includeDbMap', 'dbMap', 'includeDatabaseMap', 'emitDbMap'],
} as const

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function pickConfigValue(
  rawConfig: Record<string, string | undefined>,
  aliases: readonly string[],
): string | undefined {
  for (const key of aliases) {
    const value = rawConfig[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

function translateGeneratorConfig(
  rawConfig: Record<string, string | undefined>,
): NormalizedGeneratorConfig {
  const namespace =
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.namespace) ||
    CONFIG_DEFAULTS.namespace

  const outputDir =
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.outputDir) ||
    CONFIG_DEFAULTS.outputDir

  const emitRelations = parseBoolean(
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.emitRelations),
    CONFIG_DEFAULTS.emitRelations,
  )

  const includeDbMap = parseBoolean(
    pickConfigValue(rawConfig, CONFIG_TRANSLATOR.includeDbMap),
    CONFIG_DEFAULTS.includeDbMap,
  )

  return {
    namespace,
    outputDir,
    emitRelations,
    includeDbMap,
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

function escapeIdentifier(name: string): string {
  const valid = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name)
  if (valid && !RESERVED_IDENTIFIERS.has(name)) {
    return name
  }
  return `\`${name}\``
}

function escapeDoc(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function formatComment(
  comment: string | null | undefined,
  indent = '',
): string[] {
  if (!comment) return []

  const lines = comment
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) return []
  return lines.map((line) => `${indent}@doc("${escapeDoc(line)}")`)
}

function mapScalarType(field: DMMF.Field): string {
  if (field.kind === 'enum' || field.kind === 'object') {
    return escapeIdentifier(String(field.type))
  }

  switch (field.type) {
    case 'String':
      return 'string'
    case 'Int':
      return 'int32'
    case 'BigInt':
      return 'int64'
    case 'Float':
      return 'float64'
    case 'Boolean':
      return 'boolean'
    case 'DateTime':
      return 'utcDateTime'
    case 'Json':
      return 'unknown'
    case 'Bytes':
      return 'bytes'
    case 'Decimal':
      return 'string'
    default:
      return 'unknown'
  }
}

function renderField(
  field: DMMF.Field,
  emitRelations: boolean,
  includeDbMap: boolean,
): string[] {
  if (field.kind === 'object' && !emitRelations) {
    return []
  }

  const lines: string[] = []
  lines.push(...formatComment(field.documentation, '  '))

  if (includeDbMap && field.dbName && field.dbName !== field.name) {
    lines.push(`  @doc("DB column: ${escapeDoc(field.dbName)}")`)
  }

  const fieldName = escapeIdentifier(field.name)
  const baseType = mapScalarType(field)
  const listSuffix = field.isList ? '[]' : ''

  if (field.isId) {
    lines.push('  @key')
  }

  if (field.kind === 'object') {
    if (field.isList) {
      lines.push(`  ${fieldName}?: ${baseType}${listSuffix};`)
    } else {
      lines.push(`  ${fieldName}?: ${baseType} | null;`)
    }
    return lines
  }

  const optionalToken = field.isRequired ? '' : '?'
  const nullableSuffix = field.isRequired || field.isList ? '' : ' | null'
  lines.push(
    `  ${fieldName}${optionalToken}: ${baseType}${listSuffix}${nullableSuffix};`,
  )
  return lines
}

function renderEnum(enumType: DMMF.DatamodelEnum): string[] {
  const lines: string[] = []
  lines.push(...formatComment(enumType.documentation))
  lines.push(`enum ${escapeIdentifier(enumType.name)} {`)

  for (const value of enumType.values) {
    lines.push(
      ...formatComment(
        (value as { documentation?: string }).documentation,
        '  ',
      ),
    )
    lines.push(`  ${escapeIdentifier(value.name)},`)
  }

  lines.push('}')
  lines.push('')
  return lines
}

function renderModel(
  model: DMMF.Model,
  emitRelations: boolean,
  includeDbMap: boolean,
): string[] {
  const lines: string[] = []
  lines.push(...formatComment(model.documentation))

  if (includeDbMap && model.dbName && model.dbName !== model.name) {
    lines.push(`@doc("DB table: ${escapeDoc(model.dbName)}")`)
  }

  lines.push(`model ${escapeIdentifier(model.name)} {`)

  for (const field of model.fields) {
    lines.push(...renderField(field, emitRelations, includeDbMap))
  }

  lines.push('}')
  lines.push('')
  return lines
}

generatorHandler({
  onManifest() {
    return {
      defaultOutput: '../src/spec/models/generated/prisma-models.tsp',
      prettyName: 'Prisma TypeSpec Generator',
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
    const outputPath = resolveOutputFilePath(
      baseOutputPath,
      normalizedConfig.outputDir,
      (options as { schemaPath?: string }).schemaPath,
    )

    const lines: string[] = [
      '// Auto-generated from prisma/schema.prisma. Do not edit manually.',
      'import "@typespec/http";',
      'using TypeSpec.Http;',
      '',
      `namespace ${normalizedConfig.namespace};`,
      '',
    ]

    for (const enumType of options.dmmf.datamodel.enums) {
      lines.push(...renderEnum(enumType))
    }

    for (const model of options.dmmf.datamodel.models) {
      lines.push(
        ...renderModel(
          model,
          normalizedConfig.emitRelations,
          normalizedConfig.includeDbMap,
        ),
      )
    }

    const content = `${lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()}\n`
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, content, 'utf8')

    logger.info(`TypeSpec models generated at ${outputPath}`)
  },
})
