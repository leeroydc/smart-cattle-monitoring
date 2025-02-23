import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Battery, 
  Signal, 
  Compass, 
  Thermometer,
  Droplet,
  Sun,
  Moon,
  RefreshCw,
  Satellite,
  Copyright
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CattleLocation {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
}

const GpsTracking = () => {
  const [locations, setLocations] = useState<CattleLocation[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLocations = async () => {
    setIsRefreshing(true);
    try {
      const { data: gpsData, error } = await supabase
        .from('gps_tracking')
        .select(`
          id,
          location,
          battery_level,
          signal_strength,
          created_at,
          cattle_id,
          cattle (
            health_status
          )
        `);

      if (error) throw error;

      const locationCounts: { [key: string]: number } = {
        Feeding: 0,
        Water: 0,
        Resting: 0
      };

      const batteryLevels: { [key: string]: number[] } = {
        Feeding: [],
        Water: [],
        Resting: []
      };

      const signalStrengths: { [key: string]: number[] } = {
        Feeding: [],
        Water: [],
        Resting: []
      };

      gpsData.forEach(item => {
        const location = item.location as 'Feeding' | 'Water' | 'Resting';
        if (location) {
          locationCounts[location]++;
          if (item.battery_level) batteryLevels[location].push(item.battery_level);
          if (item.signal_strength) signalStrengths[location].push(item.signal_strength);
        }
      });

      const newLocations: CattleLocation[] = Object.keys(locationCounts).map(area => ({
        area: area as 'Feeding' | 'Water' | 'Resting',
        count: locationCounts[area],
        batteryLevel: batteryLevels[area].length 
          ? batteryLevels[area].reduce((a, b) => a + b, 0) / batteryLevels[area].length 
          : 100,
        signalStrength: signalStrengths[area].length 
          ? signalStrengths[area].reduce((a, b) => a + b, 0) / signalStrengths[area].length 
          : 100,
        lastUpdate: new Date().toISOString()
      }));

      setLocations(newLocations);

      newLocations.forEach(loc => {
        if (loc.batteryLevel < 20) {
          setAlerts(prev => [...prev, `Low battery alert in ${loc.area} area`]);
        }
        if (loc.signalStrength < 50) {
          setAlerts(prev => [...prev, `Poor signal strength in ${loc.area} area`]);
        }
      });
    } catch (error: any) {
      toast.error('Failed to fetch GPS data: ' + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    let interval: NodeJS.Timeout;

    if (autoRefresh) {
      interval = setInterval(fetchLocations, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

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

  const handleManualRefresh = () => {
    fetchLocations();
    toast.success('GPS data refreshed');
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GPS & RFID Tracking</h1>
          <p className="text-muted-foreground mt-1">Real-time location monitoring</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? 'bg-primary/10' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <Satellite className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.area} className="transform hover:scale-105 transition-transform">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAreaIcon(location.area)}
                  <CardTitle>{location.area} Area</CardTitle>
                </div>
                <Navigation className="w-5 h-5 text-muted-foreground animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{location.count} cattle</p>
                <Compass className="w-5 h-5 text-primary animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4" />
                    <span>Battery</span>
                  </div>
                  <span className={`font-medium ${location.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.round(location.batteryLevel)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Signal className="w-4 h-4" />
                    <span>Signal</span>
                  </div>
                  <span className={`font-medium ${location.signalStrength < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {Math.round(location.signalStrength)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-medium">38.5°C</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(location.lastUpdate).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length > 0 && (
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
      )}

      <div className="aspect-video overflow-hidden rounded-lg border bg-muted relative">
        <img 
          src="/cattle-grazing.jpg" 
          alt="Grazing Cattle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Live GPS Tracking</h2>
            <p className="text-white/90">
              Total cattle tracked: {locations.reduce((acc, loc) => acc + loc.count, 0)}
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center pt-8 border-t">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Copyright className="w-4 h-4" />
          <p>{new Date().getFullYear()} Cattle Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GpsTracking;
