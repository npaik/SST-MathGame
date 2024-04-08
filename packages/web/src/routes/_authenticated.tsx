import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export function Login() {
  const { login, register } = useKindeAuth();
  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-300">
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 shadow-xl p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          Welcome Back!
        </h2>
        <div className="flex flex-col items-center">
          <button
            onClick={() => login()}
            type="button"
            className="bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full mb-4"
          >
            Login
          </button>
          <button
            onClick={() => register()}
            type="button"
            className="bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

const Component = () => {
  const { isAuthenticated } = useKindeAuth();
  if (!isAuthenticated) {
    return <Login />;
  }
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  component: Component,
});
