import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface CreatePostProps {
  selectedTopic: string;
  topics: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

export default function CreatePost({ selectedTopic, topics }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [postTopic, setPostTopic] = useState(selectedTopic);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Implement post creation logic
      console.log('Creating post:', { content, topic: postTopic });
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, experiences, or ask for support..."
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="inline-flex items-center text-gray-700 hover:text-purple-600"
            >
              <PhotoIcon className="h-5 w-5 mr-1" />
              Add Image
            </button>
            <select
              value={postTopic}
              onChange={(e) => setPostTopic(e.target.value)}
              className="rounded-md border-gray-300 text-gray-700 text-sm focus:border-purple-500 focus:ring-purple-500"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.icon} {topic.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}