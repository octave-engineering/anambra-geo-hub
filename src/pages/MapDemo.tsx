import React from 'react';
import AnambraLGAMap from '@/components/AnambraLGAMap';
import { generateDemoValues, LGAS } from '@/utils/lgaData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MapDemo: React.FC = () => {
  // Generate demo values for all LGAs
  const demoValues = generateDemoValues(LGAS);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Anambra LGAs — Data Availability (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Interactive map showing demo data for all 21 Local Government Areas in Anambra State
            </p>
            
            <div className="w-full max-w-[720px] mx-auto">
              <AnambraLGAMap values={demoValues} />
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="text-center">
                <strong>Note:</strong> This is a demo with randomly generated data. Hover over or tap on an LGA to see details.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">About This Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How to Use</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Hover over an LGA to see its name and data value</li>
                <li>Click and drag to pan around the map</li>
                <li>Use the +/- buttons to zoom in and out</li>
                <li>On mobile, tap an LGA to see its details</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Data Legend</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { range: '81-100', color: '#1a75ff' },
                  { range: '61-80', color: '#4d94ff' },
                  { range: '41-60', color: '#80b3ff' },
                  { range: '21-40', color: '#b3d1ff' },
                  { range: '0-20', color: '#e6f0ff' },
                ].map((item) => (
                  <div key={item.range} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-sm mr-2 border border-gray-300"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span>{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapDemo;
