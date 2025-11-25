export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiGet(path: string) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}${path}`, { headers });
  return res.json();
}
