
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Satellite } from 'lucide-react';

interface HeaderProps {
  autoRefresh: boolean;
  isRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  autoRefresh,
  isRefreshing,
  onToggleAutoRefresh,
  onManualRefresh,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">GPS & RFID Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Real-time sensor monitoring and tracking
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onToggleAutoRefresh}
          className={autoRefresh ? 'bg-primary/10' : ''}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
          Auto Refresh Sensors
        </Button>
        <Button
          variant="outline"
          onClick={onManualRefresh}
          disabled={isRefreshing}
        >
          <Satellite className="w-4 h-4 mr-2" />
          Update Sensors
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
};
