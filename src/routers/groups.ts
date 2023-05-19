import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../router'

export const groupsRouter = createTRPCRouter({
  getAllGroups: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/groups',
        tags: ['groups'],
        summary: 'Get all groups'
      }
    })
    .input(
      z.object({
        groupId: z.number().int().optional()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          size: z.number().int()
        })
      )
    )
    .query(async ({ ctx }) => {
      const groups = await ctx.prisma.group.findMany()
      return groups
    }),

  getGroupById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/groups/{groupId}',
        tags: ['groups'],
        summary: 'Get group by id'
      }
    })
    .input(
      z.object({
        groupId: z.number().int()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          size: z.number().int()
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findMany({
        where: {
          id: input.groupId
        }
      })
      return group
    }),

  getGroupDetailsById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/groups/{groupId}/details',
        tags: ['groups'],
        summary: 'Get group details'
      }
    })
    .input(
      z.object({
        groupId: z.number().int()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          size: z.number().int(),
          students: z.array(
            z.object({
              id: z.number().int(),
              firstName: z.string(),
              lastName: z.string(),
              email: z.string()
            })
          )
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findMany({
        where: {
          id: input.groupId
        },
        include: {
          students: true
        }
      })
      return group
    }),

  createGroup: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/groups',
        tags: ['groups'],
        summary: 'Create group'
      }
    })
    .input(
      z.object({
        name: z.string(),
        size: z.number().int()
      })
    )
    .output(
      z.object({
        id: z.number().int(),
        name: z.string(),
        size: z.number().int()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          size: input.size
        }
      })
      return group
    })
})
