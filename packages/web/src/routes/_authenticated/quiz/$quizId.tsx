import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createFileRoute("/_authenticated/quiz/$quizId")({
  component: QuizDetail,
});

type Quiz = {
  id: number;
  content: string;
  solution: string;
  difficultyLevel: number;
};

const API_URL = import.meta.env.VITE_APP_API_URL;

function QuizDetail() {
  const { quizId } = Route.useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const { getToken } = useKindeAuth();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuiz() {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      try {
        const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const quizData = await response.json();
        console.log("Quiz data:", quizData.quiz);
        setQuiz(quizData.quiz);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      }
    }

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  function determineQuizStatus(
    userAnswer: string,
    correctAnswer: string
  ): "Correct" | "Incorrect" {
    return userAnswer.trim().toLowerCase() ===
      correctAnswer.trim().toLowerCase()
      ? "Correct"
      : "Incorrect";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quiz) {
      console.error("No quiz data available");
      return;
    }

    const status = determineQuizStatus(userAnswer, quiz.solution);
    const attemptDate = new Date().toISOString();

    const token = await getToken();
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, attemptDate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result && result.quiz) {
        setFeedback("Quiz answer submitted successfully.");
        setFeedbackColor("green");
      } else {
        setFeedback("Failed to submit quiz answer.");
        setFeedbackColor("red");
      }

      setTimeout(
        () =>
          navigate({
            to: "/",
          }),
        2000
      );
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setFeedback("An error occurred while updating the quiz.");
      setFeedbackColor("red");

      setTimeout(
        () =>
          navigate({
            to: "/",
          }),
        2000
      );
    }
  };

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const handleDeleteQuiz = async () => {
    const confirmation = confirm("Are you sure you want to delete this quiz?");
    if (!confirmation) {
      return;
    }

    const token = await getToken();
    if (!token) {
      setFeedback("Authentication token not found.");
      setFeedbackColor("red");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFeedback("Quiz deleted successfully.");
      setFeedbackColor("green");
      setTimeout(
        () =>
          navigate({
            to: "/",
          }),
        2000
      );
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      setFeedback("An error occurred while deleting the quiz.");
      setFeedbackColor("red");
    }
  };

  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-300">
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 shadow-xl p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
          Quiz {quiz.id}
        </h2>
        <p className="text-xl font-bold text-white mt-4">
          Solve: {quiz.content}
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="mt-4 bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full"
          >
            Submit
          </button>
        </form>
        {feedback && (
          <p
            className={`mt-4 text-center font-bold py-2 rounded ${feedbackColor === "green" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"}`}
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            {feedback}
          </p>
        )}
        <div className="flex justify-center gap-4 mt-4">
          <Link
            to="/"
            className="bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 text-center"
            style={{ width: "fit-content", padding: "0.5rem 1rem" }} 
          >
            Go back to main
          </Link>
          <button
            onClick={() => handleDeleteQuiz()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105"
            style={{ width: "fit-content", padding: "0.5rem 1rem" }} 
          >
            Delete Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
