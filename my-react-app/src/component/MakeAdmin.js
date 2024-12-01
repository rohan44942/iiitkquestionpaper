import { useState } from "react";

const api_uri = process.env.REACT_APP_API_URL;

function MakeAdmin() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [currRole, setcurrRole] = useState("");
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${api_uri}/user/data?email=${email}`, {
        method: "GET", // Explicit method type
        headers: {
          "Content-Type": "application/json", // Ensure JSON is expected
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("User not found or an error occurred.");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async () => {
    if (!userData) return;
    const newRole = userData.user.role === "admin" ? "user" : "admin";

    try {
      setUpdatingRole(true);
      setError(null);

      const response = await fetch(`${api_uri}/user/changeRole`, {
        method: "PUT", // Explicit method type
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.user.email, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role.");
      }
      setcurrRole(newRole);
      setUserData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, role: newRole },
      }));

      // Update the role locally after a successful response
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleClick = () => {
    if (email.trim() === "") {
      setError("Please enter a valid email address.");
      return;
    }
    fetchUser();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  h-full rounded-lg shadow-md p-6 bg-slate-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Make Admin
        </h2>

        <div className=" m-3 flex flex-col gap-3 items-center sm:flex-row sm:items-start md:gap-4 lg:gap-6">
          <input
            type="text"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full sm:flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all w-full sm:w-auto"
            onClick={handleClick}
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-600 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {userData && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800">
              User Details:
            </h3>
            <p className="text-gray-700">
              <strong>Name:</strong> {userData.user.fullName}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {userData.user.email}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong> {currRole}
              <button
                className={`ml-2 px-3 py-1 rounded-md ${
                  updatingRole
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                    : currRole === "admin"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={handleRoleToggle}
                disabled={updatingRole}
              >
                {updatingRole
                  ? "Updating..."
                  : userData.user.role === "admin"
                  ? "Remove Admin"
                  : "Make Admin"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MakeAdmin;
