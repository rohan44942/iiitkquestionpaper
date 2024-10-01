import LoginButton from "../component/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";

function Login() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black">
        <div className="text-white text-3xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-light-cream">
      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          {" "}
          {/* Added space-y-4 for gap */}
          <Profile />
          <LogoutButton />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-white p-10 mb-60 rounded shadow-xl">
          <h1 className="text-black text-2xl mb-6 text-center">
            After login, you can upload data and mark your favorite question
            papers and notes.
          </h1>
          <LoginButton />
        </div>
      )}
    </div>
  );
}

export default Login;
