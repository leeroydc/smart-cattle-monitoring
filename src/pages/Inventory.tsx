
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const inventory = [
  {
    name: 'Hay',
    quantity: 1500,
    unit: 'kg',
    sustainability: 15,
    progress: 75,
  },
  {
    name: 'Grain Feed',
    quantity: 800,
    unit: 'kg',
    sustainability: 10,
    progress: 50,
  },
  {
    name: 'Mineral Supplements',
    quantity: 200,
    unit: 'kg',
    sustainability: 20,
    progress: 90,
  },
  {
    name: 'Water Supply',
    quantity: 5000,
    unit: 'L',
    sustainability: 5,
    progress: 25,
  },
  {
    name: 'Medical Supplies',
    quantity: 100,
    unit: 'units',
    sustainability: 30,
    progress: 85,
  },
];

const Inventory = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <Card key={item.name} className="overflow-hidden">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sustainability:</span>
                  <span className="font-medium">{item.sustainability} days</span>
                </div>
                <Progress value={item.progress} className="mt-2" />
                <p className="text-xs text-muted-foreground">
                  {item.progress}% remaining
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
