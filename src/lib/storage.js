const KEY = "llm_hw_calc_profiles_v1";

export function loadProfiles() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveProfiles(profiles) {
  localStorage.setItem(KEY, JSON.stringify(profiles));
}
