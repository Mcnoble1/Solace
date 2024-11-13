import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const PREGNANCY_INSIGHTS_PROMPT = `You are an AI health assistant specializing in pregnancy and postpartum care. Provide insights and recommendations based on the current stage of pregnancy or postpartum recovery.

Structure your response in the following format:
{
  "stage": "Current stage (trimester or postpartum week)",
  "summary": "Brief overview of this stage",
  "development": ["Key fetal development points or recovery milestones"],
  "commonSymptoms": ["Expected symptoms during this stage"],
  "recommendations": {
    "nutrition": ["Dietary recommendations"],
    "exercise": ["Safe physical activities"],
    "selfCare": ["Self-care practices"],
    "rest": ["Rest and sleep guidance"]
  },
  "warningSignsToWatch": ["Symptoms that require medical attention"],
  "nextMilestones": ["Upcoming developmental or recovery milestones"],
  "tips": ["Practical tips for managing this stage"]
}`;

export async function getPregnancyInsights(weekNumber: number, symptoms: any[], measurements: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${PREGNANCY_INSIGHTS_PROMPT}\n\nWeek of pregnancy: ${weekNumber}\nRecent symptoms: ${JSON.stringify(symptoms)}\nMeasurements: ${JSON.stringify(measurements)}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json\n?|\n?```/gi, '').trim());
  } catch (error) {
    console.error('Error getting pregnancy insights:', error);
    throw new Error('Failed to get pregnancy insights');
  }
}

export async function getPostpartumInsights(weeksSinceBirth: number, symptoms: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${PREGNANCY_INSIGHTS_PROMPT}\n\nWeeks postpartum: ${weeksSinceBirth}\nRecent symptoms: ${JSON.stringify(symptoms)}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json\n?|\n?```/gi, '').trim());
  } catch (error) {
    console.error('Error getting postpartum insights:', error);
    throw new Error('Failed to get postpartum insights');
  }
}