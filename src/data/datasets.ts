export interface Dataset {
  id: string;
  logo: string;
  dataset: string;
  owner: string;
  format: string;
  refresh: string;
  description: string;
  lastUpdated: string;
  size: string;
  category: 'disease' | 'facility' | 'population' | 'surveillance';
  accessLevel: 'public' | 'restricted' | 'admin';
  downloadUrl: string;
  koboFormUrl?: string;
}

export const healthDatasets: Dataset[] = [
  {
    id: 'dhis2-main',
    logo: '',
    dataset: 'DHIS2 Health Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'Comprehensive health facility data from District Health Information System',
    lastUpdated: '2024-01-15',
    size: '15.2 MB',
    category: 'facility',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/dhis2-main.csv'
  },
  {
    id: 'grid3-geospatial',
    logo: '',
    dataset: 'GRID3 Geospatial Data',
    owner: 'GRID3 Nigeria',
    format: 'GeoJSON',
    refresh: 'Annual',
    description: 'High-resolution geospatial data for settlements and infrastructure',
    lastUpdated: '2024-01-01',
    size: '45.8 MB',
    category: 'facility',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/grid3-geospatial.geojson'
  },
  {
    id: 'phc-registry',
    logo: '',
    dataset: 'PHC Registry',
    owner: 'NPHCDA',
    format: 'Excel',
    refresh: 'Quarterly',
    description: 'Primary Healthcare Center registry and service data',
    lastUpdated: '2024-01-10',
    size: '8.7 MB',
    category: 'facility',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/phc-registry.xlsx'
  },
  {
    id: 'nhmis-data',
    logo: '',
    dataset: 'NHMIS Data',
    owner: 'Federal Ministry of Health',
    format: 'DHIS2 API',
    refresh: 'Monthly',
    description: 'National Health Management Information System data',
    lastUpdated: '2024-01-20',
    size: '22.1 MB',
    category: 'surveillance',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/nhmis-data.json'
  },
  {
    id: 'hr-registry',
    logo: '',
    dataset: 'HR Registry',
    owner: 'MoH HR Department',
    format: 'CSV',
    refresh: 'Annual',
    description: 'Healthcare human resources registry and distribution',
    lastUpdated: '2024-01-01',
    size: '5.3 MB',
    category: 'facility',
    accessLevel: 'admin',
    downloadUrl: '/api/datasets/hr-registry.csv'
  },
  {
    id: 'malaria-unit',
    logo: '',
    dataset: 'Malaria Unit Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'Malaria cases, treatment, and prevention program data',
    lastUpdated: '2024-01-18',
    size: '12.4 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/malaria-unit.csv'
  },
  {
    id: 'hiv-unit',
    logo: '',
    dataset: 'HIV Unit Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'HIV/AIDS surveillance, treatment and care data',
    lastUpdated: '2024-01-17',
    size: '9.8 MB',
    category: 'disease',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/hiv-unit.csv'
  },
  {
    id: 'tb-unit',
    logo: '',
    dataset: 'TB Unit Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'Tuberculosis surveillance and treatment program data',
    lastUpdated: '2024-01-16',
    size: '7.2 MB',
    category: 'disease',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/tb-unit.csv'
  },
  {
    id: 'ntd-unit',
    logo: '',
    dataset: 'NTD Unit Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'Neglected Tropical Diseases control program data',
    lastUpdated: '2024-01-14',
    size: '4.6 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/ntd-unit.csv'
  },
  {
    id: 'health-facility-registry',
    logo: '',
    dataset: 'Health Facility Registry',
    owner: 'Ministry of Health',
    format: 'GeoJSON',
    refresh: 'Annual',
    description: 'Comprehensive registry of all health facilities with locations',
    lastUpdated: '2024-01-01',
    size: '18.9 MB',
    category: 'facility',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/health-facility-registry.geojson'
  },
  {
    id: 'population-projections',
    logo: '',
    dataset: 'Population Projections',
    owner: 'National Population Commission',
    format: 'CSV',
    refresh: '5 years',
    description: 'Population projections by age, gender, and local government area',
    lastUpdated: '2023-12-01',
    size: '3.1 MB',
    category: 'population',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/population-projections.csv'
  },
  {
    id: 'maternal-health',
    logo: '',
    dataset: 'Maternal Health Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Quarterly',
    description: 'Maternal health indicators, antenatal and delivery data',
    lastUpdated: '2024-01-10',
    size: '11.5 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/maternal-health.csv'
  },
  {
    id: 'child-health',
    logo: '',
    dataset: 'Child Health Data',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Quarterly',
    description: 'Child health indicators, nutrition and growth monitoring',
    lastUpdated: '2024-01-12',
    size: '9.7 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/child-health.csv'
  },
  {
    id: 'immunization-coverage',
    logo: '',
    dataset: 'Immunization Coverage',
    owner: 'NPHCDA',
    format: 'DHIS2',
    refresh: 'Monthly',
    description: 'Routine immunization coverage and campaign data',
    lastUpdated: '2024-01-19',
    size: '6.8 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/immunization-coverage.json'
  },
  {
    id: 'disease-surveillance',
    logo: '',
    dataset: 'Disease Surveillance',
    owner: 'Ministry of Health',
    format: 'CSV',
    refresh: 'Weekly',
    description: 'Integrated disease surveillance and response data',
    lastUpdated: '2024-01-22',
    size: '25.3 MB',
    category: 'surveillance',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/disease-surveillance.csv'
  },
  {
    id: 'mortality-registry',
    logo: '',
    dataset: 'Mortality Registry',
    owner: 'National Population Commission',
    format: 'CSV',
    refresh: 'Annual',
    description: 'Vital registration and mortality statistics',
    lastUpdated: '2024-01-01',
    size: '7.9 MB',
    category: 'population',
    accessLevel: 'admin',
    downloadUrl: '/api/datasets/mortality-registry.csv'
  },
  {
    id: 'lab-results',
    logo: '',
    dataset: 'Laboratory Results',
    owner: 'MoH Laboratory Services',
    format: 'CSV',
    refresh: 'Weekly',
    description: 'Laboratory test results and diagnostic data',
    lastUpdated: '2024-01-21',
    size: '31.2 MB',
    category: 'surveillance',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/lab-results.csv'
  },
  {
    id: 'drug-stock-data',
    logo: '',
    dataset: 'Drug Stock Data',
    owner: 'MoH Pharmacy Department',
    format: 'CSV',
    refresh: 'Monthly',
    description: 'Essential medicines stock levels and distribution',
    lastUpdated: '2024-01-15',
    size: '8.4 MB',
    category: 'facility',
    accessLevel: 'admin',
    downloadUrl: '/api/datasets/drug-stock-data.csv'
  },
  {
    id: 'referral-data',
    logo: '',
    dataset: 'Referral Data',
    owner: 'Ministry of Health',
    format: 'Excel',
    refresh: 'Quarterly',
    description: 'Patient referral patterns and outcomes',
    lastUpdated: '2024-01-10',
    size: '13.6 MB',
    category: 'facility',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/referral-data.xlsx'
  },
  {
    id: 'community-surveys',
    logo: '',
    dataset: 'Community Surveys',
    owner: 'Partner NGOs',
    format: 'CSV',
    refresh: 'Ad hoc',
    description: 'Community health surveys and assessments',
    lastUpdated: '2024-01-05',
    size: '19.7 MB',
    category: 'population',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/community-surveys.csv',
    koboFormUrl: 'https://kf.kobotoolbox.org/#/forms/your-community-survey-form-id'
  }
];

export const getDatasetsByCategory = (category: string) => {
  return healthDatasets.filter(dataset => dataset.category === category);
};

export const getDatasetsByAccessLevel = (accessLevel: string) => {
  return healthDatasets.filter(dataset => dataset.accessLevel === accessLevel);
};

export const getDatasetById = (id: string) => {
  return healthDatasets.find(dataset => dataset.id === id);
};