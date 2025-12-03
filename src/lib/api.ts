export interface ViewDefinitionColumn {
  name: string;
  type?: string;
  path: string;
}

export interface ViewDefinitionSelect {
  column: ViewDefinitionColumn[];
}

export interface ViewDefinition {
  resourceType: 'ViewDefinition';
  id?: string;
  resource: string;
  select: ViewDefinitionSelect[];
}

export interface RunParameters {
  viewDefinition?: ViewDefinition;
  viewReference?: string;
  format?: 'json' | 'ndjson' | 'csv' | 'parquet';
  patient?: string;
  group?: string[];
  since?: string;
  limit?: number;
  resources?: unknown[];
}

export interface OperationOutcome {
  resourceType: 'OperationOutcome';
  issue: Array<{
    severity: 'error' | 'warning' | 'information';
    code: string;
    diagnostics?: string;
    expression?: string[];
  }>;
}

export interface RequestTrace {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export interface ResponseTrace {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
}

export interface RunResult {
  data: unknown;
  request: RequestTrace;
  response: ResponseTrace;
}

export class SofClient {
  constructor(private baseUrl: string) {}

  async runViewDefinition(params: RunParameters): Promise<RunResult> {
    // Use proxy endpoint to avoid CORS issues
    const isClientSide = typeof window !== 'undefined';
    const actualServerUrl = `${this.baseUrl}/ViewDefinition/$run`;
    
    let url: URL;
    if (isClientSide) {
      // Use proxy in browser
      url = new URL('/api/proxy', window.location.origin);
      url.searchParams.append('server', this.baseUrl);
    } else {
      // Direct call on server side
      url = new URL(actualServerUrl);
    }
    
    // Note: Query parameters are not used in POST body approach
    // They would go in the request body as parameters instead

    // Build the request body
    const requestBody: { resourceType: string; parameter: Array<{ name: string; resource?: unknown; valueReference?: { reference: string }; valueCode?: string; valueInteger?: number }> } = {
      resourceType: 'Parameters',
      parameter: []
    };

    // Add format parameter
    if (params.format) {
      requestBody.parameter.push({
        name: '_format',
        valueCode: params.format
      });
    }

    // Add limit parameter
    if (params.limit) {
      requestBody.parameter.push({
        name: '_limit',
        valueInteger: params.limit
      });
    }

    if (params.viewDefinition) {
      requestBody.parameter.push({
        name: 'viewResource',
        resource: params.viewDefinition
      });
    } else if (params.viewReference) {
      requestBody.parameter.push({
        name: 'viewReference',
        valueReference: {
          reference: params.viewReference
        }
      });
    }

    if (params.resources) {
      params.resources.forEach(resource => {
        requestBody.parameter.push({
          name: 'resource',
          resource: resource
        });
      });
    }

    const headers = {
      'Content-Type': 'application/fhir+json',
      'Accept': this.getAcceptHeader(params.format || 'json')
    };

    // Create request trace (show actual server URL, not proxy)
    const requestTrace: RequestTrace = {
      url: actualServerUrl,
      method: 'POST',
      headers,
      body: requestBody
    };

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      mode: 'cors',
      credentials: 'omit'
    });

    // Get response body
    const contentType = response.headers.get('content-type') || '';
    let responseBody;
    
    if (!response.ok) {
      responseBody = await response.json();
    } else if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else if (contentType.includes('text/csv')) {
      responseBody = await response.text();
    } else if (contentType.includes('application/x-ndjson')) {
      responseBody = await response.text();
    } else {
      responseBody = await response.blob();
    }

    // Create response trace
    const responseTrace: ResponseTrace = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody
    };

    if (!response.ok) {
      throw {
        ...responseBody,
        request: requestTrace,
        response: responseTrace
      };
    }

    return {
      data: responseBody,
      request: requestTrace,
      response: responseTrace
    };
  }

  private getAcceptHeader(format: string): string {
    switch (format) {
      case 'json':
        return 'application/json';
      case 'ndjson':
        return 'application/x-ndjson';
      case 'csv':
        return 'text/csv';
      case 'parquet':
        return 'application/octet-stream';
      default:
        return 'application/json';
    }
  }
}