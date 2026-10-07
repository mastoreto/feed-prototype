import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const pin = z.object({
  id: z.string().max(64),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  text: z.string().max(300),
});

const post = z.object({
  format: z.enum(["post", "carousel", "story", "reel", "doc"]),
  caption: z.string().max(3000),
  hashtags: z.string().max(500),
  notes: z.string().max(2000),
  media: z.array(z.string().max(900_000)).max(10), // ponytail: data URLs in DB; move to object storage if rows get heavy
  pins: z.array(pin).max(12).default([]),
  scheduledAt: z.date().nullable(),
});

export const campaignRouter = router({
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.campaign.findFirstOrThrow({
        where: { id: input.id, client: { userId: ctx.user.id } },
        include: { client: true, posts: { orderBy: { order: "asc" } } },
      }),
    ),
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        name: z.string().trim().min(1).max(80),
        platform: z.enum(["INSTAGRAM", "LINKEDIN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.client.findFirstOrThrow({
        where: { id: input.clientId, userId: ctx.user.id },
      });
      return ctx.db.campaign.create({ data: input });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.campaign.deleteMany({
        where: { id: input.id, client: { userId: ctx.user.id } },
      }),
    ),
  // ponytail: replace-all keeps order logic trivial; switch to per-post upserts if posts get large
  savePosts: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1).max(80),
        posts: z.array(post).max(60),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.campaign.findFirstOrThrow({
        where: { id: input.id, client: { userId: ctx.user.id } },
      });
      await ctx.db.$transaction([
        ctx.db.post.deleteMany({ where: { campaignId: input.id } }),
        ctx.db.post.createMany({
          data: input.posts.map((p, order) => ({
            ...p,
            order,
            campaignId: input.id,
          })),
        }),
        ctx.db.campaign.update({
          where: { id: input.id },
          data: { name: input.name },
        }),
      ]);
    }),
});
