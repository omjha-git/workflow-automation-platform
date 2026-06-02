import prisma from "@/lib/db";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

export const executionsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.execution.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          workflow: true,
        },
      });
    }),

  getMany: protectedProcedure.query(() => {
    return prisma.execution.findMany({
      orderBy: {
        startedAt: "desc",
      },
      include: {
        workflow: true,
      },
    });
  }),
});