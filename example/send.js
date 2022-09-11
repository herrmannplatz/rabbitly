#!/usr/bin/env node

const { AMQPClient } = require('@cloudamqp/amqp-client')
const exchange = process.argv[2] || 'logs'

async function send() {
  const amqp = new AMQPClient('amqp://localhost')
  const conn = await amqp.connect()
  const ch = await conn.channel()
  await ch.exchangeDeclare(exchange, 'topic')

  setInterval(() => {
    const severity = ['error', 'warning', 'info']
      .sort(() => Math.random() - 0.5)
      .pop()

    const msg = JSON.stringify({
      timestamp: new Date().toISOString(),
      severity,
      exchange,
    })

    ch.basicPublish(exchange, `logs.${severity}`, Buffer.from(msg))
  }, 10000)
}

send()
