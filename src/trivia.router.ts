import { Router } from "express";
import { Question, TriviaModel } from "./trivia.model";

export const router = Router();

async function getRandomQuestions(
  difficulty: string,
  category: string,
  count: number
): Promise<(typeof Question)[]> {
  let pipeline: any[] = [
    { $match: { difficulty } },
    { $sample: { size: count } },
  ];

  if (category !== "Any category") {
    pipeline.unshift({ $match: { category } });
  }

  const randomQuestions = await Question.aggregate(pipeline);

  return randomQuestions;
}

router.post("/generate", async (req, res) => {
  const { difficulty, category } = req.body;

  try {
    const questions = await getRandomQuestions(difficulty, category, 10);

    if (questions.length !== 10) {
      return res.status(400).json({
        error: "Not enough questions available for the specified criteria.",
      });
    }

    const trivia = new TriviaModel({
      difficulty,
      category,
      questions,
      shareId: generateRandomNumberString(6),
    });

    await trivia.save();

    res.status(201).json(trivia);
  } catch (error) {
    console.error("Error generating trivia:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.param("triviaId", async (req, res, next, triviaId) => {
  try {
    req.trivia = await TriviaModel.findById(triviaId);
    if (!req.trivia) {
      res.status(404).send(`Trivia with id ${triviaId} not found.`);
      return;
    }
    
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/:triviaId", async (req, res) => {
  try {
    if (!req.trivia) {
      res.status(404).send(`Trivia not found.`);
      return;
    }

    res.status(200).json(req.trivia);
  } catch (error) {
    console.error("Error fetching trivia:", error);
    res.status(500).send("Internal Server Error");
  }
});

function generateRandomNumberString(length: number): string {
  const randomUUID = Math.random().toString(36).substring(2, 8);
  return randomUUID.substring(0, length);
}
