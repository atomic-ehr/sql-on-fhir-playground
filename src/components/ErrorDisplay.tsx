"use client";
import { OperationOutcome } from "@/lib/api";

interface ErrorDisplayProps {
  error: OperationOutcome | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return error ? (
    <div className="bg-white rounded-lg shadow-sm border-2 border-red-300 overflow-hidden">
      <div className="bg-red-50 border-b border-red-200 px-4 py-3">
        <h3 className="text-red-800 font-semibold flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Error
        </h3>
      </div>
      <div className="p-4">
        {error.issue && error.issue.length > 0 ? (
          <div className="space-y-2">
            {error.issue.map((issue, index) => (
              <div key={index} className="text-sm">
                <span
                  className={`font-medium ${
                    issue.severity === "error"
                      ? "text-red-700"
                      : issue.severity === "warning"
                        ? "text-yellow-700"
                        : "text-blue-700"
                  }`}
                >
                  {issue.severity.toUpperCase()}:
                </span>
                <span className="ml-2 text-gray-700">
                  {issue.diagnostics || issue.code || "Unknown error"}
                </span>
                {issue.expression && (
                  <div className="mt-1 text-xs text-gray-500">
                    Location: {issue.expression.join(", ")}
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
  ) : (
    <div />
  );
}
