import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock search API with debounce validation
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    return HttpResponse.json({
      results: [
        { id: 1, title: `Result for ${query}` }
      ]
    });
  }),

  // Mock deals API with pagination
  http.get('/api/deals', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    
    return HttpResponse.json({
      deals: Array(10).fill(null).map((_, i) => ({
        id: i + (page - 1) * 10,
        title: `Deal ${i + (page - 1) * 10}`
      })),
      hasMore: page < 3
    });
  }),

  // Mock geolocation-based API
  http.get('/api/nearby', async () => {
    return HttpResponse.json({
      deals: Array(5).fill(null).map((_, i) => ({
        id: i,
        title: `Nearby Deal ${i}`,
        distance: Math.random() * 5
      }))
    });
  }),
];