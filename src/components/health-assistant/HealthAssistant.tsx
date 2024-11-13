import { useState, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import { getChatbotResponse } from '../../lib/gemini-health';
import { PhotoIcon, MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function HealthAssistant() {
  const { profile } = useUserStore();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    content: any;
    media?: {
      type: 'image' | 'audio';
      url: string;
    };
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', content: message }]);
    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(userMessage, profile);
      setConversation(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setConversation(prev => [...prev, {
      type: 'user',
      content: 'Analyzing image...',
      media: { type: 'image', url: imageUrl }
    }]);
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(`Analyzing uploaded image: ${file.name}`, profile);
      setConversation(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setConversation(prev => [...prev, {
          type: 'user',
          content: 'Analyzing audio...',
          media: { type: 'audio', url: audioUrl }
        }]);
        setIsLoading(true);

        try {
          const response = await getChatbotResponse('Analyzing recorded audio', profile);
          setConversation(prev => [...prev, { type: 'assistant', content: response }]);
        } catch (error) {
          console.error('Error analyzing audio:', error);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Solace Health Assistant</h2>

      <div className="h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.media && (
                  <div className="mb-2">
                    {msg.media.type === 'image' ? (
                      <img
                        src={msg.media.url}
                        alt="Uploaded"
                        className="max-h-40 rounded-md"
                      />
                    ) : (
                      <audio controls src={msg.media.url} className="w-full" />
                    )}
                  </div>
                )}
                {msg.type === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div>
                    <p>{msg.content.response}</p>
                    {msg.content.suggestions?.length > 0 && (
                      <ul className="mt-2 text-sm">
                        {msg.content.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-gray-600">• {suggestion}</li>
                        ))}
                      </ul>
                    )}
                    {msg.content.seek_medical && (
                      <p className="mt-2 text-red-600 text-sm">
                        ⚠️ Please consult a healthcare provider for proper medical advice.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ask me anything about your health..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-purple-600 hover:text-purple-800 focus:outline-none"
              disabled={isLoading}
            >
              <PhotoIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 focus:outline-none ${
                isRecording ? 'text-red-600 hover:text-red-800' : 'text-purple-600 hover:text-purple-800'
              }`}
              disabled={isLoading}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}