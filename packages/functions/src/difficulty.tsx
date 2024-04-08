import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

const mapDifficultyToString = (difficultyLevel: number): string => {
  const mapping: { [key: number]: string } = {
    1: "Easy",
    2: "Normal",
    3: "Hard",
  };
  return mapping[difficultyLevel] || "Unknown";
};

app.get("/difficulty", (c) => {
  if (!c.req) {
    return c.json({ message: "Request object is undefined" }, 500);
  }

  const difficultyLevelQuery = c.req.query("difficultyLevel");
  const difficultyLevel = difficultyLevelQuery
    ? parseInt(difficultyLevelQuery, 10)
    : 0;
  const difficultyString = mapDifficultyToString(difficultyLevel);

  return c.json({ difficulty: `${difficultyString}` });
});

export const handler = handle(app);
