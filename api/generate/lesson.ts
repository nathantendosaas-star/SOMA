import { GoogleGenerativeAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SOMA_BASE_CONTEXT, LESSON_PLAN_PROMPT } from '../../lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = SOMA_BASE_CONTEXT;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, classLevel, topic, duration, stream, specialConsiderations, level, subTopic, additionalInfo } = req.body;

  if (!subject || !classLevel || !topic) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const userPrompt = `
      ${LESSON_PLAN_PROMPT}

      SUBJECT: ${subject}
      TOPIC: ${topic}
      SUB-TOPIC: ${subTopic || 'General Overview'}
      CLASS: ${classLevel}
      LEVEL: ${level}
      DURATION: ${duration || '40 minutes'}
      STREAM: ${stream || 'N/A'}
      
      Specific instructions from the teacher: ${additionalInfo || specialConsiderations || 'None'}

      Structure the output clearly with these sections:
      1. Learning Objectives (3-5 SMART objectives)
      2. Prior Knowledge Required
      3. Materials and Resources
      4. Introduction / Motivation (~15% of time)
      5. Main Teaching Activity (Step-by-step teacher and learner actions)
      6. Student Activity / Group Work
      7. Assessment / Checking for Understanding
      8. Conclusion and Summary
      9. Homework Assignment
      10. Differentiation Notes (for mixed-ability classes)

      Ensure the content reflects the specific requirements of the Ugandan ${classLevel} ${subject} syllabus.
    `;

    const result = await model.generateContentStream(userPrompt);
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error: any) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
}
