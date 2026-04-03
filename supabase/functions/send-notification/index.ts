import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { initServerClient } from "npm:vibe-message@1.1.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { title, body, icon, clickAction, externalUsers } = await req.json();

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'title and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const secretKey = Deno.env.get('VIBE_MESSAGE_SECRET_KEY');
    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: 'Secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const server = initServerClient({
      appId: 'app_HKKiWsalytaLP9Dd',
      secretKey,
    });

    const notificationOptions: Record<string, unknown> = {
      notificationData: {
        title,
        body,
        icon: icon || '/placeholder.svg',
        click_action: clickAction || '/',
      },
    };

    if (externalUsers?.length) {
      notificationOptions.externalUsers = externalUsers;
    }

    const result = await server.notification(notificationOptions);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
