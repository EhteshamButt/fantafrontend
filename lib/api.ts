const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fantaapi.netlify.app/api";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

let isRefreshing = false;

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function clearAccessToken() {
  localStorage.removeItem("access_token");
}

async function rawFetch(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;
  const token = getAccessToken();

  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        const refreshData = await refreshRes.json();
        if (refreshData.accessToken) {
          setAccessToken(refreshData.accessToken);
        }
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

  register: (data: { email: string; password: string; name: string; phone?: string; referralCode?: string }) =>
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
  const doFetch = () => {
    const token = getAccessToken();
    return fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      body: formData,
    });
  };

  let res = await doFetch();

  if ((res.status === 401 || res.status === 403) && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshRes = await rawFetch("/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.accessToken) {
          setAccessToken(refreshData.accessToken);
        }
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
  id: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  method: "easypaisa" | "jazzcash";
  amount: number;
  trxId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  user?: { id: string; name: string; email: string };
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

export interface ReferralSettingRecord {
  id: string;
  type: "deposit_commission" | "plan_subscription" | "ptc_view";
  enabled: boolean;
  levels: { level: number; percentage: number }[];
}

export const referralSettingsApi = {
  getAll: () => api<ReferralSettingRecord[]>("/referral-settings"),

  updateLevels: (type: string, levels: { level: number; percentage: number }[]) =>
    api<ReferralSettingRecord>(`/referral-settings/${type}/levels`, {
      method: "PATCH",
      body: { levels },
    }),

  toggle: (type: string, enabled: boolean) =>
    api<ReferralSettingRecord>(`/referral-settings/${type}/toggle`, {
      method: "PATCH",
      body: { enabled },
    }),
};

export const withdrawalApi = {
  submit: (data: { method: string; amount: number }) =>
    api("/withdrawals/submit", { method: "POST", body: data }),

  myWithdrawals: () => api("/withdrawals/my"),
};
