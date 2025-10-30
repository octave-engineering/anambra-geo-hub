// A simple seeded random number generator (mulberry32)
function mulberry32(a: number): () => number {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export type LgaValueMap = Record<string, number>;

const SEED = 'anambra-demo-seed';

// Create a hash from the seed
function createSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function generateDemoValues(lgaNames: string[]): LgaValueMap {
  const seed = createSeed(SEED);
  const random = mulberry32(seed);
  const values: LgaValueMap = {};
  
  lgaNames.forEach(lga => {
    // Generate a deterministic value between 0-100 for each LGA
    values[lga] = Math.floor(random() * 101);
  });
  
  return values;
}

export function getColor(value: number): string {
  // Define the color scale from light to dark
  if (value < 20) return '#e6f0ff';
  if (value < 40) return '#b3d1ff';
  if (value < 60) return '#80b3ff';
  if (value < 80) return '#4d94ff';
  return '#1a75ff';
}

export const LGAS = [
  'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North',
  'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North',
  'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South',
  'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'
];
