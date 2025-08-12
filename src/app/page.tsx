'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { PlayCircle } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { SofClient, ViewDefinition, OperationOutcome, RequestTrace, ResponseTrace } from '@/lib/api';

const defaultViewDefinition = {
  resourceType: "ViewDefinition",
  status: "active",
  resource: "Patient",
  select: [
    {
      column: [
        { name: "id", path: "id" },
        { name: "gender", path: "gender" },
        { name: "birthDate", path: "birthDate" }
      ]
    }
  ]
};

export default function Home() {
  const [serverUrl, setServerUrl] = useState('http://localhost:3005');
  const [viewDefinitionText, setViewDefinitionText] = useState(JSON.stringify(defaultViewDefinition, null, 2));
  const [format, setFormat] = useState<'json' | 'ndjson' | 'csv'>('json');
  const [limit, setLimit] = useState('100');
  const [results, setResults] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<OperationOutcome | null>(null);
  const [requestTrace, setRequestTrace] = useState<RequestTrace | null>(null);
  const [responseTrace, setResponseTrace] = useState<ResponseTrace | null>(null);

  const handleRun = async () => {
    let viewDefinition: ViewDefinition;
    
    try {
      viewDefinition = JSON.parse(viewDefinitionText);
    } catch {
      setError({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Invalid JSON in ViewDefinition'
        }]
      });
      return;
    }

    if (!viewDefinition || viewDefinition.resourceType !== 'ViewDefinition') {
      setError({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'required',
          diagnostics: 'Valid ViewDefinition is required'
        }]
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setRequestTrace(null);
    setResponseTrace(null);

    try {
      const client = new SofClient(serverUrl);
      const result = await client.runViewDefinition({
        viewDefinition,
        format,
        limit: limit ? parseInt(limit) : undefined
      });

      setResults(result.data);
      setRequestTrace(result.request);
      setResponseTrace(result.response);
    } catch (err: unknown) {
      // Clear results when error occurs
      setResults(null);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      if (error.request) {
        setRequestTrace(error.request);
      }
      if (error.response) {
        setResponseTrace(error.response);
      }
      
      if (error.resourceType === 'OperationOutcome') {
        setError(error as OperationOutcome);
      } else {
        // Handle network errors and other exceptions
        let errorMessage = 'An unexpected error occurred';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
          errorMessage = 'Network error: Unable to connect to the server. Please check the server URL and ensure the server is running.';
        }
        
        setError({
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'exception',
            diagnostics: errorMessage
          }]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left column - Form */}
        <ResizablePanel defaultSize={40} minSize={20} maxSize={60}>
          <div className="h-full bg-white p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Server URL Input with Run Button */}
              <div className="space-y-2">
                <Label htmlFor="server-url">Server URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="server-url"
                    type="url"
                    placeholder="http://localhost:3005"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="flex-1"
                    list="server-urls"
                  />
                  <datalist id="server-urls">
                    <option value="http://localhost:3005" />
                    <option value="https://niquola77.edge.aidbox.app/fhir" />
                  </datalist>
                  <Button onClick={handleRun} disabled={loading} size="icon" title="Run Query">
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Format and Limit Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Format Selector */}
                <div className="space-y-2">
                  <Label htmlFor="format">Response Format</Label>
                  <Select value={format} onValueChange={(value) => setFormat(value as 'json' | 'ndjson' | 'csv')}>
                    <SelectTrigger id="format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="ndjson">NDJSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Limit Input */}
                <div className="space-y-2">
                  <Label htmlFor="limit">Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    max="10000"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              {/* ViewDefinition CodeMirror */}
              <div className="space-y-2">
                <Label htmlFor="view-definition">ViewDefinition (JSON)</Label>
                <div className="border rounded-md overflow-hidden">
                  <CodeMirror
                    value={viewDefinitionText}
                    height="auto"
                    minHeight="200px"
                    maxHeight="600px"
                    extensions={[json()]}
                    onChange={(value) => setViewDefinitionText(value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right column - Results */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Progress bar when loading */}
              {loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                    <span className="text-sm font-medium text-gray-700">Running view definition...</span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                         style={{ 
                           width: '100%',
                           animation: 'progress 2s ease-in-out infinite'
                         }}>
                    </div>
                  </div>
                  <style jsx>{`
                    @keyframes progress {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                  `}</style>
                </div>
              )}

              {(requestTrace || responseTrace) && (
                <Accordion type="single" collapsible className="space-y-3">
                  {/* Request Trace */}
                  {requestTrace && (
                    <AccordionItem value="request" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 hover:no-underline">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-gray-900">Request</span>
                          <span className="text-sm text-gray-500 font-mono truncate">{requestTrace.method} {requestTrace.url}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-t border-gray-200 bg-gray-50 px-4 pb-4">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">URL</h5>
                            <code className="block p-3 bg-white rounded-md border border-gray-200 text-sm font-mono text-gray-800">
                              {requestTrace.method} {requestTrace.url}
                            </code>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Headers</h5>
                            <pre className="p-3 bg-white rounded-md border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto">
{JSON.stringify(requestTrace.headers, null, 2)}</pre>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Body</h5>
                            <pre className="p-3 bg-white rounded-md border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto max-h-[400px] overflow-y-auto">
{JSON.stringify(requestTrace.body, null, 2)}</pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Response Trace */}
                  {responseTrace && (
                    <AccordionItem value="response" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 hover:no-underline">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-gray-900">Response</span>
                          <span className={`text-sm font-medium ${
                            responseTrace.status >= 400 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {responseTrace.status} {responseTrace.statusText}
                          </span>
                          <div className={`ml-auto mr-4 px-2 py-0.5 rounded text-xs font-medium ${
                            responseTrace.status >= 400 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {responseTrace.status >= 400 ? 'Error' : 'Success'}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-t border-gray-200 bg-gray-50 px-4 pb-4">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Status</h5>
                            <code className={`block p-3 rounded-md border text-sm font-mono ${
                              responseTrace.status >= 400 
                                ? 'bg-red-50 border-red-200 text-red-800' 
                                : 'bg-green-50 border-green-200 text-green-800'
                            }`}>
                              {responseTrace.status} {responseTrace.statusText}
                            </code>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Headers</h5>
                            <pre className="p-3 bg-white rounded-md border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto">
{JSON.stringify(responseTrace.headers, null, 2)}</pre>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Body</h5>
                            <pre className="p-3 bg-white rounded-md border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto max-h-[400px] overflow-y-auto">
{JSON.stringify(responseTrace.body, null, 2)}</pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}

              {error && (
                <div className="bg-white rounded-lg shadow-sm border-2 border-red-300 overflow-hidden">
                  <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                    <h3 className="text-red-800 font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Error
                    </h3>
                  </div>
                  <div className="p-4">
                    {error.issue && error.issue.length > 0 ? (
                      <div className="space-y-2">
                        {error.issue.map((issue, index) => (
                          <div key={index} className="text-sm">
                            <span className={`font-medium ${
                              issue.severity === 'error' ? 'text-red-700' : 
                              issue.severity === 'warning' ? 'text-orange-700' : 
                              'text-blue-700'
                            }`}>
                              {issue.severity?.toUpperCase()}:
                            </span>
                            <span className="ml-2 text-gray-700">
                              {issue.diagnostics || issue.code || 'Unknown error'}
                            </span>
                            {issue.expression && issue.expression.length > 0 && (
                              <div className="mt-1 text-xs text-gray-500">
                                Location: {issue.expression.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-700 text-sm">An unexpected error occurred</p>
                    )}
                  </div>
                </div>
              )}

              {results && !error && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Results</h3>
                  {format === 'csv' && typeof results === 'string' ? (
                    <pre className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto max-h-[600px] text-sm font-mono">
                      {results}
                    </pre>
                  ) : Array.isArray(results) && results.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {Object.keys(results[0] as any).map((key) => (
                              <TableHead key={key} className="font-semibold text-xs">
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {results.map((row: any, index: number) => (
                            <TableRow key={index}>
                              {Object.entries(row).map(([key, value]) => (
                                <TableCell key={key} className="font-mono text-xs">
                                  {value === null ? (
                                    <span className="text-gray-400 italic">null</span>
                                  ) : typeof value === 'object' ? (
                                    <span className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                      {JSON.stringify(value)}
                                    </span>
                                  ) : (
                                    String(value)
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <pre className="p-4 bg-gray-100 rounded-md overflow-auto max-h-[400px] text-sm">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}