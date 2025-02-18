
import React from 'react';
import { Button } from '@/components/ui/button';

const GpsTracking = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GPS Tracking</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            GPS tracking visualization will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default GpsTracking;
