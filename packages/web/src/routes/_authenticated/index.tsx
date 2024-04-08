import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

type QuizStatus = "NotAttempted" | "Correct" | "Incorrect";

type Quiz = {
  id: number;
  content: string;
  solution: string;
  difficultyLevel: number;
  difficultyString?: string;
  status: QuizStatus;
};

const API_URL = import.meta.env.VITE_APP_API_URL;

function Index() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const { isAuthenticated } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/_authenticated" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function getQuizzes() {
      try {
        const res = await fetch(`${API_URL}/quizzes`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const fetchedQuizzes: Quiz[] = data.quizzes;
        setQuizzes(fetchedQuizzes);
        enrichQuizzesWithDifficulty(fetchedQuizzes);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    }
    getQuizzes();
  }, []);

  async function enrichQuizzesWithDifficulty(fetchedQuizzes: Quiz[]) {
    const getDifficultyString = async (difficultyLevel: number) => {
      try {
        const response = await fetch(
          `${API_URL}/cs?difficultyLevel=${difficultyLevel}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.difficulty;
      } catch (error) {
        console.error("Failed to fetch difficulty string:", error);
        return "Unknown";
      }
    };

    const quizzesWithDifficultyString = await Promise.all(
      fetchedQuizzes.map(async (quiz) => ({
        ...quiz,
        difficultyString: await getDifficultyString(quiz.difficultyLevel),
      }))
    );

    setQuizzes(quizzesWithDifficultyString); // Update original quizzes state
    setFilteredQuizzes(quizzesWithDifficultyString); // Also set filtered quizzes
  }

  const sortQuizzes = (difficultyLevel: number) => {
    setFilteredQuizzes(
      difficultyLevel === 0
        ? quizzes
        : quizzes.filter((quiz) => quiz.difficultyLevel === difficultyLevel)
    );
  };

  function getColorForStatus(status?: QuizStatus) {
    switch (status) {
      case "NotAttempted":
        return "bg-gray-400 hover:bg-gray-500";
      case "Correct":
        return "bg-green-400 hover:bg-green-500";
      case "Incorrect":
        return "bg-red-400 hover:bg-red-500";
      default:
        return "bg-gray-300";
    }
  }

  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-30">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => sortQuizzes(0)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out transform hover:scale-110"
        >
          All
        </button>
        <button
          onClick={() => sortQuizzes(1)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out transform hover:scale-110"
        >
          Easy
        </button>
        <button
          onClick={() => sortQuizzes(2)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out transform hover:scale-110"
        >
          Normal
        </button>
        <button
          onClick={() => sortQuizzes(3)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out transform hover:scale-110"
        >
          Hard
        </button>
        <a
          href="/createQuiz"
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out transform hover:scale-110"
        >
          Create Quiz
        </a>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <li key={quiz.id} className="cursor-pointer">
            <a href={`/quiz/${quiz.id}`} className="block">
              <div
                className={`p-6 shadow-xl rounded-lg bg-gradient-to-br ${getColorForStatus(
                  quiz.status
                )} transition duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105`}
              >
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Quiz {quiz.id} - {quiz.difficultyString || "Loading..."}
                </h3>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

export default Index;
