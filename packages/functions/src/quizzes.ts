import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { quizzes as quizzesTable } from "@finalproject/core/db/schema/quizzes";
import { users as usersTable } from "@finalproject/core/db/schema/users";
import { userProgress as userProgressTable } from "@finalproject/core/db/schema/userProgress";
import { db } from "@finalproject/core/db";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/quizzes", async (c) => {
  try {
    const quizzes = await db.select().from(quizzesTable).execute();

    console.log("Quizzes fetched: ", quizzes);

    return c.json({ quizzes });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching quizzes." }, 500);
  }
});

app.get("/quizzes/:id", async (c) => {
  const id = c.req.param("id");

  const quizId = parseInt(id, 10);
  if (isNaN(quizId)) {
    return c.json({ error: "Invalid ID provided" }, 400);
  }

  try {
    const quizzes = await db
      .select()
      .from(quizzesTable)
      .where(eq(quizzesTable.id, quizId))
      .execute();

    if (!quizzes || quizzes.length === 0) {
      return c.json({ message: "Quiz not found" }, 404);
    }

    return c.json({ quiz: quizzes[0] });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return c.json({ error: "An error occurred while fetching the quiz." }, 500);
  }
});

app.put("/quizzes/:id", async (c) => {
  const id = c.req.param("id");
  const { status, attemptDate } = await c.req.json(); // Extracting new status and attemptDate from request body
  const quizId = parseInt(id, 10);

  if (isNaN(quizId)) {
    return c.json({ error: "Invalid ID provided" }, 400);
  }

  if (!["NotAttempted", "Correct", "Incorrect"].includes(status)) {
    return c.json({ error: "Invalid status provided" }, 400);
  }

  try {
    const result = await db
      .update(quizzesTable)
      .set({
        status: status,
        attemptDate: attemptDate ? new Date(attemptDate) : new Date(), // Use provided attemptDate or current date
      })
      .where(eq(quizzesTable.id, quizId))
      .execute();

    if (result) {
      const updatedData = await db
        .select()
        .from(quizzesTable)
        .where(eq(quizzesTable.id, quizId))
        .execute();

      return c.json({ quiz: updatedData[0] });
    } else {
      return c.json({ error: "Failed to update quiz" }, 500);
    }
  } catch (error) {
    console.error("Error updating quiz:", error);
    return c.json({ error: "An error occurred while updating the quiz." }, 500);
  }
});

app.post("/quizzes", async (c) => {
  const body = await c.req.json();
  console.log("Creating quiz with body: ", body);
  const quiz = body.quiz;
  console.log("Creating quiz with quiz: ", quiz);
  const newQuiz = await db.insert(quizzesTable).values(quiz).returning();
  console.log("New quiz created: ", newQuiz);
  return c.json({ quiz: newQuiz });
});

export const handler = handle(app);
