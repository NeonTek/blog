/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
