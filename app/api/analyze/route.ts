import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { UserAnswers } from "../../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_ANSWERS = {
  activityLevel: ["low", "moderate", "high"],
  livingSpace: ["apartment", "house", "farm"],
  experience: ["none", "some", "experienced"],
  timeCommitment: ["minimal", "moderate", "high"],
  breedSize: ["small", "medium", "large", "extra-large"],
  groomingWillingness: ["low", "moderate", "high"],
  trainability: ["easy", "moderate", "challenge"],
};

function validateAnswers(answers: unknown): answers is UserAnswers {
  if (!answers || typeof answers !== "object") {
    return false;
  }

  const userAnswers = answers as Record<string, unknown>;

  // Check all required fields are present
  const requiredFields = Object.keys(VALID_ANSWERS);
  for (const field of requiredFields) {
    const value = userAnswers[field];
    if (
      typeof value !== "string" ||
      !VALID_ANSWERS[field as keyof typeof VALID_ANSWERS].includes(value)
    ) {
      return false;
    }
  }

  return true;
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate request body
    if (!validateAnswers(body)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const answers = body as UserAnswers;

    // Sanitize inputs by extracting only valid values
    const sanitizedAnswers = {
      activityLevel: answers.activityLevel,
      livingSpace: answers.livingSpace,
      experience: answers.experience,
      timeCommitment: answers.timeCommitment,
      breedSize: answers.breedSize,
      groomingWillingness: answers.groomingWillingness,
      trainability: answers.trainability,
    };

    const prompt = `Based on these preferences, recommend the ONE best dog breed match. Provide a brief explanation (2-3 sentences) why this breed is perfect for them.

Use British English spelling and terminology throughout your response.

Activity: ${sanitizedAnswers.activityLevel} | Space: ${sanitizedAnswers.livingSpace} | Experience: ${sanitizedAnswers.experience} | Time: ${sanitizedAnswers.timeCommitment} | Size: ${sanitizedAnswers.breedSize} | Grooming: ${sanitizedAnswers.groomingWillingness} | Training: ${sanitizedAnswers.trainability}

Format your response with the breed name on the first line, followed by a blank line, then the explanation. Keep it concise and friendly.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful dog breed expert. Provide accurate and helpful breed recommendations.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const recommendation =
      completion.choices[0]?.message?.content?.trim() ||
      "Unable to generate recommendations at this time.";

    return NextResponse.json({ recommendation });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    if (error instanceof Error) {
      console.error("OpenAI API error:", error.message);
    }

    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Failed to generate recommendations. Please try again later.",
      },
      { status: 500 }
    );
  }
}
