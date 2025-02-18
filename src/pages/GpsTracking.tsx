
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CattleLocation {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
}

const GpsTracking = () => {
  const [locations, setLocations] = useState<CattleLocation[]>([
    { area: 'Feeding', count: 85 },
    { area: 'Water', count: 45 },
    { area: 'Resting', count: 70 },
  ]);

  // Simulate RFID detection updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prev => prev.map(loc => ({
        ...loc,
        count: loc.count + Math.floor(Math.random() * 5) - 2
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GPS & RFID Tracking</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.area}>
            <CardHeader>
              <CardTitle>{location.area} Area</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{location.count} cattle detected</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="aspect-video overflow-hidden rounded-lg border bg-muted relative">
        <img 
          src="/grazing-cattle.jpg" 
          alt="Grazing Cattle"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Live GPS Tracking</h2>
            <p className="text-muted-foreground">
              Total cattle tracked: {locations.reduce((acc, loc) => acc + loc.count, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpsTracking;
