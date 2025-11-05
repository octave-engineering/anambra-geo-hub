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
  // Enhanced fields for the new Data Portal
  source: string;
  type: 'Spatial' | 'Non-spatial' | 'Hybrid' | 'Spatial + Attribute';
  custodian: string;
  updateFrequency: string;
  citation: string;
  // New portal-based categorization
  portal: 'DHIS2' | 'NHMIS' | 'GRID3' | 'HFR' | 'HRR' | 'Program-Specific';
  subcategory: string;
  attributes?: Array<{
    name: string;
    exampleValue: string;
    description: string;
  }>;
  usage?: string;
}

export const healthDatasets: Dataset[] = [
  // New DHIS2 Datasets
  {
    id: 'dhis2-malaria',
    logo: '',
    dataset: 'Malaria Case Surveillance',
    owner: 'National Malaria Elimination Programme',
    format: 'DHIS2',
    refresh: 'Weekly',
    description: 'Weekly reported malaria cases, testing, and treatment data across health facilities in Anambra State.',
    lastUpdated: '2024-01-19',
    size: '4.2 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/malaria-cases.json',
    source: 'DHIS2',
    type: 'Spatial + Attribute',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Weekly',
    citation: 'Anambra State Ministry of Health, DHIS2 Malaria Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Malaria',
    attributes: [
      { name: 'facility_name', exampleValue: 'General Hospital Onitsha', description: 'Name of the health facility' },
      { name: 'lga', exampleValue: 'Onitsha North', description: 'Local Government Area' },
      { name: 'total_cases', exampleValue: '245', description: 'Total malaria cases reported' },
      { name: 'confirmed_cases', exampleValue: '198', description: 'Laboratory confirmed cases' },
      { name: 'tested', exampleValue: '320', description: 'Number of tests conducted' }
    ]
  },
  {
    id: 'dhis2-mortality',
    logo: '',
    dataset: 'Mortality Data',
    owner: 'Ministry of Health',
    format: 'DHIS2',
    refresh: 'Monthly',
    description: 'Mortality data including causes of death by age, sex, and location across Anambra State.',
    lastUpdated: '2024-01-15',
    size: '5.1 MB',
    category: 'disease',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/mortality-data.json',
    source: 'DHIS2',
    type: 'Spatial + Attribute',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, DHIS2 Mortality Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Mortality',
    attributes: [
      { name: 'facility_name', exampleValue: 'General Hospital Awka', description: 'Name of the health facility' },
      { name: 'lga', exampleValue: 'Awka South', description: 'Local Government Area' },
      { name: 'total_deaths', exampleValue: '45', description: 'Total deaths recorded' },
      { name: 'under_five_deaths', exampleValue: '12', description: 'Deaths of children under 5 years' },
      { name: 'maternal_deaths', exampleValue: '3', description: 'Maternal deaths recorded' }
    ]
  },
  {
    id: 'dhis2-yellow-fever',
    logo: '',
    dataset: 'Yellow Fever Surveillance',
    owner: 'National Primary Health Care Development Agency',
    format: 'DHIS2',
    refresh: 'Weekly',
    description: 'Yellow fever case-based surveillance and vaccination data across Anambra State.',
    lastUpdated: '2024-01-18',
    size: '2.8 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/yellow-fever.json',
    source: 'DHIS2',
    type: 'Spatial + Attribute',
    custodian: 'Anambra State Primary Health Care Development Board',
    updateFrequency: 'Weekly',
    citation: 'Anambra State Primary Health Care Development Board, DHIS2 Yellow Fever Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Vaccine Preventable Diseases',
    attributes: [
      { name: 'facility_name', exampleValue: 'Primary Health Center Nnewi', description: 'Name of the health facility' },
      { name: 'lga', exampleValue: 'Nnewi North', description: 'Local Government Area' },
      { name: 'suspected_cases', exampleValue: '15', description: 'Suspected yellow fever cases' },
      { name: 'confirmed_cases', exampleValue: '5', description: 'Laboratory confirmed cases' },
      { name: 'vaccination_coverage', exampleValue: '78%', description: 'Vaccination coverage rate' }
    ]
  },
  {
    id: 'dhis2-breast-cancer',
    logo: '',
    dataset: 'Breast Cancer Screening',
    owner: 'Anambra State Cancer Registry',
    format: 'DHIS2',
    refresh: 'Quarterly',
    description: 'Breast cancer screening and diagnosis data from health facilities in Anambra State.',
    lastUpdated: '2023-12-30',
    size: '3.5 MB',
    category: 'disease',
    accessLevel: 'restricted',
    downloadUrl: '/api/datasets/breast-cancer.json',
    source: 'DHIS2',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Quarterly',
    citation: 'Anambra State Cancer Registry, DHIS2 Cancer Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Non-Communicable Diseases',
    attributes: [
      { name: 'facility_name', exampleValue: 'Teaching Hospital Amaku', description: 'Name of the health facility' },
      { name: 'lga', exampleValue: 'Awka South', description: 'Local Government Area' },
      { name: 'screened', exampleValue: '320', description: 'Number of women screened' },
      { name: 'suspected_cases', exampleValue: '28', description: 'Suspected breast cancer cases' },
      { name: 'confirmed_cases', exampleValue: '7', description: 'Biopsy confirmed cases' }
    ]
  },
  {
    id: 'dhis2-syphilis',
    logo: '',
    dataset: 'Syphilis in Pregnancy',
    owner: 'Reproductive Health Unit',
    format: 'DHIS2',
    refresh: 'Monthly',
    description: 'Syphilis screening and treatment data for pregnant women attending ANC in Anambra State.',
    lastUpdated: '2024-01-10',
    size: '2.1 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/syphilis-pregnancy.json',
    source: 'DHIS2',
    type: 'Spatial + Attribute',
    custodian: 'Anambra State Primary Health Care Development Board',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, DHIS2 ANC Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Sexually Transmitted Infections',
    attributes: [
      { name: 'facility_name', exampleValue: 'Primary Health Center Onitsha', description: 'Name of the health facility' },
      { name: 'lga', exampleValue: 'Onitsha South', description: 'Local Government Area' },
      { name: 'anc_attendance', exampleValue: '150', description: 'Number of ANC attendees' },
      { name: 'screened', exampleValue: '142', description: 'Number screened for syphilis' },
      { name: 'positive_cases', exampleValue: '8', description: 'Number of positive cases' },
      { name: 'treated', exampleValue: '7', description: 'Number of cases treated' }
    ]
  },
  {
    id: 'dhis2-immunization',
    logo: '',
    dataset: 'Routine Immunization Coverage',
    owner: 'Ministry of Health',
    format: 'DHIS2',
    refresh: 'Monthly',
    description: 'Monthly immunization data (BCG, OPV, Measles, Penta) tagged to LGAs.',
    lastUpdated: '2024-01-19',
    size: '6.8 MB',
    category: 'disease',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/immunization-coverage.json',
    source: 'DHIS2',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, DHIS2 Routine Data, 2025',
    portal: 'DHIS2',
    subcategory: 'Routine Immunization',
    attributes: [
      { name: 'LGA_CODE', exampleValue: 'ANS001', description: 'Unique LGA identifier' },
      { name: 'BCG_COVERAGE', exampleValue: '86%', description: 'BCG immunization coverage percentage' },
      { name: 'OPV_COVERAGE', exampleValue: '78%', description: 'Oral Polio Vaccine coverage percentage' }
    ],
    usage: 'This dataset supports immunization dashboards and coverage analysis.'
  },
  {
    id: 'grid3-population',
    logo: '',
    dataset: 'Population Estimates and Boundaries',
    owner: 'GRID3 Nigeria',
    format: 'GeoJSON',
    refresh: 'Annual',
    description: 'Population grids, settlements, and administrative boundaries for Anambra.',
    lastUpdated: '2024-01-01',
    size: '45.8 MB',
    category: 'population',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/grid3-geospatial.geojson',
    source: 'GRID3',
    type: 'Spatial',
    custodian: 'GRID3 Nigeria',
    updateFrequency: 'Annual',
    citation: 'GRID3 Nigeria, Population Estimates, 2024',
    portal: 'GRID3',
    subcategory: 'Population & Demography',
    attributes: [
      { name: 'POP_ESTIMATE', exampleValue: '15420', description: 'Population estimate for the area' },
      { name: 'SETTLEMENT_TYPE', exampleValue: 'Urban', description: 'Classification of settlement type' }
    ],
    usage: 'Population analysis, planning, and resource allocation.'
  },
  {
    id: 'hfr-facility-registry',
    logo: '',
    dataset: 'Health Facility Registry (HFR)',
    owner: 'NPHCDA',
    format: 'GeoJSON',
    refresh: 'Annual',
    description: 'Master facility list and service readiness dataset.',
    lastUpdated: '2024-01-01',
    size: '18.9 MB',
    category: 'facility',
    accessLevel: 'public',
    downloadUrl: '/api/datasets/health-facility-registry.geojson',
    source: 'HFR / NPHCDA',
    type: 'Spatial + Attribute',
    custodian: 'National Primary Health Care Development Agency',
    updateFrequency: 'Annual',
    citation: 'NPHCDA, Health Facility Registry, 2024',
    portal: 'HFR',
    subcategory: 'Facility Registry',
    attributes: [
      { name: 'FACILITY_ID', exampleValue: 'PHC001', description: 'Unique facility identifier' },
      { name: 'FACILITY_TYPE', exampleValue: 'Primary', description: 'Type of health facility' },
      { name: 'LATITUDE', exampleValue: '6.2345', description: 'Facility latitude coordinate' }
    ],
    usage: 'Health facility mapping and service availability analysis.'
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
    downloadUrl: '/api/datasets/nhmis-data.json',
    source: 'NHMIS',
    type: 'Non-spatial',
    custodian: 'Federal Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Federal Ministry of Health, NHMIS Data, 2024',
    portal: 'NHMIS',
    subcategory: 'Validation & Reference Indicators'
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
    downloadUrl: '/api/datasets/hr-registry.csv',
    source: 'SMOH HR Department',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Annual',
    citation: 'Anambra State Ministry of Health, HR Registry, 2024',
    portal: 'HRR',
    subcategory: 'Workforce Distribution'
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
    downloadUrl: '/api/datasets/malaria-unit.csv',
    source: 'SMOH Malaria Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, Malaria Unit Data, 2024',
    portal: 'Program-Specific',
    subcategory: 'NTD Unit'
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
    downloadUrl: '/api/datasets/hiv-unit.csv',
    source: 'SMOH HIV Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, HIV Unit Data, 2024',
    portal: 'Program-Specific',
    subcategory: 'HIV Unit'
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
    downloadUrl: '/api/datasets/tb-unit.csv',
    source: 'SMOH TB Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, TB Unit Data, 2024',
    portal: 'Program-Specific',
    subcategory: 'TB Unit'
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
    downloadUrl: '/api/datasets/ntd-unit.csv',
    source: 'SMOH NTD Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, NTD Unit Data, 2024',
    portal: 'Program-Specific',
    subcategory: 'NTD Unit'
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
    downloadUrl: '/api/datasets/health-facility-registry.geojson',
    source: 'HFR / NPHCDA',
    type: 'Spatial + Attribute',
    custodian: 'National Primary Health Care Development Agency',
    updateFrequency: 'Annual',
    citation: 'NPHCDA, Health Facility Registry, 2024',
    portal: 'HFR',
    subcategory: 'Facility Registry'
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
    downloadUrl: '/api/datasets/population-projections.csv',
    source: 'National Population Commission',
    type: 'Non-spatial',
    custodian: 'National Population Commission',
    updateFrequency: '5 years',
    citation: 'National Population Commission, Population Projections, 2023',
    portal: 'GRID3',
    subcategory: 'Population & Demography'
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
    downloadUrl: '/api/datasets/maternal-health.csv',
    source: 'SMOH Maternal Health Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Quarterly',
    citation: 'Anambra State Ministry of Health, Maternal Health Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Maternal Health'
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
    downloadUrl: '/api/datasets/child-health.csv',
    source: 'SMOH Child Health Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Quarterly',
    citation: 'Anambra State Ministry of Health, Child Health Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Maternal Health'
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
    downloadUrl: '/api/datasets/immunization-coverage.json',
    source: 'DHIS2',
    type: 'Non-spatial',
    custodian: 'National Primary Health Care Development Agency',
    updateFrequency: 'Monthly',
    citation: 'NPHCDA, Immunization Coverage Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Routine Immunization'
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
    downloadUrl: '/api/datasets/disease-surveillance.csv',
    source: 'SMOH Surveillance Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Weekly',
    citation: 'Anambra State Ministry of Health, Disease Surveillance Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Disease Surveillance'
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
    downloadUrl: '/api/datasets/mortality-registry.csv',
    source: 'National Population Commission',
    type: 'Non-spatial',
    custodian: 'National Population Commission',
    updateFrequency: 'Annual',
    citation: 'National Population Commission, Mortality Registry, 2024',
    portal: 'GRID3',
    subcategory: 'Population & Demography'
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
    downloadUrl: '/api/datasets/lab-results.csv',
    source: 'SMOH Laboratory Services',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Weekly',
    citation: 'Anambra State Ministry of Health, Laboratory Results, 2024',
    portal: 'DHIS2',
    subcategory: 'Disease Surveillance'
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
    downloadUrl: '/api/datasets/drug-stock-data.csv',
    source: 'SMOH Pharmacy Department',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Monthly',
    citation: 'Anambra State Ministry of Health, Drug Stock Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Maternal Health'
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
    downloadUrl: '/api/datasets/referral-data.xlsx',
    source: 'SMOH Referral Unit',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Quarterly',
    citation: 'Anambra State Ministry of Health, Referral Data, 2024',
    portal: 'DHIS2',
    subcategory: 'Maternal Health'
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
    koboFormUrl: 'https://kf.kobotoolbox.org/#/forms/your-community-survey-form-id',
    source: 'Partner NGOs',
    type: 'Non-spatial',
    custodian: 'Anambra State Ministry of Health',
    updateFrequency: 'Ad hoc',
    citation: 'Anambra State Ministry of Health, Community Surveys, 2024',
    portal: 'GRID3',
    subcategory: 'Population & Demography'
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

export const getDatasetsByPortal = (portal: string) => {
  return healthDatasets.filter(dataset => dataset.portal === portal);
};

export const getDatasetsBySubcategory = (subcategory: string) => {
  return healthDatasets.filter(dataset => dataset.subcategory === subcategory);
};

export const getUniquePortals = () => {
  return [...new Set(healthDatasets.map(d => d.portal))];
};

export const getSubcategoriesByPortal = (portal: string) => {
  return [...new Set(healthDatasets.filter(d => d.portal === portal).map(d => d.subcategory))];
};

export const groupDatasetsByPortal = () => {
  const portals = getUniquePortals();
  return portals.reduce((acc, portal) => {
    const portalDatasets = getDatasetsByPortal(portal);
    const subcategories = getSubcategoriesByPortal(portal);

    acc[portal] = subcategories.reduce((subAcc, subcategory) => {
      subAcc[subcategory] = portalDatasets.filter(d => d.subcategory === subcategory);
      return subAcc;
    }, {} as Record<string, typeof healthDatasets>);

    return acc;
  }, {} as Record<string, Record<string, typeof healthDatasets>>);
};

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'ebook' | 'tool' | 'sample-data' | 'documentation';
  category: 'QGIS' | 'PostGIS' | 'KoboToolbox' | 'Geospatial Basics' | 'Health GIS' | 'Web Development' | 'Data Collection';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration?: string;
  pages?: string;
  size?: string;
  url: string;
  thumbnail?: string;
  instructor?: string;
  topics: string[];
  rating?: number;
  views?: string;
  format?: string;
  features?: string;
}

export const learningResources: LearningResource[] = [
  // Video Tutorials
  {
    id: 'qgis-full-course',
    title: 'QGIS Full Course for Beginners: Master GIS Mapping & Analysis for Free!',
    description: 'Complete beginner\'s guide to QGIS covering mapping, analysis, and visualization techniques',
    type: 'video',
    category: 'QGIS',
    level: 'Beginner',
    duration: '2h 45m',
    url: 'https://youtu.be/xKlk3IXyPMo?si=UV6y4C9zp8NJTuHK',
    thumbnail: 'https://img.youtube.com/vi/xKlk3IXyPMo/maxresdefault.jpg',
    instructor: 'GeoDelta Labs',
    topics: ['QGIS Basics', 'Mapping', 'Spatial Analysis', 'Beginner Friendly'],
    rating: 4.8,
    views: '1.8M'
  },
  {
    id: 'gis-fundamentals',
    title: 'What is GIS? A Guide to Geographic Information Systems',
    description: 'Comprehensive introduction to Geographic Information Systems and their applications',
    type: 'video',
    category: 'Geospatial Basics',
    level: 'Beginner',
    duration: '35m',
    url: 'https://youtu.be/Hau_ZCmN8eU?si=X1FAZIwfk4Gag-wf',
    thumbnail: 'https://img.youtube.com/vi/Hau_ZCmN8eU/maxresdefault.jpg',
    instructor: 'GIS & RS Professionals',
    topics: ['GIS Fundamentals', 'Spatial Analysis', 'Data Visualization', 'Applications'],
    rating: 4.7,
    views: '950K'
  },
  {
    id: 'postgis-tutorial',
    title: 'Getting started with PostGIS (Supabase)',
    description: 'Demonstrates creating geospatial tables, queries, and spatial operations in PostGIS',
    type: 'video',
    category: 'PostGIS',
    level: 'Beginner',
    duration: '1h 20m',
    url: 'https://www.youtube.com/watch?v=MWfB0t5u3V0',
    thumbnail: 'https://img.youtube.com/vi/MWfB0t5u3V0/maxresdefault.jpg',
    instructor: 'Supabase',
    topics: ['PostGIS Setup', 'Spatial Tables', 'Spatial Queries', 'Database Operations'],
    rating: 4.7,
    views: '456K'
  },
  {
    id: 'kobo-beginners',
    title: 'KoboToolbox for Beginners - Complete Guide',
    description: 'A comprehensive tutorial on getting started with KoboToolbox for data collection and form creation',
    type: 'video',
    category: 'KoboToolbox',
    level: 'Beginner',
    duration: '1h 12m',
    url: 'https://youtu.be/Eh-yYEwpLAo?si=2iTcLitPyv0A3Xzu',
    thumbnail: 'https://img.youtube.com/vi/Eh-yYEwpLAo/maxresdefault.jpg',
    instructor: 'KoboToolbox',
    topics: ['Getting Started', 'Form Creation', 'Data Collection', 'Basic Features'],
    rating: 4.7,
    views: '42K'
  },

  // E-books and Documentation
  {
    id: 'qgis-training-manual',
    title: 'QGIS Training Manual (Official Guide)',
    description: 'Official QGIS training manual with comprehensive tutorials, exercises, and sample data',
    type: 'documentation',
    category: 'QGIS',
    level: 'All Levels',
    pages: '800+',
    url: 'https://docs.qgis.org/latest/en/docs/training_manual/',
    topics: ['Official Guide', 'Tutorials', 'Exercises', 'Sample Data'],
    format: 'Online Documentation'
  },
  {
    id: 'who-geospatial-toolkit',
    title: 'WHO Geospatial Toolkit for Public Health',
    description: 'World Health Organization\'s comprehensive toolkit for using GIS in public health applications',
    type: 'ebook',
    category: 'Health GIS',
    level: 'Intermediate',
    pages: '450',
    size: '18MB PDF',
    url: 'https://apps.who.int/iris/handle/10665/337626',
    topics: ['Public Health', 'WHO Standards', 'Health Applications', 'Best Practices']
  },
  {
    id: 'grid3-nigeria-docs',
    title: 'GRID3 Nigeria – Geospatial Data Documentation',
    description: 'Documentation and datasets on population, settlements, and health infrastructure in Nigeria',
    type: 'documentation',
    category: 'Geospatial Basics',
    level: 'All Levels',
    url: 'https://nigeria.grid3.org/resources',
    topics: ['Nigeria Data', 'Population', 'Settlements', 'Health Infrastructure'],
    format: 'Data Portal'
  },

  // Tools
  {
    id: 'qgis-tool',
    title: 'QGIS Desktop GIS Software',
    description: 'Open-source GIS software used for mapping and spatial analysis of health data',
    type: 'tool',
    category: 'QGIS',
    level: 'All Levels',
    url: 'https://qgis.org/en/site/forusers/download.html',
    topics: ['Desktop GIS', 'Mapping', 'Spatial Analysis', 'Free Software'],
    features: 'Interactive Maps, Data Visualization, Spatial Analysis'
  },
  {
    id: 'postgis-tool',
    title: 'PostgreSQL + PostGIS',
    description: 'Powerful open-source spatial database system for storing and managing geospatial health data',
    type: 'tool',
    category: 'PostGIS',
    level: 'Intermediate',
    url: 'https://postgis.net/',
    topics: ['Spatial Database', 'Data Management', 'SQL Queries', 'Enterprise Ready'],
    features: 'Spatial Queries, Fast Performance, Cloud Compatible'
  },
  {
    id: 'kobo-toolbox',
    title: 'KoBoToolbox & KoBoCollect',
    description: 'Mobile data collection platform for health surveys and facility assessments',
    type: 'tool',
    category: 'KoboToolbox',
    level: 'Beginner',
    url: 'https://www.kobotoolbox.org/',
    topics: ['Mobile Data Collection', 'Survey Forms', 'Offline Capable', 'Real-time Sync'],
    features: 'Android App, Web Interface, Data Export, Integration Ready'
  },

  // Sample Data
  {
    id: 'qgis-sample-data',
    title: 'QGIS Sample Data Sets',
    description: 'Official QGIS training datasets including shapefiles, rasters, and project files',
    type: 'sample-data',
    category: 'QGIS',
    level: 'All Levels',
    size: '500MB',
    url: 'https://github.com/qgis/QGIS-Training-Data',
    topics: ['Training Data', 'Shapefiles', 'Rasters', 'Project Files'],
    format: 'GitHub Repository',
    features: 'Multiple Datasets, Training Ready'
  },
  {
    id: 'grid3-health-facilities',
    title: 'GRID3 Nigeria Health Facility Dataset',
    description: 'Locations and attributes of health facilities across Nigeria with detailed metadata',
    type: 'sample-data',
    category: 'Health GIS',
    level: 'All Levels',
    size: '25MB',
    url: 'https://data.grid3.org/datasets/nigeria-health-facilities',
    topics: ['Health Facilities', 'Nigeria Data', 'Locations', 'Attributes'],
    format: 'Shapefile/CSV',
    features: 'Geolocated Facilities, Complete Coverage'
  }
];

export const getLearningResourcesByCategory = (category: string) => {
  return learningResources.filter(resource => resource.category === category);
};

export const getLearningResourcesByType = (type: string) => {
  return learningResources.filter(resource => resource.type === type);
};

export const getLearningResourceById = (id: string) => {
  return learningResources.find(resource => resource.id === id);
};