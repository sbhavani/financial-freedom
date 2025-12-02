import { NextRequest, NextResponse } from 'next/server';
import * as https from 'https';
import { URL } from 'url';

// Disable certificate verification for development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function handler(req: NextRequest) {
  // Extract the path after /api/
  // The route is /api/[...path], so req.nextUrl.pathname starts with /api/
  // We want to forward everything AFTER /api/ to the backend.
  // Example: /api/api/user -> backend/api/user
  // Example: /api/sanctum/csrf-cookie -> backend/sanctum/csrf-cookie

  const pathPart = req.nextUrl.pathname.replace(/^\/api\//, '');
  const queryString = req.nextUrl.search;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://mac-mini-i7.local:8443';
  const targetUrl = `${backendUrl}/${pathPart}${queryString}`;

  return new Promise((resolve) => {
    try {
      const url = new URL(targetUrl);

      const options: https.RequestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + queryString,
        method: req.method,
        headers: Object.fromEntries(req.headers),
        agent: httpsAgent,
      };

      // Remove host header to avoid virtual host issues on backend
      delete options.headers['host'];
      // Remove content-length to let https.request recalculate it if we stream body,
      // but here we read body text so it might be safer to keep it or let write() handle it.
      // Better to delete it and let node handle it if we write data.
      delete options.headers['content-length'];

      const httpsReq = https.request(options, (httpsRes) => {
        const chunks: Buffer[] = [];

        httpsRes.on('data', (chunk) => {
          chunks.push(chunk);
        });

        httpsRes.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const response = new NextResponse(buffer, {
            status: httpsRes.statusCode || 200,
            headers: httpsRes.headers as any,
          });
          resolve(response);
        });
      });

      httpsReq.on('error', (error) => {
        console.error('API proxy error:', error);
        resolve(
          NextResponse.json(
            { error: 'API proxy failed', details: String(error) },
            { status: 500 }
          )
        );
      });

      // Copy body if present
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        req.arrayBuffer().then((body) => {
            if (body.byteLength > 0) {
                httpsReq.write(Buffer.from(body));
            }
            httpsReq.end();
        }).catch(err => {
             console.error('Error reading request body', err);
             httpsReq.end();
        });
      } else {
        httpsReq.end();
      }
    } catch (error) {
      console.error('API proxy error:', error);
      resolve(
        NextResponse.json(
          { error: 'API proxy failed', details: String(error) },
          { status: 500 }
        )
      );
    }
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
