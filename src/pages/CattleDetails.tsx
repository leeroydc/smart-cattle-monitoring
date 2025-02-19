
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

interface Cattle {
  id: string;
  tag_number: string;
  temperature: number;
  health_status: string;
  location: string;
}

const CattleDetails = () => {
  const [cattle, setCattle] = useState<Cattle[]>([]);

  useEffect(() => {
    fetchCattle();
  }, []);

  const fetchCattle = async () => {
    const { data, error } = await supabase
      .from('cattle')
      .select('*');

    if (data) {
      setCattle(data);
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
            <TableHead>Tag Number</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Health Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cow) => (
            <TableRow key={cow.id}>
              <TableCell>{cow.tag_number}</TableCell>
              <TableCell>{cow.temperature}</TableCell>
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
