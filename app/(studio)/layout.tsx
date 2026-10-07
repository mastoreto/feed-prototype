import { AdBlockGate } from "@/features/ads/AdBlockGate";
import { Providers } from "@/lib/trpc";

// Everything under (studio) is the tool itself: it needs data providers and the ad-block wall.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdBlockGate>
      <Providers>{children}</Providers>
    </AdBlockGate>
  );
}
