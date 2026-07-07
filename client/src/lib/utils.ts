import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Datum } from "@db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ImperialValue {
  feet: number;
  inches: number;
}

export function splitImperialMeasurement(totalInches: number): ImperialValue {
  const feet = Math.floor(Math.abs(totalInches) / 12);
  const inches = Math.abs(totalInches) % 12;
  return { feet, inches };
}
export interface ImperialMeasurementResult {
  value: number | null;
  error?: string;
}

export function parseImperialMeasurement(value: string | number): ImperialMeasurementResult {
  // Convert to string and handle null/undefined
  const stringValue = String(value || '');
  
  // Remove all whitespace
  const cleaned = stringValue.replace(/\s/g, '');
  
  // Match only patterns like: X" where X is an integer
  const regex = /^(-?\d+)"$/;
  const match = cleaned.match(regex);
  
  if (!match) {
    return {
      value: null,
      error: 'Measurement must be in format "X\\"" where X is a whole number (e.g., "24\\"" or "-24\\"")',
    };
  }
  
  const inches = parseInt(match[1], 10);
  
  if (isNaN(inches)) {
    return {
      value: null,
      error: 'Measurement must be a whole number',
    };
  }
  
  return { value: inches };
}

export function formatImperialMeasurement(inches: number | string): string {
  const value = typeof inches === 'string' ? parseInt(inches, 10) : inches;
  if (isNaN(value)) return '0"';
  
  const feet = Math.floor(Math.abs(value) / 12);
  const remainingInches = Math.abs(value) % 12;
  const sign = value < 0 ? '-' : '';
  
  if (feet === 0) {
    return `${sign}${remainingInches}"`;
  }
  return `${sign}${feet}'-${remainingInches}"`;
}

export function calculateAbsoluteOffset(datum: Datum, datums: Datum[]): number {
  if (datum.isAbsolute) {
    return Number(datum.zOffset);
  }
  
  const parent = datums.find(d => d.id === datum.parentId);
  if (!parent) return Number(datum.zOffset);
  
  return calculateAbsoluteOffset(parent, datums) + Number(datum.zOffset);
}