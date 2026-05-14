import { GoogleGenerativeAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SOMA_BASE_CONTEXT, EXAM_PAPER_PROMPT } from '../../lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = SOMA_BASE_CONTEXT;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, classLevel, topic, count, types, difficulty, includeAnswers, marks, sectionRatio, additionalInfo } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite-preview-02-05',
      systemInstruction: SYSTEM_PROMPT
    });

    const userPrompt = `
      ${EXAM_PAPER_PROMPT}

      SUBJECT: ${subject}
      CLASS: ${classLevel}
      TOPIC: ${topic}
      COUNT: ${count}
      QUESTION_TYPES: ${types.join(', ')}
      MARKS: ${marks || '50'}
      DIFFICULTY: ${difficulty || 'Mixed'}
      SECTION_RATIO: ${sectionRatio || 'Balanced'}
      INCLUDE_ANSWERS: ${includeAnswers}
      
      Additional Instructions: ${additionalInfo || 'None'}
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
