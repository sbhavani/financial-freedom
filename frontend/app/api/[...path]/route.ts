import { NextRequest, NextResponse } from 'next/server';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

// Disable certificate verification for development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function handler(req: NextRequest) {
  // Extract the path after /api/
  const pathPart = req.nextUrl.pathname.replace(/^\/api\//, '');
  const queryString = req.nextUrl.search;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://mac-mini-i7.local:8443';
  const targetUrl = `${backendUrl}/${pathPart}${queryString}`;

  return new Promise((resolve) => {
    try {
      const url = new URL(targetUrl);
      const isHttps = url.protocol === 'https:';

      const requestModule = isHttps ? https : http;

      const options: any = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + queryString,
        method: req.method,
        headers: Object.fromEntries(req.headers),
      };

      if (isHttps) {
        options.agent = httpsAgent;
      }

      // Remove host header to avoid virtual host issues on backend
      delete options.headers['host'];
      delete options.headers['content-length'];

      const proxyReq = requestModule.request(options, (proxyRes) => {
        const chunks: Buffer[] = [];

        proxyRes.on('data', (chunk) => {
          chunks.push(chunk);
        });

        proxyRes.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const response = new NextResponse(buffer, {
            status: proxyRes.statusCode || 200,
            headers: proxyRes.headers as any,
          });
          resolve(response);
        });
      });

      proxyReq.on('error', (error) => {
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
                proxyReq.write(Buffer.from(body));
            }
            proxyReq.end();
        }).catch(err => {
             console.error('Error reading request body', err);
             proxyReq.end();
        });
      } else {
        proxyReq.end();
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
