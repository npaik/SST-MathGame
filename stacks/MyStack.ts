import { StackContext, Api, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /users": "packages/functions/src/users.handler",
      "POST /users": "packages/functions/src/users.handler",
      "GET /quizzes": "packages/functions/src/quizzes.handler",
      "GET /quizzes/{id}": "packages/functions/src/quizzes.handler",
      "PUT /quizzes/{id}": "packages/functions/src/quizzes.handler",
      "POST /quizzes": "packages/functions/src/quizzes.handler",
      // "GET /difficulty": "packages/functions/src/difficulty.handler",
      "GET /cs": {
        function: {
          handler: "packages/CSharp",
          runtime: "container",
        },
      },
      // "ANY /api/{proxy+}": {
      //   function: {
      //     handler: "packages/CSharp",
      //     runtime: "container",
      //   },
      // },
    },
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebUrl: web.url,
  });
}
