import { GoogleGenerativeAI } from '@google/generative-ai';

// This is a Vercel serverless function
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const { expense } = request.body;

  if (!expense) {
    return response.status(400).json({ error: 'Expense description is required' });
  }

  const prompt = `Categorize the following expense into one of these categories: Food, Transport, Bills, Entertainment, Shopping, Health, Other. Return only the category name. Expense: "${expense}"`;

  try {
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const category = geminiResponse.text().trim();
    response.status(200).json({ category });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to categorize expense' });
  }
}
