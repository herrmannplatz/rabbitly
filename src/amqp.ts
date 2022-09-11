import { AMQPClient } from '@cloudamqp/amqp-client'
import type { AMQPBaseClient } from '@cloudamqp/amqp-client/types/amqp-base-client'

export type MessageHandler = (message: string | unknown) => Promise<void>

export async function connect(host: string) {
  const amqp = new AMQPClient(host)
  const connection = await amqp.connect()
  console.log('🚀 Connected to host', host)
  return connection
}

async function createChannel(connection: AMQPBaseClient) {
  const channel = await connection.channel()
  return channel
}

export async function consume(
  connection: AMQPBaseClient,
  exchange: { name: string },
  queue: string,
  config: {
    prefetch?: number
    routingKey?: string
    noAck?: boolean
    json?: boolean
  },
  handler: (message: string | unknown) => Promise<void>,
) {
  const channel = await createChannel(connection)

  if (config.prefetch) {
    await channel.prefetch(config.prefetch)
  }

  const q = await channel.queue(queue)
  await q.bind(exchange.name, config.routingKey ?? '')

  console.log(
    `🔊 Created to queue ${queue} on exchange ${exchange.name} with bindkey ${config.routingKey}`,
  )

  const consumer = await q.subscribe({ noAck: config.noAck }, async (msg) => {
    const bodyString = msg.bodyToString()
    const body = config.json && bodyString ? JSON.parse(bodyString) : bodyString

    if (config.noAck === false) {
      try {
        await handler(body)
        await msg.ack()
      } catch (err) {
        await msg.nack()
      }
    } else {
      return await handler(body)
    }
  })

  await consumer.wait()
}
