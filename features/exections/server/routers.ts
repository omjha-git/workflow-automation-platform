import prisma from "@/lib/db";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { PAGINATION } from "@/config/constants";

export const executionsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return prisma.execution.findFirstOrThrow({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const where = {
        workflow: {
          userId: ctx.auth.user.id,
        },
      };

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        prisma.execution.count({
          where,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),
});