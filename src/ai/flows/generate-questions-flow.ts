
'use server';
/**
 * @fileOverview A Genkit flow for generating quiz questions.
 *
 * - generateNewQuestions - A function that invokes the question generation flow.
 * - GenerateQuestionsInput - The input type for the generateNewQuestions function.
 * - GenerateQuestionsOutput - The return type for the generateNewQuestions function.
 * - QuestionType - TypeScript type for a single quiz question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for a single quiz question, aligning with the Question type in src/types/index.ts
const QuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question, e.g., 'q1', 'genKnow1'. This ID must be unique across all generated questions in a single request."),
  text: z.string().describe("The text of the quiz question."),
  options: z.array(z.string()).length(4).describe("An array of exactly four string options for the question."),
  correctAnswer: z.string().describe("The correct answer, which must be one of the provided options."),
});
export type QuestionType = z.infer<typeof QuestionSchema>;

// Schema for the input of the question generation flow
const GenerateQuestionsInputSchema = z.object({
  count: z.number().int().positive().min(1).max(10).describe("The number of questions to generate (e.g., 5)."),
  topic: z.string().optional().describe("An optional topic for the quiz questions (e.g., 'World History', 'Science', 'General Knowledge'). If not provided, general knowledge questions will be generated."),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

// Schema for the output of the question generation flow
const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe("An array of generated quiz questions."),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

// Exported function to be called from the application
export async function generateNewQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: GenerateQuestionsInputSchema},
  output: {schema: GenerateQuestionsOutputSchema},
  prompt: `You are a helpful AI that generates engaging multiple-choice quiz questions.
Please generate exactly {{count}} unique questions.
{{#if topic}}
The questions should be about the topic: "{{topic}}".
{{else}}
The questions should be on general knowledge topics.
{{/if}}

For each question, you must provide:
1.  A unique 'id' (string, e.g., "q1", "topic_question_2"). Ensure this ID is unique for every question in this batch.
2.  The 'text' of the question (string).
3.  An array of exactly 4 'options' (array of strings).
4.  The 'correctAnswer' (string), which must be one of the provided options.

Your response MUST be a JSON object with a single key "questions", where "questions" is an array of these question objects.
Do not include any markdown formatting (like \`\`\`json) around your JSON response.

Example of a single question object structure:
{
  "id": "some_unique_id",
  "text": "What is the primary color of the sky on a clear day?",
  "options": ["Red", "Green", "Blue", "Yellow"],
  "correctAnswer": "Blue"
}
`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuestionsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate questions or received empty output from AI.');
    }
    // Ensure each question has a unique ID, fallback if necessary (though prompt requests it)
    output.questions.forEach((q, index) => {
      if (!q.id || q.id.trim() === "") {
        q.id = `gen_q_${Date.now()}_${index}`;
      }
    });
    return output;
  }
);

