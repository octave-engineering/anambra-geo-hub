import React from 'react';
import FacilityMap from '../components/FacilityMap';
import ErrorBoundary from '../components/ErrorBoundary';

const FacilityMapPage: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <ErrorBoundary>
        <FacilityMap />
      </ErrorBoundary>
    </div>
  );
};

export default FacilityMapPage;
