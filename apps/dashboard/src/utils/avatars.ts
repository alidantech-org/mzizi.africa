/**
 * DiceBear Avatar Utilities
 * Generates unique avatars based on user names using DiceBear API
 */

/**
 * Generate a DiceBear avatar URL based on a name or string
 * @param seed - The seed string (usually user name or email)
 * @param style - DiceBear avatar style (default: 'adventurer')
 * @param size - Avatar size in pixels (default: 128)
 * @returns DiceBear avatar URL
 */
export function getDiceBearAvatar(seed: string, style: string = 'adventurer', size: number = 128): string {
  // Clean the seed to ensure consistent avatars
  const cleanSeed = seed
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 20); // Limit length

  const baseUrl = 'https://api.dicebear.com/7.x';
  return `${baseUrl}/${style}/svg?seed=${cleanSeed}&size=${size}`;
}

/**
 * Generate avatar URL with fallback options
 * @param name - User name
 * @param email - User email (fallback)
 * @param style - DiceBear style
 * @param size - Avatar size
 * @returns Avatar URL
 */
export function getUserAvatar(name?: string, email?: string, style: string = 'adventurer', size: number = 128): string {
  // Use name as primary seed, fallback to email, then default
  const seed = name || email || 'default-user';
  return getDiceBearAvatar(seed, style, size);
}

/**
 * Available DiceBear styles for reference
 */
export const DICEBEAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'bottts-neutral',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'notionists',
  'notionists-neutral',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'rings',
  'shapes',
  'thumbs',
] as const;

/**
 * Get a random DiceBear style
 * @returns Random style from the available options
 */
export function getRandomDiceBearStyle(): string {
  const randomIndex = Math.floor(Math.random() * DICEBEAR_STYLES.length);
  return DICEBEAR_STYLES[randomIndex];
}
