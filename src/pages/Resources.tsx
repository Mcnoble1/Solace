import { useState } from 'react';
import { getHealthResources } from '../lib/gemini-health';

const commonConditions = [
  'PCOS',
  'Endometriosis',
  'Thyroid Issues',
  'Menstruation',
  'Menopause',
  'Fertility',
  'Pregnancy',
  'Mental Health',
  'Women\'s Health',
  'Reproductive Health',
  'Hormonal Health',
  'Sexual Health',
];

const categories = [
  {
    title: 'Reproductive Health',
    description: 'Understanding your reproductive system and cycle',
    icon: '🌸',
    tags: ['menstruation', 'fertility', 'reproductive-health'],
  },
  {
    title: 'Pregnancy & Postpartum',
    description: 'Guidance for pregnancy and after birth',
    icon: '🤰',
    tags: ['pregnancy', 'postpartum', 'maternal-health'],
  },
  {
    title: 'Mental Wellbeing',
    description: 'Support for emotional and mental health',
    icon: '🧠',
    tags: ['mental-health', 'emotional-wellbeing', 'stress'],
  },
  {
    title: 'Hormonal Health',
    description: 'Understanding and managing hormonal conditions',
    icon: '⚡',
    tags: ['hormones', 'thyroid', 'pcos'],
  },
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Health Resources</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore comprehensive, AI-powered information about women's health topics
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
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
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
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

      {/* Categories Grid */}
      {!resources && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() => {
                setSearchTerm(category.title);
                handleSearch(category.title);
                setSelectedCategory(category.title);
              }}
              className="text-left p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
              <p className="mt-2 text-gray-600">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-50 text-purple-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Resource Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      ) : resources ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600">{resources.condition_overview}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Symptoms</h2>
              <ul className="list-disc list-inside space-y-2">
                {resources.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="text-gray-600">{symptom}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Management Strategies</h2>
              <ul className="list-disc list-inside space-y-2">
                {resources.management.map((strategy: string, index: number) => (
                  <li key={index} className="text-gray-600">{strategy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lifestyle Recommendations</h2>
              <ul className="list-disc list-inside space-y-2">
                {resources.lifestyle.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>

            {resources.research.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Research</h2>
                <ul className="list-disc list-inside space-y-2">
                  {resources.research.map((finding: string, index: number) => (
                    <li key={index} className="text-purple-800">{finding}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}