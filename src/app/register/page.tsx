"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const router=useRouter();
  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });  //creating a new user

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            name,
            role,
          },
        ]);

      if (profileError) {
        alert(profileError.message);
        return;
      }
    }

    alert("Registration successful!");
router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 p-6">

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Campus Connect
        </p>

        {/* Form */}
        <div className="space-y-4">

          {/* Name */}
          <input
            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role */}
          <select
            className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {/* Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
          >
            Create Account
          </button>

        </div>

       {/* Footer */}
<p className="text-center text-sm text-gray-500 mt-6">
  Already have an account?{" "}
  <Link
    href="/login"
    className="text-blue-600 font-medium hover:underline"
  >
    Login
  </Link>
</p>

      </div>
    </div>
  );
}