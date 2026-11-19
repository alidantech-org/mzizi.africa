/** Five-step colour scale from the theme tokens (works in every palette and mode). */
export const steps = [0, 1, 2, 3, 4].map((i) => `var(--scale-${i})`);
export const stepFor = (value: number, min: number, max: number) => steps[Math.max(0, Math.min(4, Math.floor(((value - min) / (max - min || 1)) * 5)))];
