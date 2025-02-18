import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Thermometer, Users, Activity, DollarSign, Utensils, Clock } from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts
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
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-primary" />
              <CardTitle>Daily Feeding Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedingSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{schedule.time}</p>
                      <p className="text-sm text-muted-foreground">{schedule.meal}</p>
                    </div>
                  </div>
                  <span className="font-bold">{schedule.amount}</span>
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
    </div>
  );
};

export default Dashboard;
