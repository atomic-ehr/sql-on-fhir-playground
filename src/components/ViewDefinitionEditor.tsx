'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ViewDefinition } from '@/lib/api';
import { json } from '@codemirror/lang-json';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

interface ViewDefinitionEditorProps {
  value: ViewDefinition | null;
  onChange: (viewDef: ViewDefinition | null) => void;
}

export function ViewDefinitionEditor({ value, onChange }: ViewDefinitionEditorProps) {
  const [jsonText, setJsonText] = useState(value ? JSON.stringify(value, null, 2) : '');
  const [error, setError] = useState<string | null>(null);


  const handleJsonChange = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      onChange(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed.resourceType !== 'ViewDefinition') {
        setError('Invalid resource type. Must be ViewDefinition');
        onChange(null);
      } else {
        setError(null);
        onChange(parsed);
      }
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      onChange(null);
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={jsonText}
          onChange={(value) => handleJsonChange(value)}
          extensions={[json()]}
          placeholder="Enter ViewDefinition JSON..."
          height="100%"
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
          style={{
            fontSize: '12px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
            height: '100%',
          }}
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