
// import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";
import AuthForm from "../component/AuthForm";
import { useContext } from "react";
import { UserContext } from "../contextapi/userContext";

function Login() {
  const { isAuthenticated } = useContext(UserContext);
  const baseUrl = process.env.REACT_APP_API_URL;

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center w-screen h-screen bg-black">
  //       <div className="text-white text-3xl">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-light-cream">
      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Profile />
          <LogoutButton />
        </div>
      ) : (
        <div className="w-full max-w-lg h-[85%] mt-20 bg-white p-8 rounded-lg shadow-xl border border-gray-200 mx-6">
          <h1 className="text-center text-xl text-gray-700 ">
            After login, you can upload data and mark your favorite question
            papers and notes (beta).
          </h1>
          <div className="h-full mt-[-1rem] ">
            <AuthForm baseUrl={baseUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
