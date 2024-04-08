import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isAuthenticated } = useKindeAuth();
  return (
    <>
      <div className="min-h-screen bg-pink-300 text-pink-700">
        <nav className="p-4 flex justify-center gap-4 text-3xl md:text-5xl">
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-pink-300 hover:bg-pink-200 text-pink-700 [&.active]:font-bold [&.active]:underline"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="px-4 py-2 rounded-full bg-pink-300 hover:bg-pink-200 text-pink-700 [&.active]:font-bold [&.active]:underline"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Profile
            </Link>
          )}
        </nav>
        <div className="p-4">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    </>
  );
}
