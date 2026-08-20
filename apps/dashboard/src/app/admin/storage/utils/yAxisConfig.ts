/**
 * Y-axis domain and tick configuration utility
 * Calculates appropriate domain and tick intervals based on maximum data value
 */

export interface YAxisConfig {
  domain: [number, number];
  ticks: number[];
  tickFormatter: (value: number) => string;
}

/**
 * Calculates Y-axis domain and tick configuration based on maximum value
 * @param maxValue The maximum value in the dataset
 * @returns Y-axis configuration with domain, ticks, and formatter
 */
export function calculateYAxisConfig(maxValue: number): YAxisConfig {
  // Handle edge cases
  if (maxValue <= 0) {
    return {
      domain: [0, 100],
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      tickFormatter: (value: number) => value.toString(),
    };
  }

  // Determine the appropriate scale and gap
  const scale = getScale(maxValue);
  const domain: [number, number] = [0, scale.upperBound];
  const ticks = generateTicks(scale.lowerBound, scale.upperBound, scale.gap);
  const tickFormatter = createTickFormatter(scale.upperBound);

  return {
    domain,
    ticks,
    tickFormatter,
  };
}

/**
 * Determines the appropriate scale based on the maximum value
 */
function getScale(maxValue: number): Scale {
  const scales: Scale[] = [
    { lowerBound: 0, upperBound: 100, gap: 10, unit: '', multiplier: 1 },
    { lowerBound: 0, upperBound: 200, gap: 20, unit: '', multiplier: 1 },
    { lowerBound: 0, upperBound: 500, gap: 50, unit: '', multiplier: 1 },
    { lowerBound: 0, upperBound: 1000, gap: 100, unit: '', multiplier: 1 },
    { lowerBound: 0, upperBound: 10000, gap: 1000, unit: 'K', multiplier: 1000 },
    { lowerBound: 0, upperBound: 100000, gap: 10000, unit: 'K', multiplier: 1000 },
    { lowerBound: 0, upperBound: 1000000, gap: 100000, unit: 'K', multiplier: 1000 },
    { lowerBound: 0, upperBound: 10000000, gap: 1000000, unit: 'M', multiplier: 1000000 },
    { lowerBound: 0, upperBound: 100000000, gap: 10000000, unit: 'M', multiplier: 1000000 },
    { lowerBound: 0, upperBound: 1000000000, gap: 100000000, unit: 'M', multiplier: 1000000 },
    { lowerBound: 0, upperBound: 10000000000, gap: 1000000000, unit: 'B', multiplier: 1000000000 },
    { lowerBound: 0, upperBound: 100000000000, gap: 10000000000, unit: 'B', multiplier: 1000000000 },
    { lowerBound: 0, upperBound: 1000000000000, gap: 100000000000, unit: 'B', multiplier: 1000000000 },
    { lowerBound: 0, upperBound: 10000000000000, gap: 1000000000000, unit: 'T', multiplier: 1000000000000 },
  ];

  // Find the smallest scale that can accommodate the maxValue
  for (const scale of scales) {
    if (maxValue <= scale.upperBound) {
      return scale;
    }
  }

  // If maxValue is larger than our largest defined scale, use the largest
  return scales[scales.length - 1];
}

/**
 * Generates tick values from lower to upper bound with specified gap
 */
function generateTicks(lowerBound: number, upperBound: number, gap: number): number[] {
  const ticks: number[] = [];
  for (let value = lowerBound; value <= upperBound; value += gap) {
    ticks.push(value);
  }
  return ticks;
}

/**
 * Creates a tick formatter function based on the scale
 */
function createTickFormatter(upperBound: number): (value: number) => string {
  return (value: number) => {
    if (upperBound >= 1000000000000) {
      // Trillions
      return `${(value / 1000000000000).toFixed(1)}T`;
    } else if (upperBound >= 1000000000) {
      // Billions
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (upperBound >= 1000000) {
      // Millions
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (upperBound >= 1000) {
      // Thousands
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      // Hundreds and below
      return value.toString();
    }
  };
}

/**
 * Scale configuration interface
 */
interface Scale {
  lowerBound: number;
  upperBound: number;
  gap: number;
  unit: string;
  multiplier: number;
}

/**
 * Convenience function to get Y-axis props for Recharts
 * @param data Array of data objects with numeric values
 * @param valueKey Key to extract numeric values from data objects
 * @returns Props object for Recharts YAxis component
 */
export function getYAxisProps<T extends Record<string, any>>(
  data: T[],
  valueKey: keyof T,
): Omit<React.ComponentProps<typeof import('recharts').YAxis>, 'ref'> {
  const maxValue = Math.max(...data.map((item) => Number(item[valueKey]) || 0), 0);
  const config = calculateYAxisConfig(maxValue);

  return {
    stroke: 'transparent',
    tick: { fill: 'rgb(107, 114, 128)', fontSize: 8 },
    domain: config.domain,
    ticks: config.ticks,
    tickFormatter: config.tickFormatter,
  };
}

/**
 * Pre-calculated common scales for quick access
 */
export const COMMON_SCALES = {
  SMALL: { domain: [0, 100] as [number, number], gap: 10 },
  MEDIUM: { domain: [0, 1000] as [number, number], gap: 100 },
  LARGE: { domain: [0, 10000] as [number, number], gap: 1000 },
  EXTRA_LARGE: { domain: [0, 100000] as [number, number], gap: 10000 },
  SCALE_200: { domain: [0, 200] as [number, number], gap: 20 },
  SCALE_500: { domain: [0, 500] as [number, number], gap: 50 },
} as const;
