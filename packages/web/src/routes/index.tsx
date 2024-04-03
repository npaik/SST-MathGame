import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

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

const mapDifficultyToString = (difficultyLevel: number) => {
  const mapping = {
    1: "Easy",
    2: "Normal",
    3: "Hard",
  };
  return mapping[difficultyLevel] || "Unknown";
};

function Index() {
  const [quizzes, setQuizzes] = useState(mockQuizzes);

  const sortQuizzes = (difficultyLevel: number) => {
    if (difficultyLevel === 0) {
      setQuizzes(mockQuizzes);
      return;
    }
    const sortedQuizzes = mockQuizzes.filter(
      (quiz) => quiz.difficultyLevel === difficultyLevel
    );
    setQuizzes(sortedQuizzes);
  };

  return (
    <div>
      <div className="difficulty-buttons">
        <button onClick={() => sortQuizzes(0)}>All</button>
        <button onClick={() => sortQuizzes(1)}>Easy</button>
        <button onClick={() => sortQuizzes(2)}>Normal</button>
        <button onClick={() => sortQuizzes(3)}>Hard</button>
      </div>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} style={{ cursor: "pointer" }}>
            <Link to={`/quiz/${quiz.id}`}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                  cursor: "pointer",
                }}
              >
                Quiz {quiz.id} - {mapDifficultyToString(quiz.difficultyLevel)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

export default Index;
