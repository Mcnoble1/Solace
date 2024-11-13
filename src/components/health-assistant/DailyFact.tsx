interface DailyFactProps {
  fact: {
    fact: string;
    explanation: string;
    common_myths: string[];
    scientific_context: string;
  };
}

export default function DailyFact({ fact }: DailyFactProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🔬</span>
        <h2 className="text-xl font-semibold">Daily Health Fact</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-lg font-medium text-purple-900">{fact.fact}</p>
          <p className="mt-2 text-gray-600">{fact.explanation}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-medium text-purple-900 mb-2">Scientific Context:</h3>
          <p className="text-purple-800">{fact.scientific_context}</p>
        </div>

        {fact.common_myths.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Common Myths:</h3>
            <ul className="list-disc list-inside space-y-1">
              {fact.common_myths.map((myth, index) => (
                <li key={index} className="text-gray-600">{myth}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}