export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
console.log("Using API URL:", API_URL);

if (process.env.NODE_ENV === "production" && API_URL.includes("localhost")) {
  console.warn(
    "WARNING: You are running in production mode but connecting to localhost. " +
    "Please set the NEXT_PUBLIC_API_URL environment variable."
  );
}

export async function apiGet(path: string) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}${path}`, { headers });
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPut(path: string, body: any) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path: string) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
}
