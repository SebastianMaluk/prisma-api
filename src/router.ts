// 1. CONTEXT
import { prisma } from './db'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export type Context = {
  req: FastifyRequest
  res: FastifyReply
  prisma: typeof prisma
}

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  return { req, res, prisma }
}

// 2. INITIALIZATION
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { OpenApiMeta } from 'trpc-openapi'

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    transformer: superjson,
    errorFormatter: ({ error, shape }) => {
      if (error.code === 'INTERNAL_SERVER_ERROR' && process.env.NODE_ENV === 'production') {
        return { ...shape, message: 'Internal server error' }
      }
      return shape
    }
  })

// 3. ROUTER & PROCEDURE

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure

import { studentsRouter } from './routers/students'
import { groupsRouter } from './routers/groups'
import { evaluationsRouter } from './routers/evaluations'

export const appRouter = t.router({
  students: studentsRouter,
  groups: groupsRouter,
  evaluations: evaluationsRouter
})

export type AppRouter = typeof appRouter
