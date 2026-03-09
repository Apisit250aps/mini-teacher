import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import openapiTS, {
  astToString,
  type OpenAPITSOptions,
  type SchemaObject,
} from 'openapi-typescript'

type ScalarMappings = Partial<Record<string, string>>

type GeneratorApiConfig = {
  openapiInput: string
  outputFile: string
  scalarMappings: ScalarMappings
}

const DEFAULT_CONFIG: GeneratorApiConfig = {
  openapiInput: 'src/lib/spec/schema/openapi.yaml',
  outputFile: 'src/lib/client/api/v1.d.ts',
  scalarMappings: {
    'date-time': 'Date',
    date: 'string',
  },
}

const CONFIG_ENV_KEY = 'GEN_API_CONFIG'

function toAbsolutePath(relativeOrAbsolute: string): string {
  return path.isAbsolute(relativeOrAbsolute)
    ? relativeOrAbsolute
    : path.resolve(relativeOrAbsolute)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function mergeMappings(
  base: ScalarMappings,
  extra: ScalarMappings | undefined,
): ScalarMappings {
  return {
    ...base,
    ...(extra ?? {}),
  }
}

function createTypeNode(typeName: string): ts.TypeNode {
  const normalized = typeName.trim()
  switch (normalized) {
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    case 'number':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
    case 'boolean':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
    case 'unknown':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
    case 'any':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
    default:
      return ts.factory.createTypeReferenceNode(normalized)
  }
}

async function loadConfig(): Promise<GeneratorApiConfig> {
  const configPathFromEnv = asString(process.env[CONFIG_ENV_KEY])
  const configPath = toAbsolutePath(
    configPathFromEnv ?? 'scripts/generator-api.config.json',
  )

  let userConfig: Partial<GeneratorApiConfig> = {}

  try {
    const configRaw = await fs.readFile(configPath, 'utf8')
    userConfig = JSON.parse(configRaw) as Partial<GeneratorApiConfig>
  } catch (error) {
    const errorLike = error as NodeJS.ErrnoException
    if (errorLike.code !== 'ENOENT') {
      throw error
    }
  }

  const envOpenApiInput = asString(process.env.GEN_API_INPUT)
  const envOutputFile = asString(process.env.GEN_API_OUTPUT)
  const envDateTimeType = asString(process.env.GEN_API_DATE_TIME_TYPE)
  const envDateType = asString(process.env.GEN_API_DATE_TYPE)

  const config: GeneratorApiConfig = {
    openapiInput:
      envOpenApiInput ?? userConfig.openapiInput ?? DEFAULT_CONFIG.openapiInput,
    outputFile:
      envOutputFile ?? userConfig.outputFile ?? DEFAULT_CONFIG.outputFile,
    scalarMappings: mergeMappings(
      mergeMappings(DEFAULT_CONFIG.scalarMappings, userConfig.scalarMappings),
      {
        ...(envDateTimeType ? { 'date-time': envDateTimeType } : {}),
        ...(envDateType ? { date: envDateType } : {}),
      },
    ),
  }

  return config
}

function createTransform(
  config: GeneratorApiConfig,
): OpenAPITSOptions['transform'] {
  const nullType = ts.factory.createLiteralTypeNode(ts.factory.createNull())

  return (schemaObject: SchemaObject) => {
    if (schemaObject.type !== 'string') {
      return undefined
    }

    const format = schemaObject.format
    if (!format) {
      return undefined
    }

    const mappedType = config.scalarMappings[format]
    if (!mappedType) {
      return undefined
    }

    const mappedTypeNode = createTypeNode(mappedType)
    return schemaObject.nullable
      ? ts.factory.createUnionTypeNode([mappedTypeNode, nullType])
      : mappedTypeNode
  }
}

async function main() {
  const config = await loadConfig()

  const openapiInputPath = toAbsolutePath(config.openapiInput)
  const outputFilePath = toAbsolutePath(config.outputFile)

  const ast = await openapiTS(pathToFileURL(openapiInputPath), {
    transform: createTransform(config),
  })

  const content = astToString(ast)

  await fs.mkdir(path.dirname(outputFilePath), { recursive: true })
  await fs.writeFile(outputFilePath, content, 'utf8')

  console.log(`API types generated at ${outputFilePath}`)
  console.log(`Mappings: ${JSON.stringify(config.scalarMappings)}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
