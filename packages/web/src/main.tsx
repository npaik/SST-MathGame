import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

import {
  RouterProvider,
  createRouter,
  NotFoundRoute,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Route as rootRoute } from "./routes/__root.tsx";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => "404 Not Found",
});

const router = createRouter({
  routeTree,
  notFoundRoute,
});

export const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      audience={import.meta.env.VITE_APP_KINDE_AUDIENCE}
      clientId="319370f8f4bc4fd5ab8801733a71b888"
      domain="https://mathgame.kinde.com"
      logoutUri={window.location.origin}
      redirectUri={window.location.origin}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <RouterProvider router={router} />
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>
);
