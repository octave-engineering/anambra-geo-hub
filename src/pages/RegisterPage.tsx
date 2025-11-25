import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accessLevel, setAccessLevel] = useState<"public" | "partner" | "admin">("public");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const role =
        accessLevel === "public"
          ? "user"
          : accessLevel === "partner"
            ? "partner"
            : "admin";
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      if (data.pendingApproval) {
        setSuccess(
          "Your request for Partner/Admin access has been submitted and is pending approval. You will be able to log in once your account is activated."
        );
        return;
      }

      setSuccess("Account created successfully. You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-poppins font-bold text-foreground mb-1">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up to access the Anambra Health GeoHub
            </p>
          </div>

          <Card className="shadow-strong border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Sign up</span>
              </CardTitle>
              <CardDescription>
                Enter your details to create an account or request elevated access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access level</Label>
                  <select
                    id="accessLevel"
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as "public" | "partner" | "admin")}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="public">Public user (view-only access)</option>
                    <option value="partner">Partner (requires approval)</option>
                    <option value="admin">Administrator (requires approval)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Public accounts are activated immediately. Partner and Admin requests must be approved by an administrator before you can log in.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full hero-gradient text-primary-foreground shadow-medium hover:shadow-strong transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign up
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground mt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
