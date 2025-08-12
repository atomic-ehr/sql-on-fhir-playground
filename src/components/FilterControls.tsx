'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterControlsProps {
  patient: string;
  onPatientChange: (patient: string) => void;
  limit: string;
  onLimitChange: (limit: string) => void;
  since: string;
  onSinceChange: (since: string) => void;
}

export function FilterControls({
  patient,
  onPatientChange,
  limit,
  onLimitChange,
  since,
  onSinceChange
}: FilterControlsProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-medium">Query Filters</h3>
            <p className="text-sm text-muted-foreground">
              Configure filtering parameters for your SQL-on-FHIR query
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <Label htmlFor="patient" className="text-sm font-medium">Patient Reference</Label>
              <Input
                id="patient"
                type="text"
                placeholder="Patient/123"
                value={patient}
                onChange={(e) => onPatientChange(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="since" className="text-sm font-medium">Since (ISO DateTime)</Label>
              <Input
                id="since"
                type="text"
                placeholder="2023-01-01T00:00:00Z"
                value={since}
                onChange={(e) => onSinceChange(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="limit" className="text-sm font-medium">Limit</Label>
              <Input
                id="limit"
                type="number"
                placeholder="100"
                value={limit}
                onChange={(e) => onLimitChange(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}