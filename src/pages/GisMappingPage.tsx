import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import QGISFilterableMap from '@/components/QGISFilterableMap';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const GisMappingPage = () => {
  const [runTour, setRunTour] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('gis-tutorial-completed');
    if (!hasSeenTutorial) {
      // Show welcome dialog after a short delay
      setTimeout(() => setShowWelcome(true), 1000);
    }
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    setRunTour(true);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
    localStorage.setItem('gis-tutorial-completed', 'true');
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('gis-tutorial-completed', 'true');
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-3 text-[#ffaa00]">Welcome to the GIS Mapping Platform! 🗺️</h2>
          <p className="text-base mb-3">
            This interactive tutorial will guide you through all the powerful features of our geospatial health data visualization tool.
          </p>
          <p className="text-sm text-muted-foreground">
            Click <strong>Next</strong> to begin the tour, or <strong>Skip</strong> to explore on your own.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="metric-select"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select a Health Metric</h3>
          <p className="text-sm">
            Choose from various health indicators like Malaria Cases, HIV Cases, TB Cases, and more. This determines what data is displayed on the map.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="lga-filter"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Filter by Local Government Area</h3>
          <p className="text-sm">
            Select a specific LGA to focus on a particular region, or leave it as "All LGAs" to view the entire state. The map will automatically zoom to your selection.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="ward-filter"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Filter by Ward</h3>
          <p className="text-sm">
            Once you select an LGA, you can drill down further by choosing a specific ward within that LGA for more granular analysis.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="period-filter"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Time Period</h3>
          <p className="text-sm">
            Choose the time period for your data analysis. Available periods depend on the selected metric and data availability.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="value-mode"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Toggle Value Type</h3>
          <p className="text-sm mb-2">
            Switch between viewing:
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li><strong>Cases:</strong> Raw number of cases</li>
            <li><strong>Incidence:</strong> Cases per 1,000 population (normalized for comparison)</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="incidence-range"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Filter by Incidence Rate</h3>
          <p className="text-sm">
            When viewing incidence data, you can filter facilities by setting minimum and maximum incidence rates to identify hotspots or areas with specific burden levels.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.ol-viewport',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
          <p className="text-sm mb-2">
            The map shows health facilities as colored dots:
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li><strong>Blue dots:</strong> Health facilities with data</li>
            <li><strong>Size:</strong> Larger dots indicate higher values</li>
            <li><strong>Click any dot</strong> to view detailed information</li>
          </ul>
          <p className="text-sm mt-2">
            Use your mouse to pan and zoom the map for better exploration.
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="population-display"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Population Information</h3>
          <p className="text-sm">
            This displays the total population for your current selection (State, LGA, or Ward). Essential for understanding incidence rates and burden.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="burden-summary"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Disease Burden Summary</h3>
          <p className="text-sm">
            View key statistics for your selection including total cases, number of facilities reporting, and incidence rate. Perfect for quick insights!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-3 text-green-600">🎉 Tutorial Complete!</h2>
          <p className="text-base mb-3">
            You're now ready to explore Anambra's health data! Remember:
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1 mb-3">
            <li>Click on map dots for detailed facility information</li>
            <li>Use filters to focus on specific areas or time periods</li>
            <li>Toggle between cases and incidence for different perspectives</li>
            <li>Export data for further analysis when needed</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            You can restart this tutorial anytime from the help menu.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  return (
    <>
      {/* Welcome Dialog */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={handleSkipTour}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-2xl font-bold mb-3">Welcome to the GIS Mapping Platform!</h2>
              <p className="text-muted-foreground mb-6">
                Would you like a quick tour to learn how to use all the powerful features? It only takes 2 minutes!
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleSkipTour}>
                  Skip Tour
                </Button>
                <Button onClick={handleStartTour} className="bg-[#ffaa00] hover:bg-[#ffaa00]/90">
                  Start Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Joyride Tutorial */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#ffaa00',
            textColor: '#333',
            backgroundColor: '#fff',
            arrowColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
          },
          buttonNext: {
            backgroundColor: '#ffaa00',
            borderRadius: '6px',
            fontSize: '14px',
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#666',
            marginRight: '10px',
          },
          buttonSkip: {
            color: '#999',
          },
          tooltip: {
            borderRadius: '8px',
            fontSize: '14px',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipTitle: {
            fontSize: '18px',
            marginBottom: '10px',
          },
        }}
      />

      <div className="h-screen" style={{height: '90vh'}}>
        <QGISFilterableMap />
      </div>
    </>
  );
};

export default GisMappingPage;
