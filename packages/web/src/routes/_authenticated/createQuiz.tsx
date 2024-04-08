import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/createQuiz")({
  component: CreateQuiz,
});

type NewQuiz = {
  content: string;
  solution: string;
  difficultyLevel: string;
};

const API_URL = import.meta.env.VITE_APP_API_URL;

function CreateQuiz() {
  const [newQuiz, setNewQuiz] = useState<NewQuiz>({
    content: "",
    solution: "",
    difficultyLevel: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz: {
            ...newQuiz,
            difficultyLevel: parseInt(newQuiz.difficultyLevel),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-300">
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 shadow-xl p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
          Create a New Quiz
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={newQuiz.content}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, content: e.target.value })
            }
            placeholder="Quiz Content"
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={newQuiz.solution}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, solution: e.target.value })
            }
            placeholder="Solution"
            className="w-full p-2 mt-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={newQuiz.difficultyLevel}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, difficultyLevel: e.target.value })
            }
            className="w-full p-2 mt-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Difficulty</option>
            <option value="1">Easy</option>
            <option value="2">Normal</option>
            <option value="3">Hard</option>
          </select>
          <button
            type="submit"
            className="mt-4 bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full"
          >
            Create Quiz
          </button>
        </form>
        <Link
          to="/"
          className="mt-4 inline-block bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 text-center"
        >
          Go back to main
        </Link>
      </div>
    </div>
  );
}
