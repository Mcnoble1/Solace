import { useState } from 'react';
import SymptomInput from '../components/symptom-checker/SymptomInput';
import AnalysisResult from '../components/symptom-checker/AnalysisResult';
import { analyzeSymptoms, analyzeImage, analyzeAudio } from '../lib/gemini';

export default function SymptomChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSymptomSubmit = async (symptoms: string, image?: File, audio?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      
      if (image) {
        result = await analyzeImage(image, symptoms);
      } else if (audio) {
        result = await analyzeAudio(audio, symptoms);
      } else {
        result = await analyzeSymptoms(symptoms);
      }
      
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
        <p className="mt-2 text-gray-600">
          Describe your symptoms, upload images, or record audio to get AI-powered insights and recommendations.
          Remember, this is not a replacement for professional medical advice.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <SymptomInput onSubmit={handleSymptomSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <AnalysisResult analysis={analysis} />
        </div>
      )}
    </div>
  );
}