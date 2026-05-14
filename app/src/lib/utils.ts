import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a public asset path so it works under any Vite `base` (root or
 * subpath like `/Hoc_lieu_so/`). JSON content uses paths like
 * `/images/foo.png`; this prepends BASE_URL so the browser doesn't request
 * `/images/foo.png` from the domain root.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL; // ends with "/"
  // Remote URLs pass through unchanged.
  if (/^https?:\/\//i.test(path)) return path;
  // Strip leading slash before joining with base.
  const clean = path.replace(/^\//, "");
  return base + clean;
}
