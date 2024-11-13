import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYMPTOM_ANALYSIS_PROMPT = `You are an AI health assistant. Analyze the provided symptoms and provide a structured response. 
Important guidelines:

1. Always maintain a professional and calm tone
2. Never make definitive diagnoses
3. Always recommend consulting a healthcare provider
4. Focus on providing general information and potential next steps
5. Include lifestyle recommendations when relevant
6. Highlight any red flags that require immediate medical attention

Structure your response in the following format:
{
  "summary": "Brief overview of the main symptoms",
  "possibleCauses": ["List of potential causes"],
  "redFlags": ["Any concerning symptoms that need immediate attention"],
  "recommendations": {
    "immediate": ["Immediate steps to take"],
    "lifestyle": ["Lifestyle recommendations"],
    "medical": ["Medical recommendations"]
  },
  "urgencyLevel": "low|medium|high",
  "disclaimer": "Standard medical disclaimer"
}

Analyze the following:`;

const IMAGE_ANALYSIS_PROMPT = `${SYMPTOM_ANALYSIS_PROMPT}
For the provided image, focus on visible symptoms such as:
- Skin conditions
- Rashes
- Swelling
- Discoloration
- Physical abnormalities`;

const VOICE_ANALYSIS_PROMPT = `You are an AI health assistant analyzing a voice recording transcript. 
Consider both what the user is saying about their health AND how they're saying it.

Important guidelines:
1. Analyze the described symptoms and concerns
2. Note any emotional distress in their voice (from transcript context)
3. Pay attention to mentions of:
   - Pain levels and descriptions
   - Duration of symptoms
   - Impact on daily life
   - Previous treatments tried
   - Medical history mentioned
4. Consider both physical and mental health aspects
5. Maintain a professional and empathetic tone

Structure your response in the following format:
{
  "transcriptSummary": "Brief overview of what was shared",
  "primaryConcerns": ["Main health issues mentioned"],
  "symptomAnalysis": {
    "physical": ["Physical symptoms identified"],
    "mental": ["Mental/emotional symptoms identified"]
  },
  "riskAssessment": {
    "urgencyLevel": "low|medium|high",
    "redFlags": ["Any concerning symptoms requiring immediate attention"]
  },
  "recommendations": {
    "immediate": ["Immediate steps to take"],
    "followUp": ["Follow-up actions recommended"],
    "selfCare": ["Self-care suggestions"],
    "professional": ["When/how to seek professional care"]
  },
  "supportResources": ["Relevant support services or resources"],
  "disclaimer": "Standard medical disclaimer"
}

Analyze the following voice transcript:`;

export async function analyzeSymptoms(symptoms: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(SYMPTOM_ANALYSIS_PROMPT + "\n" + symptoms);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\n?|\n?```/gi, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

export async function analyzeImage(image: File, description: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = await fileToGenerativePart(image);
    const prompt = `${IMAGE_ANALYSIS_PROMPT}\n\nUser description: ${description}`;
    
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\n?|\n?```/gi, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

export async function analyzeAudio(audio: File, description: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert audio to text using Web Speech API
    const audioText = await audioToText(audio);
    const prompt = `${VOICE_ANALYSIS_PROMPT}\n\nContext: ${description}\n\nTranscribed audio: ${audioText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\n?|\n?```/gi, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw new Error('Failed to analyze audio. Please try again.');
  }
}

async function fileToGenerativePart(file: File): Promise<Part> {
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type
    }
  };
}

async function audioToText(audio: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    let transcript = '';

    recognition.onresult = (event) => {
      transcript += event.results[event.results.length - 1][0].transcript;
    };

    recognition.onerror = (event) => {
      reject(new Error('Speech recognition error: ' + event.error));
    };

    recognition.onend = () => {
      resolve(transcript);
    };

    const audioUrl = URL.createObjectURL(audio);
    const audio_element = new Audio(audioUrl);
    audio_element.play();
    recognition.start();
  });
}