'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { OperationOutcome } from '@/lib/api';

interface ResultsViewerProps {
  data: unknown;
  format: string;
  loading: boolean;
  error: OperationOutcome | null;
}

export function ResultsViewer({ data, format, loading, error }: ResultsViewerProps) {
  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Running query...</div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">
            {error.issue.map((issue, idx) => (
              <div key={idx} className="mb-2">
                <strong>{issue.code}:</strong> {issue.diagnostics}
                {issue.expression && (
                  <div className="text-xs mt-1">
                    Expression: {issue.expression.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      );
    }

    if (!data) {
      return (
        <div className="text-center text-muted-foreground p-8">
          No results to display. Run a query to see results.
        </div>
      );
    }

    if (format === 'csv' && typeof data === 'string') {
      return (
        <pre className="bg-muted p-3 rounded overflow-auto text-xs">
          {data}
        </pre>
      );
    }

    if (format === 'json' || format === 'ndjson') {
      return (
        <pre className="bg-muted p-3 rounded overflow-auto text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }

    if (format === 'parquet') {
      return (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Parquet file generated successfully. The file has been downloaded.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card className="h-full shadow-none border">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Results</CardTitle>
          <Badge variant="outline" className="text-xs">{format.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderResults()}
      </CardContent>
    </Card>
  );
}