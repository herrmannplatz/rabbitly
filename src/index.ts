import * as dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import yaml from 'js-yaml'
import { validateConfiguration } from './config'
import { connect, consume } from './amqp'

const CONFIG_FILE = 'rabbitly.yaml'

function loadHandler(handler: string) {
  const [file, method] = handler.split('.')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(process.cwd() + `/${file}`)[method]
}

function loadConfigurationFile() {
  return fs.readFile(path.resolve(CONFIG_FILE), 'utf8')
}

function replaceEnvironmentVariables(file: string) {
  return file.replace(/\${([a-zA-Z_]+[a-zA-Z0-9_]*)}/g, (_, variable) => {
    if (typeof process.env[variable] == 'string') {
      return '' + process.env[variable]
    }
    throw Error(`Failed to replace env var ${variable}`)
  })
}

function parseConfiguration(file: string) {
  return yaml.load(file)
}

export default async function rabbitly() {
  dotenv.config()

  const configuration = await loadConfigurationFile()
    .then(replaceEnvironmentVariables)
    .then(parseConfiguration)
    .then(validateConfiguration)

  const connection = await connect(configuration.host)

  Object.entries(configuration.exchange.queues).forEach(([queue, config]) => {
    const handler = loadHandler(config.handler)
    consume(connection, configuration.exchange, queue, config, handler)
  })
}

export type { MessageHandler } from './amqp'
