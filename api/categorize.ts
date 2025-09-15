import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('Server configuration error: API key missing.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const { expense } = req.body;

    if (!expense) {
      return res.status(400).json({ error: 'Expense description is required' });
    }

    // --- NEW, UPGRADED PROMPT ---
    const prompt = `
      Analyze the following expense entry. Your task is to extract three pieces of information and return them as a valid JSON object.
      1.  "category": Categorize the expense into one of these categories: Food, Transport, Bills, Entertainment, Shopping, Health, Other.
      2.  "value": Extract the numerical value of the expense. If no number is found, return 0.
      3.  "description": Return the original expense text, but with the numerical value and any currency symbols (like BDT) removed. Clean it up for display.
      
      Example: For the input "BFC chicken 300 BDT", you should return:
      {"category": "Food", "value": 300, "description": "BFC chicken"}

      Here is the expense to analyze: "${expense}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();

    // Parse the JSON string returned by the AI
    const data = JSON.parse(jsonText);

    res.status(200).json(data);

  } catch (error) {
    console.error('Error in Gemini API call:', error);
    res.status(500).json({ error: 'Failed to process expense with AI' });
  }
}
