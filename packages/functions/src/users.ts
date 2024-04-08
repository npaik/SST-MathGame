import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

const Users = [
  {
    id: 3,
    username: "tony",
    email: "tony@email.com",
    firstName: "Eugene",
    lastName: "Paik",
    age: 5,
    avatarURL:
      "https://fastly.picsum.photos/id/181/200/300.jpg?hmac=3b280Ezwkze55gQeG0IWLTJ9e_Pawe5ZL4mhe-LO_WE",
  },
];

app.get("/users", (c) => {
  return c.json({ users: Users });
});

app.post("/users", async (c) => {
  const body = await c.req.json();
  const newUser = body.user;
  Users.push({
    ...newUser,
    id: (Users.length + 1).toString(),
  });
  return c.json({ users: Users });
});

export const handler = handle(app);
