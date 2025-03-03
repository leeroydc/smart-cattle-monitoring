
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SensorData {
  temperature?: number;
  humidity?: number;
  battery_level?: number;
  signal_strength?: number;
  cattle_id?: string;
  lat?: number;
  lng?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'GET') {
      // Return all sensor data entries
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Handle POST - Receiving sensor data
    if (req.method === 'POST') {
      const body: SensorData = await req.json()
      console.log('Received sensor data:', body)

      // Validate the required fields
      if (body.temperature === undefined && body.humidity === undefined) {
        return new Response(
          JSON.stringify({ error: 'Temperature or humidity data is required' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // Insert the sensor data into the database
      const { data, error } = await supabase
        .from('sensor_readings')
        .insert({
          temperature: body.temperature,
          humidity: body.humidity,
          battery_level: body.battery_level,
          signal_strength: body.signal_strength,
          cattle_id: body.cattle_id,
          lat: body.lat,
          lng: body.lng,
        })
        .select()

      if (error) {
        console.error('Error inserting sensor data:', error)
        throw error
      }

      // If we have cattle_id, update the cattle record with the latest sensor values
      if (body.cattle_id) {
        try {
          // Get the cattle record to update
          const { data: cattleData, error: cattleError } = await supabase
            .from('cattle')
            .select('*')
            .eq('id', body.cattle_id)
            .single()

          if (cattleError) throw cattleError

          // Update the cattle record with the latest temperature if provided
          if (body.temperature !== undefined) {
            const { error: updateError } = await supabase
              .from('cattle')
              .update({ temperature: body.temperature })
              .eq('id', body.cattle_id)

            if (updateError) throw updateError
          }

          // Update GPS tracking data if provided
          if (body.lat !== undefined || body.lng !== undefined || 
              body.battery_level !== undefined || body.signal_strength !== undefined) {
            
            // Check if GPS tracking record exists
            const { data: gpsData, error: gpsError } = await supabase
              .from('gps_tracking')
              .select('*')
              .eq('cattle_id', body.cattle_id)
              
            if (gpsError) throw gpsError

            if (gpsData && gpsData.length > 0) {
              // Update existing GPS tracking record
              const { error: updateGpsError } = await supabase
                .from('gps_tracking')
                .update({
                  lat: body.lat !== undefined ? body.lat : gpsData[0].lat,
                  lng: body.lng !== undefined ? body.lng : gpsData[0].lng,
                  battery_level: body.battery_level !== undefined ? body.battery_level : gpsData[0].battery_level,
                  signal_strength: body.signal_strength !== undefined ? body.signal_strength : gpsData[0].signal_strength,
                  last_updated: new Date().toISOString()
                })
                .eq('cattle_id', body.cattle_id)

              if (updateGpsError) throw updateGpsError
            } else {
              // Create new GPS tracking record
              const { error: insertGpsError } = await supabase
                .from('gps_tracking')
                .insert({
                  cattle_id: body.cattle_id,
                  lat: body.lat,
                  lng: body.lng,
                  battery_level: body.battery_level,
                  signal_strength: body.signal_strength,
                  last_updated: new Date().toISOString()
                })

              if (insertGpsError) throw insertGpsError
            }
          }
        } catch (cattleUpdateError) {
          console.error('Error updating cattle record:', cattleUpdateError)
          // Continue with response even if cattle update fails
        }
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
