
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface AlertsCardProps {
  alerts: string[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-yellow-500">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <CardTitle>System Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.slice(-3).map((alert, index) => (
            <div key={index} className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <p>{alert}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
