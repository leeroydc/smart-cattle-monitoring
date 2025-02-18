
import React, { useState } from 'react';
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

const generateCattle = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    temperature: (37 + Math.random()).toFixed(1),
    feedingRate: Math.floor(Math.random() * 5) + 1,
    health: Math.random() > 0.15 ? 'Healthy' : 'Under Treatment',
    forSale: Math.random() > 0.8,
  }));

const CattleDetails = () => {
  const [cattle] = useState(generateCattle(200));

  const healthyCattle = cattle.filter((c) => c.health === 'Healthy');
  const sickCattle = cattle.filter((c) => c.health === 'Under Treatment');
  const forSaleCattle = cattle.filter((c) => c.forSale);

  const CattleTable = ({ data }: { data: typeof cattle }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Feeding Rate (kg/day)</TableHead>
            <TableHead>Health Status</TableHead>
            <TableHead>For Sale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cow) => (
            <TableRow key={cow.id}>
              <TableCell>{cow.id}</TableCell>
              <TableCell>{cow.temperature}</TableCell>
              <TableCell>{cow.feedingRate}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    cow.health === 'Healthy'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {cow.health}
                </span>
              </TableCell>
              <TableCell>
                {cow.forSale ? (
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    Yes
                  </span>
                ) : (
                  'No'
                )}
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
          <TabsTrigger value="sale">For Sale ({forSaleCattle.length})</TabsTrigger>
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
        <TabsContent value="sale">
          <CattleTable data={forSaleCattle} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CattleDetails;
