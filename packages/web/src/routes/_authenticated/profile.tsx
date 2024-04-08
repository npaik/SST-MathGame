import { createFileRoute } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useState, useRef } from "react";
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
      console.log("signedURLResponse", signedURLResponse);

      const { url } = (await signedURLResponse.json()) as { url: string };

      await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      const imageUrl = url.split("?")[0];
      setProfileImageUrl(imageUrl);
      console.log("S3 bucket image url", imageUrl);
      console.log(user);
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            firstname: user?.given_name,
            lastname: user?.family_name,
            imageurl: imageUrl,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.error);
        console.log("User created with new image:", responseData.user);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error);
    }
  };

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
                      console.log(file);
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
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
