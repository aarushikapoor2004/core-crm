import { v4 as uuidv4 } from "uuid";

export function generateId(email: string | null): string {
  console.log(" generateUsername is called ");
  if (!email) {
    // Return a short UUID if email is null
    return uuidv4().replace(/-/g, "").slice(0, 12);
  }

  // Extract base username from email (before '@') and sanitize it
  let base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Append a short UUID segment to ensure uniqueness
  const uniquePart = uuidv4().split("-")[0]; // e.g., "d3e4a8f1"

  return `${base}${uniquePart}`;
}
