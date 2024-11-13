import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const MENTAL_HEALTH_PROMPT = `You are an empathetic AI mental health assistant. Provide supportive guidance while maintaining professional boundaries.
Remember to:
1. Be supportive and non-judgmental
2. Encourage professional help when needed
3. Focus on coping strategies and self-care
4. Maintain a calm and reassuring tone

Structure your response as:
{
  "response": "Main supportive message",
  "coping_strategies": ["List of relevant coping strategies"],
  "self_care": ["Self-care recommendations"],
  "resources": ["Relevant support resources"],
  "professional_help": boolean
}`;

const CHATBOT_PROMPT = `You are Solace, an AI health assistant specializing in women's health. 
Maintain a professional yet friendly tone. Focus on:
1. First-response health guidance
2. General wellness information
3. Directing to appropriate resources
4. Clear disclaimers when medical attention is needed

Structure your response as:
{
  "response": "Main response message",
  "suggestions": ["Relevant suggestions or tips"],
  "seek_medical": boolean,
  "resources": ["Relevant resources or next steps"]
}`;

const HEALTH_TIPS_PROMPT = `Generate a daily health tip for women. Focus on general wellness, self-care, and preventive health.
Keep the content informative yet friendly. Avoid any sensitive or potentially harmful content.

Structure response as:
{
  "tip_of_day": "Main health tip",
  "explanation": "Brief, clear explanation",
  "action_steps": ["Simple, actionable steps"],
  "benefits": ["Key health benefits"]
}`;

const LEARNING_FACTS_PROMPT = `Share an educational fact about women's health and wellness.
Focus on general health education and scientific information.
Avoid sensitive topics or potentially triggering content.

Structure response as:
{
  "fact": "Main health fact",
  "explanation": "Clear, scientific explanation",
  "common_myths": ["Related misconceptions"],
  "learn_more": ["Additional educational points"]
}`;

const HEALTH_RESOURCES_PROMPT = `Provide comprehensive information about women's health conditions.
Include:
1. Evidence-based information
2. Management strategies
3. Lifestyle recommendations
4. Latest research insights

Structure response as:
{
  "condition_overview": "Detailed overview",
  "symptoms": ["Common symptoms"],
  "management": ["Management strategies"],
  "lifestyle": ["Lifestyle recommendations"],
  "research": ["Recent research findings"],
  "resources": ["Additional learning resources"]
}`;

async function getGenerativeResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings,
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text.replace(/```json\n?|\n?```/gi, '').trim());
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
}

export async function getMentalHealthSupport(input: string) {
  try {
    return await getGenerativeResponse(`${MENTAL_HEALTH_PROMPT}\n\nUser input: ${input}`);
  } catch (error) {
    console.error('Error getting mental health support:', error);
    return {
      response: "I apologize, but I'm having trouble processing your request. Please try again or seek professional help if you're in crisis.",
      coping_strategies: ["Take deep breaths", "Practice mindfulness", "Reach out to a trusted friend"],
      self_care: ["Get adequate rest", "Stay hydrated", "Take breaks when needed"],
      resources: ["Contact a mental health professional", "Call crisis helpline: 988"],
      professional_help: true
    };
  }
}

export async function getChatbotResponse(input: string, userProfile: any) {
  try {
    return await getGenerativeResponse(`${CHATBOT_PROMPT}\n\nUser input: ${input}\nUser profile: ${JSON.stringify(userProfile)}`);
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return {
      response: "I apologize, but I'm having trouble processing your request. Please try again later.",
      suggestions: ["Consider consulting a healthcare provider", "Check our health resources section"],
      seek_medical: false,
      resources: ["Contact your healthcare provider", "Visit our Resources page"]
    };
  }
}

export async function getDailyHealthTip(userProfile: any) {
  try {
    return await getGenerativeResponse(`${HEALTH_TIPS_PROMPT}\n\nUser profile: ${JSON.stringify(userProfile)}`);
  } catch (error) {
    console.error('Error getting daily health tip:', error);
    return {
      tip_of_day: "Stay hydrated throughout the day",
      explanation: "Proper hydration is essential for overall health and wellbeing",
      action_steps: ["Drink water regularly", "Keep a water bottle nearby", "Monitor your intake"],
      benefits: ["Improved energy", "Better concentration", "Healthier skin"]
    };
  }
}

export async function getDailyFact() {
  try {
    return await getGenerativeResponse(LEARNING_FACTS_PROMPT);
  } catch (error) {
    console.error('Error getting daily fact:', error);
    return {
      fact: "Regular exercise supports both physical and mental health",
      explanation: "Physical activity releases endorphins and promotes overall wellbeing",
      common_myths: ["You need intense exercise to see benefits", "Exercise is only for weight loss"],
      learn_more: ["Benefits of different types of exercise", "How to start a safe exercise routine"]
    };
  }
}

export async function getHealthResources(condition: string) {
  try {
    return await getGenerativeResponse(`${HEALTH_RESOURCES_PROMPT}\n\nCondition: ${condition}`);
  } catch (error) {
    console.error('Error getting health resources:', error);
    return {
      condition_overview: "Information temporarily unavailable. Please try again later.",
      symptoms: ["Please consult a healthcare provider for accurate symptom information"],
      management: ["Consult with healthcare professionals for management strategies"],
      lifestyle: ["Maintain a healthy lifestyle", "Stay active", "Eat a balanced diet"],
      research: ["Consult reliable medical sources for current research"],
      resources: ["Speak with your healthcare provider", "Visit reputable medical websites"]
    };
  }
}