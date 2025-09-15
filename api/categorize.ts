import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- START DEBUGGING LOGS ---
  console.log('API route /api/categorize was hit.');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
    console.error('CRITICAL: GEMINI_API_KEY environment variable is not set or is too short.');
    return res.status(500).json({ error: 'Server configuration error: API key missing.' });
  } else {
    // Log a safe, partial key to confirm it's being read by the function
    console.log(`API Key has been loaded successfully, starting with: ${process.env.GEMINI_API_KEY.substring(0, 4)}...`);
  }
  // --- END DEBUGGING LOGS ---

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // --- FINAL MODEL NAME CHANGE ---
    // We are now using the latest Gemini Flash model, which is ideal for this task.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    // --- END CHANGE ---
    
    const { expense } = req.body;

    if (!expense) {
      console.log('Request failed because the expense description was missing.');
      return res.status(400).json({ error: 'Expense description is required' });
    }

    console.log(`Received expense to categorize: "${expense}"`);

    const prompt = `Categorize the following expense into one of these categories: Food, Transport, Bills, Entertainment, Shopping, Health, Other. Return only the category name. Expense: "${expense}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();
    
    console.log(`Successfully categorized expense as: "${category}"`);
    res.status(200).json({ category });

  } catch (error) {
    console.error('--- AN ERROR OCCURRED WHEN CALLING THE GEMINI API ---');
    console.error(error); // This will log the full, detailed error object from Google
    console.error('--- END OF ERROR ---');
    res.status(500).json({ error: 'Failed to categorize expense due to an internal API error.' });
  }
}
