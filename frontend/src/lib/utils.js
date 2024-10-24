import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to combine class names with Tailwind CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to read a file as a Data URL
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => { 
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as Data URL"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
};
