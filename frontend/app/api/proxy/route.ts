import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const requestData = await request.json();
  const { path, body, method = 'POST' } = requestData;

  // Validate the path to prevent potential security issues
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return NextResponse.json(
      { error: 'Invalid path parameter' },
      { status: 400 }
    );
  }

  // Prevent proxy from calling itself to avoid infinite loops
  if (path.includes('/api/proxy')) {
    return NextResponse.json(
      { error: 'Cannot proxy to proxy endpoint' },
      { status: 400 }
    );
  }

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const backendUrl = `${backendBaseUrl}${path}`;

  try {
    // Get cookies from the incoming request to forward to backend
    const cookieHeader = request.headers.get('cookie');

    // Filter out authentication-related cookies to prevent duplication
    // Only forward non-auth cookies to backend
    let filteredCookieHeader = '';
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const nonAuthCookies = cookies.filter(cookie =>
        !cookie.startsWith('access_token=') &&
        !cookie.startsWith('better-auth.session_token=')
      );
      filteredCookieHeader = nonAuthCookies.join('; ');
    }

    const response = await fetch(backendUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward only non-auth cookies to backend to prevent duplication
        ...(filteredCookieHeader && filteredCookieHeader.length > 0 && { 'Cookie': filteredCookieHeader }),
        // Forward authorization header if present
        ...request.headers.has('authorization')
          ? { 'Authorization': request.headers.get('authorization')! }
          : {},
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, return the raw text
      const text = await response.text();
      return NextResponse.json(
        { error: 'Invalid JSON response', raw: text },
        { status: response.status }
      );
    }

    // Get cookies from the backend response and forward them to the client
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');

    // Forward cookies from backend response (if any)
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders.set('set-cookie', setCookieHeader);
    }

    // Forward other headers as needed, excluding problematic ones
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return; // Already handled above
      // Exclude headers that might cause issues
      if (!['content-length', 'transfer-encoding', 'connection', 'server', 'date', 'location'].includes(key.toLowerCase())) {
        responseHeaders.append(key, value);
      }
    });

    // Log the response for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Proxy ${method} ${path} -> ${backendUrl}, Status: ${response.status}`);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  // Validate the path to prevent potential security issues
  if (typeof path !== 'string' || !path.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid path parameter' }, { status: 400 });
  }

  // Prevent proxy from calling itself to avoid infinite loops
  if (path.includes('/api/proxy')) {
    return NextResponse.json(
      { error: 'Cannot proxy to proxy endpoint' },
      { status: 400 }
    );
  }

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const backendUrl = `${backendBaseUrl}${path}`;

  try {
    // Get cookies from the incoming request to forward to backend
    const cookieHeader = request.headers.get('cookie');

    // Filter out authentication-related cookies to prevent duplication
    // Only forward non-auth cookies to backend
    let filteredCookieHeader = '';
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const nonAuthCookies = cookies.filter(cookie =>
        !cookie.startsWith('access_token=') &&
        !cookie.startsWith('better-auth.session_token=')
      );
      filteredCookieHeader = nonAuthCookies.join('; ');
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        // Forward only non-auth cookies to backend to prevent duplication
        ...(filteredCookieHeader && filteredCookieHeader.length > 0 && { 'Cookie': filteredCookieHeader }),
        // Forward authorization header if present
        ...request.headers.has('authorization')
          ? { 'Authorization': request.headers.get('authorization')! }
          : {},
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, return the raw text
      const text = await response.text();
      return NextResponse.json(
        { error: 'Invalid JSON response', raw: text },
        { status: response.status }
      );
    }

    // Get cookies from the backend response and forward them to the client
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');

    // Forward cookies from backend response (if any)
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders.set('set-cookie', setCookieHeader);
    }

    // Forward other headers as needed, excluding problematic ones
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return; // Already handled above
      // Exclude headers that might cause issues
      if (!['content-length', 'transfer-encoding', 'connection', 'server', 'date', 'location'].includes(key.toLowerCase())) {
        responseHeaders.append(key, value);
      }
    });

    // Log the response for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Proxy GET ${path} -> ${backendUrl}, Status: ${response.status}`);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}