import { StackContext, Api, StaticSite, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {
  const audience = `api-mathgameapi-${stack.stage}`;
  const assetsBucket = new Bucket(stack, "assets");

  const api = new Api(stack, "api", {
    authorizers: {
      myAuthorizer: {
        type: "jwt",
        jwt: {
          issuer: "https://mathgame.kinde.com",
          audience: [audience],
        },
      },
    },
    defaults: {
      authorizer: "myAuthorizer",
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /difficulty": "packages/functions/src/difficulty.handler",
      "GET /users": "packages/functions/src/users.handler",
      "GET /users/{id}": "packages/functions/src/users.handler",
      "PUT /users/{id}": "packages/functions/src/users.handler",
      "POST /users": "packages/functions/src/users.handler",
      "GET /quizzes": "packages/functions/src/quizzes.handler",
      "GET /quizzes/{id}": "packages/functions/src/quizzes.handler",
      "PUT /quizzes/{id}": "packages/functions/src/quizzes.handler",
      "DELETE /quizzes/{id}": "packages/functions/src/quizzes.handler",
      "POST /quizzes": "packages/functions/src/quizzes.handler",
      "POST /signed-url": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: assetsBucket.bucketName,
          },
          handler: "packages/functions/src/s3.handler",
        },
      },
      // "GET /cs": {
      //   function: {
      //     handler: "packages/CSharp",
      //     runtime: "container",
      //   },
      // },
      // "ANY /api/{proxy+}": {
      //   function: {
      //     handler: "packages/CSharp",
      //     runtime: "container",
      //   },
      // },
    },
  });

  api.attachPermissionsToRoute("POST /signed-url", [assetsBucket, "grantPut"]);

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_KINDE_AUDIENCE: audience,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebUrl: web.url,
  });
}
