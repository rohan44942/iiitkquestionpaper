import Profile from "../component/Profile";
import AuthForm from "../component/AuthForm";
import { useContext } from "react";
import { UserContext } from "../contextapi/userContext";

function Login() {
  const { isAuthenticated, isLoading } = useContext(UserContext);
  const baseUrl = process.env.REACT_APP_API_URL;

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="skeleton h-64 max-w-md mx-auto" />
      </div>
    );
  }

  return (
    <div className="page-shell flex justify-center">
      {isAuthenticated ? (
        <Profile />
      ) : (
        <div className="surface-card w-full max-w-md p-6 sm:p-8 animate-fadeUp">
          <p className="text-center text-sm text-ink-muted mb-6">
            Sign in to upload resources, save favorites, and join community
            discussions.
          </p>
          <AuthForm baseUrl={baseUrl} />
        </div>
      )}
    </div>
  );
}

export default Login;
