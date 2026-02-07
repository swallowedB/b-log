const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const KEY = "viewer_id";
export function getOrCreateViewerId(): string {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing && UUID_REGEX.test(existing)) return existing;

    const id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    return "";
  }
}
