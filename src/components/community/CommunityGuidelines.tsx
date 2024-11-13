interface CommunityGuidelinesProps {
  onClose: () => void;
}

export default function CommunityGuidelines({ onClose }: CommunityGuidelinesProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Respect & Support</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Be kind and supportive to all community members</li>
              <li>Respect different experiences and perspectives</li>
              <li>No hate speech, discrimination, or harassment</li>
              <li>Use inclusive and respectful language</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy & Safety</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Do not share personal medical information</li>
              <li>Respect others' privacy and confidentiality</li>
              <li>Do not share contact information publicly</li>
              <li>Report any concerning content or behavior</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content Guidelines</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Share experiences, not medical advice</li>
              <li>No promotional or commercial content</li>
              <li>Keep content relevant to women's health and wellness</li>
              <li>Use content warnings for sensitive topics</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Moderation</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Content is monitored for community safety</li>
              <li>Violations may result in content removal</li>
              <li>Repeated violations may lead to account restrictions</li>
              <li>Appeals can be made through support</li>
            </ul>
          </section>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-purple-800">
              Remember: This is a safe space for support and connection. If you need immediate medical attention or are in crisis, please contact emergency services or your healthcare provider.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}