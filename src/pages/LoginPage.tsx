import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, Users, Globe, LogIn, MapPin, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [accessLevel, setAccessLevel] = useState("public");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const accessLevels = [
    {
      id: "admin",
      label: "Administrator",
      description: "Anambra State Ministry of Health (AMOH)",
      icon: Shield,
      color: "text-destructive",
      requiresAuth: true,
    },
    {
      id: "partner",
      label: "Partner Access",
      description: "NGOs, Donors, Dev Afrique & Members",
      icon: Users,
      color: "text-warning",
      requiresAuth: true,
    },
    {
      id: "public",
      label: "Public Access",
      description: "General public with limited dataset access",
      icon: Globe,
      color: "text-primary",
      requiresAuth: false,
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple demo login logic
    if (accessLevel === "public") {
      navigate("/dashboard/public");
    } else if (accessLevel === "partner" && credentials.username && credentials.password) {
      navigate("/dashboard/partner");
    } else if (accessLevel === "admin" && credentials.username && credentials.password) {
      navigate("/dashboard/admin");
    } else {
      alert("Please enter valid credentials");
    }
  };

  const selectedLevel = accessLevels.find((level) => level.id === accessLevel);

  return (
    <div className="min-h-screen py-8 subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-strong">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-foreground">
                  Anambra Health GeoHub
                </h1>
                <p className="text-sm text-muted-foreground">Health Data Repository</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Choose your access level and log in to explore health data
            </p>
          </div>

          <Card className="shadow-strong border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogIn className="w-5 h-5 text-primary" />
                <span>Login Portal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Access Level Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Access Level</Label>
                  <RadioGroup value={accessLevel} onValueChange={setAccessLevel}>
                    {accessLevels.map((level) => {
                      const Icon = level.icon;
                      return (
                        <div
                          key={level.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                            accessLevel === level.id
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border hover:border-primary/30 hover:bg-secondary/30"
                          }`}
                        >
                          <RadioGroupItem value={level.id} id={level.id} />
                          <Icon className={`w-5 h-5 ${level.color}`} />
                          <div className="flex-1">
                            <label htmlFor={level.id} className="cursor-pointer">
                              <div className="font-medium text-foreground">{level.label}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Credentials for Admin/Partner */}
                {selectedLevel?.requiresAuth && (
                  <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full hero-gradient text-primary-foreground shadow-medium hover:shadow-strong transition-all duration-300"
                  size="lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {accessLevel === "public" ? "Continue as Public User" : "Sign In"}
                </Button>

                {/* Info */}
                <div className="text-center text-sm text-muted-foreground">
                  {accessLevel === "public" ? (
                    "Public access provides limited dataset access for general exploration"
                  ) : (
                    "Contact your system administrator if you need access credentials"
                  )}
                </div>

                {/* Forgot password and contact */}
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <Button variant="link" className="text-sm text-muted-foreground">
                      Forgot your password?
                    </Button>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      Need access? Contact:
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Building className="h-4 w-4 text-primary" />
                      <span>Anambra State Ministry of Health (AMOH)</span>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {selectedLevel?.requiresAuth && (
            <Card className="mt-4 border-warning/20 bg-warning/5">
              <CardContent className="pt-4">
                <div className="text-sm text-warning-foreground">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: demo | Password: demo123
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Button variant="link" asChild>
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
