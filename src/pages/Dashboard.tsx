
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
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
            <div className="text-2xl font-bold">200</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">185</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Under Treatment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">10</div>
          </CardContent>
        </Card>
        
        <Card className="transform scale-115">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ready for Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">25</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
