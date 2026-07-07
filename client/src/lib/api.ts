import type { InsertDatum, Datum, InsertObject, Object } from "@db/schema";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const STORAGE_KEY = "datum3dvisualizer-store-v1";

type StaticStore = {
  datums: Datum[];
  objects: Object[];
  nextDatumId: number;
  nextObjectId: number;
};

function useStaticStore() {
  return !import.meta.env.VITE_API_URL && window.location.hostname.endsWith("github.io");
}

function readStore(): StaticStore {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    datums: [],
    objects: [],
    nextDatumId: 1,
    nextObjectId: 1,
  };
}

function writeStore(store: StaticStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function toDatum(id: number, datum: InsertDatum): Datum {
  return {
    id,
    name: datum.name,
    isAbsolute: datum.isAbsolute,
    zOffset: String(datum.zOffset),
    parentId: datum.parentId,
  } as Datum;
}

function toObject(id: number, object: InsertObject): Object {
  return {
    id,
    name: object.name,
    color: object.color,
    bottomDatumId: object.bottomDatumId,
    bottomOffset: String(object.bottomOffset),
    topDatumId: object.topDatumId,
    topOffset: String(object.topOffset),
  } as Object;
}

function absoluteOffset(datum: Datum, datums: Datum[]): number {
  if (datum.isAbsolute) {
    return Number(datum.zOffset);
  }

  const parent = datums.find((item) => item.id === datum.parentId);
  return Number(datum.zOffset) + (parent ? absoluteOffset(parent, datums) : 0);
}

// Datum API calls
export async function fetchDatums(): Promise<Datum[]> {
  if (useStaticStore()) {
    return readStore().datums;
  }

  const response = await fetch(`${API_BASE}/datums`);
  if (!response.ok) throw new Error("Failed to fetch datums");
  return response.json();
}

export async function createDatum(datum: InsertDatum): Promise<Datum> {
  if (useStaticStore()) {
    const store = readStore();
    const result = toDatum(store.nextDatumId, datum);
    store.nextDatumId += 1;
    store.datums.push(result);
    writeStore(store);
    return result;
  }

  console.log('Creating datum with data:', datum);
  const response = await fetch(`${API_BASE}/datums`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      // Add cache control to prevent caching
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    },
    body: JSON.stringify(datum),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server error response:', errorText);
    throw new Error(`Failed to create datum: ${errorText}`);
  }

  const result = await response.json();
  console.log('Server response:', result);
  return result;
}

export async function updateDatum(id: number, datum: Partial<InsertDatum>): Promise<Datum> {
  if (useStaticStore()) {
    const store = readStore();
    const existing = store.datums.find((item) => item.id === id);
    if (!existing) throw new Error("Datum not found");

    const updated = {
      ...existing,
      ...datum,
      zOffset: datum.zOffset == null ? existing.zOffset : String(datum.zOffset),
    } as Datum;
    store.datums = store.datums.map((item) => (item.id === id ? updated : item));
    writeStore(store);
    return updated;
  }

  const response = await fetch(`${API_BASE}/datums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datum),
  });
  if (!response.ok) throw new Error("Failed to update datum");
  return response.json();
}

export async function deleteDatum(id: number): Promise<void> {
  if (useStaticStore()) {
    const store = readStore();
    const target = store.datums.find((item) => item.id === id);
    if (target) {
      store.datums = store.datums
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.parentId !== id) return item;
          return {
            ...item,
            isAbsolute: true,
            zOffset: String(absoluteOffset(item, store.datums)),
            parentId: null,
          } as Datum;
        });
      writeStore(store);
    }
    return;
  }

  const response = await fetch(`${API_BASE}/datums/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete datum");
}

// Object API calls
export async function fetchObjects(): Promise<Object[]> {
  if (useStaticStore()) {
    return readStore().objects;
  }

  const response = await fetch(`${API_BASE}/objects`);
  if (!response.ok) throw new Error("Failed to fetch objects");
  return response.json();
}

export async function createObject(object: InsertObject): Promise<Object> {
  if (useStaticStore()) {
    const store = readStore();
    const result = toObject(store.nextObjectId, object);
    store.nextObjectId += 1;
    store.objects.push(result);
    writeStore(store);
    return result;
  }

  const response = await fetch(`${API_BASE}/objects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
  if (!response.ok) throw new Error("Failed to create object");
  return response.json();
}

export async function updateObject(id: number, object: Partial<InsertObject>): Promise<Object> {
  if (useStaticStore()) {
    const store = readStore();
    const existing = store.objects.find((item) => item.id === id);
    if (!existing) throw new Error("Object not found");

    const updated = {
      ...existing,
      ...object,
      bottomOffset: object.bottomOffset == null ? existing.bottomOffset : String(object.bottomOffset),
      topOffset: object.topOffset == null ? existing.topOffset : String(object.topOffset),
    } as Object;
    store.objects = store.objects.map((item) => (item.id === id ? updated : item));
    writeStore(store);
    return updated;
  }

  const response = await fetch(`${API_BASE}/objects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
  if (!response.ok) throw new Error("Failed to update object");
  return response.json();
}

export async function deleteObject(id: number): Promise<void> {
  if (useStaticStore()) {
    const store = readStore();
    store.objects = store.objects.filter((item) => item.id !== id);
    writeStore(store);
    return;
  }

  const response = await fetch(`${API_BASE}/objects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete object");
}
