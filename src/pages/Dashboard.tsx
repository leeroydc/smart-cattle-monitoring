import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Thermometer, Users, Activity, DollarSign, Utensils, Clock, Leaf, Wheat, Apple, Droplet, Info, Copyright } from 'lucide-react';

const Dashboard = () => {
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

  const feedingData = [
    { name: 'Hay', value: 40 },
    { name: 'Grass', value: 30 },
    { name: 'Grains', value: 20 },
    { name: 'Supplements', value: 10 },
  ];

  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);

  const nutritionalRecommendations = [
    { name: 'Hay', percentage: 40, icon: <Wheat className="w-5 h-5" />, details: 'Rich in fiber, essential for digestion' },
    { name: 'Fresh Grass', percentage: 30, icon: <Leaf className="w-5 h-5" />, details: 'Source of protein and nutrients' },
    { name: 'Grains', percentage: 20, icon: <Apple className="w-5 h-5" />, details: 'Energy source for growth' },
    { name: 'Water', percentage: 10, icon: <Droplet className="w-5 h-5" />, details: 'Essential for hydration' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Cattle Management System</h1>
        <p className="text-muted-foreground mt-2">Efficient Livestock Management Solution</p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-primary" />
              <CardTitle>Nutritional Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 gap-4">
              {nutritionalRecommendations.map((nutrient, index) => (
                <div
                  key={nutrient.name}
                  className={`p-4 rounded-lg border transition-all cursor-pointer transform hover:scale-105 ${
                    selectedNutrient === nutrient.name ? 'bg-primary/10 border-primary' : 'bg-accent/10'
                  }`}
                  onClick={() => setSelectedNutrient(nutrient.name)}
                >
                  <div className="flex items-center space-x-3">
                    {nutrient.icon}
                    <div>
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

        <Card>
          <CardHeader>
            <CardTitle>Average Temperature (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[35, 40]} />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feed Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedingData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feedingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
