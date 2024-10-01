import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white text-xl">
        Loading ...
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
        <img 
          src={user.picture} 
          alt={user.name} 
          className="rounded-full w-24 h-24 mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-2 text-center">
          {user.email}
        </p>
        <p className="text-gray-700 text-center mb-2">
          Now you are able to upload documents for your peers and juniors. After approval, your document will be shown on the main page of the website.
        </p>
        <p className="text-gray-700 font-semibold text-center">
          Sharing is Caring
        </p>
      </div>
    )
  );
};

export default Profile;
