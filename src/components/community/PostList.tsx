import { useState } from 'react';
import { format } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, FlagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  topic: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface PostListProps {
  selectedTopic: string;
}

// Dummy data for demonstration
const dummyPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah',
      avatar: '👩',
    },
    topic: 'mental-health',
    content: 'Found some great meditation techniques that really help with anxiety. Happy to share my experience!',
    timestamp: new Date(),
    likes: 15,
    comments: 3,
    isLiked: false,
  },
  // Add more dummy posts...
];

export default function PostList({ selectedTopic }: PostListProps) {
  const [posts, setPosts] = useState(dummyPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        };
      }
      return post;
    }));
  };

  const handleReport = (postId: string) => {
    // Implement report functionality
    console.log('Reporting post:', postId);
  };

  return (
    <div className="space-y-6">
      {posts
        .filter(post => selectedTopic === 'general' || post.topic === selectedTopic)
        .map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{post.author.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                  <button
                    onClick={() => handleReport(post.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FlagIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {format(post.timestamp, 'MMM d, yyyy')}
                </p>
                <p className="mt-2 text-gray-600">{post.content}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-purple-600"
                  >
                    {post.isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-purple-600" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}