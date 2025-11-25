/**
 * Health Metrics Configuration
 * Defines available health metrics and their database mappings
 */

export const HEALTH_METRICS = {
  'severe_malaria': {
    table: 'dhis_severe_malaria_cases',
    view: 'vw_severe_malaria_cases',
    name: 'Severe Malaria Cases',
    description: 'Cases of severe malaria reported by health facilities'
  },
  'sickle_cell': {
    table: 'dhis_sickle_cell_cases',
    view: 'vw_sickle_cell_disease',
    name: 'Sickle Cell Cases',
    description: 'Sickle cell disease cases reported by health facilities'
  },
  'breast_cancer': {
    table: 'dhis_breast_cancer_cases',
    view: 'vw_breast_cancer_cases',
    name: 'Breast Cancer Cases',
    description: 'Breast cancer cases reported by health facilities'
  },
  'death_cases': {
    table: 'dhis_death_cases',
    view: 'vw_death_cases',
    name: 'Death Cases',
    description: 'Death cases reported by health facilities'
  },
  // Additional metrics used by the map and analytics pages
  'arthritis_suspected': {
    view: 'vw_arthritis_new_cases_suspected',
    name: 'Arthritis Cases (Suspected)',
    description: 'New suspected arthritis cases reported by health facilities'
  },
  'deliveries_sba': {
    view: 'vw_deliveries_sba',
    name: 'Deliveries with Skilled Birth Attendant',
    description: 'Deliveries attended by skilled birth attendants'
  },
  'elephantiasis': {
    view: 'vw_elephantiasis_new_cases',
    name: 'Elephantiasis Cases',
    description: 'New elephantiasis cases reported by health facilities'
  },
  'hepc_tested': {
    view: 'vw_hepc_tested',
    name: 'Hepatitis C Tests',
    description: 'Number of Hepatitis C tests conducted'
  },
  'measles_under_5': {
    view: 'vw_measles_new_cases_under_5',
    name: 'Measles Cases (Under 5)',
    description: 'New measles cases in children under 5 years'
  },
  'patients_admitted': {
    view: 'vw_patients_admitted',
    name: 'Patients Admitted',
    description: 'Total number of patients admitted to health facilities'
  },
  'yellow_fever_vaccination': {
    view: 'vw_yellow_fever_given',
    name: 'Yellow Fever Vaccinations',
    description: 'Yellow fever vaccinations administered'
  }
};

/**
 * Validate if a metric ID is supported
 */
export const isValidMetric = (metricId) => {
  return metricId in HEALTH_METRICS;
};

/**
 * Get metric configuration by ID
 */
export const getMetricConfig = (metricId) => {
  return HEALTH_METRICS[metricId] || null;
};

/**
 * Get all available metrics as array
 */
export const getAllMetrics = () => {
  return Object.entries(HEALTH_METRICS).map(([id, config]) => ({
    id,
    name: config.name,
    description: config.description
  }));
};

export default HEALTH_METRICS;
