import { IMGBB_KEY } from "./constants";

export interface ImgbbResult {
  url: string;
  thumbUrl: string;
  displayUrl: string;
  deleteUrl?: string;
}

export async function uploadToImgbb(file: File): Promise<ImgbbResult> {
  if (!IMGBB_KEY) {
    throw new Error(
      "imgbb API-Key fehlt. In .env VITE_IMGBB_KEY setzen und neu deployen."
    );
  }
  if (file.size > 30 * 1024 * 1024) {
    throw new Error("Datei zu groß (max 30 MB).");
  }

  const form = new FormData();
  form.append("key", IMGBB_KEY);
  form.append("image", file);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`imgbb error ${res.status}`);
  const data = await res.json();
  if (!data?.success) throw new Error(data?.error?.message ?? "Upload fehlgeschlagen");

  return {
    url: data.data.url as string,
    thumbUrl: data.data.thumb?.url as string,
    displayUrl: data.data.display_url as string,
    deleteUrl: data.data.delete_url as string,
  };
}
