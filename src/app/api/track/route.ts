import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Read and validate Supabase credentials at request time so bad config never crashes the route.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let supabase = null as ReturnType<typeof createClient> | null;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials missing. Tracking disabled.');
    } else {
      try {
        // Validate URL format; if invalid, disable tracking instead of throwing.
        new URL(supabaseUrl);
        supabase = createClient(supabaseUrl, supabaseKey);
      } catch (err) {
        console.warn('Invalid Supabase configuration. Tracking disabled.', err);
      }
    }

    const body = await req.json().catch(() => ({}));
    const page = body.page || 'unknown';

    // 1. Extract IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() || '127.0.0.1' : '127.0.0.1';

    // 2. Extract Referrer
    const referrer = req.headers.get('referer') || 'direct';

    // 3. Extract User Agent
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Simple robust parsing for UA
    const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
    const device = isMobile ? 'Mobile' : /Tablet|iPad/i.test(userAgent) ? 'Tablet' : 'Desktop';
    
    // Guess OS
    let os = 'Unknown OS';
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac OS X/i.test(userAgent)) os = 'macOS';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else if (/iOS|iPhone|iPad/i.test(userAgent)) os = 'iOS';

    // Guess Browser
    let browser = 'Unknown Browser';
    if (/Chrome/i.test(userAgent) && !/Edge|OPR|Edg/i.test(userAgent)) browser = 'Chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';

    // Extract Phone Model (Text inside first parentheses, useful for iOS/Android specifics)
    let phoneModel = null;
    if (isMobile) {
      const match = userAgent.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        // e.g. "Linux; Android 13; SM-S918B" -> "SM-S918B"
        const parts = match[1].split(';');
        phoneModel = parts[parts.length - 1]?.trim() || null;
      }
    }

    // 4. Geolocation mapping (via ipapi.co)
    let country = 'Unknown';
    let city = 'Unknown';

    // Avoid hitting public IP APIs for localhost
    if (ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country_name || 'Unknown';
          city = geoData.city || 'Unknown';
        }
      } catch (geoErr) {
        console.error('Geolocation fetch failed:', geoErr);
      }
    } else {
      country = 'Localhost';
      city = 'LocalDev';
    }

    // 5. Insert to Supabase directly (if tracking is configured)
    if (supabase) {
      const { error: insertError } = await supabase.from('visits').insert([
        {
          ip,
          user_agent: userAgent,
          device,
          os,
          browser,
          phone_model: phoneModel,
          referrer,
          page,
          country,
          city
        }
      ]);
      
      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
      }
    }

  } catch (error) {
    console.error('Tracking API caught exception:', error);
  }

  // 6. Always return ok: true. Tracking should never block the user journey.
  return NextResponse.json({ ok: true });
}
