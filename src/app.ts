import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import Fastify from 'fastify'
import { fastifyTRPCOpenApiPlugin } from './fastify'
// import from local file while we wait for the PR to be merged
// https://github.com/jlalmes/trpc-op

import { openApiDocument } from './openapi'
import { appRouter, createContext } from './router'

const app = Fastify()

async function main() {
  // Setup CORS
  await app.register(cors)

  // Handle incoming tRPC requests
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWss: false,
    trpcOptions: { router: appRouter, createContext }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  // Handle incoming OpenAPI requests
  await app.register(fastifyTRPCOpenApiPlugin, {
    basePath: '/api',
    router: appRouter,
    createContext
  })

  // Serve the OpenAPI document
  app.get('/openapi.json', () => openApiDocument)

  // Server Swagger UI
  // Register Swagger UI
  app.register(import('@fastify/swagger'), {
    mode: 'static',
    specification: { document: openApiDocument }
  })
  app.register(import('@fastify/swagger-ui'), {
    prefix: '/docs',
    uiConfig: {}
  })

  await app
    .listen({ port: 3000 })
    .then((address) => {
      app.swagger()
      console.log(`Server started on ${address}\nSwagger UI: http://localhost:3000/docs`)
    })
    .catch((e) => {
      throw e
    })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
