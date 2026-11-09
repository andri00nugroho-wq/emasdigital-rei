import { cache } from "react";
import { query } from "./db";

export type Settings = Record<string, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const rows = await query<{ setting_key: string; setting_value: string }>(
      "SELECT setting_key, setting_value FROM settings"
    );
    return Object.fromEntries(rows.map((r) => [r.setting_key, r.setting_value]));
  } catch {
    return {};
  }
});
