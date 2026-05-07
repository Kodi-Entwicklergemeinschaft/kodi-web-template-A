// worker/worker.ts
export interface Env {
  NOMINATIM_USER_AGENT?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const q = url.searchParams.get('q') ?? '';
      const limit = url.searchParams.get('limit') ?? '5';

      if (!q.trim()) {
        return new Response(JSON.stringify({ error: 'Query required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const upstream = new URL('https://nominatim.openstreetmap.org/search');
      upstream.searchParams.set('format', 'jsonv2');
      upstream.searchParams.set('q', q);
      upstream.searchParams.set('limit', limit);
      upstream.searchParams.set('addressdetails', '1');

      const USER_AGENT =
        env.NOMINATIM_USER_AGENT || 'MyViteApp/1.0 (contact@example.com)';

      const r = await fetch(upstream.toString(), {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      const text = await r.text();

      return new Response(text, {
        status: r.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  },
};
