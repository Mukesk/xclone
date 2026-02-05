import app from '../backend/server.js';

export default function handler(req, res) {
    // Vercel serverless function entry point
    // It passes the request to the express app
    return app(req, res);
}