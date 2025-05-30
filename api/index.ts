import type { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from "dotenv";
import express from "express";
import { registerRoutes } from "../server/routes";

// Load environment variables
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up routes
let routesInitialized = false;
let routePromise: Promise<void> | null = null;

async function initializeRoutes() {
  if (!routesInitialized && !routePromise) {
    routePromise = registerRoutes(app).then(() => {
      routesInitialized = true;
    });
  }
  if (routePromise) {
    await routePromise;
  }
}

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

  try {
    // Initialize routes if not already done
    await initializeRoutes();
    
    // Use Express app to handle the request
    app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}