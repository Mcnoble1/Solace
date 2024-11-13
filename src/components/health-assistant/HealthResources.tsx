import { useState } from 'react';
import { getHealthResources } from '../../lib/gemini-health';

const commonConditions = [
  'PCOS',
  'Endometriosis',
  'Thyroid Issues',
  'Menstruation',
  'Menopause',
  'Fertility',
  'Pregnancy',
  'Mental Health',
];

export default function HealthResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (condition: string) => {
    setIsLoading(true);
    try {
      const result = await getHealthResources(condition);
      setResources(result);
    } catch (error) {
      console.error('Error fetching health resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Health Resources</h2>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Search health topics..."
          />
          <button
            onClick={() => handleSearch(searchTerm)}
            disabled={!searchTerm.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonConditions.map((condition) => (
            <button
              key={condition}
              onClick={() => {
                setSearchTerm(condition);
                handleSearch(condition);
              }}
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100"
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading resources...</p>
        </div>
      ) : resources ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-600">{resources.condition_overview}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Common Symptoms</h3>
            <ul className="list-disc list-inside space-y-1">
              {resources.symptoms.map((symptom: string, index: number) => (
                <li key={index} className="text-gray-600">{symptom}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Management Strategies</h3>
            <ul className="list-disc list-inside space-y-1">
              {resources.management.map((strategy: string, index: number) => (
                <li key={index} className="text-gray-600">{strategy}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Lifestyle Recommendations</h3>
            <ul className="list-disc list-inside space-y-1">
              {resources.lifestyle.map((rec: string, index: number) => (
                <li key={index} className="text-gray-600">{rec}</li>
              ))}
            </ul>
          </div>

          {resources.research.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Recent Research</h3>
              <ul className="list-disc list-inside space-y-1">
                {resources.research.map((finding: string, index: number) => (
                  <li key={index} className="text-purple-800">{finding}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Search for a health topic to get started</p>
        </div>
      )}
    </div>
  );
}