// app/api/generate-questions/route.ts

import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Ensure this API route runs on the Edge runtime
export const runtime = 'edge';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const response = await openai.chat.completions.create({
    model: 'gpt-4', // You can also use 'gpt-3.5-turbo'
    stream: true,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Convert OpenAI's response into a stream
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
