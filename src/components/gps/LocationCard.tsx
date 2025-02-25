
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Battery, Signal, Compass, Sun, Moon, Droplet, MapPin, Eye } from 'lucide-react';

interface CattleData {
  tag_number: string;
  temperature: number;
  health_status: string;
}

interface LocationCardProps {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
  cattle: CattleData[];
}

const getAreaIcon = (area: string) => {
  switch (area) {
    case 'Feeding':
      return <Sun className="w-5 h-5 text-yellow-500" />;
    case 'Water':
      return <Droplet className="w-5 h-5 text-blue-500" />;
    case 'Resting':
      return <Moon className="w-5 h-5 text-purple-500" />;
    default:
      return <MapPin className="w-5 h-5 text-primary" />;
  }
};

export const LocationCard: React.FC<LocationCardProps> = ({
  area,
  count,
  batteryLevel,
  signalStrength,
  lastUpdate,
  cattle,
}) => {
  return (
    <Card className="transform hover:scale-105 transition-transform">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getAreaIcon(area)}
            <CardTitle>{area} Area</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{area} Area - Cattle Details</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] mt-4">
                <div className="space-y-4">
                  {cattle.map((cow) => (
                    <div key={cow.tag_number} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Tag #{cow.tag_number}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          cow.health_status === 'Healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : cow.health_status === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cow.health_status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Temperature: {cow.temperature}°C
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2 bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold">{count} cattle</p>
            <Compass className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div className="text-sm text-muted-foreground">
            Currently in {area.toLowerCase()} area
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4" />
              <span>Battery</span>
            </div>
            <span className={`font-medium ${batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`}>
              {Math.round(batteryLevel)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4" />
              <span>Signal</span>
            </div>
            <span className={`font-medium ${signalStrength < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
              {Math.round(signalStrength)}%
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
