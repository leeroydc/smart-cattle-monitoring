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
import { Eye, Trash2, Syringe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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

  useEffect(() => {
    fetchCattle();
  }, []);

  const fetchCattle = async () => {
    const { data, error } = await supabase
      .from('cattle')
      .select('*')
      .order('tag_number', { ascending: true });

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
      toast.success('Record deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete record: ' + error.message);
    }
  };

  const handleAdministerMedicine = async (cattle: Cattle) => {
    const { error } = await supabase
      .from('cattle')
      .update({ health_status: 'Under Treatment' })
      .eq('id', cattle.id);

    if (error) {
      toast.error('Failed to update treatment status');
    } else {
      toast.success('Medicine administered successfully');
      fetchCattle();
    }
    setIsAdministeringMedicine(false);
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
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
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
