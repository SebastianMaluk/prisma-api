import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../router'

export const evaluationsRouter = createTRPCRouter({
  getEvaluations: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/evaluations',
        tags: ['evaluations'],
        summary: 'Get all evaluations'
      }
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          creationDate: z.date(),
          closingDate: z.date()
        })
      )
    )
    .query(async ({ ctx }) => {
      const evaluations = await ctx.prisma.evaluation.findMany({})
      return evaluations
    }),

  getEvaluationById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/evaluations/{evaluationId}',
        tags: ['evaluations'],
        summary: 'Get evaluation by id'
      }
    })
    .input(
      z.object({
        evaluationId: z.number().int()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          creationDate: z.date(),
          closingDate: z.date()
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const evaluation = await ctx.prisma.evaluation.findMany({
        where: {
          id: input.evaluationId
        }
      })
      return evaluation
    }),

  getEvaluationsActive: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/evaluations/active',
        tags: ['evaluations'],
        summary: 'Get active evaluations'
      }
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          creationDate: z.date(),
          closingDate: z.date()
        })
      )
    )
    .query(async ({ ctx }) => {
      // active evaluations are those that have a closing date in the future
      const evaluations = await ctx.prisma.evaluation.findMany({
        where: {
          closingDate: {
            gt: new Date()
          }
        }
      })
      return evaluations
    })
})
