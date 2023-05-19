'use strict'

// Read the .env file.
import * as dotenv from 'dotenv'
dotenv.config()

// Require the framework
import Fastify from 'fastify'

// Instantiate Fastify with some config
const app = Fastify({
  logger: true
})(
  // Register your application as a normal plugin.
  import('../dist/src/app')
).then((module) => {
  app.register(module.default)
})

export default async (req, res) => {
  await app.ready()
  app.server.emit('request', req, res)
}
