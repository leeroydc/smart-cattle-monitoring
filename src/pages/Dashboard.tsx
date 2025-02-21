import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Legend, PieChart, Pie 
} from 'recharts';
import { 
  Thermometer, Users, Activity, DollarSign, 
  Copyright, Scale, Heart 
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface FeedDistribution {
  id: string;
  feed_type: string;
  percentage: number;
  details?: string;
}

interface WeightData {
  range: string;
  count: number;
}

interface HealthData {
  status: string;
  count: number;
  color: string;
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feedingData, setFeedingData] = useState<FeedDistribution[]>([]);
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [cattleStats, setCattleStats] = useState({
    totalCattle: 0,
    healthyCattle: 0,
    sickCattle: 0,
    readyForSale: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchFeedDistribution();
    fetchCattleStats();
    fetchWeightDistribution();
    fetchHealthDistribution();
  }, []);

  const fetchCattleStats = async () => {
    const { data: cattleData, error } = await supabase
      .from('cattle')
      .select('*');

    if (cattleData) {
      const stats = {
        totalCattle: cattleData.length,
        healthyCattle: cattleData.filter(c => c.health_status === 'Healthy').length,
        sickCattle: cattleData.filter(c => c.health_status === 'Under Treatment').length,
        readyForSale: cattleData.filter(c => c.health_status === 'Critical').length,
      };
      setCattleStats(stats);
    }
  };

  const fetchFeedDistribution = async () => {
    const { data, error } = await supabase
      .from('feed_distribution')
      .select('*');
    
    if (data) {
      const enrichedData = data.map(item => ({
        ...item,
        details: getFeedDetails(item.feed_type)
      }));
      setFeedingData(enrichedData);
    }
  };

  const fetchWeightDistribution = async () => {
    const { data: cattleData, error } = await supabase
      .from('cattle')
      .select('weight');

    if (cattleData) {
      const weightRanges: { [key: string]: number } = {
        '300-400kg': 0,
        '401-500kg': 0,
        '501-600kg': 0,
        '601-700kg': 0,
        '700+kg': 0
      };

      cattleData.forEach(cattle => {
        const weight = cattle.weight || 0;
        if (weight <= 400) weightRanges['300-400kg']++;
        else if (weight <= 500) weightRanges['401-500kg']++;
        else if (weight <= 600) weightRanges['501-600kg']++;
        else if (weight <= 700) weightRanges['601-700kg']++;
        else weightRanges['700+kg']++;
      });

      setWeightData(Object.entries(weightRanges).map(([range, count]) => ({
        range,
        count
      })));
    }
  };

  const fetchHealthDistribution = async () => {
    const { data: cattleData, error } = await supabase
      .from('cattle')
      .select('health_status');

    if (cattleData) {
      const healthCounts = {
        'Healthy': 0,
        'Under Treatment': 0,
        'Critical': 0
      };

      cattleData.forEach(cattle => {
        if (cattle.health_status) {
          healthCounts[cattle.health_status as keyof typeof healthCounts]++;
        }
      });

      setHealthData([
        { status: 'Healthy', count: healthCounts['Healthy'], color: '#10B981' },
        { status: 'Under Treatment', count: healthCounts['Under Treatment'], color: '#F59E0B' },
        { status: 'Critical', count: healthCounts['Critical'], color: '#EF4444' }
      ]);
    }
  };

  const getFeedDetails = (feedType: string): string => {
    switch (feedType) {
      case 'Hay':
        return 'Rich in fiber, essential for digestion';
      case 'Grass':
        return 'Source of protein and nutrients';
      case 'Grains':
        return 'Energy source for growth';
      case 'Supplements':
        return 'Additional nutrients for health';
      default:
        return 'Essential feed component';
    }
  };

  const temperatureData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    temperature: 37 + Math.sin(i / 3) + Math.random(),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{label || payload[0].payload.status || payload[0].payload.range}</p>
          <p className="text-primary">{payload[0].value} {label ? '%' : 'cattle'}</p>
          {payload[0].payload.details && (
            <p className="text-sm text-muted-foreground">
              {payload[0].payload.details}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Cattle Management System</h1>
        <p className="text-muted-foreground mt-2">
          {format(currentTime, 'PPpp')}
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transform hover:scale-105 transition-transform">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleStats.totalCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-105 transition-transform">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-600" />
              <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cattleStats.healthyCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-105 transition-transform">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-yellow-600" />
              <CardTitle className="text-sm font-medium">Under Treatment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{cattleStats.sickCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-105 transition-transform">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{cattleStats.readyForSale}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Feed Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="feed_type" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" fill="#8884d8">
                    {feedingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-primary" />
              <CardTitle>Weight Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#60A5FA">
                    {weightData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${210 + index * 20}, 70%, 60%)`} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <CardTitle>Health Status Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {healthData.map((status) => (
                <div 
                  key={status.status} 
                  className="flex items-center justify-center p-2 rounded-md"
                  style={{ backgroundColor: `${status.color}20` }}
                >
                  <span className="text-sm font-medium" style={{ color: status.color }}>
                    {status.status}: {status.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-primary" />
              <CardTitle>Temperature (24h)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[35, 40]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#2563eb" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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

export default Dashboard;
