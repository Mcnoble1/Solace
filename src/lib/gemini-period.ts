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

const CYCLE_ANALYSIS_PROMPT = `Analyze menstrual cycle data and provide structured insights.
Keep responses focused on general patterns and wellness recommendations.

Structure your response exactly as follows:
{
  "summary": "Brief overview of cycle patterns",
  "insights": {
    "cycleHealth": ["Key observations about cycle regularity and length"],
    "symptoms": ["Patterns in symptoms and their timing"],
    "mood": ["Observed mood patterns"]
  },
  "recommendations": ["List of lifestyle and self-care recommendations"],
  "alerts": {
    "patterns": ["Notable patterns requiring attention"],
    "irregularities": ["Identified irregularities"],
    "medical": ["Issues needing medical consultation"]
  }
}`;

const PHASE_SPECIFIC_PROMPT = `Provide insights for the specified menstrual phase.
Keep information general and wellness-focused.

Structure your response exactly as follows:
{
  "phase": "Current phase name",
  "description": "Brief phase description",
  "duration": "Expected duration",
  "bodily_changes": ["Typical changes"],
  "recommendations": ["Phase-specific recommendations"]
}`;

async function getGenerativeResponse(prompt: string, data?: any) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings,
    });
    
    const fullPrompt = data ? `${prompt}\n\nAnalyze: ${JSON.stringify(data)}` : prompt;
    const result = await model.generateContent(fullPrompt);
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

export async function analyzeCycleData(cycleData: any) {
  try {
    return await getGenerativeResponse(CYCLE_ANALYSIS_PROMPT, cycleData);
  } catch (error) {
    console.error('Error analyzing cycle data:', error);
    // Return fallback response
    return {
      summary: "Unable to analyze cycle data at this time",
      insights: {
        cycleHealth: ["Please continue tracking your cycle regularly"],
        symptoms: ["Track any symptoms you experience"],
        mood: ["Note any mood changes throughout your cycle"]
      },
      recommendations: [
        "Maintain regular cycle tracking",
        "Stay hydrated and active",
        "Get adequate rest",
        "Manage stress levels"
      ],
      alerts: {
        patterns: [],
        irregularities: [],
        medical: ["Consult your healthcare provider for personalized advice"]
      }
    };
  }
}

export async function getPhaseInsights(phase: string, userData: any) {
  try {
    return await getGenerativeResponse(PHASE_SPECIFIC_PROMPT, { phase, userData });
  } catch (error) {
    console.error('Error getting phase insights:', error);
    // Return fallback response
    return {
      phase: phase,
      description: "Information temporarily unavailable",
      duration: "Varies by individual",
      bodily_changes: ["Track any changes you notice"],
      recommendations: [
        "Stay hydrated",
        "Get adequate rest",
        "Practice self-care",
        "Contact healthcare provider if concerned"
      ]
    };
  }
}

export async function getPredictiveInsights(historicalData: any) {
  try {
    const response = await getGenerativeResponse(
      "Based on historical cycle data, predict likely patterns and provide recommendations.",
      historicalData
    );
    return response;
  } catch (error) {
    console.error('Error getting predictive insights:', error);
    // Return fallback response
    return {
      predictions: ["Continue tracking your cycle regularly"],
      recommendations: ["Maintain healthy lifestyle habits", "Consult healthcare provider for concerns"]
    };
  }
}