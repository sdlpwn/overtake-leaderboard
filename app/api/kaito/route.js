// app/api/kaito/route.js

export async function GET(req) {
  const duration = req.nextUrl.searchParams.get('duration') || '7d';

  const apiURL = `https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=${duration}&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true`;

  try {
    const response = await fetch(apiURL, { cache: 'no-store' }); // fresh data
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API fetch failed:', error);
    return new Response(JSON.stringify({ error: 'API fetch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}