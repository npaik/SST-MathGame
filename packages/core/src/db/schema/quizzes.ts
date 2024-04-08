import {
  serial,
  varchar,
  pgTable,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

type QuizStatus = "NotAttempted" | "Correct" | "Incorrect";

export const quizzes = pgTable("Quizzes", {
  id: serial("id").primaryKey(),
  content: varchar("Content", { length: 255 }).notNull(),
  solution: varchar("Solution", { length: 255 }).notNull(),
  difficultyLevel: integer("DifficultyLevel").notNull(),
  status: varchar("Status", { enum: ["NotAttempted", "Correct", "Incorrect"] })
    .notNull()
    .default("NotAttempted" as QuizStatus),
  attemptDate: timestamp("AttemptDate").notNull().default(new Date()),
});
