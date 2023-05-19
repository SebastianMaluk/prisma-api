import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../router'

export const studentsRouter = createTRPCRouter({
  getStudents: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/students',
        tags: ['students'],
        summary: 'Get all students'
      }
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string()
        })
      )
    )
    .query(async ({ ctx }) => {
      const students = await ctx.prisma.student.findMany({})
      return students
    }),

  getStudentById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/students/{studentId}',
        tags: ['students'],
        summary: 'Get student by id'
      }
    })
    .input(
      z.object({
        studentId: z.number().int()
      })
    )
    .output(
      z.array(
        z.object({
          id: z.number().int(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string()
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findMany({
        where: {
          id: input.studentId
        }
      })
      return student
    }),

  deleteStudentById: publicProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/students/{studentId}',
        tags: ['students'],
        summary: 'Delete student by id'
      }
    })
    .input(
      z.object({
        studentId: z.number().int()
      })
    )
    .output(
      z.object({
        statusCode: z.number().int(),
        message: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.student.delete({
          where: {
            id: input.studentId
          }
        })
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Student not found'
        })
      }
      return {
        statusCode: 200,
        message: 'Student deleted'
      }
    })
})
