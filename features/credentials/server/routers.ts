import prisma from "@/lib/db";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
   baseProcedure,
} from "@/trpc/init";

const credentialTypes = ["OPENAI", "ANTHROPIC", "GEMINI"] as const;

export const credentialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(credentialTypes),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name, type, value } = input;

      return prisma.credential.create({
        data: {
          name,
          type,
          value,
          userId: ctx.auth.user.id,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(credentialTypes),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, type, value } = input;

      return prisma.credential.update({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          type,
          value,
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        select: {
          id: true,
          name: true,
          type: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  getMany: baseProcedure
  .input(
    z.object({
      page: z.number().default(1),
      pageSize: z.number().default(10),
      search: z.string().default(""),
    })
  )
  .query(async ({ input }) => {
    const where = {
      name: {
        contains: input.search,
        mode: "insensitive" as const,
      },
    };

    const [items, total] = await Promise.all([
      prisma.credential.findMany({
        where,
        orderBy: {
          updatedAt: "desc",
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.credential.count({ where }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / input.pageSize),
    };
  }),

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum(credentialTypes),
      })
    )
    .query(async ({ input, ctx }) => {
      const { type } = input;

      const credentials = await prisma.credential.findMany({
        where: {
          type,
          userId: ctx.auth.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          name: true,
          type: true,
        },
      });

      return credentials;
    }),
});