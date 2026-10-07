import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const input = z.object({
  name: z.string().trim().min(1).max(80),
  handle: z.string().trim().min(1).max(40),
  industry: z.string().trim().max(60).optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#2B3BFF"),
});

export const clientRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.client.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        campaigns: {
          select: {
            id: true,
            name: true,
            platform: true,
            updatedAt: true,
            posts: {
              select: { media: true },
              orderBy: { order: "asc" },
              take: 3,
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    }),
  ),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.client.findFirstOrThrow({
        where: { id: input.id, userId: ctx.user.id },
        include: {
          campaigns: {
            orderBy: { updatedAt: "desc" },
            include: { _count: { select: { posts: true } } },
          },
        },
      }),
    ),
  create: protectedProcedure.input(input).mutation(({ ctx, input }) =>
    ctx.db.client.create({
      data: {
        ...input,
        handle: input.handle.replace(/^@/, ""),
        userId: ctx.user.id,
      },
    }),
  ),
  update: protectedProcedure
    .input(input.extend({ id: z.string() }))
    .mutation(({ ctx, input: { id, ...data } }) =>
      // updateMany keeps the ownership check in the WHERE clause
      ctx.db.client.updateMany({
        where: { id, userId: ctx.user.id },
        data: { ...data, handle: data.handle.replace(/^@/, "") },
      }),
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.client.deleteMany({
        where: { id: input.id, userId: ctx.user.id },
      }),
    ),
});
