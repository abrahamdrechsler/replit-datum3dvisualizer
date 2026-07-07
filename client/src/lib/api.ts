import type { InsertDatum, Datum, InsertObject, Object } from "@db/schema";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// Datum API calls
export async function fetchDatums(): Promise<Datum[]> {
  const response = await fetch(`${API_BASE}/datums`);
  if (!response.ok) throw new Error("Failed to fetch datums");
  return response.json();
}

export async function createDatum(datum: InsertDatum): Promise<Datum> {
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
  const response = await fetch(`${API_BASE}/datums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datum),
  });
  if (!response.ok) throw new Error("Failed to update datum");
  return response.json();
}

export async function deleteDatum(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/datums/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete datum");
}

// Object API calls
export async function fetchObjects(): Promise<Object[]> {
  const response = await fetch(`${API_BASE}/objects`);
  if (!response.ok) throw new Error("Failed to fetch objects");
  return response.json();
}

export async function createObject(object: InsertObject): Promise<Object> {
  const response = await fetch(`${API_BASE}/objects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
  if (!response.ok) throw new Error("Failed to create object");
  return response.json();
}

export async function updateObject(id: number, object: Partial<InsertObject>): Promise<Object> {
  const response = await fetch(`${API_BASE}/objects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
  if (!response.ok) throw new Error("Failed to update object");
  return response.json();
}

export async function deleteObject(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/objects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete object");
}