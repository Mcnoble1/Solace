interface SupportGroupsProps {
  topics: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

interface Group {
  id: string;
  name: string;
  description: string;
  topic: string;
  members: number;
  nextMeeting?: {
    date: string;
    time: string;
    topic: string;
  };
}

// Dummy data for demonstration
const groups: Group[] = [
  {
    id: '1',
    name: 'PCOS Support Circle',
    description: 'A supportive community for women managing PCOS, sharing experiences and coping strategies.',
    topic: 'menstrual-health',
    members: 156,
    nextMeeting: {
      date: '2024-03-15',
      time: '19:00',
      topic: 'Natural Ways to Manage PCOS Symptoms',
    },
  },
  {
    id: '2',
    name: 'Mindful Motherhood',
    description: 'Supporting expecting and new mothers through their journey with mindfulness and shared experiences.',
    topic: 'pregnancy',
    members: 234,
    nextMeeting: {
      date: '2024-03-16',
      time: '20:00',
      topic: 'Managing Pregnancy Anxiety',
    },
  },
  // Add more groups...
];

export default function SupportGroups({ topics }: SupportGroupsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div key={group.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            <span className="text-2xl">
              {topics.find((t) => t.id === group.topic)?.icon}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{group.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="mr-4">{group.members} members</span>
            <span>{topics.find((t) => t.id === group.topic)?.label}</span>
          </div>

          {group.nextMeeting && (
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-purple-900 mb-2">Next Meeting</h4>
              <p className="text-sm text-purple-800">
                {group.nextMeeting.date} at {group.nextMeeting.time}
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Topic: {group.nextMeeting.topic}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Join Group
            </button>
            <button className="px-4 py-2 text-purple-600 hover:text-purple-800">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}