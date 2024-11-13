interface TopicFilterProps {
  topics: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  selectedTopic: string;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onSelectTopic,
}: TopicFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-medium text-gray-900 mb-4">Topics</h2>
      <div className="space-y-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedTopic === topic.id
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{topic.icon}</span>
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}