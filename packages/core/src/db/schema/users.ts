import { serial, varchar, pgTable, integer } from "drizzle-orm/pg-core";

export const users = pgTable("Users", {
  id: serial("id").primaryKey(),
  username: varchar("Username", { length: 10 }).notNull(),
  email: varchar("Email", { length: 50 }).notNull(),
  firstname: varchar("FirstName", { length: 20 }).notNull(),
  lastname: varchar("LastName", { length: 20 }).notNull(),
  age: integer("Age").notNull(),
  avatarurl: varchar("AvatarURL", { length: 255 }).notNull(),
});
