import { GoogleGenerativeAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SOMA_BASE_CONTEXT, SCHEME_OF_WORK_PROMPT } from '../../lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = SOMA_BASE_CONTEXT;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, classLevel, term, weeks, periodsPerWeek } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const userPrompt = `
      ${SCHEME_OF_WORK_PROMPT}

      SUBJECT: ${subject}
      CLASS: ${classLevel}
      TERM: ${term}
      DURATION: ${weeks} weeks
      PERIODS_PER_WEEK: ${periodsPerWeek}

      Ensure all objectives are SMART and aligned to the Uganda NCDC syllabus for ${classLevel}.
    `;

    const result = await model.generateContentStream(userPrompt);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }
    res.end();
  } catch (error: any) {
    res.status(500).json({ error: 'Generation failed', details: error.message });
  }
}
