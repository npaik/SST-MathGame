import { createFileRoute } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { logout, user } = useKindeAuth();
  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-300">
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 shadow-xl p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          Profile
        </h2>
        <div className="text-white text-center mb-4">
          {user?.picture && (
            <img
              src={user?.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mt-4"
            />
          )}
          <p className="text-lg font-bold p-4">
            Welcome back! {user?.given_name} {user?.family_name}
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
