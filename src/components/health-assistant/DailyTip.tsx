interface DailyTipProps {
  tip: {
    tip_of_day: string;
    explanation: string;
    action_steps: string[];
    benefits: string[];
  };
}

export default function DailyTip({ tip }: DailyTipProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">💡</span>
        <h2 className="text-xl font-semibold">Daily Health Tip</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-lg font-medium text-purple-900">{tip.tip_of_day}</p>
          <p className="mt-2 text-gray-600">{tip.explanation}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Action Steps:</h3>
          <ul className="list-disc list-inside space-y-1">
            {tip.action_steps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Benefits:</h3>
          <ul className="list-disc list-inside space-y-1">
            {tip.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600">{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}