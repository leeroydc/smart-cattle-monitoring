
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
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
  Copyright,
  Eye,
  Activity,
  AlertOctagon,
  HeartPulse,
  Scale,
  Timer,
  Move // Changed from Movement to Move
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CattleLocation {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
  cattle: Array<{
    id: string; // Added id to the interface
    tag_number: string;
    temperature: number;
    health_status: string;
  }>;
}

const GpsTracking = () => {
  const [locations, setLocations] = useState<CattleLocation[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLocations = async () => {
    setIsRefreshing(true);
    try {
      const { data: cattleData, error: cattleError } = await supabase
        .from('cattle')
        .select(`
          id, // Explicitly selecting id
          tag_number,
          location,
          temperature,
          health_status,
          gps_tracking (
            battery_level,
            signal_strength
          )
        `)
        .order('tag_number', { ascending: true });

      if (cattleError) throw cattleError;

      const locationCounts: { [key: string]: number } = {
        Feeding: 0,
        Water: 0,
        Resting: 0
      };

      const cattleByLocation: { [key: string]: Array<any> } = {
        Feeding: [],
        Water: [],
        Resting: []
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

      cattleData?.forEach(cattle => {
        if (cattle.location && locationCounts.hasOwnProperty(cattle.location)) {
          locationCounts[cattle.location]++;
          cattleByLocation[cattle.location].push({
            ...cattle,
            tag_number: cattle.tag_number.padStart(6, '0')
          });
          
          const gpsData = Array.isArray(cattle.gps_tracking) ? 
            cattle.gps_tracking[0] : cattle.gps_tracking;

          if (gpsData) {
            if (gpsData.battery_level) {
              batteryLevels[cattle.location].push(gpsData.battery_level);
            }
            if (gpsData.signal_strength) {
              signalStrengths[cattle.location].push(gpsData.signal_strength);
            }
          }
        }
      });

      Object.keys(cattleByLocation).forEach(location => {
        cattleByLocation[location].sort((a, b) => 
          a.tag_number.localeCompare(b.tag_number, undefined, { numeric: true })
        );
      });

      const newLocations: CattleLocation[] = Object.keys(locationCounts).map(area => ({
        area: area as 'Feeding' | 'Water' | 'Resting',
        count: locationCounts[area],
        cattle: cattleByLocation[area],
        batteryLevel: batteryLevels[area].length 
          ? batteryLevels[area].reduce((a, b) => a + b, 0) / batteryLevels[area].length 
          : 100,
        signalStrength: signalStrengths[area].length 
          ? signalStrengths[area].reduce((a, b) => a + b, 0) / signalStrengths[area].length 
          : 100,
        lastUpdate: new Date().toISOString()
      }));

      setLocations(newLocations);

      setAlerts([]);
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

  const handleHealthReview = async (cattleId: string) => {
    try {
      const { data: cattleData, error } = await supabase
        .from('cattle')
        .update({ health_status: 'Under Treatment' })
        .eq('id', cattleId)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Cattle marked for health review');
      fetchLocations(); // Refresh the data
    } catch (error: any) {
      toast.error('Failed to update health status: ' + error.message);
    }
  };

  const getAbnormalityDetails = (cow: any) => {
    const abnormalities = [];
    
    if (cow.temperature > 39.5) {
      abnormalities.push({
        type: 'High Temperature',
        value: `${cow.temperature}°C`,
        severity: 'Critical',
        icon: <Thermometer className="w-4 h-4 text-red-500" />
      });
    }
    
    if (cow.temperature < 37.5) {
      abnormalities.push({
        type: 'Low Temperature',
        value: `${cow.temperature}°C`,
        severity: 'Warning',
        icon: <Thermometer className="w-4 h-4 text-yellow-500" />
      });
    }

    return abnormalities;
  };

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

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Cattle Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Real-time sensor monitoring and tracking
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? 'bg-primary/10' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh Sensors
          </Button>
          <Button
            variant="outline"
            onClick={handleManualRefresh}
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

      <div className="grid gap-6 md:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.area} className="transform hover:scale-105 transition-transform">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAreaIcon(location.area)}
                  <CardTitle>{location.area} Area</CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                      View Cattle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{location.area} Area - Cattle Details</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] mt-4">
                      <div className="space-y-4">
                        {location.cattle.map((cow) => (
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
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1">
                                  <Thermometer className="w-4 h-4" />
                                  Temperature
                                </span>
                                <span>{cow.temperature}°C</span>
                              </div>
                            </div>

                            {cow.health_status !== 'Healthy' && getAbnormalityDetails(cow).length > 0 && (
                              <div className="mt-3 space-y-2 bg-red-50 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold text-red-700 flex items-center gap-1">
                                  <AlertOctagon className="w-4 h-4" />
                                  Abnormal Behaviors Detected
                                </h4>
                                {getAbnormalityDetails(cow).map((abnormality, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1">
                                      {abnormality.icon}
                                      {abnormality.type}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                      ${abnormality.severity === 'Critical' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'}`
                                    }>
                                      {abnormality.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {cow.health_status === 'Healthy' && (
                              <Button 
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() => handleHealthReview(cow.id)}
                              >
                                <HeartPulse className="w-4 h-4 mr-1" />
                                Request Health Review
                              </Button>
                            )}
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
                  <p className="text-2xl font-bold">{location.count} cattle</p>
                  <Compass className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Currently in {location.area.toLowerCase()} area
                </div>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            GPS and Sensor Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Satellite className="w-4 h-4 text-blue-600" />
                GPS Location
              </h3>
              <div className="text-sm space-y-1">
                <p>Latitude: <span className="font-mono animate-pulse">12.3456°N</span></p>
                <p>Longitude: <span className="font-mono animate-pulse">78.9012°E</span></p>
                <Progress value={65} className="mt-2" />
                <p className="text-xs text-muted-foreground">Signal Strength: 65%</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-green-600" />
                Environmental Data
              </h3>
              <div className="text-sm space-y-1">
                <p>Temperature: <span className="font-mono animate-pulse">28.5°C</span></p>
                <p>Humidity: <span className="font-mono animate-pulse">65%</span></p>
                <Progress value={85} className="mt-2" />
                <p className="text-xs text-muted-foreground">DHT11 Status: 85%</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Move className="w-4 h-4 text-purple-600" /> {/* Changed from Movement to Move */}
                Motion Analysis
              </h3>
              <div className="text-sm space-y-1">
                <p>X-Axis: <span className="font-mono animate-pulse">0.23g</span></p>
                <p>Y-Axis: <span className="font-mono animate-pulse">0.15g</span></p>
                <p>Z-Axis: <span className="font-mono animate-pulse">1.02g</span></p>
                <Progress value={95} className="mt-2" />
                <p className="text-xs text-muted-foreground">MPU6050 Status: 95%</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Timer className="w-4 h-4 text-orange-600" />
                System Status
              </h3>
              <div className="text-sm space-y-1">
                <p>ESP32: <span className="text-green-500 animate-pulse">Active</span></p>
                <p>Last Update: <span className="font-mono">12:45:32</span></p>
                <Progress value={90} className="mt-2" />
                <p className="text-xs text-muted-foreground">System Health: 90%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Real-time Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span>Monitoring 24 active sensors</span>
                  </div>
                  <Progress value={75} className="mt-2" />
                  <p className="text-xs text-muted-foreground">Network Status: Good</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 via-green-100 to-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <HeartPulse className="w-4 h-4 text-green-600 animate-pulse" />
                    <span>All systems operational</span>
                  </div>
                  <Progress value={95} className="mt-2" />
                  <p className="text-xs text-muted-foreground">Last Check: 2 minutes ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center pt-8 border-t">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Copyright className="w-4 h-4" />
          <p>{new Date().getFullYear()} Smart Cattle Monitoring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GpsTracking;
