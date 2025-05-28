"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async () => {
  try {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Login successful!");
      router.push("/");
    } else {
      // First try to login — if it succeeds, tell user to login instead
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (!signInError) {
        toast.error("User already registered. Please login instead.");
        setIsLogin(true);
        return;
      }

      // If login fails, then sign up
      const { error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }

      toast.success("Signup successful! Check your email to confirm.");
    }
  } catch (err: any) {
    toast.error("Something went wrong.");
    console.error(err);
  }
};

const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email above first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to your email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          </div>
          {isLogin && (
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer text-right"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-all"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-center text-gray-600 cursor-pointer hover:underline"
        >
          {isLogin ? "New user? Sign up" : "Already have an account? Login"}
        </p>
        <p className="text-xs text-center text-gray-400">
          &copy; 2025 TaskManager. All rights reserved.
        </p>
      </div>
    </div>
  );
}
