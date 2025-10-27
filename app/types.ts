export interface Option {
  value: string;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
}

export interface UserAnswers {
  activityLevel?: string;
  livingSpace?: string;
  experience?: string;
  timeCommitment?: string;
  breedSize?: string;
  groomingWillingness?: string;
  trainability?: string;
}
