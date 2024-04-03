import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/quiz/$quizId")({
  component: QuizDetail,
});

const mockQuizzes = [
  {
    id: 1,
    content: "1+1",
    solution: "2",
    difficultyLevel: 1,
  },
  {
    id: 2,
    content: "2+2",
    solution: "4",
    difficultyLevel: 1,
  },
  {
    id: 3,
    content: "3+3",
    solution: "6",
    difficultyLevel: 1,
  },
  {
    id: 4,
    content: "2 X 2",
    solution: "4",
    difficultyLevel: 2,
  },
  {
    id: 5,
    content: "3 X 3",
    solution: "9",
    difficultyLevel: 2,
  },
  {
    id: 6,
    content: "3 / 3",
    solution: "1",
    difficultyLevel: 3,
  },
  {
    id: 7,
    content: "6 / 2",
    solution: "3",
    difficultyLevel: 3,
  },
];

function QuizDetail() {
  const { quizId } = Route.useParams();
  const quiz = mockQuizzes.find((q) => q.id === parseInt(quizId || "0"));
  const [userAnswer, setUserAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quiz?.solution === userAnswer) {
      alert("Correct answer!");
    } else {
      alert("Wrong answer, try again.");
    }
  };

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div>
      <h2>Quiz {quiz.id}</h2>
      <p>Solve: {quiz.content}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
