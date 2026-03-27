"use client";

import { useEffect, useState } from "react";
import { referralSettingsApi, ReferralSettingRecord } from "../../../lib/api";

const TYPE_LABELS: Record<string, string> = {
  deposit_commission: "Deposit Commission",
  plan_subscription: "Plan Subscription",
  ptc_view: "PTC View",
};

interface CardState {
  numLevels: string;
  generatedLevels: { level: number; percentage: string }[];
  saving: boolean;
}

export default function ReferralCommissionsPage() {
  const [settings, setSettings] = useState<ReferralSettingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await referralSettingsApi.getAll();
      setSettings(data);
      const states: Record<string, CardState> = {};
      data.forEach((s) => {
        states[s.type] = { numLevels: "", generatedLevels: [], saving: false };
      });
      setCardStates(states);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(type: string, currentEnabled: boolean) {
    try {
      const updated = await referralSettingsApi.toggle(type, !currentEnabled);
      setSettings((prev) =>
        prev.map((s) => (s.type === type ? updated : s))
      );
    } catch {
      // ignore
    }
  }

  function handleGenerate(type: string) {
    const state = cardStates[type];
    if (!state) return;
    const num = parseInt(state.numLevels);
    if (!num || num < 1) return;

    const generated = Array.from({ length: num }, (_, i) => ({
      level: i + 1,
      percentage: "",
    }));

    setCardStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], generatedLevels: generated },
    }));
  }

  function handlePercentageChange(type: string, index: number, value: string) {
    setCardStates((prev) => {
      const updated = { ...prev[type] };
      updated.generatedLevels = [...updated.generatedLevels];
      updated.generatedLevels[index] = {
        ...updated.generatedLevels[index],
        percentage: value,
      };
      return { ...prev, [type]: updated };
    });
  }

  function handleRemoveLevel(type: string, index: number) {
    setCardStates((prev) => {
      const updated = { ...prev[type] };
      updated.generatedLevels = updated.generatedLevels.filter(
        (_, i) => i !== index
      );
      return { ...prev, [type]: updated };
    });
  }

  async function handleSubmit(type: string) {
    const state = cardStates[type];
    if (!state) return;

    const levels = state.generatedLevels
      .filter((l) => l.percentage !== "")
      .map((l) => ({
        level: l.level,
        percentage: parseFloat(l.percentage),
      }));

    setCardStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], saving: true },
    }));

    try {
      const updated = await referralSettingsApi.updateLevels(type, levels);
      setSettings((prev) =>
        prev.map((s) => (s.type === type ? updated : s))
      );
      setCardStates((prev) => ({
        ...prev,
        [type]: { ...prev[type], generatedLevels: [], numLevels: "", saving: false },
      }));
    } catch {
      setCardStates((prev) => ({
        ...prev,
        [type]: { ...prev[type], saving: false },
      }));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        Referral Commissions
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((setting) => {
          const state = cardStates[setting.type];
          if (!state) return null;

          return (
            <div
              key={setting.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-lg bg-[#1e2a4a] px-4 py-3">
                <h2 className="text-sm font-semibold text-white">
                  {TYPE_LABELS[setting.type] || setting.type}
                </h2>
                <button
                  onClick={() => handleToggle(setting.type, setting.enabled)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium text-white ${
                    setting.enabled
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  <span className="text-sm">&#x1F534;</span>
                  {setting.enabled ? "Disable Now" : "Enable Now"}
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                {/* Existing levels */}
                {setting.levels.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {setting.levels.map((lvl) => (
                      <div
                        key={lvl.level}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-semibold text-[#1e2a4a]">
                          Level {lvl.level}
                        </span>
                        <span className="text-gray-600">
                          {lvl.percentage.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider + Update Setting */}
                <div className="relative my-4 flex items-center">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="px-3 text-xs text-gray-500">
                    Update Setting
                  </span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                {/* Number of Level input */}
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Number of Level
                </label>
                <div className="mb-3 flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Type a number & hit ENTER &#x21B5;"
                    value={state.numLevels}
                    onChange={(e) =>
                      setCardStates((prev) => ({
                        ...prev,
                        [setting.type]: {
                          ...prev[setting.type],
                          numLevels: e.target.value,
                        },
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleGenerate(setting.type);
                    }}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleGenerate(setting.type)}
                    className="rounded-md bg-[#5a4fcf] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3fbf]"
                  >
                    Generate
                  </button>
                </div>

                {/* Generated level inputs */}
                {state.generatedLevels.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-red-500">
                      The Old setting will be removed after generating new
                    </p>
                    {state.generatedLevels.map((lvl, idx) => (
                      <div key={lvl.level} className="flex items-center gap-2">
                        <span className="w-16 shrink-0 rounded-l-md border border-gray-300 bg-gray-100 px-2 py-2 text-xs font-medium text-gray-600">
                          Level {lvl.level}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Percentage"
                          value={lvl.percentage}
                          onChange={(e) =>
                            handlePercentageChange(
                              setting.type,
                              idx,
                              e.target.value
                            )
                          }
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() =>
                            handleRemoveLevel(setting.type, idx)
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-100 text-red-500 hover:bg-red-200"
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => handleSubmit(setting.type)}
                      disabled={state.saving}
                      className="mt-3 w-full rounded-md bg-[#5a4fcf] py-2.5 text-sm font-medium text-white hover:bg-[#4a3fbf] disabled:opacity-50"
                    >
                      {state.saving ? "Saving..." : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
