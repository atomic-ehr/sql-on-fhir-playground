'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { examplePatientResources } from '@/lib/examples';

interface ResourcesEditorProps {
  value: unknown[];
  onChange: (resources: unknown[]) => void;
}

export function ResourcesEditor({ value, onChange }: ResourcesEditorProps) {
  const [jsonText, setJsonText] = useState(value.length > 0 ? JSON.stringify(value, null, 2) : '');
  const [error, setError] = useState<string | null>(null);

  const handleLoadExample = () => {
    setJsonText(JSON.stringify(examplePatientResources, null, 2));
    setError(null);
    onChange(examplePatientResources);
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      onChange([]);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setError('Resources must be an array');
        onChange([]);
      } else {
        setError(null);
        onChange(parsed);
      }
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      onChange([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <Textarea
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          placeholder="Enter FHIR resources as JSON array..."
          className="font-mono text-xs h-full resize-none"
        />
      </div>

      {error && (
        <div className="border-t bg-card p-2">
          <Alert variant="destructive" className="border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}