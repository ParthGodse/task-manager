"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      toast.error("Login failed");
    } else {
      toast.success("Check your email for the login link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-8">
      <h1 className="text-2xl font-bold">Login to Task Manager</h1>
      <input
        type="email"
        className="p-2 border rounded w-80"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Magic Link
      </button>
    </div>
  );
}
