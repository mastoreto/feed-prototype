// Authorised-sellers file required by AdSense: https://support.google.com/adsense/answer/12171612
export function GET() {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.replace("ca-", "");
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Set NEXT_PUBLIC_ADSENSE_CLIENT to publish ads.txt\n";
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
