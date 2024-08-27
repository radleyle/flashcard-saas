import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. Your task is to design a set of flashcards that effectively help users learn and retain new information. Each flashcard should contain a concise question or prompt on one side and a clear, accurate answer on the other. Your goal is to ensure the content is easy to understand, engaging, and relevant to the subject matter. You should also organize the flashcards in a logical order, allowing for gradual progression in difficulty and encouraging spaced repetition for optimal memory retention.

1. Conciseness: Keep questions and answers short and to the point to make the information easy to digest.
2. Clarity: Use clear and simple language to ensure that users can understand the content without confusion.
3. Relevance: Focus on key concepts and information that are most important to the subject matter.
4. Engagement: Incorporate interesting facts, examples, or visuals to make the flashcards more engaging and memorable.
5. Logical Order: Arrange the flashcards in a sequence that gradually increases in difficulty, allowing users to build their knowledge step by step.
6. Spaced Repetition: Design the flashcards to encourage regular review at increasing intervals to reinforce learning and improve long-term retention.
7. Dual Sided: Ensure that each flashcard has a question or prompt on one side and the corresponding answer on the other.
8. Customization: Allow for customization so users can add personal notes or modify the flashcards to better suit their learning style.
9. Feedback: Include a way for users to mark which flashcards they find challenging, so they can focus on reviewing those more frequently.
10. Variety: Mix different types of questions (e.g., multiple-choice, fill-in-the-blank, true/false) to keep the learning process dynamic and engaging.

Return in the following JSON format:
{
    "flashcards":[
        {
            "front": "str",
            "back": "str"
        }
    ]
}`;

// export async function POST(req) {
//     const openai = new OpenAI({
//         baseURL: "https://openrouter.ai/api/v1", // Base URL for OpenRouter.ai
//         apiKey: process.env.OPENROUTER_API_KEY, // Use OpenRouter API key from .env.local file
//         defaultHeaders: {
//           "HTTP-Referer": process.env.SITE_URL, // Optional: Referer for OpenRouter rankings
//           "X-Title": process.env.SITE_NAME, // Optional: Site name for OpenRouter rankings
//         },
//       });
//     const data = await req.text()

//     const completion = await openai.chat.completions.create({
//         message: [
//             {role: "system", content: systemPrompt},
//             {role: "user", content: data},
//         ],
//         model: 'meta-llama/llama-3.1-8b-instruct:free',
//         response_format: {type: "json_object"},
//     })

//     const flashcards = JSON.parse(completion.choices[0].message.content)

//     return NextResponse.json(flashcards.flashcard)
// }
// export async function POST(req) {
//     const openai = new OpenAI()
//     const data = await req.text()
  
//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: data },
//       ],
//       model: 'gpt-4o',
//       response_format: { type: 'json_object' },
//     })
  
//     // Parse the JSON response from the OpenAI API
//     const flashcards = JSON.parse(completion.choices[0].message.content)
  
//     // Return the flashcards as a JSON response
//     return NextResponse.json(flashcards.flashcards)
//   }
export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY, // Correctly set API key
        baseURL: "https://openrouter.ai/api/v1", // Correct base URL
    });

    try {
        const data = await req.text();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            model: 'openai/gpt-3.5-turbo', // Ensure this is the correct model name
        });

        const flashcards = JSON.parse(completion.choices[0].message.content);

        return NextResponse.json(flashcards.flashcards);

    } catch (error) {
        console.error("Error during API request:", error.message);
        console.error("Stack trace:", error.stack);
        return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}