interface MentalHealthSupportProps {
  onSupportRequest: (input: string) => void;
  response: any;
  isLoading: boolean;
}

export default function MentalHealthSupport({
  onSupportRequest,
  response,
  isLoading,
}: MentalHealthSupportProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('support') as HTMLTextAreaElement;
    if (input.value.trim()) {
      onSupportRequest(input.value);
      input.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">AI Support Assistant</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          name="support"
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Share what's on your mind..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Getting Support...' : 'Get Support'}
        </button>
      </form>

      {response && (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-gray-800">{response.response}</p>
          </div>

          {response.coping_strategies.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Coping Strategies</h3>
              <ul className="list-disc list-inside space-y-1">
                {response.coping_strategies.map((strategy: string, index: number) => (
                  <li key={index} className="text-gray-600">{strategy}</li>
                ))}
              </ul>
            </div>
          )}

          {response.self_care.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Self-Care Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {response.self_care.map((tip: string, index: number) => (
                  <li key={index} className="text-gray-600">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {response.professional_help && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-800">
                Consider reaching out to a mental health professional for additional support.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}