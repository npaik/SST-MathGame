import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { users } from "./users";
import { quizzes } from "./quizzes";

export const userProgress = pgTable("UserProgresses", {
  id: serial("Id").primaryKey(),
  userId: integer("UserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quizId: integer("QuizId")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
});
