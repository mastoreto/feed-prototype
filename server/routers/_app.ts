import { router } from "../trpc";
import { campaignRouter } from "./campaign";
import { clientRouter } from "./client";

export const appRouter = router({
  client: clientRouter,
  campaign: campaignRouter,
});
export type AppRouter = typeof appRouter;
