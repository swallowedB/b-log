const VIEWER_ID_KEY = "b_log_viewer_id";

export function getOrCreateViewerId(): string | null {
  if (typeof window === "undefined") return null;

  let id = window.localStorage.getItem(VIEWER_ID_KEY);

  if (!id) {
    if (window.crypto?.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    window.localStorage.setItem(VIEWER_ID_KEY, id);
  }

  return id;
}
