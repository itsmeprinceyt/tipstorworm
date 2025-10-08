import { v4 as uuidv4 } from 'uuid';

/**
 * @description Generates a random ID of desired length using UUID.
 * - If length <= 12: hyphens removed
 * - If length > 12: hyphens included
 */
export function generateHexId(length: number): string {
  let id: string = uuidv4();
  
  if (length <= 12) {
    id = id.replace(/-/g, '');
  }

  if (id.length < length) {
    id = id.repeat(Math.ceil(length / id.length));
  }

  return id.slice(0, length);
}
