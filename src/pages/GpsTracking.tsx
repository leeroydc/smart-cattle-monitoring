
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Copyright } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LocationCard } from '@/components/gps/LocationCard';
import { AlertsCard } from '@/components/gps/AlertsCard';
import { Header } from '@/components/gps/Header';

interface CattleLocation {
  area: 'Feeding' | 'Water' | 'Resting';
  count: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
  cattle: Array<{
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

      cattleData.forEach(cattle => {
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
      <Header
        autoRefresh={autoRefresh}
        isRefreshing={isRefreshing}
        onToggleAutoRefresh={toggleAutoRefresh}
        onManualRefresh={handleManualRefresh}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {locations.map((location) => (
          <LocationCard
            key={location.area}
            {...location}
          />
        ))}
      </div>

      <AlertsCard alerts={alerts} />

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
