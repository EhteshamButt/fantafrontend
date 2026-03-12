const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Send HttpOnly cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api("/auth/login", { method: "POST", body: { email, password } }),

  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api("/auth/register", { method: "POST", body: data }),

  profile: () => api("/auth/profile"),

  refresh: () => api("/auth/refresh", { method: "POST" }),

  logout: () => api("/auth/logout", { method: "POST" }),
};
