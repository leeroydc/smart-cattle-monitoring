
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Cattle Management System</h1>
        <p className="text-muted-foreground mt-2">Efficient Livestock Management Solution</p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleStats.totalCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cattleStats.healthyCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Under Treatment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{cattleStats.sickCattle}</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ready for Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{cattleStats.readyForSale}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
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
            <CardTitle>Cattle Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Healthy', value: cattleStats.healthyCattle },
                { name: 'Sick', value: cattleStats.sickCattle },
                { name: 'For Sale', value: cattleStats.readyForSale }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
