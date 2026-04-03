import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const appId = 'app_HKKiWsalytaLP9Dd';
    const secretKey = Deno.env.get('VIBE_MESSAGE_SECRET_KEY');

    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: 'Secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: Record<string, unknown> = {
      notificationData: {
        title,
        body,
        icon: icon || '/placeholder.svg',
        click_action: clickAction || '/',
      },
    };

    if (externalUsers?.length) {
      payload.externalUsers = externalUsers;
    }

    // Use the vibe-message server SDK via direct API call
    const response = await fetch('https://vibemessage.sailorlabs.in/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': appId,
        'x-secret-key': secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
