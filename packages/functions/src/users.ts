import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { users as usersTable } from "@finalproject/core/db/schema/users";
import { db } from "@finalproject/core/db";
import { eq } from "drizzle-orm";
const app = new Hono();

app.get("/users", async (c) => {
  try {
    const users = await db.select().from(usersTable).execute();

    console.log("users fetched: ", users);

    return c.json({ users });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching users." }, 500);
  }
});

app.get("/users/:id", async (c) => {
  const id = c.req.param("id");

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return c.json({ error: "Invalid ID provided" }, 400);
  }

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

    if (!users || users.length === 0) {
      return c.json({ message: "user not found" }, 404);
    }

    return c.json({ user: users[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "An error occurred while fetching the user." }, 500);
  }
});

app.put("/users/:id", async (c) => {
  const id = c.req.param("id");
  const { imageurl } = await c.req.json();
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return c.json({ error: "Invalid ID provided" }, 400);
  }

  try {
    const result = await db
      .update(usersTable)
      .set({ imageurl })
      .where(eq(usersTable.id, userId))
      .execute();

    if (result) {
      const updatedUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .execute();

      return c.json({ user: updatedUser[0] });
    } else {
      return c.json({ error: "Failed to update user" }, 500);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "An error occurred while updating the user." }, 500);
  }
});

app.post("/users", async (c) => {
  const body = await c.req.json();
  try {
    const newUser = await db
      .insert(usersTable)
      .values(body)
      .returning()
      .execute();

    return c.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "An error occurred while creating the user." }, 500);
  }
});

export const handler = handle(app);
