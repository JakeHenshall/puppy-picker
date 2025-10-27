"use client";

import { useCallback, useEffect, useState } from "react";
import type { Question, UserAnswers } from "./types";

const getGridColsClass = (numOptions: number): string => {
  const colsMap: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };
  return colsMap[numOptions] || "md:grid-cols-2";
};

const questions: Question[] = [
  {
    id: "activityLevel",
    question: "What's your activity level?",
    options: [
      { value: "low", label: "Low", description: "I prefer a calm companion" },
      {
        value: "moderate",
        label: "Moderate",
        description: "Regular walks are good",
      },
      {
        value: "high",
        label: "High",
        description: "I'm very active and love to exercise",
      },
    ],
  },
  {
    id: "livingSpace",
    question: "What's your living space like?",
    options: [
      { value: "apartment", label: "Apartment", description: "Small space" },
      { value: "house", label: "House", description: "With a yard" },
      { value: "farm", label: "Farm/Rural", description: "Lots of space" },
    ],
  },
  {
    id: "experience",
    question: "What's your experience with dogs?",
    options: [
      { value: "none", label: "First-timer", description: "Never owned a dog" },
      {
        value: "some",
        label: "Some experience",
        description: "Owned a dog or two",
      },
      {
        value: "experienced",
        label: "Experienced",
        description: "Very familiar with dogs",
      },
    ],
  },
  {
    id: "timeCommitment",
    question: "How much time can you commit daily?",
    options: [
      {
        value: "minimal",
        label: "Less than 1 hour",
        description: "Busy schedule",
      },
      {
        value: "moderate",
        label: "1-3 hours",
        description: "Moderate commitment",
      },
      {
        value: "high",
        label: "3+ hours",
        description: "Lots of time available",
      },
    ],
  },
  {
    id: "breedSize",
    question: "What size dog do you prefer?",
    options: [
      { value: "small", label: "Small", description: "Under 9 kg" },
      { value: "medium", label: "Medium", description: "9-23 kg" },
      { value: "large", label: "Large", description: "23-45 kg" },
      {
        value: "extra-large",
        label: "Extra Large",
        description: "45+ kg",
      },
    ],
  },
  {
    id: "groomingWillingness",
    question: "How much grooming are you comfortable with?",
    options: [
      { value: "low", label: "Low", description: "Minimal maintenance" },
      {
        value: "moderate",
        label: "Moderate",
        description: "Regular brushing is fine",
      },
      {
        value: "high",
        label: "High",
        description: "I enjoy grooming",
      },
    ],
  },
  {
    id: "trainability",
    question: "What's your training preference?",
    options: [
      { value: "easy", label: "Easy to train", description: "Quick learner" },
      {
        value: "moderate",
        label: "Moderate",
        description: "Some training needed",
      },
      {
        value: "challenge",
        label: "Challenge",
        description: "I enjoy training challenges",
      },
    ],
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      if (currentStep < questions.length - 1) {
        const id = setTimeout(() => setCurrentStep(currentStep + 1), 300);
        setTimeoutId(id);
      }
    },
    [currentStep, currentQuestion.id]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.recommendation) {
        throw new Error("Invalid response from server");
      }

      setResults(data.recommendation);
      setShowResults(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "There was an error generating recommendations. Please try again.";
      setError(errorMessage);
      setResults(
        "Sorry, we encountered an error while analysing your preferences. Please try again."
      );
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  }, [answers]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setResults("");
    setError(null);
  }, []);

  const isComplete =
    currentStep === questions.length - 1 && answers[currentQuestion.id];

  if (showResults) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">
              Your Perfect Match
            </h1>
            <p className="text-xl text-gray-600">Based on your preferences</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-10 border-2 border-blue-100">
            <div className="text-center">
              <div className="text-6xl mb-3">🐕</div>
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {results}
              </div>
              {error && (
                <div className="mt-4 text-sm text-red-600">{error}</div>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Find Another Breed
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Puppy Picker
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Find the dog breed that suits you best with AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div
              className={`grid grid-cols-1 gap-4 ${getGridColsClass(
                currentQuestion.options.length
              )}`}
            >
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    aria-label={`Select ${option.label}`}
                    className={`p-6 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold text-lg text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              aria-disabled={currentStep === 0}
              className={`px-6 py-3 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ← Back
            </button>

            {isLoading ? (
              <div className="px-8 py-3">
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                  role="status"
                  aria-label="Loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : isComplete ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Find My Breed →
              </button>
            ) : (
              <div className="text-sm text-gray-500 py-3">
                {answers[currentQuestion.id]
                  ? "Select an option above"
                  : "Please select an option"}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
