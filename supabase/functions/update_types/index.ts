// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the project ID from the environment variable
    const projectId = Deno.env.get("SUPABASE_PROJECT_ID");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!projectId || !serviceKey) {
      throw new Error("Missing environment variables");
    }

    // Generate types using the Supabase Management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectId}/types/typescript`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to generate types: ${response.statusText}`);
    }

    const types = await response.text();

    return new Response(JSON.stringify({ types }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
