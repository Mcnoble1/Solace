interface AnalysisResultProps {
  analysis: {
    summary: string;
    possibleCauses: string[];
    redFlags: string[];
    recommendations: {
      immediate: string[];
      lifestyle: string[];
      medical: string[];
    };
    urgencyLevel: 'low' | 'medium' | 'high';
    disclaimer: string;
  };
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Urgency Level */}
      <div className={`rounded-md p-4 ${urgencyColors[analysis.urgencyLevel]}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {analysis.urgencyLevel === 'high' && (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">
              Urgency Level: {analysis.urgencyLevel.charAt(0).toUpperCase() + analysis.urgencyLevel.slice(1)}
            </h3>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Summary</h3>
        <p className="mt-2 text-gray-600">{analysis.summary}</p>
      </div>

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Warning Signs</h3>
          <ul className="mt-2 list-disc list-inside text-red-700">
            {analysis.redFlags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Possible Causes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Possible Causes</h3>
        <ul className="mt-2 list-disc list-inside text-gray-600">
          {analysis.possibleCauses.map((cause, index) => (
            <li key={index}>{cause}</li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
        
        {analysis.recommendations.immediate.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700">Immediate Steps</h4>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {analysis.recommendations.immediate.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.recommendations.lifestyle.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700">Lifestyle Recommendations</h4>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {analysis.recommendations.lifestyle.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.recommendations.medical.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700">Medical Recommendations</h4>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {analysis.recommendations.medical.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="rounded-md bg-gray-50 p-4">
        <p className="text-sm text-gray-500">{analysis.disclaimer}</p>
      </div>
    </div>
  );
}