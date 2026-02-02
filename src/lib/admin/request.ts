export async function adminRequest<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const json = await res.json();
      message = json.error ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
