# rabbitly 🚅🐰💨

> configuration based ampq message handling

❗️Still in development

## Install

`npm install herrmannplatz/rabbitly`

## Usage

Place a `rabbitly.yaml` in the root of you project.

```yaml
version: 1

host: amqp://localhost

exchange:
  name: logs
  queues:
    errors:
      routingKey: logs.error
      handler: handler.errors
      json: true
```

If you prefer editor support when writing your configuration, reference the schema in your configuration file and install [YAML vscode extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

```yaml
# yaml-language-server: $schema=node_modules/rabbitly/schema.json
version: 1

host: ${RABBITMQ_URI}

exchange:
  name: logs
```

Specify the handler file `handler.js` with exports the specified handler functions.

```js
module.exports.errors = async (message) => {
  console.error('💥', message)
}
```

Run it.

```json
{
  "scripts": {
    "start": "rabbitly"
  }
}
```
