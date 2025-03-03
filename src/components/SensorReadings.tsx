
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase, castToType } from '@/integrations/supabase/client';
import { 
  Thermometer, 
  Droplet, 
  Battery, 
  Signal, 
  MapPin, 
  RotateCw,
  AlertTriangle
} from 'lucide-react';

interface SensorReading {
  id: string;
  temperature?: number;
  humidity?: number;
  battery_level?: number;
  signal_strength?: number;
  cattle_id?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

const SensorReadings = () => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    setLoading(true);
    try {
      // Using raw query to get around type limitations
      const { data, error } = await supabase
        .rpc('get_latest_sensor_readings', { limit_count: 10 })
        .select('*');

      if (error) {
        throw error;
      }

      // Cast the data to our expected type
      setReadings(castToType<SensorReading[]>(data || []));
      setError(null);
    } catch (err: any) {
      console.error('Error fetching sensor data:', err);
      setError(err.message);
      toast.error('Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();

    // Set up real-time subscription for new sensor readings
    const channel = supabase
      .channel('sensor_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          setReadings((current) => [castToType<SensorReading>(payload.new), ...current.slice(0, 9)]);
          toast.info('New sensor reading received');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTemperatureColor = (temp?: number) => {
    if (!temp) return 'text-gray-500';
    if (temp > 39.5) return 'text-red-500';
    if (temp < 37.5) return 'text-blue-500';
    return 'text-green-500';
  };

  const getHumidityColor = (humidity?: number) => {
    if (!humidity) return 'text-gray-500';
    if (humidity > 70) return 'text-blue-500';
    if (humidity < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-500';
    if (level < 20) return 'text-red-500';
    if (level < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSignalColor = (level?: number) => {
    if (!level) return 'text-gray-500';
    if (level < 30) return 'text-red-500';
    if (level < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sensor Readings</h2>
        <Button 
          variant="outline" 
          onClick={fetchSensorData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {readings.length === 0 && !loading && !error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No sensor readings available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {readings.map((reading) => (
            <Card key={reading.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Sensor Reading
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(reading.created_at)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className={`w-4 h-4 mr-2 ${getTemperatureColor(reading.temperature)}`} />
                        <span>Temperature</span>
                      </div>
                      <span className={`font-medium ${getTemperatureColor(reading.temperature)}`}>
                        {reading.temperature !== undefined ? `${reading.temperature}°C` : 'N/A'}
                      </span>
                    </div>
                    {reading.temperature !== undefined && (
                      <Progress 
                        value={Math.min(100, ((reading.temperature - 35) / 10) * 100)} 
                        className="h-1.5" 
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Droplet className={`w-4 h-4 mr-2 ${getHumidityColor(reading.humidity)}`} />
                        <span>Humidity</span>
                      </div>
                      <span className={`font-medium ${getHumidityColor(reading.humidity)}`}>
                        {reading.humidity !== undefined ? `${reading.humidity}%` : 'N/A'}
                      </span>
                    </div>
                    {reading.humidity !== undefined && (
                      <Progress 
                        value={reading.humidity} 
                        className="h-1.5" 
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(reading.battery_level)}`} />
                        <span>Battery</span>
                      </div>
                      <span className={`font-medium ${getBatteryColor(reading.battery_level)}`}>
                        {reading.battery_level !== undefined ? `${reading.battery_level}%` : 'N/A'}
                      </span>
                    </div>
                    {reading.battery_level !== undefined && (
                      <Progress 
                        value={reading.battery_level} 
                        className="h-1.5" 
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Signal className={`w-4 h-4 mr-2 ${getSignalColor(reading.signal_strength)}`} />
                        <span>Signal</span>
                      </div>
                      <span className={`font-medium ${getSignalColor(reading.signal_strength)}`}>
                        {reading.signal_strength !== undefined ? `${reading.signal_strength}%` : 'N/A'}
                      </span>
                    </div>
                    {reading.signal_strength !== undefined && (
                      <Progress 
                        value={reading.signal_strength} 
                        className="h-1.5" 
                      />
                    )}
                  </div>
                </div>

                {(reading.lat !== undefined && reading.lng !== undefined) && (
                  <div className="pt-2">
                    <div className="flex items-center mb-1">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Location</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lat: {reading.lat.toFixed(6)}, Lng: {reading.lng.toFixed(6)}
                    </div>
                  </div>
                )}

                {reading.cattle_id && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Cattle ID: {reading.cattle_id}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SensorReadings;
