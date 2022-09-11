import { Static, Type } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

class ValidationError extends Error {
  constructor(errors: ValueError[]) {
    const message = [
      'Config validation failed',
      ...errors.map((error) => {
        return `❌ ${error.message} for at ${error.path}`
      }),
    ].join('\n')
    super(message)
    this.name = 'ValidationError'
  }
}

export const Configuration = Type.Object({
  version: Type.Literal(1),
  host: Type.String(),
  exchange: Type.Object({
    name: Type.String(),
    queues: Type.Record(
      Type.String(),
      Type.Object({
        handler: Type.String(),
        json: Type.Optional(Type.Boolean()),
        routingKey: Type.Optional(Type.String()),
        noAck: Type.Optional(Type.Boolean()),
      }),
    ),
  }),
})

type Configuration = Static<typeof Configuration>

export function validateConfiguration(config: unknown): Configuration {
  const [...errors] = Value.Errors(Configuration, config)
  if (errors.length === 0) {
    return config as Configuration
  }
  throw new ValidationError(errors)
}
