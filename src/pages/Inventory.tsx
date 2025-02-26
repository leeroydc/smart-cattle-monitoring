
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Droplet, Pill, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const inventory = [
  {
    name: 'Hay',
    quantity: 1500,
    unit: 'kg',
    sustainability: 15,
    progress: 75,
    type: 'feed',
  },
  {
    name: 'Grain Feed',
    quantity: 800,
    unit: 'kg',
    sustainability: 10,
    progress: 50,
    type: 'feed',
  },
  {
    name: 'Mineral Supplements',
    quantity: 200,
    unit: 'kg',
    sustainability: 20,
    progress: 90,
    type: 'feed',
  },
  {
    name: 'Water Supply',
    quantity: 5000,
    unit: 'L',
    sustainability: 5,
    progress: 25,
    type: 'water',
  },
  {
    name: 'Medical Supplies',
    quantity: 100,
    unit: 'units',
    sustainability: 30,
    progress: 85,
    type: 'medicine',
  },
];

const Inventory = () => {
  const handleDistribute = async (item: typeof inventory[0]) => {
    try {
      let targetLocation = '';
      switch (item.type) {
        case 'water':
          targetLocation = 'Water';
          break;
        case 'feed':
          targetLocation = 'Feeding';
          break;
        case 'medicine':
          // Medicine can be distributed anywhere
          return;
      }

      // If it's medicine, we don't update locations
      if (item.type !== 'medicine') {
        const { data: cattleInArea, error: queryError } = await supabase
          .from('cattle')
          .select('id')
          .eq('location', targetLocation);

        if (queryError) throw queryError;

        if (!cattleInArea || cattleInArea.length === 0) {
          toast.error(`No cattle found in ${targetLocation} area`);
          return;
        }
      }

      // Show success message based on type
      switch (item.type) {
        case 'water':
          toast.success(`Water distributed to Water area`);
          break;
        case 'feed':
          toast.success(`${item.name} distributed to Feeding area`);
          break;
        case 'medicine':
          toast.success(`Medical supplies ready for distribution`);
          break;
      }
    } catch (error: any) {
      toast.error('Failed to distribute: ' + error.message);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplet className="w-4 h-4" />;
      case 'medicine':
        return <Pill className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
    }
  };

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                    >
                      {getItemIcon(item.type)}
                      <span className="ml-2">Distribute {item.name}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Distribute {item.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'water' && "Water will be distributed to the Water area"}
                        {item.type === 'feed' && "Feed will be distributed to the Feeding area"}
                        {item.type === 'medicine' && "Medical supplies can be administered to any cattle"}
                      </p>
                      <p className="mt-2 text-sm">
                        Available: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => handleDistribute(item)}
                      >
                        Confirm Distribution
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
