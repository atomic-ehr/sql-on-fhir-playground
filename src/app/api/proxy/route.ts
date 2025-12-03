import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the target server from query parameter
    const targetServer = request.nextUrl.searchParams.get('server');
    if (!targetServer) {
      return NextResponse.json(
        { error: 'Server URL is required' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to the actual server
    const response = await fetch(`${targetServer}/ViewDefinition/$run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': request.headers.get('Accept') || 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/csv')) {
      data = await response.text();
    } else if (contentType.includes('application/x-ndjson')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    // Return the response with appropriate headers
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    
    return new NextResponse(
      contentType.includes('application/json') ? JSON.stringify(data) : data,
      {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      },
      { status: 500 }
    );
  }
}