import React from 'react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Smart Cattle Monitoring</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      <div>
        Dashboard Content
      </div>
    </div>
  );
};

export default Dashboard;
