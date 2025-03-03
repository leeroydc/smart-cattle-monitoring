import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
  List
} from 'lucide-react';
import { supabase, Cattle, castToType } from '@/integrations/supabase/client';

interface CattleLocation {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
  cattle: Cattle[];
}

const GpsTracking = () => {
  const [locations, setLocations] = useState<CattleLocation[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showCattleList, setShowCattleList] = useState(false);
  const [allCattle, setAllCattle] = useState<Cattle[]>([]);

  const fetchLocations = async () => {
    setIsRefreshing(true);
    try {
      const { data: cattleData, error: cattleError } = await supabase
        .from('cattle')
        .select(`
          id,
          tag_number,
          temperature,
          weight,
          health_status,
          location,
          created_at,
          updated_at,
          gps_tracking (
            battery_level,
            signal_strength,
            last_updated
          )
        `)
        .order('tag_number', { ascending: true });

      if (cattleError) {
        throw cattleError;
      }

      const typedCattleData = castToType<Cattle[]>(cattleData);
      setAllCattle(typedCattleData);

      const locationCounts: { [key: string]: number } = {
        Feeding: 0,
        Water: 0,
        Resting: 0
      };

      const cattleByLocation: { [key: string]: Array<Cattle> } = {
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

      typedCattleData?.forEach(cattle => {
        if (cattle.location && locationCounts.hasOwnProperty(cattle.location)) {
          locationCounts[cattle.location]++;
          cattleByLocation[cattle.location].push(cattle);
          
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Cattle Monitoring</h1>
          <p className="text-muted-foreground mt-1">GPS and Sensor Data</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowCattleList(!showCattleList)}
            className={showCattleList ? 'bg-primary/10' : ''}
          >
            <List className="w-4 h-4 mr-2" />
            {showCattleList ? 'Hide' : 'Show'} All Cattle
          </Button>
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

      {showCattleList && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Complete Cattle List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag #</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Health Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCattle.map((cow) => (
                    <TableRow key={cow.id}>
                      <TableCell className="font-medium">{cow.tag_number}</TableCell>
                      <TableCell>{cow.location}</TableCell>
                      <TableCell>{cow.temperature}°C</TableCell>
                      <TableCell>{cow.weight} kg</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getHealthStatusColor(cow.health_status)}`}>
                          {cow.health_status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

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
                          <div key={cow.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">Tag #{cow.tag_number}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getHealthStatusColor(cow.health_status)}`}>
                                {cow.health_status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <p className="text-sm text-muted-foreground">
                                Temperature: {cow.temperature}°C
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Weight: {cow.weight} kg
                              </p>
                            </div>
                          </div>
                        ))}
                        {location.cattle.length === 0 && (
                          <p className="text-center text-muted-foreground">
                            No cattle in this area
                          </p>
                        )}
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Sensor Monitoring Dashboard
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
                <p>Latitude: <span className="font-mono">--.-°N</span></p>
                <p>Longitude: <span className="font-mono">--.-°E</span></p>
                <Progress value={0} className="mt-2" />
                <p className="text-xs text-muted-foreground">Awaiting GPS signal...</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-green-600" />
                DHT11 Sensor
              </h3>
              <div className="text-sm space-y-1">
                <p>Temperature: <span className="font-mono">--°C</span></p>
                <p>Humidity: <span className="font-mono">--%</span></p>
                <Progress value={0} className="mt-2" />
                <p className="text-xs text-muted-foreground">Initializing sensor...</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Navigation className="w-4 h-4 text-purple-600" />
                MPU6050 Accelerometer
              </h3>
              <div className="text-sm space-y-1">
                <p>X-Axis: <span className="font-mono">0.00g</span></p>
                <p>Y-Axis: <span className="font-mono">0.00g</span></p>
                <p>Z-Axis: <span className="font-mono">0.00g</span></p>
                <Progress value={0} className="mt-2" />
                <p className="text-xs text-muted-foreground">Calibrating...</p>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600" />
                ESP32 Status
              </h3>
              <div className="text-sm space-y-1">
                <p>Status: <span className="text-yellow-500">Initializing</span></p>
                <p>Last Update: <span className="font-mono">--:--:--</span></p>
                <Progress value={0} className="mt-2" />
                <p className="text-xs text-muted-foreground">Connecting...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cattle Activity Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Activity Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={0} className="w-full" />
                    <p className="text-xs text-muted-foreground">Waiting for sensor data...</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>ESP32:</span>
                      <span className="text-yellow-500">Initializing</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Sensors:</span>
                      <span className="text-yellow-500">Connecting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

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
