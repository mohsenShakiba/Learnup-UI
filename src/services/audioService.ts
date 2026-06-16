const blobUrlCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

export async function playAudio(url: string): Promise<void> {
  let blobUrl = blobUrlCache.get(url);

  if (!blobUrl) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch audio: ${url}`);
    blobUrl = URL.createObjectURL(await response.blob());
    blobUrlCache.set(url, blobUrl);
  }

  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(blobUrl);
  await currentAudio.play();
}
