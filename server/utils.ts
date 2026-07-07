import type { Datum } from "@db/schema";

export function calculateAbsoluteOffset(datum: Datum, datums: Datum[]): number {
  if (datum.isAbsolute) {
    return Number(datum.zOffset);
  }
  
  const parent = datums.find(d => d.id === datum.parentId);
  if (!parent) return Number(datum.zOffset);
  
  return calculateAbsoluteOffset(parent, datums) + Number(datum.zOffset);
}
