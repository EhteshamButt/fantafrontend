"use client";

import { FormEvent, useEffect, useState } from "react";
import { generalSettingsApi } from "@/lib/api";

export default function GeneralSettingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    siteTitle: "Fanta Earn",
    currency: "Rs",
    currencySymbol: "Rs",
    timezone: "Asia/Karachi",
    siteBaseColor: "e65353",
    siteSecondaryColor: "000000",
    registrationBonus: 50,
    defaultPlan: "None",
    balanceTransferFixedCharge: 2,
    balanceTransferPercentCharge: 2,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await generalSettingsApi.get();
      setForm({
        siteTitle: data.siteTitle || "Fanta Earn",
        currency: data.currency || "Rs",
        currencySymbol: data.currencySymbol || "Rs",
        timezone: data.timezone || "Asia/Karachi",
        siteBaseColor: (data.siteBaseColor || "e65353").replace("#", ""),
        siteSecondaryColor: (data.siteSecondaryColor || "000000").replace("#", ""),
        registrationBonus: Number(data.registrationBonus ?? 50),
        defaultPlan: data.defaultPlan || "None",
        balanceTransferFixedCharge: Number(data.balanceTransferFixedCharge ?? 2),
        balanceTransferPercentCharge: Number(data.balanceTransferPercentCharge ?? 2),
      });
    } catch {
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await generalSettingsApi.update({
        ...form,
        siteBaseColor: form.siteBaseColor.replace("#", ""),
        siteSecondaryColor: form.siteSecondaryColor.replace("#", ""),
      });
      setMessage("Settings updated successfully");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#e8e8ef] p-5 md:p-8">
      <h1 className="mb-8 text-3xl font-semibold text-slate-800">General Setting</h1>

      <div className="rounded-md border border-slate-200 bg-[#f2f2f5] p-4 md:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.siteTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, siteTitle: e.target.value }))}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-indigo-500"
                disabled={loading || saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-indigo-500"
                disabled={loading || saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currency Symbol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm((prev) => ({ ...prev, currencySymbol: e.target.value }))}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-indigo-500"
                disabled={loading || saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-indigo-500"
                disabled={loading || saving}
              >
                <option>Asia/Karachi</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Site Base Color</label>
              <div className="flex h-12 items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                <input
                  type="color"
                  value={`#${form.siteBaseColor}`}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      siteBaseColor: e.target.value.replace("#", ""),
                    }))
                  }
                  className="h-full w-28 cursor-pointer border-0 bg-transparent p-0"
                  disabled={loading || saving}
                />
                <input
                  type="text"
                  value={form.siteBaseColor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      siteBaseColor: e.target.value.replace("#", ""),
                    }))
                  }
                  className="h-full flex-1 border-0 px-4 text-slate-700 outline-none"
                  disabled={loading || saving}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Site Secondary Color</label>
              <div className="flex h-12 items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                <input
                  type="color"
                  value={`#${form.siteSecondaryColor}`}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      siteSecondaryColor: e.target.value.replace("#", ""),
                    }))
                  }
                  className="h-full w-28 cursor-pointer border-0 bg-transparent p-0"
                  disabled={loading || saving}
                />
                <input
                  type="text"
                  value={form.siteSecondaryColor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      siteSecondaryColor: e.target.value.replace("#", ""),
                    }))
                  }
                  className="h-full flex-1 border-0 px-4 text-slate-700 outline-none"
                  disabled={loading || saving}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Registration Bonus <span className="text-red-500">*</span>
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-slate-300 bg-white">
                <input
                  type="number"
                  value={form.registrationBonus}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      registrationBonus: Number(e.target.value || 0),
                    }))
                  }
                  className="h-full flex-1 border-0 px-4 text-slate-700 outline-none"
                  disabled={loading || saving}
                />
                <span className="flex items-center border-l border-slate-300 px-4 text-xl text-slate-700">Rs</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Default Plan</label>
              <select
                value={form.defaultPlan}
                onChange={(e) => setForm((prev) => ({ ...prev, defaultPlan: e.target.value }))}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-indigo-500"
                disabled={loading || saving}
              >
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Balance Transfer Fixed Charge <span className="text-red-500">*</span>
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-slate-300 bg-white">
                <input
                  type="number"
                  value={form.balanceTransferFixedCharge}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      balanceTransferFixedCharge: Number(e.target.value || 0),
                    }))
                  }
                  className="h-full flex-1 border-0 px-4 text-slate-700 outline-none"
                  disabled={loading || saving}
                />
                <span className="flex items-center border-l border-slate-300 px-4 text-2xl text-slate-700">Rs</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Balance Transfer Percent Charge <span className="text-red-500">*</span>
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-slate-300 bg-white">
                <input
                  type="number"
                  value={form.balanceTransferPercentCharge}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      balanceTransferPercentCharge: Number(e.target.value || 0),
                    }))
                  }
                  className="h-full flex-1 border-0 px-4 text-slate-700 outline-none"
                  disabled={loading || saving}
                />
                <span className="flex items-center border-l border-slate-300 px-4 text-2xl text-slate-700">%</span>
              </div>
            </div>
          </div>

          {message && (
            <p className="text-sm font-medium text-slate-700">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading || saving}
            className="h-12 w-full rounded-md bg-indigo-600 text-lg font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
