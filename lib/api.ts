const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fantaapi.netlify.app/api";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

let isRefreshing = false;

async function rawFetch(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;

  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function api<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  let res = await rawFetch(endpoint, options);

  // Auto-refresh on 401 (expired) or 403 (stale role in JWT) — retry once
  if (
    (res.status === 401 || res.status === 403) &&
    !isRefreshing &&
    !endpoint.includes("/auth/refresh") &&
    !endpoint.includes("/auth/login")
  ) {
    isRefreshing = true;
    try {
      const refreshRes = await rawFetch("/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        res = await rawFetch(endpoint, options);
      }
    } finally {
      isRefreshing = false;
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api("/auth/login", { method: "POST", body: { email, password } }),

  register: (data: { email: string; password: string; name: string }) =>
    api("/auth/register", { method: "POST", body: data }),

  profile: () => api("/auth/profile"),

  refresh: () => api("/auth/refresh", { method: "POST" }),

  logout: () => api("/auth/logout", { method: "POST" }),
};

// For multipart/form-data uploads (file uploads)
export async function apiUpload<T = unknown>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const doFetch = () =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

  let res = await doFetch();

  if ((res.status === 401 || res.status === 403) && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshRes = await rawFetch("/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        res = await doFetch();
      }
    } finally {
      isRefreshing = false;
    }
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data as T;
}

export const paymentApi = {
  submit: (formData: FormData) => apiUpload("/payments/submit", formData),
  myPayments: () => api("/payments/my"),
};

export interface DashboardStats {
  totalUsers: number;
  totalDeposited: number;
  todayApprovedUsers: number;
  pendingRequests: number;
  rejectedUsers: number;
  referralCommissions: number;
  todayWithdrawals: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  totalTaskEarnings: number;
  manualAdditions: number;
  manualSubtractions: number;
  netManualBalance: number;
}

export interface WithdrawalRecord {
  _id: string;
  userId: { _id: string; name: string; email: string };
  method: "easypaisa" | "jazzcash";
  amount: number;
  trxId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  _id: string;
  userId: { _id: string; name: string; email: string };
  packageId: string;
  packageName: string;
  amount: number;
  trxId: string;
  senderNumber: string;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPayments {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminApi = {
  getUsers: () => api("/auth/users"),

  updateUserRole: (userId: string, role: string) =>
    api(`/auth/users/${userId}/role`, { method: "PATCH", body: { role } }),

  getStats: () => api<DashboardStats>("/admin/stats"),

  getAllPayments: (page = 1, limit = 20) =>
    api<PaginatedPayments>(`/admin/payments?page=${page}&limit=${limit}`),

  getPendingPayments: () => api<PaymentRecord[]>("/admin/payments/pending"),

  updatePaymentStatus: (paymentId: string, status: string) =>
    api(`/admin/payments/${paymentId}/status`, {
      method: "PATCH",
      body: { status },
    }),

  getApprovedUsers: () => api("/admin/users/approved"),

  getTodayApprovedUsers: () => api("/admin/users/today-approved"),

  getRejectedUsers: () => api("/admin/users/rejected"),

  getPendingWithdrawals: () =>
    api<WithdrawalRecord[]>("/withdrawals/pending"),

  getPendingWithdrawalCount: () =>
    api<{ count: number }>("/withdrawals/pending/count"),

  getAllWithdrawals: () =>
    api<WithdrawalRecord[]>("/withdrawals/all"),

  getTodayApprovedWithdrawals: () =>
    api<WithdrawalRecord[]>("/withdrawals/today-approved"),

  updateWithdrawalStatus: (id: string, status: string) =>
    api(`/withdrawals/${id}/status`, { method: "PATCH", body: { status } }),
};

export const withdrawalApi = {
  submit: (data: { method: string; amount: number }) =>
    api("/withdrawals/submit", { method: "POST", body: data }),

  myWithdrawals: () => api("/withdrawals/my"),
};
