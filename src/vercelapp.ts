import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { FastifyInstance } from 'fastify'
import { fastifyTRPCOpenApiPlugin } from './fastify'

import { openApiDocument } from './openapi'
import { appRouter, createContext } from './router'

export default async function main(fastify: FastifyInstance) {
  // Setup CORS
  await fastify.register(cors)

  // Handle incoming tRPC requests
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWss: false,
    trpcOptions: { router: appRouter, createContext }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  // Handle incoming OpenAPI requests
  await fastify.register(fastifyTRPCOpenApiPlugin, {
    basePath: '/api',
    router: appRouter,
    createContext
  })

  // Serve the OpenAPI document
  fastify.get('/openapi.json', () => openApiDocument)

  // Server Swagger UI
  // Register Swagger UI
  fastify.register(import('@fastify/swagger'), {
    mode: 'static',
    specification: { document: openApiDocument }
  })
  fastify.register(import('@fastify/swagger-ui'), {
    prefix: '/docs',
    uiConfig: {}
  })

  fastify.ready().then(() => {
    fastify.swagger()
  })
}
