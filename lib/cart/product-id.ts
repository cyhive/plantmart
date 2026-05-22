/** Cart line id is the catalog product MongoDB ObjectId (24 hex chars). */
export function normalizeCartProductId(id: string): string {
  const trimmed = id.trim();
  if (/^[a-f0-9]{24}$/i.test(trimmed)) return trimmed;
  const first = trimmed.split('-')[0];
  if (/^[a-f0-9]{24}$/i.test(first)) return first;
  return trimmed;
}
