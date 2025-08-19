import { sha256 } from "js-sha256";
import { Bot, Eye, EyeOff, Mail, Lock, Github, Chrome } from "lucide-react";
import React, { useState } from "react";
import { User } from "stream-chat";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface LoginProps {
  onLogin: (user: User) => void;
}

// Function to create a deterministic user ID from username using SHA-256
const createUserIdFromUsername = (username: string): string => {
  const hash = sha256(username.toLowerCase().trim());
  return `user_${hash.substring(0, 12)}`;
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      const user = {
        id: createUserIdFromUsername(username.trim().toLowerCase()),
        name: username.trim(),
      };
      onLogin(user);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <Bot className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to continue to your AI workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="you@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-medium"
              disabled={!username.trim() || !password.trim()}
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Social Login */}
          <div className="flex items-center space-x-4 w-full">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              type="button"
            >
              <Chrome className="h-4 w-4 mr-2" /> Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              type="button"
            >
              <Github className="h-4 w-4 mr-2" /> GitHub
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Don’t have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
