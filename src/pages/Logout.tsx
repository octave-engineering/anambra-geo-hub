import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();

  // Clear session or credentials here
  useEffect(() => {
    localStorage.removeItem("user"); // example if you're storing user in localStorage
    sessionStorage.clear();
    navigate("/", { replace: true });
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-muted/20 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <LogOut className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">
            You have been logged out
          </h1>
          <p className="text-muted-foreground">
            Thank you for using Anambra GeoHub. You can return to the homepage or
            log in again anytime.
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleGoHome} variant="default">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button onClick={() => navigate("/login")} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Login Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
