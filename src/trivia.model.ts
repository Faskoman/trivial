import { Schema , model } from "mongoose";

type Difficulty = "easy" | "medium" | "hard";

type Category = "Any category" | "Sports" | "Animals";


interface Question {
    type: string;
    difficulty: Difficulty;
    category: Category;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
}

const questionSchema = new Schema<Question>({
    type: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true,  default: "easy" },
    category: { type: String, enum: ["Any category", "Sports", "Animals"], required: true,  default: "Any category" },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: { type: [String], default: [] },
  });

export const Question = model<Question>("Question", questionSchema, "questions");

interface Trivia {
    difficulty: Difficulty;
    category: Category;
    questions: Question[];
    shareId: string;
}

const triviaSchema = new Schema<Trivia>({
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true,  default: "easy" },
    category: { type: String, enum: ["Any category", "Sports", "Animals"], required: true,  default: "Any category" },
    questions: { type: [Question] },
    shareId: { type: String }
})

export const Trivia = model<Trivia>("Trivia", triviaSchema, "trivias");