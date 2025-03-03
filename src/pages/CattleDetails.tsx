import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Trash2, Syringe, AlertCircle, HeartPulse } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface Cattle {
  id: string;
  tag_number: string;
  temperature: number;
  weight: number;
  health_status: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

const CattleDetails = () => {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [isAdministeringMedicine, setIsAdministeringMedicine] = useState(false);
  const [unhealthyNotifications, setUnhealthyNotifications] = useState<Cattle[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    fetchCattle();
    
    // Set up real-time listener for cattle health changes
    const channel = supabase
      .channel('cattle_health_changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE',
          schema: 'public',
          table: 'cattle',
          filter: 'health_status=in.(Under Treatment,Critical)'
        },
        (payload) => {
          console.log('Health status change detected:', payload);
          const updatedCattle = payload.new as Cattle;
          
          if (updatedCattle.health_status === 'Under Treatment' || updatedCattle.health_status === 'Critical') {
            // Add to notifications if not already there
            setUnhealthyNotifications(prev => {
              if (!prev.some(c => c.id === updatedCattle.id)) {
                toast("Cattle health alert - Cattle #" + updatedCattle.tag_number + " needs medical attention!");
                return [...prev, updatedCattle];
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCattle = async () => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .select('*')
        .order('tag_number', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedData: Cattle[] = data.map(record => ({
          id: record.id,
          tag_number: record.tag_number,
          temperature: record.temperature || 37.5,
          weight: record.weight || 500,
          health_status: record.health_status || 'Healthy',
          location: record.location || 'Resting',
          created_at: record.created_at,
          updated_at: record.updated_at
        }));
        setCattle(formattedData);
        
        // Check for unhealthy cattle and add to notifications
        const unhealthyCattle = formattedData.filter(
          c => c.health_status === 'Under Treatment' || c.health_status === 'Critical'
        );
        
        if (unhealthyCattle.length > 0) {
          setUnhealthyNotifications(unhealthyCattle);
          // Only show toast notification on initial load if there are unhealthy cattle
          if (unhealthyCattle.length > 0) {
            toast("Unhealthy cattle detected - " + unhealthyCattle.length + " cattle need medical attention");
          }
        }
      }
    } catch (error: any) {
      toast("Error: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cattle')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCattle(prevCattle => prevCattle.filter(cow => cow.id !== id));
      setUnhealthyNotifications(prev => prev.filter(cow => cow.id !== id));
      toast.success('Record deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete record: ' + error.message);
    }
  };

  const handleAdministerMedicine = async (cattle: Cattle) => {
    try {
      const { error } = await supabase
        .from('cattle')
        .update({ health_status: 'Under Treatment' })
        .eq('id', cattle.id);

      if (error) throw error;
      
      toast.success('Medicine administered successfully');
      fetchCattle();
    } catch (error: any) {
      toast.error('Failed to update treatment status: ' + error.message);
    }
    setIsAdministeringMedicine(false);
  };

  const handleTreatCattle = async (cattleId: string) => {
    try {
      const { error } = await supabase
        .from('cattle')
        .update({ health_status: 'Healthy' })
        .eq('id', cattleId);

      if (error) throw error;

      // Update both lists
      setCattle(prev => prev.map(cow => 
        cow.id === cattleId ? { ...cow, health_status: 'Healthy' } : cow
      ));
      
      // Remove from notifications
      setUnhealthyNotifications(prev => prev.filter(cow => cow.id !== cattleId));
      
      toast.success('Treatment complete! Cattle is now healthy');
    } catch (error: any) {
      toast.error('Failed to update health status: ' + error.message);
    }
  };

  const healthyCattle = cattle.filter((c) => c.health_status === 'Healthy');
  const sickCattle = cattle.filter((c) => c.health_status === 'Under Treatment');
  const criticalCattle = cattle.filter((c) => c.health_status === 'Critical');

  const CattleTable = ({ data }: { data: Cattle[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">No.</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Health Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cow, index) => (
            <TableRow key={cow.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{cow.temperature}</TableCell>
              <TableCell>{cow.weight}</TableCell>
              <TableCell>{cow.location}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    cow.health_status === 'Healthy'
                      ? 'bg-green-100 text-green-800'
                      : cow.health_status === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {cow.health_status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCattle(cow)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cattle Details - Tag #{cow.tag_number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold">Temperature</p>
                            <p>{cow.temperature}°C</p>
                          </div>
                          <div>
                            <p className="font-semibold">Weight</p>
                            <p>{cow.weight} kg</p>
                          </div>
                          <div>
                            <p className="font-semibold">Location</p>
                            <p>{cow.location}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Health Status</p>
                            <p>{cow.health_status}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Created At</p>
                            <p>{new Date(cow.created_at!).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Last Updated</p>
                            <p>{new Date(cow.updated_at!).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(cow.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  {(cow.health_status === 'Under Treatment' || cow.health_status === 'Critical') && (
                    <Dialog open={isAdministeringMedicine} onOpenChange={setIsAdministeringMedicine}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Syringe className="w-4 h-4 text-yellow-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Administer Medicine</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <p>Administer medicine to cattle with tag #{cow.tag_number}?</p>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAdministeringMedicine(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleAdministerMedicine(cow)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cattle Details</h1>
        <div className="flex items-center gap-4">
          <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <AlertCircle className="w-5 h-5" />
                {unhealthyNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unhealthyNotifications.length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cattle Health Alerts</DialogTitle>
                <DialogDescription>
                  The following cattle require medical attention
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto">
                {unhealthyNotifications.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No unhealthy cattle at the moment</p>
                ) : (
                  <div className="space-y-3 py-2">
                    {unhealthyNotifications.map(cow => (
                      <div key={cow.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium flex items-center">
                            <span className="mr-2">#{cow.tag_number}</span>
                            {cow.health_status === 'Critical' ? (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                Critical
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Under Treatment
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Temperature: {cow.temperature}°C, Weight: {cow.weight}kg
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTreatCattle(cow.id)}
                          className="flex items-center gap-1"
                        >
                          <HeartPulse className="w-4 h-4 text-green-500" />
                          <span>Treat</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Cattle ({cattle.length})</TabsTrigger>
          <TabsTrigger value="healthy">Healthy ({healthyCattle.length})</TabsTrigger>
          <TabsTrigger value="sick">Under Treatment ({sickCattle.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({criticalCattle.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CattleTable data={cattle} />
        </TabsContent>
        <TabsContent value="healthy">
          <CattleTable data={healthyCattle} />
        </TabsContent>
        <TabsContent value="sick">
          <CattleTable data={sickCattle} />
        </TabsContent>
        <TabsContent value="critical">
          <CattleTable data={criticalCattle} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CattleDetails;
