import { NextRequest, NextResponse } from 'next/server';
import * as https from 'https';
import { URL } from 'url';

// Disable certificate verification for development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function handler(req: NextRequest) {
  const pathArray = req.nextUrl.pathname.split('/api/')[1];
  const queryString = req.nextUrl.search;

  const targetUrl = `https://mac-mini-i7.local:8443/api/${pathArray}${queryString}`;

  return new Promise((resolve) => {
    try {
      const url = new URL(targetUrl);

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + queryString,
        method: req.method,
        headers: Object.fromEntries(req.headers),
        agent: httpsAgent,
      };

      // Remove host header
      delete options.headers['host'];

      const httpsReq = https.request(options, (httpsRes) => {
        let data = '';

        httpsRes.on('data', (chunk) => {
          data += chunk;
        });

        httpsRes.on('end', () => {
          const response = new NextResponse(data, {
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
        req.text().then((body) => {
          if (body) {
            httpsReq.write(body);
          }
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
