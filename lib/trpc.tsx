"use client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

const isUnauthorized = (e: unknown) =>
  e instanceof TRPCClientError && e.data?.code === "UNAUTHORIZED";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: (n, e) => !isUnauthorized(e) && n < 2,
          },
        },
        // session expired: back to login instead of showing a broken page
        queryCache: new QueryCache({
          onError: (e) => {
            if (isUnauthorized(e)) window.location.assign("/login");
          },
        }),
      }),
  );
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
