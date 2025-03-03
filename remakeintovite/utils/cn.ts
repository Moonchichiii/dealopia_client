import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 * Useful for conditional and dynamic class names in components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}