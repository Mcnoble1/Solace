import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';
import PostList from '../components/community/PostList';
import CreatePost from '../components/community/CreatePost';
import CommunityGuidelines from '../components/community/CommunityGuidelines';
import TopicFilter from '../components/community/TopicFilter';
import SupportGroups from '../components/community/SupportGroups';

const topics = [
  { id: 'general', label: 'General Discussion', icon: '💭' },
  { id: 'menstrual-health', label: 'Menstrual Health', icon: '🌸' },
  { id: 'pregnancy', label: 'Pregnancy Journey', icon: '🤰' },
  { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { id: 'fitness', label: 'Fitness & Wellness', icon: '🏃‍♀️' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'success-stories', label: 'Success Stories', icon: '⭐' },
  { id: 'support', label: 'Support & Encouragement', icon: '💝' },
];

export default function Community() {
  const { t } = useTranslation();
  const { profile } = useUserStore();
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [view, setView] = useState<'posts' | 'groups'>('posts');

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Solace Community</h1>
        <p className="mt-4 text-lg text-gray-600">
          Connect, share, and support each other on your health journey
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setView('posts')}
            className={`px-4 py-2 rounded-md ${
              view === 'posts'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Discussion Board
          </button>
          <button
            onClick={() => setView('groups')}
            className={`px-4 py-2 rounded-md ${
              view === 'groups'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Support Groups
          </button>
          <button
            onClick={() => setShowGuidelines(true)}
            className="px-4 py-2 text-purple-600 hover:text-purple-800"
          >
            Community Guidelines
          </button>
        </div>
      </div>

      {view === 'posts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TopicFilter
              topics={topics}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• Be respectful and supportive</li>
                <li>• Maintain privacy</li>
                <li>• Share experiences, not medical advice</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <CreatePost selectedTopic={selectedTopic} topics={topics} />
            <PostList selectedTopic={selectedTopic} />
          </div>
        </div>
      ) : (
        <SupportGroups topics={topics} />
      )}

      {/* Community Guidelines Modal */}
      {showGuidelines && (
        <CommunityGuidelines onClose={() => setShowGuidelines(false)} />
      )}
    </div>
  );
}