export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default async function ClientApi(path: string, init: RequestInit) {
  return await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
