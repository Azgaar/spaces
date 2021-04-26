const parseJSON = (json: string): {} | null => {
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getStored = (key: string): unknown => {
  const stored = localStorage.getItem(key);
  if (!stored) return;

  return parseJSON(stored);
}
