import { createFileRoute } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { logout, user, getToken } = useKindeAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    user?.picture ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setProfileImageUrl(user?.picture ?? null);
  };

  const API_URL = import.meta.env.VITE_APP_API_URL;

  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = await getToken();
    if (!token) {
      throw new Error("No token found");
    }

    if (!selectedFile) return;

    try {
      let userId = null;
      const usersResponse = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: token,
        },
      });
      if (!usersResponse.ok) throw new Error("Failed to fetch users");

      const { users } = await usersResponse.json();
      // @ts-ignore
      const existingUser = users.find((u) => u.email === user?.email);

      if (existingUser) {
        userId = existingUser.id;
      }

      const signedURLResponse = await fetch(`${API_URL}/signed-url`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: selectedFile.type,
          contentLength: selectedFile.size,
          checksum: await computeSHA256(selectedFile),
        }),
      });
      const { url: signedUrl } = await signedURLResponse.json();

      await fetch(signedUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      const imageUrl = signedUrl.split("?")[0];
      console.log("Image uploaded successfully:", imageUrl);
      setProfileImageUrl(imageUrl);

      const userData = {
        email: user?.email,
        firstname: user?.given_name,
        lastname: user?.family_name,
        imageurl: imageUrl,
      };

      const userUpdateResponse = await fetch(
        `${API_URL}/users${userId ? `/${userId}` : ""}`,
        {
          method: userId ? "PUT" : "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!userUpdateResponse.ok) {
        const errorData = await userUpdateResponse.json();
        throw new Error(errorData.error || "Failed to update user data");
      }

      console.log("User profile updated successfully.");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  useEffect(() => {
    async function getCurrentUser() {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const usersResponse = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: token,
        },
      });
      if (!usersResponse.ok) throw new Error("Failed to fetch users");
      const { users } = await usersResponse.json();
      // @ts-ignore
      const existingUser = users.find((u) => u.email === user?.email);
      if (existingUser) {
        setProfileImageUrl(existingUser.imageurl);
      }
    }
    getCurrentUser();
  }, []);

  return (
    <div className="container mx-auto p-4 font-baloo min-h-screen bg-pink-300">
      <form onSubmit={handleSubmit}>
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 shadow-xl p-6 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Profile
          </h2>
          <div className="text-white text-center mb-4">
            {user?.picture && (
              <>
                <img
                  src={profileImageUrl || user?.picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mt-4 cursor-pointer"
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImageUrl(URL.createObjectURL(file));
                      setSelectedFile(file);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </>
            )}
            <p className="text-lg font-bold p-4">
              Welcome back! {user?.given_name} {user?.family_name}
            </p>
          </div>
          {selectedFile && (
            <button
              type="button" 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleRemoveSelectedFile}
            >
              Remove
            </button>
          )}
          {selectedFile && (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          )}
          <button
            onClick={() => logout()}
            className="bg-gradient-to-br from-pink-700 to-purple-500 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-150 transform hover:scale-105 block w-full mt-4"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
