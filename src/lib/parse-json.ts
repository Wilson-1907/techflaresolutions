export async function parseJsonResponse<T extends Record<string, unknown> = Record<string, unknown>>(
  res: Response
): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    if (!res.ok) {
      throw new Error(
        res.status === 401
          ? "Session expired — sign in again."
          : `Server returned an empty response (${res.status}).`
      );
    }
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.ok
        ? "Server returned invalid JSON."
        : `Request failed (${res.status}) — try again or contact support.`
    );
  }
}
