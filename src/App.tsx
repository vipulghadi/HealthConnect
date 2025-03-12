import { Suspense, useState } from "react";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import AppRoutes from "./components/routes/Routes";
import Header from "./components/layout/Header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");

  const handleLogin = (data: any) => {
    // In a real app, you would validate credentials with your backend
    console.log("Login data:", data);
    setIsAuthenticated(true);
    // Determine user type based on login data
    setUserType(data.userType || "patient");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Header
          isLoggedIn={isAuthenticated}
          userType={userType}
          userName={userType === "patient" ? "John Doe" : "Dr. Michael Chen"}
          onLogout={handleLogout}
        />
        <AppRoutes isAuthenticated={isAuthenticated} userType={userType} />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
