import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return crypto.randomUUID();
}

export function generateTitle(text: string): string {
  return text.length > 20 ? `${text.slice(0, 20)}...` : text;
}
