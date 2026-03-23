export function getApiErrorMessage(fallback: string): string {
  if (!navigator.onLine) {
    return 'No internet connection.';
  }

  return fallback;
}

export async function withApiErrorHandling<T>(
  request: () => Promise<T>,
  fallback: string
): Promise<T> {
  try {
    return await request();
  } catch (err) {
    console.error(err);
    throw new Error(getApiErrorMessage(fallback), { cause: err });
  }
}
