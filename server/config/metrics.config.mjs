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
