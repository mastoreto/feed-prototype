/** Resize an uploaded image to a JPEG data URL small enough to store with the post. */
export async function fileToJpeg(file: File, maxEdge = 1350): Promise<string> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d")?.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  let q = 0.85;
  let url = c.toDataURL("image/jpeg", q);
  while (url.length > 800_000 && q > 0.4) {
    q -= 0.1; // server cap is 900k chars
    url = c.toDataURL("image/jpeg", q);
  }
  return url;
}
