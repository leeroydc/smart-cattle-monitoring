
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Thermometer, Users, Activity, DollarSign, Utensils, Clock, Leaf, Wheat, Apple, Droplet, Copyright } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface FeedDistribution {
  id: string;
  feed_type: string;
  percentage: number;
  details?: string;
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feedingData, setFeedingData] = useState<FeedDistribution[]>([]);
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
          <p className="font-medium">{`${payload[0].payload.feed_type}`}</p>
          <p className="text-primary">{`${payload[0].value}%`}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.details}
          </p>
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
        {/* Feed Distribution Card - Now using BarChart */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Feed Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="feed_type" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
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

        {/* Temperature Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Temperature (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
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
