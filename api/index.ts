import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple API endpoint for testing
  if (req.method === 'GET' && req.url === '/api/health') {
    res.status(200).json({ status: 'ok', message: 'API is working' });
    return;
  }

  // For now, return a simple response
  res.status(200).json({ 
    message: 'Wooden Fish API',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
}