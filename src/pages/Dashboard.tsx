import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchFeedDistribution();
  }, []);

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

  const cattleStats = {
    averageTemperature: 38.2,
    averageFeedingRate: 4.5,
    totalCattle: 200,
    healthyCattle: 185,
    sickCattle: 10,
    readyForSale: 25
  };

  const feedingSchedule = [
    { time: 'Morning', meal: 'Hay and Grains', amount: '15 kg' },
    { time: 'Afternoon', meal: 'Fresh Grass', amount: '10 kg' },
    { time: 'Evening', meal: 'Mixed Feed', amount: '12 kg' },
  ];

  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);

  const nutritionalRecommendations = [
    { name: 'Hay', percentage: 40, icon: <Wheat className="w-5 h-5" />, details: 'Rich in fiber, essential for digestion' },
    { name: 'Fresh Grass', percentage: 30, icon: <Leaf className="w-5 h-5" />, details: 'Source of protein and nutrients' },
    { name: 'Grains', percentage: 20, icon: <Apple className="w-5 h-5" />, details: 'Energy source for growth' },
    { name: 'Water', percentage: 10, icon: <Droplet className="w-5 h-5" />, details: 'Essential for hydration' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{`${payload[0].feed_type}`}</p>
          <p className="text-primary">{`${payload[0].percentage}%`}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].details}
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
              <Thermometer className="w-4 h-4 text-primary" />
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
              <Users className="w-4 h-4 text-green-600" />
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
              <Activity className="w-4 h-4 text-yellow-600" />
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
              <CardTitle className="text-sm font-medium">Ready for Sale</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{cattleStats.readyForSale}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Feed Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedingData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="feed_type"
                  >
                    {feedingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {feedingData.map((feed, index) => (
                <div key={feed.feed_type} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-sm truncate">
                    {feed.feed_type} ({feed.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-primary" />
              <CardTitle>Nutritional Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {nutritionalRecommendations.map((nutrient, index) => (
                <div
                  key={nutrient.name}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                    selectedNutrient === nutrient.name ? 'bg-primary/10 border-primary' : 'bg-accent/10'
                  }`}
                  onClick={() => setSelectedNutrient(nutrient.name)}
                >
                  <div className="flex items-center space-x-3">
                    {nutrient.icon}
                    <div className="flex-1">
                      <p className="font-medium">{nutrient.name}</p>
                      <p className="text-sm text-muted-foreground">{nutrient.percentage}%</p>
                    </div>
                  </div>
                  {selectedNutrient === nutrient.name && (
                    <p className="mt-2 text-sm text-muted-foreground">{nutrient.details}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Temperature (24h)</CardTitle>
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
