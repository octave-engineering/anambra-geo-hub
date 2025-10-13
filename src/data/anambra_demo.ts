export type Disease = 'malaria' | 'hiv' | 'tb';

export interface LgaDemo {
  name: string;
  lat: number; // latitude
  lon: number; // longitude
  metrics: Record<Disease, number>; // demo values per 10k
}

export interface PhcPoint {
  name: string;
  lat: number;
  lon: number;
  lga: string;
}

// Approximate centroids for 21 LGAs (demo-only, not precise)
export const ANAMBRA_LGAS_DEMO: LgaDemo[] = [
  { name: 'Aguata', lat: 6.01, lon: 7.09, metrics: { malaria: 42, hiv: 18, tb: 7 } },
  { name: 'Anambra East', lat: 6.33, lon: 6.87, metrics: { malaria: 28, hiv: 14, tb: 5 } },
  { name: 'Anambra West', lat: 6.35, lon: 6.64, metrics: { malaria: 33, hiv: 12, tb: 6 } },
  { name: 'Anaocha', lat: 6.13, lon: 7.01, metrics: { malaria: 51, hiv: 16, tb: 8 } },
  { name: 'Awka North', lat: 6.26, lon: 7.07, metrics: { malaria: 37, hiv: 15, tb: 6 } },
  { name: 'Awka South', lat: 6.21, lon: 7.06, metrics: { malaria: 62, hiv: 21, tb: 9 } },
  { name: 'Ayamelum', lat: 6.50, lon: 6.99, metrics: { malaria: 24, hiv: 13, tb: 5 } },
  { name: 'Dunukofia', lat: 6.20, lon: 7.06, metrics: { malaria: 48, hiv: 17, tb: 7 } },
  { name: 'Ekwusigo', lat: 6.02, lon: 6.86, metrics: { malaria: 39, hiv: 15, tb: 6 } },
  { name: 'Idemili North', lat: 6.18, lon: 6.87, metrics: { malaria: 53, hiv: 19, tb: 8 } },
  { name: 'Idemili South', lat: 6.11, lon: 6.87, metrics: { malaria: 41, hiv: 16, tb: 7 } },
  { name: 'Ihiala', lat: 5.85, lon: 6.85, metrics: { malaria: 36, hiv: 14, tb: 6 } },
  { name: 'Njikoka', lat: 6.17, lon: 7.03, metrics: { malaria: 47, hiv: 17, tb: 7 } },
  { name: 'Nnewi North', lat: 6.02, lon: 6.92, metrics: { malaria: 58, hiv: 20, tb: 8 } },
  { name: 'Nnewi South', lat: 5.94, lon: 6.92, metrics: { malaria: 45, hiv: 18, tb: 7 } },
  { name: 'Ogbaru', lat: 6.00, lon: 6.72, metrics: { malaria: 26, hiv: 12, tb: 5 } },
  { name: 'Onitsha North', lat: 6.16, lon: 6.78, metrics: { malaria: 52, hiv: 23, tb: 9 } },
  { name: 'Onitsha South', lat: 6.14, lon: 6.78, metrics: { malaria: 49, hiv: 22, tb: 9 } },
  { name: 'Orumba North', lat: 6.05, lon: 7.18, metrics: { malaria: 34, hiv: 14, tb: 6 } },
  { name: 'Orumba South', lat: 5.96, lon: 7.16, metrics: { malaria: 31, hiv: 13, tb: 5 } },
  { name: 'Oyi', lat: 6.27, lon: 6.96, metrics: { malaria: 38, hiv: 15, tb: 6 } },
];

// Sample PHC locations (subset, demo-only)
export const PHC_DEMO: PhcPoint[] = [
  { name: 'PHC Awka', lat: 6.21, lon: 7.07, lga: 'Awka South' },
  { name: 'PHC Nnewi', lat: 6.02, lon: 6.92, lga: 'Nnewi North' },
  { name: 'PHC Onitsha', lat: 6.16, lon: 6.79, lga: 'Onitsha North' },
  { name: 'PHC Oyi', lat: 6.26, lon: 6.97, lga: 'Oyi' },
  { name: 'PHC Ihiala', lat: 5.85, lon: 6.85, lga: 'Ihiala' },
  { name: 'PHC Ekwusigo', lat: 6.02, lon: 6.86, lga: 'Ekwusigo' },
];
