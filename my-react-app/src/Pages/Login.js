import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";
import AuthForm from "../component/AuthForm";
import { useContext } from "react";
import { UserContext } from "../contextapi/userContext";

function Login() {
  const { isAuthenticated } = useContext(UserContext);
  const baseUrl = process.env.REACT_APP_API_URL;

  return (
    <div className="flex flex-col items-center justify-center w-full  bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 min-h-screen pt-[4rem]">
      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Profile />
          <LogoutButton />
        </div>
      ) : (
        <div className="mx-8 max-w-lg bg-white sm:p-8 p-5 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-center text-lg text-gray-700 md:text-xl">
            After login, you can upload data and mark your favorite question
            papers and notes (beta).
          </h1>
          <div className="mt-4 md:mt-6 lg:mt-8 ">
            <AuthForm baseUrl={baseUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
