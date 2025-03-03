
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Initialize Supabase client with the service role key (for admin operations)
    
    if (req.method === "GET") {
      // Extract limit parameter from URL if present
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "10");
      
      // Fetch latest sensor readings
      const { data, error } = await supabaseClient
        .from("sensor_readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    if (req.method === "POST") {
      // Parse the request body
      const requestData = await req.json();
      console.log("Received sensor data:", requestData);
      
      // Validate required fields
      if (!requestData.temperature && !requestData.humidity) {
        throw new Error("At least one sensor reading (temperature or humidity) is required");
      }
      
      // Prepare data for insertion
      const sensorData = {
        temperature: requestData.temperature,
        humidity: requestData.humidity,
        battery_level: requestData.battery_level,
        signal_strength: requestData.signal_strength,
        lat: requestData.lat,
        lng: requestData.lng,
        cattle_id: requestData.cattle_id,
      };
      
      // Insert data into the sensor_readings table
      const { data, error } = await supabaseClient
        .from("sensor_readings")
        .insert(sensorData)
        .select();
        
      if (error) throw error;
      
      // If cattle_id provided, update the cattle record with latest readings
      if (requestData.cattle_id) {
        const cattleUpdate = {};
        
        if (requestData.temperature) {
          cattleUpdate.temperature = requestData.temperature;
        }
        
        // Update GPS tracking if location data is provided
        if (requestData.lat && requestData.lng) {
          const gpsData = {
            cattle_id: requestData.cattle_id,
            lat: requestData.lat, 
            lng: requestData.lng
          };
          
          if (requestData.battery_level) {
            gpsData.battery_level = requestData.battery_level;
          }
          
          if (requestData.signal_strength) {
            gpsData.signal_strength = requestData.signal_strength;
          }
          
          // Check if GPS record exists for this cattle_id
          const { data: existingGps } = await supabaseClient
            .from("gps_tracking")
            .select("id")
            .eq("cattle_id", requestData.cattle_id)
            .maybeSingle();
            
          if (existingGps) {
            // Update existing GPS record
            await supabaseClient
              .from("gps_tracking")
              .update(gpsData)
              .eq("cattle_id", requestData.cattle_id);
          } else {
            // Insert new GPS record
            await supabaseClient
              .from("gps_tracking")
              .insert(gpsData);
          }
        }
        
        // Update the cattle record if we have updates
        if (Object.keys(cattleUpdate).length > 0) {
          await supabaseClient
            .from("cattle")
            .update(cattleUpdate)
            .eq("id", requestData.cattle_id);
        }
      }
      
      return new Response(JSON.stringify({ success: true, data: data[0] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }
    
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
