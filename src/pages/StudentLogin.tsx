
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

const StudentLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let userCredential;

      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: name,
        });

      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult(true);

      //  Block admin from student login
      if (idTokenResult.claims.role === "admin") {
        alert("Admins must login from Admin page");
        await signOut(auth);
        return;
      }

      localStorage.setItem("token", idTokenResult.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem(
        "userName",
        user.displayName || email.split("@")[0]
      );

      navigate("/courses");

    } catch (error: any) {
      alert("In valid credentials ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">
            {isSignUp ? "Create Account" : "Student Login"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Sign up to start learning"
              : "Welcome back! Continue learning"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {isSignUp && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              className="text-primary ml-1"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/admin-login"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Admin? Login here
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;