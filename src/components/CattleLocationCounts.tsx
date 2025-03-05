
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, Cattle } from '@/integrations/supabase/client';

const CattleLocationCounts = () => {
  const [locationCounts, setLocationCounts] = useState({
    Feeding: 0,
    Water: 0,
    Resting: 0,
    total: 0
  });

  useEffect(() => {
    // Initial fetch
    fetchLocationCounts();

    // Set up real-time listener for cattle location changes
    const channel = supabase
      .channel('cattle_location_changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE',
          schema: 'public',
          table: 'cattle',
        },
        (payload) => {
          console.log('Location change detected:', payload);
          // Instead of updating just one count, refetch all to maintain accurate totals
          fetchLocationCounts();
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'cattle',
        },
        () => fetchLocationCounts()
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE',
          schema: 'public',
          table: 'cattle',
        },
        () => fetchLocationCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLocationCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .select('location');

      if (error) throw error;

      if (data) {
        const counts = data.reduce((acc: any, cattle: any) => {
          const location = cattle.location || 'Unknown';
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {});

        const total = data.length;
        
        setLocationCounts({
          Feeding: counts['Feeding'] || 0,
          Water: counts['Water'] || 0, 
          Resting: counts['Resting'] || 0,
          total: total
        });
      }
    } catch (error: any) {
      console.error('Error fetching location counts:', error.message);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Feeding Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationCounts.Feeding}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((locationCounts.Feeding / locationCounts.total) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Water Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationCounts.Water}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((locationCounts.Water / locationCounts.total) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Resting Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationCounts.Resting}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((locationCounts.Resting / locationCounts.total) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationCounts.total}</div>
          <p className="text-xs text-muted-foreground">
            All tracked cattle
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleLocationCounts;
