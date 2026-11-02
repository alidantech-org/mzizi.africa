'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle, Users } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import React, { useState, useEffect } from 'react';

// Kenya counties topojson from public folder - accessible via browser
const KENYA_TOPO_JSON = '/kenyan-counties.geojson';

export default function KenyaMap() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [countyData, setCountyData] = useState<Record<string, any>>({});

  // Generate sample political finance data for counties
  const generateCountyData = (countyName: string) => {
    const riskLevels = ['high', 'medium', 'low'];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const riskValues = {
      high: 65 + Math.floor(Math.random() * 20),
      medium: 30 + Math.floor(Math.random() * 20),
      low: 15 + Math.floor(Math.random() * 15),
    };

    return {
      risk: randomRisk,
      value: riskValues[randomRisk as keyof typeof riskValues],
      candidates: Math.floor(Math.random() * 25) + 5,
    };
  };

  // Initialize county data when component mounts
  useEffect(() => {
    // This would typically come from your API
    const sampleCounties = [
      'Nairobi',
      'Mombasa',
      'Kisumu',
      'Nakuru',
      'Eldoret',
      'Kisii',
      'Kitui',
      'Machakos',
      'Garissa',
      'Wajir',
      'Mandera',
      'Marsabit',
      'Isiolo',
      'Meru',
      'Embu',
      'Tharaka Nithi',
      'Nyeri',
      'Kirinyaga',
      "Murang'a",
      'Kiambu',
      'Turkana',
      'West Pokot',
      'Samburu',
      'Trans Nzoia',
      'Uasin Gishu',
      'Elgeyo Marakwet',
      'Nandi',
      'Baringo',
      'Laikipia',
      'Narok',
      'Kajiado',
      'Kwale',
      'Kilifi',
      'Tana River',
      'Lamu',
      'Taita Taveta',
      'Taita Taveta',
      'Bungoma',
      'Busia',
      'Kakamega',
      'Vihiga',
      'Siaya',
      'Homa Bay',
      'Migori',
      'Kisii',
      'Nyamira',
      'Kericho',
      'Bomet',
      'Nyandarua',
    ];

    const data: Record<string, any> = {};
    sampleCounties.forEach((county) => {
      data[county] = generateCountyData(county);
    });

    setCountyData(data);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f97316';
      case 'low':
        return '#22c55e';
      default:
        return '#e5e7eb';
    }
  };

  const getCountyColor = (countyName: string) => {
    const county = countyData[countyName];
    if (county) {
      return getRiskColor(county.risk);
    }
    return '#e5e7eb';
  };

  const getCountyData = (countyName: string) => {
    return (
      countyData[countyName] || {
        risk: 'unknown',
        value: 0,
        candidates: 0,
      }
    );
  };

  const countyList = Object.entries(countyData).map(([name, data]) => ({
    name,
    ...data,
  }));

  const totalCandidates = countyList.reduce((sum, county) => sum + county.candidates, 0);
  const highRiskCounties = countyList.filter((county) => county.risk === 'high').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Kenya Political Finance Map
        </CardTitle>
        <CardDescription>Real-time political finance risk monitoring across counties</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2 h-[500px] bg-muted rounded-lg overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 2800,
                center: [37.9, 0.5],
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={KENYA_TOPO_JSON}>
                {({ geographies }) => {
                  if (!geographies || geographies.length === 0) {
                    return (
                      <g>
                        {/* Fallback Kenya outline */}
                        <path
                          d="M 37.9 -4.5 L 40.5 -4.5 L 41.5 -2.5 L 41.0 -0.5 L 39.5 1.0 L 38.0 1.5 L 36.5 1.0 L 35.5 -0.5 L 36.0 -2.5 L 37.0 -4.0 Z"
                          fill="#e5e7eb"
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                        {/* Simplified county regions */}
                        <circle cx="38.5" cy="-1.5" r="8" fill={getCountyColor('Nairobi')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="40.0" cy="-3.5" r="6" fill={getCountyColor('Mombasa')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="35.5" cy="-0.5" r="7" fill={getCountyColor('Kisumu')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="40.5" cy="-0.5" r="9" fill={getCountyColor('Garissa')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="39.0" cy="-2.0" r="8" fill={getCountyColor('Tana River')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="40.5" cy="-2.5" r="7" fill={getCountyColor('Kilifi')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="37.5" cy="-1.0" r="6" fill={getCountyColor('Kiambu')} stroke="#ffffff" strokeWidth={0.5} />
                        <circle cx="36.5" cy="0.0" r="7" fill={getCountyColor('Nakuru')} stroke="#ffffff" strokeWidth={0.5} />
                      </g>
                    );
                  }

                  return geographies.map((geo) => {
                    // Handle Kenya counties - use the COUNTY property from the geojson
                    const countyName = geo.properties.COUNTY || '';

                    const countyInfo = getCountyData(countyName);
                    const isHovered = hoveredCounty === countyName;
                    const isSelected = selectedCounty === countyName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          countyName && countyData[countyName]
                            ? isSelected
                              ? '#3b82f6'
                              : isHovered
                                ? '#60a5fa'
                                : getCountyColor(countyName)
                            : '#e5e7eb' // Default color for areas without data
                        }
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 0.5}
                        style={{
                          default: {
                            outline: 'none',
                            cursor: countyName ? 'pointer' : 'default',
                          },
                          hover: {
                            outline: 'none',
                            cursor: countyName ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => countyName && setHoveredCounty(countyName)}
                        onMouseLeave={() => setHoveredCounty(null)}
                        onClick={() => countyName && setSelectedCounty(countyName)}
                      />
                    );
                  });
                }}
              </Geographies>
            </ComposableMap>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            {/* Risk Legend */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Risk Levels</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
                  High Risk
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mr-1"></div>
                  Medium Risk
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-1"></div>
                  Low Risk
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{countyList.length}</div>
                <div className="text-xs text-muted-foreground">Counties Monitored</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-destructive">{highRiskCounties}</div>
                <div className="text-xs text-muted-foreground">High Risk Counties</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalCandidates}</div>
                <div className="text-xs text-muted-foreground">Total Candidates</div>
              </div>
            </div>

            {/* Selected County Details */}
            {selectedCounty && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="text-sm font-semibold mb-2 text-primary">{selectedCounty} Details</h4>
                {(() => {
                  const county = getCountyData(selectedCounty);
                  return (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{
                              backgroundColor: getRiskColor(county.risk),
                            }}
                          ></div>
                          <span className="font-medium">{county.risk.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Score:</span>
                        <span className="font-medium">{county.value}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Candidates:</span>
                        <span className="font-medium">{county.candidates}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* County Details */}
            <div>
              <h4 className="text-sm font-semibold mb-2">All Counties {selectedCounty && `(Click to select)`}</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {countyList.map((county, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between text-xs bg-background p-2 rounded border cursor-pointer transition-colors ${
                      selectedCounty === county.name ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedCounty(county.name)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(county.risk) }}></div>
                      <span className="font-medium">{county.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{county.candidates}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span>{county.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
