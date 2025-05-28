"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`, // or /dashboard
      },
    });

    if (error) toast.error(error.message);
    else toast.success("Check your inbox for verification!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full space-y-4 bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleMagicLink} className="w-full">
          Send Confirmation Link
        </Button>
      </div>
    </div>
  );
}
